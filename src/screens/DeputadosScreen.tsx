import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dataService } from '@/services/dataService';
import { PoliticianDto } from '@/types/api';

export function DeputadosScreen() {
  const [politicians, setPoliticians] = useState<PoliticianDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPoliticians = async (pageNumber: number, shouldRefresh = false) => {
    if (!hasMore && !shouldRefresh) return;

    try {
      const response = await dataService.getPoliticians({ page: pageNumber, size: 20 });

      if (shouldRefresh) {
        setPoliticians(response.data);
      } else {
        setPoliticians(prev => [...prev, ...response.data]);
      }

      setHasMore(response.page < response.totalPages - 1);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching politicians:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPoliticians(0, true);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchPoliticians(0, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPoliticians(page + 1);
    }
  };

  if (loading && page === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009C3B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Deputados</Text>
      </View>
      <FlatList
        data={politicians}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.photoUrl }}
              style={styles.photo}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.party}>{item.party} - {item.state}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#E0E0E0',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  party: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#999999',
  },
  footerLoader: {
    marginVertical: 16,
  },
});
