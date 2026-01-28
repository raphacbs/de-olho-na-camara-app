// Minimal navigation shim to provide a subset of react-navigation hooks using expo-router.
// This keeps most existing screens working with minimal changes.

// @ts-ignore
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

// Generic RouteProp mimicking @react-navigation/native's type shape for our simple use.
export type RouteProp<T extends Record<string, any> = any, K extends keyof T = keyof T> = {
  params: K extends keyof T ? T[K] : any;
};

export type NavigationProp = any;

export function useNavigation<T = any>() {
  const router = useRouter();

  const navigate = useCallback((name: string, params?: any) => {
    if (name === 'PoliticianDetails' && params?.id) {
      router.push(`/politician/${params.id}`);
      return;
    }
    if (name === 'PoliticianPropositions' && params?.politicianId) {
      router.push(`/politician/${params.politicianId}/propositions`);
      return;
    }
    if (name === 'PoliticianExpenses' && params?.politicianId) {
      router.push(`/politician/${params.politicianId}/expenses`);
      return;
    }
    if (name === 'PoliticianVotes' && params?.politicianId) {
      router.push(`/politician/${params.politicianId}/votes`);
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
    if (name === 'ProposalDetail' && params?.proposal) {
      const serialized = encodeURIComponent(JSON.stringify(params.proposal));
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
  }, [router]);

  const replace = useCallback((path: string) => {
    router.replace(path);
  }, [router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // Provide a simple getState that mimics react-navigation shape for minimal uses
  const getState = useCallback(() => {
    return { routes: [{ name: '(tabs)/home' }], index: 0 };
  }, []);

  // Return a navigation-like object; cast to generic T so callers can keep their typing
  return ({ navigate, replace, goBack, getState } as unknown) as T & {
    navigate: (name: string, params?: any) => void;
    replace: (path: string) => void;
    goBack: () => void;
    getState: () => any;
  };
}

export function useRoute<T = Record<string, any>>() {
  // @ts-ignore
  const params = useLocalSearchParams<T>();
  return { params } as { params: T };
}

export default {} as any;
