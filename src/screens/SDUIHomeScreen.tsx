/**
 * SDUIHomeScreen – Home screen rendered by the SDUI engine.
 *
 * This is a thin wrapper around `SDUIBFFScreen` configured for the home
 * endpoint. Adding future SDUI screens is equally simple — just point
 * `SDUIBFFScreen` at a different endpoint.
 *
 * Enabled via the EXPO_PUBLIC_SDUI_ENABLED environment variable.
 * The existing NewHomeScreen is left untouched so both approaches coexist
 * during the evaluation period.
 */

import React from 'react';
import { useFilters } from '@/contexts/FiltersContext';
import { SDUIBFFScreen } from '@/sdui/SDUIBFFScreen';
import { FollowingDeputiesSession } from './NewHomeScreen/components/FollowingDeputiesSession';

export function SDUIHomeScreen() {
  const { year } = useFilters();
  const params = year ? { ano: year } : undefined;

  return (
    <SDUIBFFScreen
      endpoint="/api/v1/sdui/home"
      queryKey={['sduiHomeScreen']}
      params={params}
      footer={
        // The BFF returns a section header for followed deputies but not the list.
        // We embed the existing session here until the BFF exposes a
        // FOLLOWED_POLITICIANS_LIST component type.
        // TODO: replace with a fully declarative SDUI component once the BFF supports it.
        <FollowingDeputiesSession />
      }
    />
  );
}

