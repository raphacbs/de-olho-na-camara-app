import React from 'react';
import { Users, Star, FileText, DollarSign } from 'lucide-react-native';
import { MetricConfig } from './types';

export const metricConfig: MetricConfig[] = [
  {
    key: 'activeDeputies',
    label: 'Deputados Ativos',
    icon: <Users size={22} color="#FFF" />,
    backgroundColor: '#2F6FED',
  },
  {
    key: 'following',
    label: 'Seguindo',
    icon: <Star size={22} color="#FFF" />,
    backgroundColor: '#F59E0B',
  },
  {
    key: 'proposals',
    label: 'Proposições',
    icon: <FileText size={22} color="#FFF" />,
    backgroundColor: '#10B981',
  },
  {
    key: 'expenses',
    label: 'Despesas do Mês',
    icon: <DollarSign size={22} color="#FFF" />,
    backgroundColor: '#EF4444',
  },
];
