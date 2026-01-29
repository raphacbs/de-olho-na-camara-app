// Minimal navigation shim to provide a subset of react-navigation hooks using expo-router.
// This keeps most existing screens working with minimal changes.

import { useCallback } from 'react';

// Try to import expo-router hooks; they may exist in some runtime modes
let _useExpoRouter: any = null;
let _useExpoLocalSearchParams: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const expoRouter = require('expo-router');
  _useExpoRouter = expoRouter.useRouter;
  _useExpoLocalSearchParams = expoRouter.useLocalSearchParams;
} catch (e) {
  // expo-router not available or not initialized — we'll fallback to react-navigation below
}

import { useNavigation as useRNNavigation, useRoute as useRNRoute } from '@react-navigation/native';

// Generic RouteProp mimicking @react-navigation/native's type shape for our simple use.
export type RouteProp<T extends Record<string, any> = any, K extends keyof T = keyof T> = {
  params: K extends keyof T ? T[K] : any;
};

export type NavigationProp = any;

export function useNavigation<T = any>() {
  // Prefer expo-router if available and initialized; otherwise fallback to react-navigation
  const router = _useExpoRouter ? _useExpoRouter() : null;
  const rnNav = useRNNavigation<any>();

  const navigate = useCallback((name: string, params?: any) => {
    // Prefer React Navigation when available, fallback to expo-router
    if (rnNav && typeof rnNav.navigate === 'function') {
      try {
        // Verbose debug: log backend choice, params and short stack to trace caller
        const stack = new Error().stack?.split('\n').slice(2, 6).map(s => s.trim());
        // eslint-disable-next-line no-console
        console.debug('[routerShim] navigate via react-navigation', { name, params, stack });
        rnNav.navigate(name as any, params);
        return;
      } catch (e) {
        // If RN navigate fails, try expo-router below
        // eslint-disable-next-line no-console
        console.warn('[routerShim] react-navigation navigate failed, trying expo-router', e, { name, params });
      }
    }

    // Try expo-router as fallback
    if (router && typeof router.push === 'function') {
      try {
        // Verbose debug: build and log final path that will be pushed and short stack
        const stack = new Error().stack?.split('\n').slice(2, 6).map(s => s.trim());
        // eslint-disable-next-line no-console
        console.debug('[routerShim] navigate via expo-router (attempt)', { name, params, stack });
        if (name === 'PoliticianDetails' && params?.id) {
          const path = `/politician/${params.id}`;
          // eslint-disable-next-line no-console
          console.debug('[routerShim] expo-router push path', path);
          router.push(path);
          return;
        }
        if (name === 'PoliticianPropositions' && params?.politicianId) {
          const path = `/politician/${params.politicianId}/propositions`;
          // eslint-disable-next-line no-console
          console.debug('[routerShim] expo-router push path', path);
          router.push(path);
          return;
        }
        if (name === 'PoliticianExpenses' && params?.politicianId) {
          const path = `/politician/${params.politicianId}/expenses`;
          // eslint-disable-next-line no-console
          console.debug('[routerShim] expo-router push path', path);
          router.push(path);
          return;
        }
        if (name === 'PoliticianVotes' && params?.politicianId) {
          const path = `/politician/${params.politicianId}/votes`;
          // eslint-disable-next-line no-console
          console.debug('[routerShim] expo-router push path', path);
          router.push(path);
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
        const path = `/${name}`.toLowerCase();
        // eslint-disable-next-line no-console
        console.debug('[routerShim] expo-router fallback path', path);
        router.push(path);
        return;
      } catch (e) {
        // expo-router may not be fully initialized (isReady) — nothing else to try
        // eslint-disable-next-line no-console
        console.warn('[routerShim] expo-router navigation failed', e, { name, params });
      }
    }

    // eslint-disable-next-line no-console
    console.warn('[routerShim] navigate fallback failed for', name, params);
  }, [router, rnNav]);

  const replace = useCallback((path: string) => {
    if (router && typeof router.replace === 'function') {
      try {
        router.replace(path);
        return;
      } catch (e) {
        console.warn('expo-router replace failed, falling back', e);
      }
    }
    if (rnNav && typeof rnNav.replace === 'function') {
      // react-navigation's replace expects a route name; cast to any
      rnNav.replace(path as any);
      return;
    }
  }, [router, rnNav]);

  const goBack = useCallback(() => {
    if (router && typeof router.back === 'function') {
      try {
        router.back();
        return;
      } catch (e) {
        console.warn('expo-router back failed, falling back', e);
      }
    }
    if (rnNav && typeof rnNav.goBack === 'function') {
      rnNav.goBack();
    }
  }, [router, rnNav]);

  const getState = useCallback(() => {
    if (rnNav && typeof rnNav.getState === 'function') {
      try {
        return rnNav.getState();
      } catch (e) {
        // ignore
      }
    }
    return { routes: [{ name: '(tabs)/home' }], index: 0 };
  }, [rnNav]);

  return ({ navigate, replace, goBack, getState } as unknown) as T & {
    navigate: (name: string, params?: any) => void;
    replace: (path: string) => void;
    goBack: () => void;
    getState: () => any;
  };
}

export function useRoute<T = Record<string, any>>() {
  // Prefer react-navigation route params when present (this covers RN navigation flows).
  // If none are present, try expo-router's local search params as a fallback.
  const rnRoute = useRNRoute();
  if (rnRoute && rnRoute.params && Object.keys(rnRoute.params).length > 0) {
    return { params: rnRoute.params as T };
  }

  if (_useExpoLocalSearchParams) {
    try {
      // @ts-ignore
      const params = _useExpoLocalSearchParams<T>();
      return { params } as { params: T };
    } catch (e) {
      // continue to final fallback
    }
  }

  return { params: (rnRoute?.params ?? {}) as T };
}

export default {} as any;

