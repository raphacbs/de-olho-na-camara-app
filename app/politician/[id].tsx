import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PoliticianDetailsScreen } from '@/screens/PoliticianDetailsScreen';

export default function PoliticianPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;

  // The original screen reads route.params.id — provide the same shape by passing a route prop
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <PoliticianDetailsScreen route={{ params: { id: numericId } }} />;
}

export const options = { title: 'Detalhes do Deputado', headerShown: true };
