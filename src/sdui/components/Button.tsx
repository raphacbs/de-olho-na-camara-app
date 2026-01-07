import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import { ButtonComponent } from '@/types/sdui';
import { convertStyleToRN } from './BaseComponent';
import { useSDUIActionsContext } from '../SDUIActionsContext';

const buttonVariants = {
  primary: {
    backgroundColor: '#009C3B', // Verde brasileiro
    color: '#FFFFFF',
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    color: '#009C3B',
    borderWidth: 1,
    borderColor: '#009C3B',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#009C3B',
    borderWidth: 1,
    borderColor: '#009C3B',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#009C3B',
    borderWidth: 0,
  },
};

const buttonSizes = {
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderRadius: 6,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    borderRadius: 12,
  },
};

export const Button: React.FC<ButtonComponent> = React.memo(({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  actionParams,
  style,
  ..._props
}) => {
  const { handleAction } = useSDUIActionsContext();

  // Garantir que o variant seja válido, fallback para 'primary'
  const safeVariant = variant && buttonVariants[variant as keyof typeof buttonVariants] ? variant : 'primary';
  const variantStyle = buttonVariants[safeVariant as keyof typeof buttonVariants];

  // Garantir que o size seja válido, fallback para 'medium'
  const safeSize = size && buttonSizes[size as keyof typeof buttonSizes] ? size : 'medium';
  const sizeStyle = buttonSizes[safeSize as keyof typeof buttonSizes];

  const buttonStyle: ViewStyle = {
    ...variantStyle,
    ...sizeStyle,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...convertStyleToRN(style),
  };

  // Adicionar sombra para botões primários
  if (variant === 'primary' && !disabled) {
    if (Platform.OS === 'ios') {
      buttonStyle.shadowColor = '#009C3B';
      buttonStyle.shadowOffset = { width: 0, height: 2 };
      buttonStyle.shadowOpacity = 0.3;
      buttonStyle.shadowRadius = 4;
    } else {
      buttonStyle.elevation = 3;
    }
  }

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      handleAction(onPress, actionParams);
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.color} />
      ) : (
        <Text
          style={{
            color: variantStyle.color,
            fontSize: sizeStyle.fontSize,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});
