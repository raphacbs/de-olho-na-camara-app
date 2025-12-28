
import React from 'react';
import { SDUIScreen } from '@/types/sdui';
import { ScreenRenderer } from '@/sdui/ScreenRenderer';

const mockScreen: SDUIScreen = {
  id: 'proposals',
  title: 'Propostas',
  components: [
    {
      id: 'title',
      type: 'TextBlock',
      text: 'Lista de propostas',
      variant: 'title',
    },
    {
      id: 'spacer',
      type: 'Spacer',
      size: 'medium',
    },
    {
      id: 'empty-state',
      type: 'TextBlock',
      text: 'Nenhuma proposta encontrada.',
      variant: 'body',
      style: { textAlign: 'center', opacity: 0.7 },
    },
  ],
};

export function ProposalsScreen() {
  return <ScreenRenderer screen={mockScreen} />;
}
