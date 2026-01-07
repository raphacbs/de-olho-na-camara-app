import React from 'react';
import { Text, TouchableOpacity, Platform } from 'react-native';
import { CardComponent, ComponentStyle } from '@/types/sdui';
import { BaseComponent } from './BaseComponent';
import { useSDUIActionsContext } from '../SDUIActionsContext';

export const Card: React.FC<CardComponent & { children?: React.ReactNode }> = ({
  title,
  subtitle,
  elevation = 2,
  shadow = true,
  borderRadius = 12,
  padding = 16,
  margin = 0,
  backgroundColor = '#FFFFFF',
  gradientColors,
  onPress,
  actionParams,
  style,
  children,
  ...props
}) => {
  const { handleAction } = useSDUIActionsContext();
  // Estilo base do card
  const cardStyle: ComponentStyle = {
    backgroundColor,
    borderRadius,
    padding,
    margin,
    ...style,
  };

  // Adicionar sombra/elevação
  if (shadow && elevation > 0) {
    if (Platform.OS === 'ios') {
      cardStyle.shadowColor = '#000';
      cardStyle.shadowOffset = { width: 0, height: elevation };
      cardStyle.shadowOpacity = 0.1;
      cardStyle.shadowRadius = elevation * 2;
    } else {
      cardStyle.elevation = elevation;
    }
  }

  // Se tem gradiente, aplicar (simplificado - pode ser expandido)
  if (gradientColors && gradientColors.length >= 2) {
    // Para implementação completa de gradiente, seria necessário usar react-native-linear-gradient
    // Por enquanto, usamos uma cor média
    cardStyle.backgroundColor = gradientColors[0];
  }

  const CardContent = () => (
    <BaseComponent style={cardStyle} {...props}>
      {title && (
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          marginBottom: subtitle ? 4 : 0,
          color: '#1a1a1a'
        }}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: children ? 12 : 0
        }}>
          {subtitle}
        </Text>
      )}
      {children}
    </BaseComponent>
  );

  // Se tem onPress, tornar o card pressionável
  if (onPress) {
    return (
      <TouchableOpacity
        style={{
          borderRadius: borderRadius || 12,
          overflow: 'hidden', // Garante que o conteúdo respeite o borderRadius
        }}
        activeOpacity={0.8}
        onPress={() => {
          handleAction(onPress, actionParams);
        }}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};
