// Arquivo mantido para evitar quebras em imports existentes que ainda não foram migrados
// TODO: Remover este arquivo após migração completa

// Tipos SDUI mais precisos para facilitar migração incremental
import React from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// ─── BFF SDUI types ───────────────────────────────────────────────────────────

/** Action emitted by the BFF (e.g. navigate to a route). */
export interface BFFComponentAction {
  type: string;  // e.g. "NAVIGATE"
  route: string; // e.g. "/politicians"
}

/** Properties for the YEAR_SELECTOR_BANNER component. */
export interface YearSelectorBannerProperties {
  title: string;
  subtitle: string;
  selectedYear: number;
  buttonBackgroundColor: string;
}

/** Properties for the GREETING_HEADER component. */
export interface GreetingHeaderProperties {
  greeting: string;
  subtitle: string;
}

/** A single stat card in the stats grid. */
export interface BFFStatCardItem {
  id: string;
  icon: string;
  value: string;
  label: string;
  backgroundColor: string;
  action?: BFFComponentAction;
}

/** Properties for the STATS_GRID component. */
export interface StatsGridProperties {
  columns: number;
  items: BFFStatCardItem[];
}

/** A single item in the quick-access grid. */
export interface BFFQuickAccessItem {
  id: string;
  icon: string;
  label: string;
  action?: BFFComponentAction;
}

/** Properties for the QUICK_ACCESS_GRID component. */
export interface QuickAccessGridProperties {
  title: string;
  columns: number;
  items: BFFQuickAccessItem[];
}

/** Properties for the SECTION_HEADER_WITH_BADGE component. */
export interface SectionHeaderWithBadgeProperties {
  title: string;
  badgeCount: number;
  badgeBackgroundColor: string;
  action?: BFFComponentAction;
}

/** Union of all BFF-defined component property shapes. */
export type BFFComponentProperties =
  | YearSelectorBannerProperties
  | GreetingHeaderProperties
  | StatsGridProperties
  | QuickAccessGridProperties
  | SectionHeaderWithBadgeProperties;

/** A single component as returned by the BFF SDUI endpoint. */
export interface BFFScreenComponent {
  id: string;
  type:
    | 'YEAR_SELECTOR_BANNER'
    | 'GREETING_HEADER'
    | 'STATS_GRID'
    | 'QUICK_ACCESS_GRID'
    | 'SECTION_HEADER_WITH_BADGE';
  properties: BFFComponentProperties;
}

/** Top-level response from GET /api/v1/sdui/home. */
export interface HomeScreenBFFResponse {
  screenId: string;
  version: string;
  components: BFFScreenComponent[];
}

// ─── End BFF SDUI types ───────────────────────────────────────────────────────

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
