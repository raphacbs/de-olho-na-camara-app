// Arquivo mantido para evitar quebras em imports existentes que ainda não foram migrados
// TODO: Remover este arquivo após migração completa

// Tipos SDUI mais precisos para facilitar migração incremental
import React from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Estilo genérico de componente (pode ser View/Text/Image)
export type ComponentStyle = StyleProp<ViewStyle | TextStyle | ImageStyle>;

export interface SDUIScreen {
  id: string;
  title?: string;
  components?: any[]; // definição concreta depende do registry; manter any para composibilidade
  loading?: boolean;
  navigation?: any;
  params?: Record<string, any>;
}

export type SDUIComponent = any;

export interface BaseComponentProps {
  id?: string;
  type?: string;
  style?: ComponentStyle;
  children?: React.ReactNode;
  [key: string]: any;
}

export interface AvatarComponent {
  source?: ImageSourcePropType | string;
  size?: number;
  placeholder?: string;
  style?: ComponentStyle;
  id?: string | number;
  [key: string]: any;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonComponent {
  title?: string;
  // onPress pode ser um id de ação SDUI (string) ou um callback local
  onPress?: string | ((...args: any[]) => any);
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  actionParams?: Record<string, any>;
  style?: ComponentStyle;
  [key: string]: any;
}

export interface CardComponent {
  children?: React.ReactNode;
  style?: ComponentStyle;
  [key: string]: any;
}

export interface ContainerComponent {
  children?: React.ReactNode;
  style?: ComponentStyle;
  [key: string]: any;
}

export interface ImageComponent {
  source?: ImageSourcePropType | string;
  style?: ComponentStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  [key: string]: any;
}

export interface InputComponent {
  placeholder?: string;
  value?: string;
  inputType?: 'text' | 'number' | 'email' | 'password';
  disabled?: boolean;
  required?: boolean;
  validation?: any;
  style?: ComponentStyle;
  onChange?: (value: string) => void;
  [key: string]: any;
}

export interface SpacerComponent {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number;
  style?: ComponentStyle;
}

export interface TextBlockComponent {
  text?: string;
  style?: ComponentStyle;
  [key: string]: any;
}

export interface SDUIError {
  message?: string;
  // pode ser numérico ou string dependendo da origem
  code?: number | string;
  [key: string]: any;
}

export interface SDUIAction {
  type?: string;
  payload?: any;
  [key: string]: any;
}

export interface SDUIResponse {
  screens?: any[];
  actions?: SDUIAction[];
  [key: string]: any;
}

export type AvatarProps = AvatarComponent;
export type ButtonProps = ButtonComponent;
export type BaseProps = BaseComponentProps;
export type InputProps = InputComponent;

export default {} as any;
