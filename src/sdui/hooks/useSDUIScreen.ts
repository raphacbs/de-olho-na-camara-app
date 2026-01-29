import { useState, useEffect, useCallback, useRef } from 'react';
import { SDUIResponse, SDUIScreen, SDUIError, SDUIAction } from '@/types/sdui';
import apiClient, { ApiError } from '@/services/apiClient';
import { useScreenParams } from '../ScreenParamsContext';

// Tipos para o estado do hook
export interface SDUIScreenState {
  screen: SDUIScreen | null;
  loading: boolean;
  error: SDUIError | null;
  isRefreshing: boolean;
}

// Tipos para as opções do hook
export interface UseSDUIScreenOptions {
  endpoint: string;
  screenId?: string; // ID da tela para observar mudanças de parâmetros
  cache?: boolean;
  cacheTTL?: number; // Tempo de vida do cache em ms
  autoRefresh?: boolean;
  refreshInterval?: number; // Intervalo de auto-refresh em ms
  retryOnError?: boolean;
  maxRetries?: number;
}

// Cache simples em memória
const screenCache = new Map<string, { data: SDUIResponse; timestamp: number }>();

/**
 * Remove propriedades null/undefined de um objeto recursivamente
 * Isso otimiza o JSON recebido do BFF que pode ter muitas propriedades null
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
function cleanNullProperties(obj: unknown): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanNullProperties(item));
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    const objRecord = obj as Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, value] of Object.entries(objRecord)) {
      // Manter propriedades que não são null/undefined
      // Exceto para propriedades especiais como 'props' que podem ser objetos vazios
      if (value !== null && value !== undefined) {
        if (key === 'props' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const propsObj = value as Record<string, unknown>;
          if (Object.keys(propsObj).length === 0) {
            // Pular props vazio
            continue;
          }
        }
        cleaned[key] = cleanNullProperties(value);
      }
    }
    return cleaned;
  }

  return obj;
}

/**
 * Normaliza a resposta do BFF para garantir estrutura consistente
 */
function normalizeBFFResponse(response: SDUIResponse): SDUIResponse {
  // Limpar propriedades null dos componentes recursivamente
  const cleaned = cleanNullProperties(response);
  
  // Validar e converter para SDUIResponse
  if (typeof cleaned !== 'object' || cleaned === null) {
    throw new Error('Resposta do BFF inválida: formato incorreto');
  }

  const normalized = cleaned as Record<string, unknown>;
  
  // Garantir que screen existe
  if (!normalized.screen || typeof normalized.screen !== 'object') {
    throw new Error('Resposta do BFF inválida: campo "screen" não encontrado');
  }

  const screen = normalized.screen as Record<string, unknown>;

  // Garantir que components é um array
  if (!Array.isArray(screen.components)) {
    screen.components = [];
  }

  // Validar estrutura mínima do screen
  if (typeof screen.id !== 'string' || !Array.isArray(screen.components)) {
    throw new Error('Resposta do BFF inválida: estrutura do "screen" incorreta');
  }

  const result: SDUIResponse = {
    screen: {
      id: screen.id,
      title: typeof screen.title === 'string' ? screen.title : undefined,
      components: screen.components as SDUIScreen['components'],
      navigation: typeof screen.navigation === 'object' && screen.navigation !== null
        ? screen.navigation as SDUIScreen['navigation']
        : undefined,
      refresh: typeof screen.refresh === 'boolean' ? screen.refresh : undefined,
      loading: typeof screen.loading === 'boolean' ? screen.loading : undefined,
    },
  };

  if (Array.isArray(normalized.actions)) {
    result.actions = normalized.actions as SDUIAction[];
  }

  if (typeof normalized.metadata === 'object' && normalized.metadata !== null) {
    result.metadata = normalized.metadata as SDUIResponse['metadata'];
  }

  return result;
}

/**
 * Hook personalizado para gerenciar telas SDUI vindas da API BFF
 * Inclui estados de loading, erro, cache e auto-refresh
 */
