/**
 * SDUIProposalDetailScreen – Proposition detail screen rendered by the SDUI engine.
 *
 * Reads the proposition id from the navigation route params and fetches the
 * SDUI screen definition from the BFF.  The BFF returns a declarative set of
 * components (PROPOSITION_DETAIL_HEADER, DETAIL_SECTION, TEXT_LINK_SECTION,
 * AUTHOR_CARD_LIST) which the client renders without any extra logic.
 *
 * Enabled when EXPO_PUBLIC_SDUI_ENABLED=true (see AppNavigator.tsx).
 */

import React from 'react';
import { useRoute } from '@/navigation/routerShim';
import { PropositionDto } from '@/types/api';
import { SDUIBFFScreen } from '@/sdui/SDUIBFFScreen';

type ProposalDetailRouteParams = { proposal: PropositionDto };

export function SDUIProposalDetailScreen() {
  const route = useRoute<ProposalDetailRouteParams>();
  const { proposal } = route.params;

  return (
    <SDUIBFFScreen
      endpoint={`/api/v1/sdui/propositions/${proposal.id}`}
      queryKey={['sduiPropositionDetail', String(proposal.id)]}
    />
  );
}
