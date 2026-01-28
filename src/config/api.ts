/**
 * Configuração da API BFF - Backend For Frontend
 *
 * Este arquivo centraliza todas as configurações relacionadas
 * à comunicação com a API BFF do Fiscaliza AI.
 */

// Detecta se está rodando em emulador Android
// No Android, o host da máquina é acessível via 10.0.2.2
const isAndroidEmulator = 
  typeof navigator !== 'undefined' &&
  /Android/.test(navigator.userAgent);

// 1. Captura as variáveis com valores padrão de segurança
let API_IP = process.env.EXPO_PUBLIC_API_IP || 'localhost';
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '8080';

// Se está no emulador Android e o IP configurado não é já 10.0.2.2, usa o IP do emulador
if (isAndroidEmulator && API_IP !== '10.0.2.2' && API_IP === 'localhost') {
  API_IP = '10.0.2.2';
  console.log('📱 Emulador Android detectado, usando IP: 10.0.2.2');
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  cache: {
    defaultTTL: number;
    maxEntries: number;
  };
  headers: Record<string, string>;
}

// Configuração para desenvolvimento
const developmentConfig: ApiConfig = {
  // AQUI ESTÁ A CORREÇÃO PRINCIPAL
  baseURL: `http://${API_IP}:${API_PORT}`,
  timeout: 30000,
  retries: 3,
  cache: {
    defaultTTL: 5 * 60 * 1000,
    maxEntries: 50,
  },
  headers: {
    'X-App-Version': '1.0.0',
    'X-Platform': 'react-native',
    'X-App-Name': 'fiscaliza-ai-camara-federal',
  },
};

// Configuração para produção
const productionConfig: ApiConfig = {
  baseURL: 'https://api.fiscaliza.ai/api',
  timeout: 15000,
  retries: 2,
  cache: {
    defaultTTL: 10 * 60 * 1000,
    maxEntries: 100,
  },
  headers: {
    'X-App-Version': '1.0.0',
    'X-Platform': 'react-native',
    'X-App-Name': 'fiscaliza-ai-camara-federal',
  },
};

// Configuração para staging
const stagingConfig: ApiConfig = {
  baseURL: 'https://api-staging.fiscaliza.ai/api',
  timeout: 20000,
  retries: 2,
  cache: {
    defaultTTL: 2 * 60 * 1000,
    maxEntries: 50,
  },
  headers: {
    'X-App-Version': '1.0.0',
    'X-Platform': 'react-native',
    'X-App-Name': 'fiscaliza-ai-camara-federal-staging',
  },
};

/**
 * Retorna a configuração da API baseada no ambiente
 */
export function getApiConfig(): ApiConfig {
  // Verifica se estamos em modo de desenvolvimento
  const isDev = __DEV__;

  // Verifica variável de ambiente específica (definida no .env)
  const envVar = process.env.EXPO_PUBLIC_ENV;
  const isStaging = envVar === 'staging';

  let config: ApiConfig;
  let environment: string;

  // Lógica de seleção
  if (isStaging) {
    config = stagingConfig;
    environment = 'staging';
  } else if (isDev) {
    config = developmentConfig;
    environment = 'development';
  } else {
    config = productionConfig;
    environment = 'production';
  }

  // Logs apenas em desenvolvimento para não sujar o console de produção
  if (__DEV__) {
    console.log(`🌍 Ambiente de API selecionado: ${environment}`);
    console.log(`🔗 URL base da API: ${config.baseURL}`);
    console.log(`🔍 IP Configurado: ${API_IP}`);
  }

  return config;
}

// ... Resto do arquivo (API_ENDPOINTS, RETRY_CONFIG) mantém igual ...
export const API_ENDPOINTS = {
  DATA: {
    DEPUTADO_DETAIL: (id: string) => `/deputados/${id}`,
    PROPOSITION_DETAIL: (id: string) => `/propositions/${id}`,
    VOTING_DETAIL: (id: string) => `/votings/${id}`,
  },
  ACTIONS: {
    USER_FEEDBACK: '/actions/feedback',
    ANALYTICS: '/actions/analytics',
  },
} as const;

export const RETRY_CONFIG = {
  NETWORK_ERRORS: {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },
  SERVER_ERRORS: {
    maxRetries: 2,
    backoffMultiplier: 1.5,
    initialDelay: 2000,
  },
  CLIENT_ERRORS: {
    maxRetries: 1,
    backoffMultiplier: 1,
    initialDelay: 500,
  },
} as const;