export function useSDUIScreen(options: UseSDUIScreenOptions): SDUIScreenState & {
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  clearCache: () => void;
} {
  const {
    endpoint,
    screenId,
    cache = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutos padrão
    autoRefresh = false,
    refreshInterval = 30 * 1000, // 30 segundos
    retryOnError = true,
    maxRetries = 3,
  } = options;

  // Hook para acessar parâmetros da tela (se screenId for fornecido)
  const { getScreenParams } = useScreenParams();

  // Estado do hook
  const [state, setState] = useState<SDUIScreenState>({
    screen: null,
    loading: true,
    error: null,
    isRefreshing: false,
  });

  // Refs para controlar intervalos e tentativas
  const retryCountRef = useRef(0);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const lastScreenParamsRef = useRef<Record<string, unknown> | undefined>(undefined);

  /**
   * Verifica se os dados em cache são válidos
   */
  const isCacheValid = useCallback((cacheEntry: { data: SDUIResponse; timestamp: number }): boolean => {
    if (!cache) return false;

    const now = Date.now();
    const cacheAge = now - cacheEntry.timestamp;

    // Verificar se o cache ainda é válido
    if (cacheAge > cacheTTL) {
      return false;
    }

    // Verificar se há TTL específico nos metadados
    if (cacheEntry.data.metadata?.ttl) {
      const metadataTTL = cacheEntry.data.metadata.ttl * 1000; // Converter para ms
      return cacheAge <= metadataTTL;
    }

    return true;
  }, [cache, cacheTTL]);

  /**
   * Busca dados do cache
   */
  const getCachedData = useCallback((): SDUIResponse | null => {
    const cacheEntry = screenCache.get(endpoint);
    if (cacheEntry && isCacheValid(cacheEntry)) {
      return cacheEntry.data;
    }
    return null;
  }, [endpoint, isCacheValid]);

  /**
   * Salva dados no cache
   */
  const setCachedData = useCallback((data: SDUIResponse): void => {
    if (cache) {
      screenCache.set(endpoint, {
        data,
        timestamp: Date.now(),
      });
    }
  }, [cache, endpoint]);

  /**
   * Limpa o cache para este endpoint
   */
  const clearCache = useCallback((): void => {
    screenCache.delete(endpoint);
  }, [endpoint]);

  /**
   * Cria um erro padronizado
   */
  const createError = useCallback((error: unknown, retryable: boolean = true): SDUIError => {
    // Verificar se é um ApiError (que tem propriedades específicas)
    if (error instanceof Error && 'code' in error && 'status' in error) {
      const apiError = error as ApiError;
      return {
        code: apiError.code,
        message: apiError.message,
        retry: retryable && retryCountRef.current < maxRetries,
      };
    }

    if (error instanceof Error) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message || 'Erro de conexão',
        retry: retryable && retryCountRef.current < maxRetries,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'Erro desconhecido',
      retry: retryable && retryCountRef.current < maxRetries,
    };
  }, [maxRetries]);

  /**
   * Mapeia filtros do componente para parâmetros da API BFF
   */
  const mapFiltersToApiParams = useCallback((baseEndpoint: string, filters: Record<string, string[]>): Record<string, string> => {
    const apiParams: Record<string, string> = {};

    // Mapeamento específico para proposições
    if (baseEndpoint.includes('/propositions') || baseEndpoint.includes('/sdui/propositions')) {

      console.log('🔄 Mapeando filtros para proposições:', filters);

      // Tipo de proposição - múltiplos valores separados por vírgula
      if (filters.tipo && filters.tipo.length > 0) {
        apiParams.tipo = filters.tipo.join(','); // Ex: "PL,PEC,PLP"
        console.log(`📝 Tipos selecionados: ${filters.tipo.join(', ')} → API: tipo=${apiParams.tipo}`);
      }

      // Status da tramitação - múltiplos valores separados por vírgula
      if (filters.status && filters.status.length > 0) {
        apiParams.status = filters.status.join(','); // Ex: "tramitando,aprovado"
        console.log(`📝 Status selecionados: ${filters.status.join(', ')} → API: status=${apiParams.status}`);
      }

      // Período - apenas um valor
      if (filters.periodo && filters.periodo.length > 0) {
        apiParams.periodo = filters.periodo[0];
      }

      // Político - apenas um valor (busca)
      if (filters.politico && filters.politico.length > 0) {
        apiParams.politico = filters.politico[0];
      }

      console.log('📋 Parâmetros mapeados para API:', apiParams);
    }

    // Mapeamento para deputados/politicians
    else if (baseEndpoint.includes('/politicians') || baseEndpoint.includes('/sdui/politicians') ||
             baseEndpoint.includes('/deputados') || baseEndpoint.includes('/sdui/deputados')) {

      console.log('🔄 Mapeando filtros para deputados:', filters);

      // UF - múltiplos valores suportados
      if (filters.uf && filters.uf.length > 0) {
        apiParams.uf = filters.uf.join(','); // Suporte a múltiplas UFs
      }

      console.log('📋 Parâmetros mapeados para API:', apiParams);
    }

    return apiParams;
  }, []);

  /**
   * Constrói a URL com parâmetros de query se houver screenParams
   */
  const buildEndpointWithParams = useCallback((baseEndpoint: string, params?: Record<string, unknown>): string => {
    if (!params) return baseEndpoint;

    const queryParams = new URLSearchParams();

    // Adicionar search se existir (mapeia para 'politico' em proposições)
    if (params.search && typeof params.search === 'string') {
      if (baseEndpoint.includes('/propositions') || baseEndpoint.includes('/sdui/propositions')) {
        queryParams.append('politico', params.search);
      } else {
        queryParams.append('search', params.search);
      }
    }

    // Adicionar filtros mapeados para parâmetros da API
    if (params.filters && typeof params.filters === 'object') {
      const apiParams = mapFiltersToApiParams(baseEndpoint, params.filters as Record<string, string[]>);
      Object.entries(apiParams).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
    }

    // Adicionar outros parâmetros (dataInicio, dataFim, page, size, etc.)
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'search' && key !== 'filters' && value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Para arrays, adicionar múltiplos valores com a mesma chave
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
  }, [mapFiltersToApiParams]);

  /**
   * Faz a chamada para a API BFF
   */
  const fetchScreenData = useCallback(async (isRefresh = false): Promise<void> => {
    if (!mountedRef.current) return;

    try {
      // Atualizar estado de loading
      setState(prev => ({
        ...prev,
        loading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      // Construir endpoint com parâmetros atuais da tela
      const screenParams = screenId ? getScreenParams(screenId) : undefined;
      const endpointWithParams = buildEndpointWithParams(endpoint, screenParams);

      // Verificar cache primeiro (se não for refresh)
      if (!isRefresh) {
        const cachedData = getCachedData();
        if (cachedData) {
          setState(prev => ({
            ...prev,
            screen: cachedData.screen,
            loading: false,
            error: null,
          }));
          return;
        }
      }

      // Fazer chamada para API
      console.log('🌐 Fazendo GET para:', endpointWithParams);
      const response = await apiClient.get<SDUIResponse>(endpointWithParams);

      // Normalizar resposta do BFF (limpar propriedades null e validar estrutura)
      const normalizedResponse = normalizeBFFResponse(response.data);
      console.log('✅ Resposta do BFF normalizada com sucesso');

      // Salvar no cache (versão normalizada)
      setCachedData(normalizedResponse);

      // Resetar contador de tentativas em caso de sucesso
      retryCountRef.current = 0;

      // Atualizar estado
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          screen: normalizedResponse.screen,
          loading: false,
          isRefreshing: false,
          error: null,
        }));
      }

    } catch (error) {
      console.error('SDUI Screen fetch error:', error);

      // Incrementar contador de tentativas
      retryCountRef.current += 1;

      // Criar erro padronizado
      const sduiError = createError(error, retryOnError);

      // Tentar novamente automaticamente se configurado
      if (retryOnError && sduiError.retry && retryCountRef.current <= maxRetries) {
        console.log(`Retrying SDUI screen fetch (attempt ${retryCountRef.current}/${maxRetries})`);
        setTimeout(() => {
          if (mountedRef.current) {
            void fetchScreenData(isRefresh);
          }
        }, Math.pow(2, retryCountRef.current) * 1000); // Backoff exponencial
        return;
      }

      // Atualizar estado com erro
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          isRefreshing: false,
          error: sduiError,
        }));
      }
    }
  }, [endpoint, screenId, getScreenParams, buildEndpointWithParams, getCachedData, setCachedData, createError, retryOnError, maxRetries, mountedRef]);

  /**
   * Função para refresh manual
   */
  const refresh = useCallback(async (): Promise<void> => {
    clearCache(); // Limpar cache antes do refresh
    await fetchScreenData(true);
  }, [fetchScreenData, clearCache]);

  /**
   * Função para tentar novamente
   */
  const retry = useCallback(async (): Promise<void> => {
    retryCountRef.current = 0; // Resetar contador
    clearCache(); // Limpar cache
    await fetchScreenData();
  }, [fetchScreenData, clearCache]);

  /**
   * Setup do auto-refresh
   */
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        if (mountedRef.current && !state.loading && !state.isRefreshing) {
          void fetchScreenData(true);
        }
      }, refreshInterval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, state.loading, state.isRefreshing, fetchScreenData]);

  /**
   * Função helper para comparar objetos de parâmetros
   */
  const areParamsEqual = useCallback((a?: Record<string, unknown>, b?: Record<string, unknown>): boolean => {
    console.log('🔍 Comparando parâmetros:', { a, b });

    if (!a && !b) {
      console.log('✅ Ambos undefined/null');
      return true;
    }
    if (!a || !b) {
      console.log('❌ Um é undefined/null');
      return false;
    }

    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();

    console.log('🔑 Chaves A:', keysA);
    console.log('🔑 Chaves B:', keysB);

    if (keysA.length !== keysB.length) {
      console.log('❌ Número diferente de chaves');
      return false;
    }

    const result = keysA.every(key => {
      const valA = a[key];
      const valB = b[key];

      console.log(`🔍 Comparando ${key}:`, { valA, valB });

      // Para arrays, comparar como strings JSON
      if (Array.isArray(valA) && Array.isArray(valB)) {
        const sortedA = [...(valA as unknown[])].sort();
        const sortedB = [...(valB as unknown[])].sort();
        const equal = JSON.stringify(sortedA) === JSON.stringify(sortedB);
        console.log(`📊 Arrays ${equal ? 'iguais' : 'diferentes'}:`, { sortedA, sortedB });
        return equal;
      }

      // Para objetos, comparar recursivamente
      if (typeof valA === 'object' && typeof valB === 'object' && valA !== null && valB !== null) {
        return areParamsEqual(valA as Record<string, unknown>, valB as Record<string, unknown>);
      }

      const equal = valA === valB;
      console.log(`🔢 Valores ${equal ? 'iguais' : 'diferentes'}:`, { valA, valB });
      return equal;
    });

    console.log(`🎯 Resultado da comparação: ${result}`);
    return result;
  }, []);

  /**
   * Efeito para recarregar quando parâmetros da tela mudarem
   * Usa uma ref para rastrear mudanças sem causar loops infinitos
   */
  useEffect(() => {
    if (!screenId) return;

    const currentParams = getScreenParams(screenId);

    // Se não há parâmetros e nunca houve parâmetros, não fazer nada
    if (!currentParams && !lastScreenParamsRef.current) {
      return;
    }

    // Verificar se os parâmetros realmente mudaram para evitar loops
    const paramsChanged = !areParamsEqual(currentParams, lastScreenParamsRef.current);

    if (paramsChanged) {
      if (__DEV__) {
        console.log(`🔄 SDUIScreen: Parâmetros da tela ${screenId} mudaram, recarregando`);
      }
      lastScreenParamsRef.current = currentParams ? { ...currentParams } : undefined; // Criar cópia
      void fetchScreenData(true); // Forçar refresh quando parâmetros mudarem
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId, getScreenParams]);

  /**
   * Efeito inicial para buscar dados
   */
  useEffect(() => {
    void fetchScreenData();

    // Cleanup
    return () => {
      mountedRef.current = false;
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refresh,
    retry,
    clearCache,
  };
}
