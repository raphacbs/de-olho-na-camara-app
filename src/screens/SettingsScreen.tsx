
import React from 'react';
import { SDUIScreen } from '@/types/sdui';
import { ScreenRenderer } from '@/sdui/ScreenRenderer';

const mockScreen: SDUIScreen = {
  id: 'settings',
  title: 'Configurações',
  components: [
    {
      id: 'title',
      type: 'TextBlock',
      text: 'Configurações',
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
      text: 'Personalize sua experiência no app.',
      variant: 'body',
      style: { opacity: 0.7 },
    },
  ],
};

export function SettingsScreen() {
  return <ScreenRenderer screen={mockScreen} />;
}
