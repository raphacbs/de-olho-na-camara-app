import React from 'react';
import { Image as RNImage, ImageStyle } from 'react-native';
import { ImageComponent } from '@/types/sdui';
import { BaseComponent } from './BaseComponent';

export const Image: React.FC<ImageComponent> = ({
  source,
  alt = '',
  resizeMode = 'cover',
  width,
  height,
  style,
  ...props
}) => {
  const imageStyle: ImageStyle = {
    width: width || '100%',
    height: height || 200,
    resizeMode,
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
