/**
 * SDUIBFFScreen – Generic SDUI screen renderer for BFF endpoints.
 *
 * ## How the SDUI architecture works
 *
 * The server (BFF) returns a declarative screen definition:
 * ```json
 * {
 *   "screenId": "home",
 *   "version": "1.0",
 *   "components": [
 *     { "id": "greeting", "type": "GREETING_HEADER", "properties": { ... } },
 *     { "id": "stats",    "type": "STATS_GRID",      "properties": { ... } }
 *   ]
 * }
 * ```
 *
 * The client (this component) renders each component using the `ComponentRegistry`.
 * The registry maps BFF type strings (e.g. "STATS_GRID") to React Native components.
 *
 * ## Extending the engine
 *
 * Adding a NEW component type:
 *   1. Create the React Native component in `src/sdui/components/`
 *   2. Register it in `src/sdui/ComponentRegistry.tsx`
 *   → That's it. The BFF can then include it on ANY screen — no other
 *     frontend changes needed. Component placement, order, and data are
 *     entirely server-controlled.
 *
 * Adding a NEW SDUI screen:
 *   ```tsx
 *   // e.g. PoliticiansSDUIScreen.tsx
 *   export function PoliticiansSDUIScreen() {
 *     return (
 *       <SDUIBFFScreen
 *         endpoint="/api/v1/sdui/politicians"
 *         queryKey={['sduiPoliticians']}
 *       />
 *     );
 *   }
 *   ```
 *   No new rendering logic required.
 */

import React, { ReactNode } from 'react';
import {
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';
import { renderChildren } from '@/sdui/ComponentRegistry';
import { SDUIActionsContext } from '@/sdui/SDUIActionsContext';
import { ScreenParamsProvider } from '@/sdui/ScreenParamsContext';
import { useSDUIActions } from '@/sdui/hooks/useSDUIActions';

export interface SDUIBFFScreenProps {
  /** BFF endpoint to fetch the screen definition from. */
  endpoint: string;
  /** React Query cache key for this screen. Must be unique per screen. */
  queryKey: string[];
  /** Optional query params forwarded to the BFF (e.g. { ano: 2025 }). */
  params?: Record<string, string | number | boolean | undefined>;
  /**
   * Optional content rendered BELOW the BFF-driven components.
   * Use this to embed static sections that are not yet covered by the BFF.
   */
  footer?: ReactNode;
}

function SDUIBFFScreenInner({ endpoint, queryKey, params, footer }: SDUIBFFScreenProps) {
  const { handleAction } = useSDUIActions();

  const {
    data: screen,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => dataService.getSDUIScreen(endpoint, params),
  });

  const onRefresh = () => {
    void refetch();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#009C3B" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !screen) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Não foi possível carregar a tela. Tente novamente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const components = screen.components ?? [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SDUIActionsContext.Provider value={{ handleAction }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={['#009C3B']}
              tintColor="#009C3B"
            />
          }
        >
          {/* Server-driven components – fully controlled by the BFF */}
          {renderChildren(components, queryKey.join('-'))}

          {/* Optional static content rendered below BFF-driven components */}
          {footer}
        </ScrollView>
      </SDUIActionsContext.Provider>
    </SafeAreaView>
  );
}

/**
 * Generic wrapper for any BFF SDUI screen.
 *
 * Wraps the inner renderer in `ScreenParamsProvider` so that SDUI filter
 * actions (e.g. `apply_filters`) work correctly inside the screen.
 */
export function SDUIBFFScreen(props: SDUIBFFScreenProps) {
  return (
    <ScreenParamsProvider>
      <SDUIBFFScreenInner {...props} />
    </ScreenParamsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
