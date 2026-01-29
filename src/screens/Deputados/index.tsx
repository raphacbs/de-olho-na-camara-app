import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@/navigation/routerShim';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';
import { NavigationProp } from '@/types/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterModal } from '@/components/FilterModal';
import Header from './Header';
import DeputiesList from './List';
import styles from './styles';

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
        page: pageParam,
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
      // eslint-disable-next-line no-alert
      alert('Sucesso: você agora está seguindo este deputado.');
    },
    onError: () => {
      // eslint-disable-next-line no-alert
      alert('Erro: não foi possível seguir o deputado. Tente novamente.');
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: (politicianId: number) => dataService.unfollowPolitician(politicianId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['politicians'] });
      // eslint-disable-next-line no-alert
      alert('Sucesso: você deixou de seguir este deputado.');
    },
    onError: () => {
      // eslint-disable-next-line no-alert
      alert('Erro: não foi possível deixar de seguir o deputado. Tente novamente.');
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
    const numeric = id === undefined || id === null ? undefined : Number(id);
    if (typeof numeric === 'number' && !Number.isNaN(numeric)) {
      navigation.navigate('PoliticianDetails', { id: numeric });
    } else {
      // eslint-disable-next-line no-console
      console.warn('[DeputadosScreen] invalid politician id, not navigating', id);
    }
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenFilters={() => setModalVisible(true)}
        isFilterActive={isFilterActive}
      />

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

      <DeputiesList
        politicians={politicians}
        isLoading={isLoading}
        isRefetching={isRefetching}
        isFetchingNextPage={isFetchingNextPage}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        handlePoliticianPress={handlePoliticianPress}
        handleToggleFollow={handleToggleFollow}
      />
    </SafeAreaView>
  );
}

export default DeputadosScreen;
