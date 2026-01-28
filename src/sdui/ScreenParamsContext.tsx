import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

/**
 * Contexto para gerenciar parâmetros de filtros e busca por tela SDUI
 * Permite que ações como 'apply_filters' atualizem parâmetros e recarreguem telas
 */

// Tipos para parâmetros de tela
export interface ScreenFilterParams {
  search?: string;
  filters?: Record<string, string[]>;
  [key: string]: unknown;
}

interface ScreenParamsContextType {
  // Obtém parâmetros atuais de uma tela
  getScreenParams: (screenId: string) => ScreenFilterParams | undefined;

  // Atualiza parâmetros de uma tela (aciona recarregamento)
  updateScreenParams: (screenId: string, params: ScreenFilterParams) => void;

  // Limpa parâmetros de uma tela
  clearScreenParams: (screenId: string) => void;
}

const ScreenParamsContext = createContext<ScreenParamsContextType | undefined>(undefined);

interface ScreenParamsProviderProps {
  children: ReactNode;
}

/**
 * Provider para o contexto de parâmetros de tela
 * Deve ser usado no nível superior da aplicação ou por tela
 */
export function ScreenParamsProvider({ children }: ScreenParamsProviderProps) {
  const [screenParams, setScreenParams] = useState<Record<string, ScreenFilterParams>>({});

  // Usar useCallback para estabilizar a função e evitar re-renders desnecessários
  const getScreenParams = useCallback((screenId: string): ScreenFilterParams | undefined => {
    const params = screenParams[screenId];
    // Remover log excessivo - apenas logar quando houver parâmetros ou em debug
    if (__DEV__ && params) {
      console.log(`📋 getScreenParams(${screenId}):`, params);
    }
    return params;
  }, [screenParams]);

  const updateScreenParams = useCallback((screenId: string, params: ScreenFilterParams) => {
    if (__DEV__) {
      console.log(`ScreenParamsContext: Atualizando parâmetros para tela ${screenId}:`, params);
    }
    setScreenParams(prev => ({
      ...prev,
      [screenId]: { ...params }
    }));
  }, []);

  const clearScreenParams = useCallback((screenId: string) => {
    if (__DEV__) {
      console.log(`ScreenParamsContext: Limpando parâmetros para tela ${screenId}`);
    }
    setScreenParams(prev => {
      const newParams = { ...prev };
      delete newParams[screenId];
      return newParams;
    });
  }, []);

  // Usar useMemo para estabilizar o objeto de valor do contexto
  const value: ScreenParamsContextType = useMemo(() => ({
    getScreenParams,
    updateScreenParams,
    clearScreenParams,
  }), [getScreenParams, updateScreenParams, clearScreenParams]);

  return (
    <ScreenParamsContext.Provider value={value}>
      {children}
    </ScreenParamsContext.Provider>
  );
}

/**
 * Hook para usar o contexto de parâmetros de tela
 */
export function useScreenParams() {
  const context = useContext(ScreenParamsContext);
  if (!context) {
    throw new Error('useScreenParams must be used within ScreenParamsProvider');
  }
  return context;
}
