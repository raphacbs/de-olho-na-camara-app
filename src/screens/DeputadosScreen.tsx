import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@/navigation/routerShim';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';
import { PoliticianDto } from '@/types/api';
import { NavigationProp } from '@/types/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterModal } from '@/components/FilterModal';
import { Ionicons } from '@expo/vector-icons';
import DeputiesCard from './NewHomeScreen/components/DeputiesCard';
import FiscalizaLoading from "@/components/FiscalizaLoading";

export function DeputadosScreen() {
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    states: [] as string[],
    parties: [] as string[],
  });
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const isFilterActive = appliedFilters.states.length > 0 || appliedFilters.parties.length > 0;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['politicians', debouncedSearchQuery, appliedFilters],
    queryFn: async ({ pageParam = 0 }) => {
      return dataService.getPoliticians({
        page: pageParam as number,
        size: 20,
        name: debouncedSearchQuery || undefined,
        state: appliedFilters.states.join(','),
        party: appliedFilters.parties.join(','),
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const politicians = data?.pages.flatMap(page => page.data) || [];
  const followedIds = new Set(
    (data?.pages.flatMap(page => page.data) || [])
      .filter(p => p.isFollowed)
      .map(p => p.id)
  );

  const followMutation = useMutation({
    mutationFn: (politicianId: number) => dataService.followPolitician(politicianId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['politicians'] });
      Alert.alert('Sucesso', 'Você agora está seguindo este deputado.');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível seguir o deputado. Tente novamente.');
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: (politicianId: number) => dataService.unfollowPolitician(politicianId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['politicians'] });
      Alert.alert('Sucesso', 'Você deixou de seguir este deputado.');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível deixar de seguir o deputado. Tente novamente.');
    }
  });

  const handleToggleFollow = (deputyId: number) => {
    if (followedIds.has(deputyId)) {
      unfollowMutation.mutate(deputyId);
    } else {
      followMutation.mutate(deputyId);
    }
  };

  const onRefresh = useCallback(() => {
    setSearchQuery('');
    setSelectedStates([]);
    setSelectedParties([]);
    setAppliedFilters({ states: [], parties: [] });
    void refetch();
  }, [refetch]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handlePoliticianPress = (id: number) => {
    navigation.navigate('PoliticianDetails', { id });
  };

  const handleApplyFilters = () => {
    setModalVisible(false);
    setAppliedFilters({
      states: selectedStates,
      parties: selectedParties,
    });
  };

  const handleClearFilters = () => {
    setSelectedStates([]);
    setSelectedParties([]);
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <ActivityIndicator size="small" color="#009C3B" style={styles.footerLoader} />;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Deputados</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[styles.filterIconContainer, isFilterActive && styles.filterIconActive]}
          >
            <Ionicons name="filter" size={24} color={isFilterActive ? '#FFF' : '#009C3B'} />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedStates={selectedStates}
        selectedParties={selectedParties}
        onStateToggle={(state) => setSelectedStates(prev => prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state])}
        onPartyToggle={(party) => setSelectedParties(prev => prev.includes(party) ? prev.filter(p => p !== party) : [...prev, party])}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
      {isLoading ? (
          <FiscalizaLoading message="Carregando..." />
      ) : politicians.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum político encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={politicians}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePoliticianPress(item.id)}
            >
              <DeputiesCard
                name={item.name}
                party={item.party}
                state={item.state}
                photoUrl={item.photoUrl}
                isFollowed={item.isFollowed}
                onToggleFollow={() => handleToggleFollow(item.id)}
                expenseTotal={item.expenseTotal}
                propositionsTotal={item.propositionsTotal}
              />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterIconContainer: {
    padding: 4,
    borderRadius: 8,
  },
  filterIconActive: {
    backgroundColor: '#009C3B',
  },
  searchInput: {
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  footerLoader: {
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
