/**
 * SDUIDeputadosScreen – Politicians list screen rendered by the SDUI engine.
 *
 * Thin wrapper around `SDUIBFFScreen` pointing at the politicians SDUI
 * endpoint. The BFF controls component placement, filters, and data.
 *
 * Enabled when EXPO_PUBLIC_SDUI_ENABLED=true (see RootTabs.tsx).
 */

import React from 'react';
import { SDUIBFFScreen } from '@/sdui/SDUIBFFScreen';

export function SDUIDeputadosScreen() {
  return (
    <SDUIBFFScreen
      endpoint="/api/v1/sdui/politicians"
      queryKey={['sduiPoliticians']}
    />
  );
}
