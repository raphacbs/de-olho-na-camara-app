// Minimal navigation shim to provide a subset of react-navigation hooks using expo-router.
// This keeps most existing screens working with minimal changes.

import { useCallback } from 'react';
import {
  NavigationProp as RNNavigationProp,
  useNavigation as useReactNavigation,
  useRoute as useReactRoute,
} from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RootStackParamList } from '@/types/navigation';

// Generic RouteProp mimicking @react-navigation/native's type shape for our simple use.
export type RouteProp<
  T extends Record<string, unknown> = Record<string, unknown>,
  K extends keyof T = keyof T
> = {
  params: K extends keyof T ? T[K] : Record<string, unknown>;
};

export type NavigationProp = RNNavigationProp<RootStackParamList>;

const USE_EXPO_ROUTER = process.env.USE_EXPO_ROUTER === 'true';
type NavigationParams = Record<string, unknown> | undefined;

const extractNumberParam = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const extractObjectParam = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : undefined;

function useExpoRouterNavigation<T>() {
  const router = useRouter();

  const navigate = useCallback(
    (name: string, params?: NavigationParams) => {
      const id = extractNumberParam(params?.id);
      const politicianId = extractNumberParam(params?.politicianId);

      if (name === 'PoliticianDetails' && id !== undefined) {
        router.push(`/politician/${id}`);
        return;
      }
      if (name === 'PoliticianPropositions' && politicianId !== undefined) {
        router.push(`/politician/${politicianId}/propositions`);
        return;
      }
      if (name === 'PoliticianExpenses' && politicianId !== undefined) {
        router.push(`/politician/${politicianId}/expenses`);
        return;
      }
      if (name === 'PoliticianVotes' && politicianId !== undefined) {
        router.push(`/politician/${politicianId}/votes`);
        return;
      }
      if (name === 'DeputadosSeguidos' || name === 'DeputadosSeguidosScreen') {
        router.push('/deputados-seguidos');
        return;
      }
      if (name === 'PoliticianList' || name === 'PoliticianListScreen') {
        router.push('/politician-list');
        return;
      }
      const proposal = extractObjectParam(params?.proposal);
      if (name === 'ProposalDetail' && proposal) {
        const serialized = encodeURIComponent(JSON.stringify(proposal));
        router.push(`/proposal?proposal=${serialized}`);
        return;
      }

      // If caller passed a path-like name starting with '/', push directly
      if (typeof name === 'string' && name.startsWith('/')) {
        router.push(name);
        return;
      }

      // Fallback: try to push by converting name to a path-friendly string
      try {
        const path = `/${name}`.toLowerCase();
        router.push(path);
      } catch (e) {
        console.warn('navigate fallback failed for', name, params, e);
      }
    },
    [router],
  );

  const replace = useCallback(
    (path: string) => {
      router.replace(path);
    },
    [router],
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // Provide a simple getState that mimics react-navigation shape for minimal uses
  const getState = useCallback(() => {
    return { routes: [{ name: '(tabs)/home' }], index: 0 };
  }, []);

  return ({ navigate, replace, goBack, getState } as unknown) as T & {
    navigate: (name: string, params?: NavigationParams) => void;
    replace: (path: string) => void;
    goBack: () => void;
    getState: () => unknown;
  };
}

function useReactNavigationShim<T>() {
  const navigation = useReactNavigation<RNNavigationProp<RootStackParamList>>();

  const navigate = useCallback(
    (name: string, params?: NavigationParams) => {
      switch (name) {
        case 'PoliticianDetails':
        case 'PoliticianPropositions':
        case 'PoliticianExpenses':
        case 'PoliticianVotes':
        case 'ProposalDetail':
        case 'PoliticianList':
        case 'MainTabs':
        case 'DeputadosSeguidos':
          navigation.navigate(name as never, params);
          return;
        case 'PoliticianListScreen':
          navigation.navigate('PoliticianList');
          return;
        case 'DeputadosSeguidosScreen':
          navigation.navigate('DeputadosSeguidos');
          return;
        case 'ProposalsScreen':
          navigation.navigate('MainTabs', { screen: 'Proposições' });
          return;
        case 'VotesScreen':
          navigation.navigate('MainTabs', { screen: 'Votações' });
          return;
        case 'SettingsScreen':
          navigation.navigate('MainTabs', { screen: 'Configurações' });
          return;
        default:
          navigation.navigate(name as never, params as never);
      }
    },
    [navigation],
  );

  const replace = useCallback(
    (path: string, params?: NavigationParams) => {
      if ('replace' in navigation && typeof navigation.replace === 'function') {
        navigation.replace(path as never, params as never);
        return;
      }
      navigation.navigate(path as never, params as never);
    },
    [navigation],
  );

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getState = useCallback(() => navigation.getState(), [navigation]);

  return ({ ...navigation, navigate, replace, goBack, getState } as unknown) as T & {
    navigate: (name: string, params?: NavigationParams) => void;
    replace: (path: string, params?: NavigationParams) => void;
    goBack: () => void;
    getState: () => unknown;
  };
}

export function useNavigation<T = NavigationProp>() {
  return USE_EXPO_ROUTER ? useExpoRouterNavigation<T>() : useReactNavigationShim<T>();
}

export function useRoute<T = Record<string, unknown>>() {
  if (USE_EXPO_ROUTER) {
    const params = useLocalSearchParams<T>();
    return { params } as { params: T };
  }

  const route = useReactRoute();
  return route as unknown as { params: T };
}
