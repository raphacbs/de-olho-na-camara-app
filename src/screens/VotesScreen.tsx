
import React from 'react';
import { SDUIScreen } from '@/types/sdui';
import { ScreenRenderer } from '@/sdui/ScreenRenderer';

const mockScreen: SDUIScreen = {
  id: 'votes',
  title: 'Votações',
  components: [
    {
      id: 'title',
      type: 'TextBlock',
      text: 'Votações recentes',
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
      text: 'Nenhuma votação recente encontrada.',
      variant: 'body',
      style: { textAlign: 'center', opacity: 0.7 },
    },
  ],
};

export function VotesScreen() {
  return <ScreenRenderer screen={mockScreen} />;
}
