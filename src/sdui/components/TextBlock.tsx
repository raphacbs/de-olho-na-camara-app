import React from 'react';
import { Text, TextStyle } from 'react-native';
import { TextBlockComponent } from '@/types/sdui';
import { BaseComponent, convertStyleToRN } from './BaseComponent';

const textVariants = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
    opacity: 0.7,
  },
};

export const TextBlock: React.FC<TextBlockComponent> = React.memo(({
  text,
  variant = 'body',
  color = '#000000',
  fontSize,
  fontWeight,
  textAlign = 'left',
  letterSpacing,
  lineHeight,
  textDecorationLine,
  textTransform,
  style,
  ...props
}) => {
  // Garantir que o variant seja válido, fallback para 'body'
  const safeVariant = variant && textVariants[variant as keyof typeof textVariants] ? variant : 'body';
  const variantStyle = textVariants[safeVariant as keyof typeof textVariants];

  const textStyle: TextStyle = {
    ...variantStyle,
    color,
    textAlign,
    ...(fontSize && { fontSize }),
    ...(fontWeight && { fontWeight }),
    ...(letterSpacing !== undefined && { letterSpacing }),
    ...(lineHeight && { lineHeight }),
    ...(textDecorationLine && { textDecorationLine }),
    ...(textTransform && { textTransform }),
    ...convertStyleToRN(style),
  };

  return (
    <BaseComponent style={style} {...props}>
      <Text style={textStyle}>
        {text}
      </Text>
    </BaseComponent>
  );
});
