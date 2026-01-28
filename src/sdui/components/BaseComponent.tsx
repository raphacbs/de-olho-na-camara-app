import React from 'react';
import { View, ViewStyle } from 'react-native';
import { ComponentStyle } from '@/types/sdui';

interface BaseComponentProps {
  id?: string;
  type?: string;
  style?: ComponentStyle | ViewStyle;
  children?: React.ReactNode;
}

const styleMappings: Record<string, (value: unknown) => Record<string, unknown>> = {
  margin: (value: unknown) => ({ margin: value }),
  padding: (value: unknown) => ({ padding: value }),
  marginTop: (value: unknown) => ({ marginTop: value }),
  marginBottom: (value: unknown) => ({ marginBottom: value }),
  marginLeft: (value: unknown) => ({ marginLeft: value }),
  marginRight: (value: unknown) => ({ marginRight: value }),
  paddingTop: (value: unknown) => ({ paddingTop: value }),
  paddingBottom: (value: unknown) => ({ paddingBottom: value }),
  paddingLeft: (value: unknown) => ({ paddingLeft: value }),
  paddingRight: (value: unknown) => ({ paddingRight: value }),
  paddingHorizontal: (value: unknown) => ({ paddingHorizontal: value }),
  backgroundColor: (value: unknown) => ({ backgroundColor: value }),
  borderRadius: (value: unknown) => ({ borderRadius: value }),
  borderWidth: (value: unknown) => ({ borderWidth: value }),
  borderColor: (value: unknown) => ({ borderColor: value }),
  flex: (value: unknown) => ({ flex: value }),
  flexDirection: (value: unknown) => ({ flexDirection: value }),
  justifyContent: (value: unknown) => ({ justifyContent: value }),
  alignItems: (value: unknown) => ({ alignItems: value }),
  width: (value: unknown) => ({ width: value }),
  height: (value: unknown) => ({ height: value }),
  maxWidth: (value: unknown) => ({ maxWidth: value }),
  maxHeight: (value: unknown) => ({ maxHeight: value }),
  minWidth: (value: unknown) => ({ minWidth: value }),
  minHeight: (value: unknown) => ({ minHeight: value }),
  textAlign: (value: unknown) => ({ textAlign: value }),
  opacity: (value: unknown) => ({ opacity: value }),
  // Propriedades modernas
  shadowColor: (value: unknown) => ({ shadowColor: value }),
  shadowOffset: (value: unknown) => ({ shadowOffset: value }),
  shadowOpacity: (value: unknown) => ({ shadowOpacity: value }),
  shadowRadius: (value: unknown) => ({ shadowRadius: value }),
  elevation: (value: unknown) => ({ elevation: value }),
  // Bordas específicas
  borderTopWidth: (value: unknown) => ({ borderTopWidth: value }),
  borderTopColor: (value: unknown) => ({ borderTopColor: value }),
  borderBottomWidth: (value: unknown) => ({ borderBottomWidth: value }),
  borderBottomColor: (value: unknown) => ({ borderBottomColor: value }),
  borderBottomLeftRadius: (value: unknown) => ({ borderBottomLeftRadius: value }),
  borderBottomRightRadius: (value: unknown) => ({ borderBottomRightRadius: value }),
  borderLeftWidth: (value: unknown) => ({ borderLeftWidth: value }),
  borderLeftColor: (value: unknown) => ({ borderLeftColor: value }),
  borderRightWidth: (value: unknown) => ({ borderRightWidth: value }),
  borderRightColor: (value: unknown) => ({ borderRightColor: value }),
};

export function convertStyleToRN(style?: ComponentStyle): ViewStyle {
  if (!style) return {};

  const rnStyle: ViewStyle = {};

  Object.entries(style).forEach(([key, value]) => {
    const mapping = styleMappings[key];
    if (mapping) {
      Object.assign(rnStyle, mapping(value));
    }
  });

  return rnStyle;
}

export const BaseComponent: React.FC<BaseComponentProps> = ({
  style,
  children,
  ...props
}) => {
  const rnStyle = convertStyleToRN(style);

  return (
    <View style={rnStyle} {...props}>
      {children}
    </View>
  );
};
