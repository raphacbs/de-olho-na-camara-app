import { NavigatorScreenParams, NavigationProp as RNNavigationProp } from '@react-navigation/native';
import { PropositionDto } from './api';

export type RootTabParamList = {
  Home: undefined;
  Deputados: { deputyId?: string; [key: string]: unknown } | undefined;
  Proposições: { propositionId?: string; [key: string]: unknown } | undefined;
  Votações: undefined;
  Configurações: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  PoliticianDetails: { id: number };
  PoliticianPropositions: { politicianId: number };
  PoliticianExpenses: { politicianId: number };
  PoliticianVotes: { politicianId: number };
  DeputadosSeguidos: undefined;
  PoliticianList: undefined;
  ProposalDetail: { proposal: PropositionDto };
};

// Tipos para navegação
export type NavigationProp = RNNavigationProp<RootStackParamList>;
