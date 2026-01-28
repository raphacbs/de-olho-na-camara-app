import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProposalDetailScreen } from '@/screens/ProposalDetailScreen';

export default function ProposalDetailPage() {
  const { proposal } = useLocalSearchParams<{ proposal?: string }>();
  let parsed: any = undefined;
  try {
    if (proposal) parsed = JSON.parse(decodeURIComponent(proposal));
  } catch (e) {
    // If parsing fails, parsed stays undefined and the screen can fetch by id instead
    parsed = undefined;
  }
  // @ts-ignore
  return <ProposalDetailScreen route={{ params: { proposal: parsed } }} />;
}

export const options = { title: 'Detalhes da Proposta', headerShown: true };
