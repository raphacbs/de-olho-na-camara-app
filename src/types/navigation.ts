import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Deputados: undefined;
  Propostas: undefined;
  Votações: undefined;
  Configurações: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  // Adicionar outras telas conforme necessário
};

// Extensão dos tipos do React Navigation
declare module '@react-navigation/native' {
  export function useNavigation(): unknown;
  export function useRoute(): unknown;
}
