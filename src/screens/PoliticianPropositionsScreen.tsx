import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@/navigation/routerShim';
import { dataService } from '@/services/dataService';
import { PropositionDto } from '@/types/api';
import { format, parseISO } from 'date-fns';
import FiscalizaLoading from "@/components/FiscalizaLoading";

type PoliticianPropositionsRouteParams = { politicianId: number };

export function PoliticianPropositionsScreen() {
  const route = useRoute<PoliticianPropositionsRouteParams>();
  const { politicianId } = route.params;

  const [propositions, setPropositions] = useState<PropositionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPropositions = useCallback(async (isInitialLoad = false) => {
    if (loading || loadingMore) return <FiscalizaLoading message="Carregando..." />;
    if (!isInitialLoad && page >= totalPages) return;

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const nextPage = isInitialLoad ? 0 : page;

    try {
      const response = await dataService.getPoliticianPropositions(politicianId, { page: nextPage, size: 10 });
      setPropositions(prev => isInitialLoad ? response.data : [...prev, ...response.data]);
      setTotalPages(response.totalPages);
      setPage(nextPage + 1);
    } catch (error) {
      console.error('Error loading propositions:', error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [loading, loadingMore, page, totalPages, politicianId]);

  useEffect(() => {
    loadPropositions(true);
  }, [politicianId]);

  const renderItem = ({ item }: { item: PropositionDto }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.type} {item.number}/{item.year}</Text>
      <Text style={styles.cardSummary}>{item.summary}</Text>
      <Text style={styles.cardDate}>{format(parseISO(item.presentationDate), 'dd/MM/yyyy')}</Text>
    </View>
  );

  if (loading && page === 0) {
    return <FiscalizaLoading message="Carregando..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={propositions}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={() => loadPropositions()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <FiscalizaLoading message="Carregando..." /> : null}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>Nenhuma proposta encontrada.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  cardSummary: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  loader: {
    marginVertical: 20,
  },
});
