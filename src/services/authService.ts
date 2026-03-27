import apiClient, { ApiResponse } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expireIn: number;
  user?: {
    id: string;
    email: string;
    name?: string;
    profilePicture?: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expireIn?: number;
  user?: AuthResponse['user'];
}

class AuthService {
  private readonly endpoints = {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
    profile: '/api/v1/auth/profile',
  };

  /**
   * Faz login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Iniciando login com email:', credentials.email);
      console.log('🌐 Endpoint de login:', this.endpoints.login);
      console.log('📡 Fazendo requisição para API...');

      const response: ApiResponse<AuthResponse> = await apiClient.post(
        this.endpoints.login,
        credentials
      );

      console.log('✅ Resposta da API recebida, status:', response.status);
      console.log('🔑 Token recebido:', response.data.accessToken ? 'Sim' : 'Não');

      // Validar resposta
      this.validateAuthResponse(response.data);

      console.log('✅ Login realizado com sucesso');
      return response.data;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('🔍 Detalhes do erro:', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw this.handleAuthError(error);
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response: ApiResponse<AuthResponse> = await apiClient.post(
        this.endpoints.register,
        credentials
      );

      // Validar resposta
      this.validateAuthResponse(response.data);

      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(this.endpoints.logout);
    } catch (error) {
      // Logout geralmente não deve falhar criticamente
      console.warn('Erro no logout (não crítico):', error);
    }
  }

  /**
   * Atualiza o token de acesso
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response: ApiResponse<RefreshTokenResponse> = await apiClient.post(
        this.endpoints.refresh
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Busca dados do perfil do usuário
   */
  async getProfile(): Promise<AuthResponse['user']> {
    try {
      const response: ApiResponse<AuthResponse['user']> = await apiClient.get(
        this.endpoints.profile
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Valida se a resposta de autenticação tem os campos obrigatórios
   */
  private validateAuthResponse(data: AuthResponse): void {
    if (!data.accessToken || !data.tokenType || data.expireIn == null) {
      throw new Error('Resposta de autenticação inválida');
    }
  }

  /**
   * Trata erros de autenticação de forma padronizada
   */
  private handleAuthError(error: unknown): Error {
    type AuthError = Error & { code?: string; status?: number };

    const mappedError = new Error('Erro de autenticação') as AuthError;

    if (error instanceof Error) {
      // Mapeamento de erros comuns
      const errorMappings: Record<string, string> = {
        'INVALID_CREDENTIALS': 'Email ou senha incorretos',
        'USER_NOT_FOUND': 'Usuário não encontrado',
        'EMAIL_ALREADY_EXISTS': 'Este email já está cadastrado',
        'WEAK_PASSWORD': 'A senha deve ter pelo menos 6 caracteres',
        'INVALID_EMAIL': 'Email inválido',
        'NETWORK_ERROR': 'Erro de conexão. Verifique sua internet.',
        'TOKEN_EXPIRED': 'Sessão expirada. Faça login novamente.',
        'UNAUTHORIZED': 'Acesso não autorizado',
      };

      // Tentar extrair código do erro da API
      const apiError = error as { code?: string; status?: number; message?: string };
      const errorCode = apiError.code || apiError.status?.toString();

      if (errorCode && errorMappings[errorCode]) {
        mappedError.message = errorMappings[errorCode];
      } else {
        mappedError.message = error.message || 'Erro de autenticação';
      }

      // Attach code/status for callers to inspect
      mappedError.code = apiError.code;
      mappedError.status = apiError.status;

      return mappedError;
    }

    return mappedError;
  }

  /**
   * Verifica se o token é válido (pode ser usado para validação local)
   */
  isTokenValid(token: string): boolean {
    try {
      // Decodificar JWT para verificar expiração (se for JWT)
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      const currentTime = Math.floor(Date.now() / 1000);

      return (payload.exp ?? 0) > currentTime;
    } catch (error) {
      // Se não conseguir decodificar, assumir inválido
      return false;
    }
  }
}

// Instância singleton
export const authService = new AuthService();
export default authService;