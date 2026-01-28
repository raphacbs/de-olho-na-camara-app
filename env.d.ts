declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * IP da máquina local para a API BFF
     * Ex: 192.168.1.53
     */
    EXPO_PUBLIC_API_IP: string;

    /**
     * Porta da API BFF
     * Ex: 8080
     */
    EXPO_PUBLIC_API_PORT: string;

    /**
     * Define o ambiente atual manualmente
     * Valores: 'development', 'staging', 'production'
     */
    EXPO_PUBLIC_ENV?: 'development' | 'staging' | 'production';

    /**
     * Flag para forçar modo desenvolvimento (opcional, baseado no seu api.ts)
     */
    FORCE_DEV_API?: string;
  }
}