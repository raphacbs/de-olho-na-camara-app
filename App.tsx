// Ativar override de desenvolvimento se necessário
if (__DEV__ && process.env.FORCE_DEV_API === 'true') {
  require('./src/config/dev-override');
}

// Non-destructive toggle to use expo-router. When USE_EXPO_ROUTER is 'true', export the router entry.
// This allows testing expo-router without removing the existing navigation setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
if (process.env.USE_EXPO_ROUTER === 'true') {
  // Use CommonJS require so Metro can load the router entry.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  module.exports = require('expo-router/entry');
}

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';
import { apiClient } from './src/services/apiClient';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { FiltersProvider } from './src/contexts/FiltersContext';


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const queryClient = new QueryClient();

export default function App() {
  
  useEffect(() => {
    // Inicializar cookies ao carregar o app
    void apiClient.initializeCookies();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider>
          <AuthProvider>
            <FiltersProvider>
              <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
            </FiltersProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
