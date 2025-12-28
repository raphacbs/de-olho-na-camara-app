
import React from 'react';
import { View, ScrollView, ActivityIndicator, ViewStyle } from 'react-native';
import { SDUIScreen } from '@/types/sdui';
import { renderChildren } from './ComponentRegistry';

interface ScreenRendererProps {
  screen: SDUIScreen;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function ScreenRenderer({
  screen,
  scrollable = true,
  style
}: ScreenRendererProps) {
  // Separar componentes sticky dos demais
  const stickyComponents = screen.components?.filter(comp => comp.sticky) || [];
  const scrollableComponents = screen.components?.filter(comp => !comp.sticky) || [];

  const scrollableContent = (
    <View style={[{ flex: 1, marginHorizontal: 10, marginBottom: 5 }, style]}>
      {screen.loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!screen.loading && renderChildren(scrollableComponents)}
    </View>
  );

  const stickyContent = stickyComponents.length > 0 ? (
    <View style={{ marginHorizontal: 0, marginTop: 30 }}>
      {renderChildren(stickyComponents)}
    </View>
  ) : null;

  if (scrollable) {
    return (
      <View style={{ flex: 1 }}>
        {stickyContent}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {scrollableContent}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {stickyContent}
      {scrollableContent}
    </View>
  );
}
