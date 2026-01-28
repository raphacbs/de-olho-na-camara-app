import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dataService } from '@/services/dataService';
import { VotingWithVotesDTO } from '@/types/api';
import FiscalizaLoading from "@/components/FiscalizaLoading";

export function VotesScreen() {
  const [votings, setVotings] = useState<VotingWithVotesDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotings = async (pageNumber: number, shouldRefresh = false) => {
    if (!hasMore && !shouldRefresh) return;

    try {
      setError(null);
      const response = await dataService.getVotingsWithVotes({ page: pageNumber, size: 20 });

      console.log(`✅ Resposta recebida:`, {
        dataLength: response.data.length,
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
      });

      if (shouldRefresh) {
        setVotings(response.data);
      } else {
        setVotings(prev => [...prev, ...response.data]);
      }

      setHasMore(response.page < response.totalPages - 1);
      setPage(pageNumber);
    } catch (error) {
      console.error('❌ Erro ao buscar votações:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVotings(0, true);
  }, []);

  const onRefresh = () => {
    console.log('🔄 Refresh solicitado');
    setHasMore(true);
    fetchVotings(0, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      console.log(`📖 Load more: page=${page}`);
      void fetchVotings(page + 1);
    }
  };

  console.log(`🎨 Renderizando: loading=${loading}, votings.length=${votings.length}, error=${error}`);

  if (loading && votings.length === 0) {
    return (
        <FiscalizaLoading message="Carregando..." />
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Votações</Text>
      </View>
      <FlatList
        data={votings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.organ}>{item.organAcronym}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          hasMore ? <ActivityIndicator size="small" color="#009C3B" style={styles.footerLoader} /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '600',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  listContent: {
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 22,
  },
  organ: {
    fontSize: 14,
    color: '#009C3B',
    fontWeight: '500',
  },
  footerLoader: {
    marginVertical: 16,
  },
});
