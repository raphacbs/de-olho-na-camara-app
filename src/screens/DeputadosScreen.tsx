import React from 'react';
import { SDUIScreen } from '@/types/sdui';
import { ScreenRenderer } from '@/sdui/ScreenRenderer';

const mockScreen: SDUIScreen = {
  id: 'deputados',
  title: 'Deputados(as)',
  components: [
    {
      id: 'title',
      type: 'TextBlock',
      text: 'Deputados(as)',
      variant: 'title',
    },
    {
      id: 'spacer',
      type: 'Spacer',
      size: 'medium',
    },
    {
      id: 'description',
      type: 'TextBlock',
      text: 'Lista de deputados federais e informações sobre seus mandatos.',
      variant: 'body',
      style: { opacity: 0.7 },
    },
  ],
};

export function DeputadosScreen() {
  return <ScreenRenderer screen={mockScreen} />;
}
