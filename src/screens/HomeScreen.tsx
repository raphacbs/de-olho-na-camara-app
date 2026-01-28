import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@/navigation/routerShim';
import { Feather } from '@expo/vector-icons';
import { dataService } from '@/services/dataService';
import { PoliticianDto, PropositionDto } from '@/types/api';
import { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import FiscalizaLoading from "@/components/FiscalizaLoading";

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const { 
    data: followedRes, 
    isLoading: isLoadingFollowed, 
    isRefetching: isRefetchingFollowed,
    refetch: refetchFollowed 
  } = useQuery({
    queryKey: ['followedPoliticians', { page: 0, size: 10 }],
    queryFn: () => dataService.getFollowedPoliticians({ page: 0, size: 10 }),
  });

  const { 
    data: propositionsRes, 
    isLoading: isLoadingPropositions, 
    isRefetching: isRefetchingPropositions,
    refetch: refetchPropositions 
  } = useQuery({
    queryKey: ['recentPropositions', { page: 0, size: 5 }],
    queryFn: () => dataService.getPropositions({ page: 0, size: 5 }),
  });

  const onRefresh = () => {
    void Promise.all([refetchFollowed(), refetchPropositions()]);
  };

  const renderStoryItem = ({ item }: { item: PoliticianDto }) => (
    <TouchableOpacity
      style={styles.story}
      onPress={() => navigation.navigate('PoliticianDetails', { id: item.id })}
    >
      <View style={styles.storyImageContainer}>
        <Image source={{ uri: item.photoUrl }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>
        {item.name.split(' ')[0]}
      </Text>
    </TouchableOpacity>
  );

  const renderSeeAllStory = () => (
    <TouchableOpacity
      style={styles.seeAllStoryContainer}
      onPress={() => navigation.navigate('DeputadosSeguidos')}
    >
      <View style={[styles.storyImageContainer, styles.seeAllStory]}>
        <Feather name="arrow-right" size={24} color="#009C3B" />
      </View>
      <Text style={styles.storyName}>Ver Todos</Text>
    </TouchableOpacity>
  );

  const renderPropositionItem = (item: PropositionDto) => (
    <TouchableOpacity
      key={item.id}
      style={styles.propositionCard}
      onPress={() => navigation.navigate('ProposalDetail', { proposal: item })}
    >
      <View style={styles.propositionHeader}>
        <Text style={styles.propositionType}>
          {item.typeDescription} {item.number}/{item.year}
        </Text>
        <Text style={styles.propositionDate}>
          {format(parseISO(item.presentationDate), 'dd/MM/yyyy')}
        </Text>
      </View>
      <Text style={styles.propositionSummary} numberOfLines={3}>
        {item.summary}
      </Text>
    </TouchableOpacity>
  );

  const followedPoliticians = followedRes?.data || [];
  const recentPropositions = propositionsRes?.data || [];
  const isLoading = isLoadingFollowed || isLoadingPropositions;
  const isRefreshing = isRefetchingFollowed || isRefetchingPropositions;

  if (isLoading && !isRefreshing) {
    return (
        <FiscalizaLoading message="Carregando..." />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fiscaliza Aí</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Configurações' })}>
          <Feather name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Followed Politicians Stories */}
        <View style={styles.storiesSection}>
          <Text style={styles.storiesTitle}>Deputados(as) seguidos</Text>
          <View style={styles.storiesContainer}>
            {followedPoliticians.length > 0 ? (
              <View style={styles.storiesWrapper}>
                <FlatList
                  horizontal
                  data={followedPoliticians}
                  renderItem={renderStoryItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.storiesList}
                />
                <View style={styles.seeAllContainer}>{renderSeeAllStory()}</View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Siga deputados para vê-los aqui.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Últimas Propostas Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas Propostas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Proposições' })}>
              <Text style={styles.seeAllButton}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {recentPropositions.map(renderPropositionItem)}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#009C3B',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  storiesSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
    paddingTop: 12,
  },
  storiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  storiesContainer: {
    paddingVertical: 12,
  },
  storiesWrapper: {
    flexDirection: 'row',
  },
  storiesList: {
    paddingLeft: 16,
  },
  seeAllContainer: {
    paddingRight: 16,
    justifyContent: 'center',
    marginLeft: 16,
  },
  story: {
    alignItems: 'center',
    width: 70,
    marginRight: 16,
  },
  seeAllStoryContainer: {
    alignItems: 'center',
    width: 70,
  },
  storyImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#009C3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  storyImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E0E0E0',
  },
  storyName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  seeAllStory: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#009C3B',
    fontWeight: '600',
  },
  propositionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  propositionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  propositionDate: {
    fontSize: 12,
    color: '#999999',
  },
  propositionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009C3B',
  },
  propositionSummary: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontStyle: 'italic',
  },
});
