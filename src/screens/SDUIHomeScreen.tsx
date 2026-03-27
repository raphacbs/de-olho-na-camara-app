/**
 * SDUIHomeScreen – Home screen rendered by the SDUI engine.
 *
 * Enabled via the EXPO_PUBLIC_SDUI_ENABLED environment variable.
 * The BFF endpoint /api/v1/sdui/home returns a declarative screen definition
 * that is rendered here using the SDUI component registry.
 *
 * The existing NewHomeScreen is left untouched so both approaches can coexist
 * during the evaluation period.
 */

import React from 'react';
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
import { useFilters } from '@/contexts/FiltersContext';
import { renderChildren } from '@/sdui/ComponentRegistry';
import { SDUIActionsContext } from '@/sdui/SDUIActionsContext';
import { ScreenParamsProvider } from '@/sdui/ScreenParamsContext';
import { useSDUIActions } from '@/sdui/hooks/useSDUIActions';
import { FollowingDeputiesSession } from './NewHomeScreen/components/FollowingDeputiesSession';

function SDUIHomeScreenInner() {
  const { year } = useFilters();
  const { handleAction } = useSDUIActions();

  const {
    data: homeScreen,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['sduiHomeScreen', year],
    queryFn: () => dataService.getSDUIHomeScreen(year ?? undefined),
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

  if (isError || !homeScreen) {
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

  const components = homeScreen.components ?? [];

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
          {/* BFF-driven components */}
          {renderChildren(components, 'sdui-home')}

          {/* The BFF returns a section header for followed deputies but not
              the list itself. We keep the existing session component here so
              that the content is still visible below the SDUI header.
              TODO: Once the BFF includes a FOLLOWED_POLITICIANS_LIST component
              type, replace this with a fully declarative SDUI component. */}
          <FollowingDeputiesSession />
        </ScrollView>
      </SDUIActionsContext.Provider>
    </SafeAreaView>
  );
}

/**
 * Exported screen component.
 * Wraps the inner screen in ScreenParamsProvider so that SDUI filter actions
 * (e.g. apply_filters) work correctly within this screen.
 */
export function SDUIHomeScreen() {
  return (
    <ScreenParamsProvider>
      <SDUIHomeScreenInner />
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
