
import React from 'react';
import { View, ScrollView, ActivityIndicator, ViewStyle, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SDUIScreen } from '@/types/sdui';
import { renderChildren } from './ComponentRegistry';
import { SDUIActionsContext } from './SDUIActionsContext';

interface ScreenRendererProps {
  screen: SDUIScreen;
  scrollable?: boolean;
  style?: ViewStyle;
  onAction?: (actionId: string, params?: Record<string, unknown>) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function ScreenRenderer({
  screen,
  scrollable = true,
  style,
  onAction,
  onRefresh,
  refreshing = false
}: ScreenRendererProps) {
  // Separar componentes sticky dos demais
  const stickyComponents = screen.components?.filter(comp => comp.sticky === true) || [];
  const scrollableComponents = screen.components?.filter(comp => comp.sticky !== true) || [];

  const defaultHandleAction = (actionId: string, params?: Record<string, unknown>) => {
    console.log('SDUI Action (no handler provided):', actionId, params);
  };

  const scrollableContent = (
    <View style={[{ flex: 1, marginHorizontal: 10, marginBottom: 5 }, style]}>
      {screen.loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!screen.loading && (
        <SDUIActionsContext.Provider value={{ handleAction: onAction || defaultHandleAction }}>
          {renderChildren(scrollableComponents)}
        </SDUIActionsContext.Provider>
      )}
    </View>
  );

  const stickyContent = stickyComponents.length > 0 ? (
    <View style={{ marginHorizontal: 0, marginTop: 30 }}>
      <SDUIActionsContext.Provider value={{ handleAction: onAction || defaultHandleAction }}>
        {renderChildren(stickyComponents)}
      </SDUIActionsContext.Provider>
    </View>
  ) : null;

  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1 }}>
          {stickyContent}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#007AFF']} // Cor do indicador iOS
                  tintColor="#007AFF" // Cor do indicador Android
                />
              ) : undefined
            }
          >
            {scrollableContent}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ flex: 1 }}>
        {stickyContent}
        {scrollableContent}
      </View>
    </SafeAreaView>
  );
}
