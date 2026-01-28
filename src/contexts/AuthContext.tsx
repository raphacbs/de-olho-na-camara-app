import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginCredentials, RegisterCredentials, AuthResponse } from '@/services/authService';
import { authApiClient, apiClient } from '@/services/apiClient';

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

  // Carregar dados de autenticação do AsyncStorage ao iniciar
  useEffect(() => {
    void loadStoredAuth();
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
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const refreshToken = async () => {
    try {
      if (!authState.token) {
        throw new Error('Nenhum token disponível para refresh');
      }

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
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
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
