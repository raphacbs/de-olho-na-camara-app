/**
 * API Client para comunicação com o Backend For Frontend (BFF)
 * Utiliza Axios com suporte nativo a cookies
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { getApiConfig } from '@/config/api';
import {
  getAppVersion,
  getAppPlatform,
  getOSVersion,
  getDeviceModel,
  getAppLanguage,
  getOrCreateDeviceId,
} from './deviceInfo';

export interface ApiError extends Error {
  status: number;
  code: string;
  retry?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, any>;
}

export interface RequestConfig extends AxiosRequestConfig {
  retries?: number;
}

class ApiClient {
  private baseURL: string;
  private axiosInstance: AxiosInstance;
  private config: ReturnType<typeof getApiConfig>;
  private authToken: string | null = null;
  private onUnauthorized?: () => void;

  constructor() {
    this.config = getApiConfig();
    this.baseURL = this.config.baseURL;

    // Criar instância do axios com configurações padrão
    // withCredentials permite que axios envie/receba cookies automaticamente
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.config.timeout,
      withCredentials: true, // CRÍTICO: Isso faz axios gerenciar cookies automaticamente
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'FiscalizaAI/1.0.0 (React Native)',
        'Connection': 'keep-alive',
        ...this.config.headers,
      },
    });

    // Interceptador de resposta para tratar erros
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 && this.onUnauthorized) {
          console.log('🔐 Erro 401 detectado, chamando callback de logout');
          this.onUnauthorized();
        }
        return Promise.reject(error);
      }
    );

    // Add device/app context headers used by SDUI endpoints for analytics
    this.axiosInstance.defaults.headers.common['X-App-Version'] = getAppVersion();
    this.axiosInstance.defaults.headers.common['X-App-Platform'] = getAppPlatform();
    this.axiosInstance.defaults.headers.common['X-OS-Version'] = getOSVersion();
    this.axiosInstance.defaults.headers.common['X-Device-Model'] = getDeviceModel();
    this.axiosInstance.defaults.headers.common['X-App-Language'] = getAppLanguage();
    // Device ID is persisted asynchronously; set it once it resolves.
    // Requests fired immediately after instantiation will be sent without this
    // header, which is acceptable because the BFF treats it as optional (used
    // for analytics only).  Subsequent requests will always carry the header.
    void getOrCreateDeviceId().then(deviceId => {
      this.axiosInstance.defaults.headers.common['X-Device-Id'] = deviceId;
    });

    console.log('✅ ApiClient inicializado com Axios (cookies gerenciados automaticamente)');
  }

  /**
   * Placeholder: initializeCookies não é mais necessário com axios
   */
  async initializeCookies(): Promise<void> {
    console.log('ℹ️ Axios gerencia cookies automaticamente, initializeCookies é um no-op');
  }

  /**
   * Placeholder: removeAllCookies para compatibilidade
   */
  clearCookies(): void {
    console.log('ℹ️ Axios gerencia cookies automaticamente via withCredentials');
  }

  /**
   * Define o token de autenticação
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common.Authorization;
    }
  }

  /**
   * Remove o token de autenticação
   */
  clearAuthToken(): void {
    this.authToken = null;
    delete this.axiosInstance.defaults.headers.common.Authorization;
  }

  /**
   * Configura a URL base da API
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.axiosInstance.defaults.baseURL = url;
  }

  /**
   * Adiciona ou atualiza headers padrão
   */
  setDefaultHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove um header padrão
   */
  removeDefaultHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  /**
   * Define callback para tratamento de erro 401 (não autorizado)
   */
  setUnauthorizedCallback(callback: () => void): void {
    this.onUnauthorized = callback;
  }

  /**
   * Remove o callback de erro 401
   */
  removeUnauthorizedCallback(): void {
    this.onUnauthorized = undefined;
  }

  /**
   * Faz uma requisição HTTP com tratamento completo de erros
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { retries = 1, ...axiosConfig } = config;

    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
      console.log(`📡 Fazendo ${config.method || 'GET'} para: ${url}`);
      console.log('📋 Headers sendo enviados:', this.axiosInstance.defaults.headers.common);

      const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
        url: endpoint,
        ...axiosConfig,
      });

      console.log(`📨 Resposta recebida - Status: ${response.status}`);
      console.log('✅ Resposta processada com sucesso');

      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      if (axiosError.response) {
        // Erro de resposta do servidor
        console.error(`❌ Resposta de erro da API: ${axiosError.response.status}`);
        console.error('🔍 Detalhes do erro da API:', axiosError.response.data);

        if (axiosError.response.status === 401 && this.onUnauthorized) {
          console.log('🔐 Erro 401 detectado, chamando callback de logout');
          this.onUnauthorized();
          return { data: null as T, status: axiosError.response.status, headers: axiosError.response.headers };
        }

        const apiError = new Error(
          axiosError.response.data?.message || `HTTP ${axiosError.response.status}`
        ) as ApiError;
        apiError.status = axiosError.response.status;
        apiError.code = axiosError.response.data?.code || `HTTP_${axiosError.response.status}`;
        apiError.retry = axiosError.response.status >= 500 || axiosError.response.status === 408;

        throw apiError;
      } else if (axiosError.request) {
        // Erro de rede
        console.error('💥 Erro na requisição HTTP:', {
          error: axiosError.message,
          isNetworkError: true,
          isTimeout: axiosError.code === 'ECONNABORTED',
        });

        if (retries > 0 && axiosError.code === 'ECONNABORTED') {
          console.warn(`🔄 Tentando novamente... (${retries} tentativas restantes)`);
          await this.delay(1000);
          return this.request<T>(endpoint, { ...config, retries: retries - 1 });
        }

        throw axiosError;
      } else {
        // Erro desconhecido
        console.error('💥 Erro desconhecido:', axiosError.message);
        throw axiosError;
      }
    }
  }

  /**
   * Método GET
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET', params });
  }

  /**
   * Método POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data });
  }

  /**
   * Método PUT
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: Omit<RequestConfig, 'method' | 'data'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data });
  }

  /**
   * Método DELETE
   */
  async delete<T>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Delay utilitário
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instância singleton do API client
export const apiClient: ApiClient = new ApiClient();

// Métodos públicos para gerenciamento de autenticação
export const authApiClient = {
  setToken: (token: string | null) => apiClient.setAuthToken(token),
  clearToken: () => apiClient.clearAuthToken(),
};

// Exportar tipos e utilitários
export type { ApiClient };
export default apiClient;
