import React from 'react';
import { ViewStyle } from 'react-native';
import { ContainerComponent } from '@/types/sdui';
import { BaseComponent, convertStyleToRN } from './BaseComponent';

export const Container: React.FC<ContainerComponent & { children?: React.ReactNode }> = ({
  direction = 'column',
  spacing = 0,
  wrap = false,
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

  return (
    <BaseComponent style={containerStyle} {...props}>
      {children}
    </BaseComponent>
  );
};
