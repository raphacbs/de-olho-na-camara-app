import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import BiometricDisabledModal from '@/components/BiometricDisabledModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginCredentials, RegisterCredentials, AuthResponse } from '@/services/authService';
import { authApiClient, apiClient } from '@/services/apiClient';
import * as biometricsService from '@/services/biometrics';

export interface User {
  id: string;
  email: string;
  name?: string;
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  // Biometric helpers
  isBiometricAvailable: () => Promise<boolean>;
  enableBiometricLogin: (email: string, password: string) => Promise<void>;
  disableBiometricLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Extrai dados do usuário do token JWT
 */
function extractUserFromToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as {
      userId?: string;
      sub?: string;
      name?: string;
      email?: string;
    };
    return {
      id: payload.userId || payload.sub || '',
      email: payload.email || payload.sub || '',
      name: payload.name,
    };
  } catch (error) {
    console.error('Erro ao extrair dados do token:', error);
    return null;
  }
}

/**
 * Mapeia a resposta da API para o formato interno
 */
function mapAuthResponse(apiResponse: AuthResponse): { user: User; token: string } {
  const user = apiResponse.user || extractUserFromToken(apiResponse.accessToken);

  if (!user) {
    throw new Error('Não foi possível extrair dados do usuário do token');
  }

  return {
    user,
    token: apiResponse.accessToken,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  // Local UI state to show modal when biometric credentials are removed
  const [showBiometricDisabledModal, setShowBiometricDisabledModal] = useState(false);

  // Carregar dados de autenticação do AsyncStorage ao iniciar
  useEffect(() => {
    void loadStoredAuth();
  }, []);

  // Ao iniciar, se biometria estiver habilitada, tentar autenticar
  useEffect(() => {
    const tryBiometric = async () => {
      try {
        const enabled = await biometricsService.isBiometricEnabled();
        if (!enabled) return;

        const supported = await biometricsService.isBiometricSupported();
        if (!supported) return;

        const authed = await biometricsService.authenticateBiometric();
        if (!authed) return;

        const creds = await biometricsService.getSavedCredentials();
        if (!creds) return;

        // Fazer login com as credenciais salvas
        // Avoid logging raw password; show only length and masked form for debugging
        try {
          const masked = creds.password ? `*`.repeat(Math.max(0, Math.min(6, creds.password.length))) : 'no-password';
          console.log('Attempting biometric auto-login for', creds.email, 'password:', masked);

          await login({ email: creds.email, password: creds.password });
        } catch (err) {
          // If login fails due to invalid credentials, remove biometric credentials to prevent lockout
          try {
            const message = err instanceof Error ? err.message : String(err);
            console.warn('Biometric auto-login failed during login():', message);

            // Heuristics for detecting invalid credential errors
            const invalidCredentialIndicators = ['senha', 'senha inv', 'invalid', 'credentials', 'Email ou senha', 'INVALID_CREDENTIALS', 'USER_NOT_FOUND'];
            const lower = message.toLowerCase();
            const isInvalidCred = invalidCredentialIndicators.some(ind => lower.includes(ind.toLowerCase()));

            if (isInvalidCred) {
              console.warn('Detected invalid saved biometric credentials — removing saved credentials');
              await biometricsService.removeCredentials();
              try {
                // Telemetry placeholder: record the event
                console.log('telemetry:event', { event: 'biometric_credentials_removed', reason: 'invalid_credentials' });
              } catch (teleErr) {
                console.warn('Failed to record telemetry for biometric credential removal:', teleErr);
              }

              // Show UI modal explaining what happened
              setShowBiometricDisabledModal(true);
            }
          } catch (cleanupErr) {
            console.warn('Error while handling biometric login failure:', cleanupErr);
          }

          // Do not re-throw: biometric auto-login should fail silently after cleanup
          return;
        }
      } catch (error) {
        console.warn('Biometric auto-login falhou:', error);
      }
    };

    void tryBiometric();
  }, []);

  // Configurar callback para interceptar erros 401 da API
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('🔐 Interceptando erro 401 da API, fazendo logout automático');
      void logout();
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    apiClient.setUnauthorizedCallback(handleUnauthorized);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      apiClient.removeUnauthorizedCallback();
    };
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData) as User;
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        // Definir token no API client
        authApiClient.setToken(token);
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const storeAuthData = async (token: string, user: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error('Erro ao armazenar dados de autenticação:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.error('Erro ao limpar dados de autenticação:', error);
    }
  };

  // Biometric controls
  const isBiometricAvailable = async () => {
    return biometricsService.isBiometricSupported();
  };

  const enableBiometricLogin = async (email: string, password: string) => {
    // Verify device support and enrollment
    const supported = await biometricsService.isBiometricSupported();
    if (!supported) throw new Error('Biometria não disponível neste dispositivo');

    // Save credentials securely
    await biometricsService.saveCredentials(email, password);
  };

  const disableBiometricLogin = async () => {
    await biometricsService.removeCredentials();
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🚀 Iniciando processo de login no AuthContext');
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await authService.login(credentials);
      console.log('📋 Resposta do authService recebida');

      // Mapear resposta da API para formato interno
      const { user, token } = mapAuthResponse(response);
      console.log('👤 Usuário mapeado:', { id: user.id, email: user.email, name: user.name });

      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      // Definir token no API client
      authApiClient.setToken(token);
      console.log('🔑 Token configurado no API client');

      // Armazenar dados localmente
      await storeAuthData(token, user);
      console.log('💾 Dados armazenados localmente');

      // If biometric is enabled in secure store, ensure credentials kept up-to-date
      const biEnabled = await biometricsService.isBiometricEnabled();
      if (biEnabled) {
        try {
          await biometricsService.saveCredentials(credentials.email, credentials.password);
        } catch (err) {
          console.warn('Não foi possível atualizar credenciais biométricas:', err);
        }
      }

      console.log('✅ Login concluído com sucesso');
    } catch (error) {
      console.error('❌ Erro durante o login no AuthContext:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await authService.register(credentials);

      // Mapear resposta da API para formato interno
      const { user, token } = mapAuthResponse(response);

      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      // Definir token no API client
      authApiClient.setToken(token);

      // Fazer uma requisição adicional para gerar JSESSIONID
      try {
        console.log('🍪 Gerando JSESSIONID do servidor...');
        await authService.getProfile();
        console.log('🍪 JSESSIONID gerado com sucesso');
      } catch (error) {
        console.warn('⚠️ Erro ao gerar JSESSIONID (não crítico):', error);
      }

      // Armazenar dados localmente
      await storeAuthData(token, user);

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Chamar logout na API se necessário
      if (authState.token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar token do API client
      authApiClient.clearToken();

      // Sempre limpar dados locais
      await clearAuthData();
      // Preserve biometric credentials if biometric login is enabled.
      // If biometric login is disabled, remove stored credentials.
      try {
        const biEnabled = await biometricsService.isBiometricEnabled();
        if (!biEnabled) {
          await biometricsService.removeCredentials();
        } else {
          console.log('Biometric login is enabled — preserving credentials after logout');
        }
      } catch (err) {
        console.warn('Erro ao verificar/limpar credenciais biométricas durante logout:', err);
      }
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const refreshToken = async () => {
    // Validate preconditions before entering try/catch to avoid throwing inside the same try
    if (!authState.token) {
      throw new Error('Nenhum token disponível para refresh');
    }

    try {
      const response = await authService.refreshToken();

      // Mapear resposta da API para formato interno
      const { user, token } = mapAuthResponse(response as AuthResponse);

      setAuthState(prev => ({
        ...prev,
        token,
        user,
      }));

      // Atualizar token no API client
      authApiClient.setToken(token);

      // Atualizar dados locais
      await storeAuthData(token, user);

    } catch (error) {
      // Se falhar o refresh, fazer logout
      await logout();
      // Throw a normalized error to avoid 'throw of exception caught locally' warning
      throw new Error(error instanceof Error ? error.message : 'Erro ao renovar token');
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    isBiometricAvailable,
    enableBiometricLogin,
    disableBiometricLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <BiometricDisabledModal visible={showBiometricDisabledModal} onClose={() => setShowBiometricDisabledModal(false)} />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
