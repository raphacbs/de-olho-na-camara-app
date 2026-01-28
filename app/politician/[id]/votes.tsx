import React from 'react';
// @ts-ignore: avoid module resolution error in this environment
const { useLocalSearchParams } = require('expo-router');
import { PoliticianVotesScreen } from '@/screens/PoliticianVotesScreen';

export default function PoliticianVotesPage() {
  const { id } = useLocalSearchParams();
  const numericId = id ? Number(id) : undefined;
  // @ts-ignore
  return <PoliticianVotesScreen route={{ params: { politicianId: numericId } }} />;
}

export const options = { title: 'Votos do Deputado', headerShown: true };
