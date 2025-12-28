import React from 'react';
import { Image as RNImage, ViewStyle } from 'react-native';
import { ImageComponent } from '@/types/sdui';
import { BaseComponent, convertStyleToRN } from './BaseComponent';

export const Image: React.FC<ImageComponent> = ({
  source,
  alt = '',
  resizeMode = 'cover',
  width,
  height,
  style,
  ...props
}) => {
  const imageStyle: ViewStyle = {
    width: width || '100%',
    height: height || 200,
    resizeMode,
    ...convertStyleToRN(style),
  };

  // Para URLs remotas ou assets locais
  const imageSource = typeof source === 'string'
    ? { uri: source }
    : source;

  return (
    <BaseComponent style={style} {...props}>
      <RNImage
        source={imageSource}
        style={imageStyle}
        accessibilityLabel={alt}
        accessible={!!alt}
      />
    </BaseComponent>
  );
};
