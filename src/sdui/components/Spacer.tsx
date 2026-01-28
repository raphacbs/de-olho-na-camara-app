import React from 'react';
import { SpacerComponent } from '@/types/sdui';
import { BaseComponent, convertStyleToRN } from './BaseComponent';

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
  const spacerSize =
    typeof size === 'string' && size in spacerSizes
      ? spacerSizes[size as keyof typeof spacerSizes]
      : (size as number);

  return (
    <BaseComponent
      style={{
        height: spacerSize,
        width: spacerSize,
        ...(typeof style === 'object' && style ? convertStyleToRN(style as any) : {}),
      }}
      {...props}
    />
  );
};
