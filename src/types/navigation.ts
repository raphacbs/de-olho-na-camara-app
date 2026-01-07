import { NavigatorScreenParams, NavigationProp as RNNavigationProp } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Deputados: { deputyId?: string; [key: string]: unknown } | undefined;
  Proposições: { propositionId?: string; [key: string]: unknown } | undefined;
  Votações: undefined;
  Configurações: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  // Adicionar outras telas conforme necessário
};

// Tipos para navegação
export type NavigationProp = RNNavigationProp<RootTabParamList>;
