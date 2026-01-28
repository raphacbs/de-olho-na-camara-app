import React, { createContext, useContext } from 'react';

interface SDUIActionsContextType {
  handleAction: (actionId: string, params?: Record<string, unknown>) => void;
}

export const SDUIActionsContext = createContext<SDUIActionsContextType | undefined>(undefined);

export function useSDUIActionsContext() {
  const context = useContext(SDUIActionsContext);
  if (!context) {
    throw new Error('useSDUIActionsContext must be used within SDUIActionsProvider');
  }
  return context;
}
