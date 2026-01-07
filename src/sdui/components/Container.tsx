import React from 'react';
import { ScrollView } from 'react-native';
import { ContainerComponent } from '@/types/sdui';
import { BaseComponent, convertStyleToRN } from './BaseComponent';

export const Container: React.FC<ContainerComponent & { children?: React.ReactNode }> = React.memo(({
  direction = 'column',
  spacing = 0,
  wrap = false,
  scrollable = false,
  horizontal = false,
  style,
  children,
  ...props
}) => {
  const containerStyle = {
    flexDirection: direction,
    ...(spacing > 0 && {
      gap: spacing,
    }),
    ...(wrap && {
      flexWrap: 'wrap' as const,
    }),
    ...convertStyleToRN(style),
  };

  // Se for scrollable, usar ScrollView
  if (scrollable) {
    return (
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={!horizontal}
        contentContainerStyle={containerStyle}
        style={{ flex: horizontal ? undefined : 1 }}
        {...props}
      >
        {children}
      </ScrollView>
    );
  }

  // Caso contrário, usar View normal
  return (
    <BaseComponent style={containerStyle} {...props}>
      {children}
    </BaseComponent>
  );
});
