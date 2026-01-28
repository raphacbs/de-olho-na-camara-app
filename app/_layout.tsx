import React, { useEffect } from 'react';
// @ts-ignore: avoid module resolution error in this environment
const { Slot } = require('expo-router');
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { FiltersProvider } from '@/contexts/FiltersContext';
import { apiClient } from '@/services/apiClient';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    void apiClient.initializeCookies();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <PaperProvider>
          <AuthProvider>
            <FiltersProvider>
              <Slot />
            </FiltersProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
