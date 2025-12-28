import React from 'react';
import { SpacerComponent } from '@/types/sdui';
import { BaseComponent } from './BaseComponent';

const spacerSizes = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export const Spacer: React.FC<SpacerComponent> = ({
  size = 'medium',
  style,
  ...props
}) => {
  const spacerSize = typeof size === 'string' ? spacerSizes[size] : size;

  return (
    <BaseComponent
      style={{
        height: spacerSize,
        width: spacerSize,
        ...style,
      }}
      {...props}
    />
  );
};
