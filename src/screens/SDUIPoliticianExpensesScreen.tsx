/**
 * SDUIPoliticianExpensesScreen – Politician expenses screen rendered by the SDUI engine.
 *
 * Reads the politicianId from the navigation route params and fetches the
 * SDUI screen definition from the BFF.  The BFF returns an EXPENSE_CARD_LIST
 * component with supplier, formatted amount, date, and document URL.
 *
 * Enabled when EXPO_PUBLIC_SDUI_ENABLED=true (see AppNavigator.tsx).
 */

import React from 'react';
import { useRoute } from '@/navigation/routerShim';
import { SDUIBFFScreen } from '@/sdui/SDUIBFFScreen';

type PoliticianExpensesRouteParams = { politicianId: number };

export function SDUIPoliticianExpensesScreen() {
  const route = useRoute<PoliticianExpensesRouteParams>();
  const { politicianId } = route.params;

  return (
    <SDUIBFFScreen
      endpoint={`/api/v1/sdui/politicians/${politicianId}/expenses`}
      queryKey={['sduiPoliticianExpenses', String(politicianId)]}
    />
  );
}
