import React from 'react';
// @ts-ignore: avoid module resolution error in this environment
const { useLocalSearchParams } = require('expo-router');
import { PoliticianExpensesScreen } from '@/screens/PoliticianExpensesScreen';

export default function PoliticianExpensesPage() {
  const { id } = useLocalSearchParams();
  const numericId = id ? Number(id) : undefined;
  // @ts-ignore
  return <PoliticianExpensesScreen route={{ params: { politicianId: numericId } }} />;
}

export const options = { title: 'Despesas do Deputado', headerShown: true };
