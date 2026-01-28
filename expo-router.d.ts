declare module 'expo-router' {
  import * as React from 'react';
  import { ComponentType } from 'react';
  export const Slot: ComponentType<any>;
  export const Tabs: any;
  export const Stack: any;
  export function useLocalSearchParams<T = Record<string, any>>(): T;
  export function useRouter(): {
    push: (path: string) => void;
    replace: (path: string) => void;
    back: () => void;
  };
  export default {} as any;
}

declare module 'expo-router/entry' {
  const entry: any;
  export = entry;
}
