import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PoliticianPropositionsScreen } from '@/screens/PoliticianPropositionsScreen';

export default function PoliticianPropositionsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
  // @ts-ignore
  return <PoliticianPropositionsScreen route={{ params: { politicianId: numericId } }} />;
}

export const options = { title: 'Propostas do Deputado', headerShown: true };
