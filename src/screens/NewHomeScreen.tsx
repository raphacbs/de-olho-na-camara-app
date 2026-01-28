// Home Screen – Fiscaliza Aí (VERSÃO FINAL)
// Cards dinâmicos com config + API + Skeleton + Acessibilidade

import React, { useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  AccessibilityInfo,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dataService } from '@/services/dataService';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useFilters } from '@/contexts/FiltersContext';
import YearFilter from '@/components/YearFilter';

import { styles } from './NewHomeScreen/styles';
import { StatsSession } from './NewHomeScreen/components/StatsSession';
import { FollowingDeputiesSession } from './NewHomeScreen/components/FollowingDeputiesSession';
import { QuickAccessSession } from './NewHomeScreen/components/QuickAccessSession';
import { RecentActivitySession } from './NewHomeScreen/components/RecentActivitySession';

/* =====================
   TELA
===================== */

export function NewHomeScreen() {
  const { user } = useAuth();
  const { year } = useFilters();
  const [fontScale, setFontScale] = useState(1);

  const {
    data: metrics,
    isLoading,
    isRefetching,
    refetch
  } = useQuery({
    queryKey: ['homeMetrics', year],
    queryFn: () => dataService.getHomeMetrics(year ?? undefined),
  });

  useEffect(() => {
    void AccessibilityInfo.isBoldTextEnabled().then((isBold) => {
      if (isBold) setFontScale(1.1);
    });
  }, []);

  const onRefresh = () => {
    void refetch();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
      >
          {/*Top Filter*/}
          <YearFilter />

          {/*Stats Session*/}
          <Text style={styles.greeting}>Olá, {user?.email?.split('@')[0] || 'Visitante'} 👋</Text>
          <Text style={styles.subtitle}>Acompanhe a atividade dos deputados federais</Text>

          <StatsSession 
            metrics={metrics} 
            isLoading={isLoading && !isRefetching} 
            fontScale={fontScale} 
          />

          {/*Quick Access Session*/}
          <QuickAccessSession />

          {/*Following Session*/}
          <FollowingDeputiesSession />

          {/*Recent Activity Session*/}
          <RecentActivitySession />
      </ScrollView>
    </SafeAreaView>
  );
}
