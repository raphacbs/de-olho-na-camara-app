import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { dataService } from '@/services/dataService';
import { PoliticianDto, PropositionDto } from '@/types/api';
import { NavigationProp } from '@/types/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [followedPoliticians, setFollowedPoliticians] = useState<PoliticianDto[]>([]);
  const [recentPropositions, setRecentPropositions] = useState<PropositionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [followedRes, propositionsRes] = await Promise.all([
        dataService.getFollowedPoliticians({ page: 0, size: 10 }),
        dataService.getPropositions({ page: 0, size: 5 })
      ]);
      setFollowedPoliticians(followedRes.data);
      setRecentPropositions(propositionsRes.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderPoliticianItem = ({ item }: { item: PoliticianDto }) => (
    <TouchableOpacity
      style={styles.politicianCard}
      onPress={() => navigation.navigate('Deputados', { deputyId: item.id.toString() })}
    >
      <Image source={{ uri: item.photoUrl }} style={styles.politicianPhoto} />
      <Text style={styles.politicianName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.politicianParty}>{item.party}-{item.state}</Text>
    </TouchableOpacity>
  );

  const renderPropositionItem = (item: PropositionDto) => (
    <View key={item.id} style={styles.propositionCard}>
      <View style={styles.propositionHeader}>
        <Text style={styles.propositionType}>{item.typeDescription} {item.number}/{item.year}</Text>
        <Text style={styles.propositionDate}>{new Date(item.presentationDate).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.propositionSummary} numberOfLines={3}>{item.summary}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009C3B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name || 'Visitante'}</Text>
            <Text style={styles.subtitle}>Acompanhe seus representantes</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
             <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
             </View>
          </TouchableOpacity>
        </View>

        {/* Meus Deputados Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Deputados</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Deputados')}>
              <Text style={styles.seeAllButton}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {followedPoliticians.length > 0 ? (
            <FlatList
              horizontal
              data={followedPoliticians}
              renderItem={renderPoliticianItem}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Você ainda não segue nenhum deputado.</Text>
            </View>
          )}
        </View>

        {/* Últimas Propostas Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimas Propostas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Proposições')}>
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#009C3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
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
  horizontalList: {
    paddingHorizontal: 16,
  },
  politicianCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  politicianPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
  },
  politicianName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  politicianParty: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  propositionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontStyle: 'italic',
  },
});
