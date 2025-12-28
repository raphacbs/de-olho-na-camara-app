// Tipos base para Server-Driven UI

export interface BaseComponent {
  id: string;
  type: string;
  style?: ComponentStyle;
  children?: SDUIComponent[];
  sticky?: boolean; // Para componentes que devem ficar fixos durante o scroll
}

export interface ComponentStyle {
  margin?: number | string;
  padding?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  flex?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  // Propriedades modernas
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Para Android
  // Gradientes
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  // Bordas
  borderTopWidth?: number;
  borderTopColor?: string;
  borderBottomWidth?: number;
  borderBottomColor?: string;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderLeftWidth?: number;
  borderLeftColor?: string;
  borderRightWidth?: number;
  borderRightColor?: string;
}

// Componentes específicos
export interface TextBlockComponent extends BaseComponent {
  type: 'TextBlock';
  text: string;
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'headline' | 'display';
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ButtonComponent extends BaseComponent {
  type: 'Button';
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: string; // Action identifier
}

export interface ImageComponent extends BaseComponent {
  type: 'Image';
  source: string; // URL or local asset path
  alt?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  width?: number;
  height?: number;
}

export interface ContainerComponent extends BaseComponent {
  type: 'Container';
  direction?: 'row' | 'column';
  spacing?: number;
  wrap?: boolean;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  padding?: number | string;
  margin?: number | string;
  backgroundColor?: string;
  borderRadius?: number;
}

export interface CardComponent extends BaseComponent {
  type: 'Card';
  title?: string;
  subtitle?: string;
  elevation?: number;
  shadow?: boolean;
  borderRadius?: number;
  padding?: number | string;
  margin?: number | string;
  backgroundColor?: string;
  gradientColors?: string[];
  onPress?: string; // Action identifier for pressable cards
}

export interface ListComponent extends BaseComponent {
  type: 'List';
  items: SDUIComponent[];
  separator?: boolean;
  scrollable?: boolean;
  numColumns?: number;
}

export interface InputComponent extends BaseComponent {
  type: 'Input';
  placeholder?: string;
  value?: string;
  inputType?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  required?: boolean;
  validation?: InputValidation;
}

export interface InputValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: string; // Validation function name
}

export interface SpacerComponent extends BaseComponent {
  type: 'Spacer';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

// Union type para todos os componentes
export type SDUIComponent =
  | TextBlockComponent
  | ButtonComponent
  | ImageComponent
  | ContainerComponent
  | CardComponent
  | ListComponent
  | InputComponent
  | SpacerComponent;

// Screen configuration
export interface SDUIScreen {
  id: string;
  title?: string;
  components: SDUIComponent[];
  navigation?: ScreenNavigation;
  refresh?: boolean;
  loading?: boolean;
}

export interface ScreenNavigation {
  header?: {
    title?: string;
    showBack?: boolean;
    actions?: NavigationAction[];
  };
  tabs?: {
    active: string;
    items: TabItem[];
  };
}

export interface NavigationAction {
  id: string;
  type: 'button' | 'icon';
  title?: string;
  icon?: string;
  action: string;
}

export interface TabItem {
  id: string;
  title: string;
  icon?: string;
  badge?: number;
}

// Actions and Events
export interface SDUIAction {
  type: 'navigate' | 'api' | 'modal' | 'refresh' | 'custom';
  payload?: Record<string, unknown>;
  target?: string;
  params?: Record<string, unknown>;
}

// Response from server
export interface SDUIResponse {
  screen: SDUIScreen;
  actions?: SDUIAction[];
  metadata?: {
    version: string;
    cache?: boolean;
    ttl?: number;
  };
}

// Error handling
export interface SDUIError {
  code: string;
  message: string;
  component?: string; // ID of component that caused the error
  retry?: boolean;
}
