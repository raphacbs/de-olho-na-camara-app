import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeputiesCard from '../NewHomeScreen/components/DeputiesCard';
import FiscalizaLoading from '@/components/FiscalizaLoading';
import styles from './styles';
import { PoliticianDto } from '@/types/api';

interface ListProps {
  politicians: PoliticianDto[];
  isLoading: boolean;
  isRefetching: boolean;
  isFetchingNextPage: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  handlePoliticianPress: (id: number) => void;
  handleToggleFollow: (id: number) => void;
}

export default function DeputiesList({
  politicians,
  isLoading,
  isRefetching,
  isFetchingNextPage,
  onRefresh,
  onEndReached,
  handlePoliticianPress,
  handleToggleFollow,
}: ListProps) {
  const insets = useSafeAreaInsets();
  const extraBottom = Platform.OS === 'android' ? 56 : 16; // give more space for Android navigation
  const bottomPadding = insets.bottom + extraBottom;

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <ActivityIndicator size="small" color="#009C3B" style={styles.footerLoader} />;
    }
    return null;
  };

  if (isLoading) return <FiscalizaLoading message="Carregando..." />;

  if (!politicians || politicians.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum político encontrado.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={politicians}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePoliticianPress(item.id)}>
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
      refreshControl={<RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={onRefresh} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
      ListFooterComponent={renderFooter}
    />
  );
}
