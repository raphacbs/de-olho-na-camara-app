import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert, ImageBackground } from 'react-native';
// use shim
import { useRoute, useNavigation } from '@/navigation/routerShim';
import { RootStackParamList, NavigationProp } from '@/types/navigation';
import { dataService } from '@/services/dataService';
import { stateFlags } from '../assets/stateFlags';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function PoliticianDetailsScreen(props?: any) {
  // Support two calling styles:
  // 1) regular screens via react-navigation: use our useRoute() shim
  // 2) directly rendered by expo-router files that pass a `route` prop (see app/politician/[id].tsx)
  const routeFromHook = useRoute<{ id?: number | string }>();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  // Normalize id: prefer explicit prop route (props.route), then hook route, then fallback to undefined
  const rawId = (props && props.route && props.route.params && props.route.params.id) ?? (routeFromHook && (routeFromHook as any).params && (routeFromHook as any).params.id) ?? undefined;
  const id = rawId === undefined || rawId === null ? undefined : Number(rawId);

  // If id is invalid (undefined or NaN), show an error UI instead of calling the API with 'undefined'
  const isIdValid = typeof id === 'number' && !Number.isNaN(id);

  const { data: politician, isLoading: isLoadingPolitician, isError } = useQuery({
    queryKey: ['politician', id],
    queryFn: () => dataService.getPoliticianById(id as number),
    enabled: isIdValid,
  });

  const { data: isFollowing, isLoading: isLoadingIsFollowing } = useQuery({
    queryKey: ['isFollowing', id],
    queryFn: async () => {
      const followed = await dataService.getFollowedPoliticians({ page: 0, size: 1000 });
      return followed.data.some(p => p.id === id);
    },
    enabled: isIdValid,
  });

  const { mutate: toggleFollow, isPending: isFollowLoading } = useMutation({
    mutationFn: async () => {
      if (!isIdValid) throw new Error('Invalid politician id');
      if (isFollowing) {
        await dataService.unfollowPolitician(id);
      } else {
        await dataService.followPolitician(id);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['isFollowing', id] });
      const previousIsFollowing = queryClient.getQueryData(['isFollowing', id]);
      queryClient.setQueryData(['isFollowing', id], (old: boolean | undefined) => !old);
      return { previousIsFollowing };
    },
    onSuccess: () => {
      const message = isFollowing ? 'Você agora está seguindo este deputado.': 'Você deixou de seguir este deputado.';
      Alert.alert('Sucesso', message);
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['isFollowing', id], context?.previousIsFollowing);
      Alert.alert('Erro', 'Não foi possível atualizar o status de seguir.');
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['isFollowing', id] });
      void queryClient.invalidateQueries({ queryKey: ['followedPoliticians'] });
    },
  });

  const renderInfoBox = (icon: string, title: string) => {
    return (
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name={icon as any} size={24} color={'#009C3B'} />
        <Text style={styles.infoBoxTitle}>{title}</Text>
      </View>
    );
  }

  const isLoading = (isIdValid && (isLoadingPolitician || isLoadingIsFollowing)) || false;

  // If id is invalid, show friendly error and a back button
  if (!isIdValid) {
    return (
      <View style={styles.errorContainer}>
        <Text>Identificador do deputado inválido.</Text>
        <TouchableOpacity onPress={() => navigation?.goBack && (navigation.goBack as any)()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#009C3B' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009C3B" />
      </View>
    );
  }

  if (isError || !politician) {
    return (
      <View style={styles.errorContainer}>
        <Text>Deputado não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imagesRow}>
          <View style={styles.flagContainer}>
            <Image
              source={stateFlags[politician.state.toUpperCase()]}
              style={styles.flagImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.flagGradient}
            />
          </View>
          <View style={styles.photoContainer}>
            <Image source={{ uri: politician.photoUrl }} style={styles.photo} />
            <LinearGradient
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.photoGradient}
            />
          </View>
        </View>
        <Text style={styles.name}>{politician.name}</Text>
        <Text style={styles.party}>{politician.party} - {politician.state}</Text>

        <TouchableOpacity
          style={[styles.followButton, isFollowing ? styles.followingButton : styles.notFollowingButton]}
          onPress={() => toggleFollow()}
          disabled={isFollowLoading}
        >
          {isFollowLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.infoBoxContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('PoliticianPropositions', { politicianId: id })}>
            {renderInfoBox("file-document-edit", "Propostas")}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PoliticianExpenses', { politicianId: id })}>
            {renderInfoBox("account-cash", "Despesas")}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PoliticianVotes', { politicianId: id })}>
            {renderInfoBox("vote", "Votos")}
          </TouchableOpacity>
        </View>
        <View style={styles.infoBoxContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('PoliticianVotes', { politicianId: id })}>
            {renderInfoBox("calendar", "Agenda")}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PoliticianVotes', { politicianId: id })}>
            {renderInfoBox("account-tie-voice", "Discursos")}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PoliticianVotes', { politicianId: id })}>
            {renderInfoBox("timeline", "Histórico")}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  imagesRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 10,
    alignItems: 'center'
  },
  flagContainer: {
    flex: 1,
    position: 'relative',
  },
  flagImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderColor: '#c2c0c0',
    borderWidth: 1,
  },
  flagGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 150,
    borderRadius: 8,
    borderColor: '#030303',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: '#E0E0E0',
  },
  photoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,

  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },
  party: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  notFollowingButton: {
    backgroundColor: '#009C3B',
  },
  followingButton: {
    backgroundColor: '#FF3B30',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginTop:10, 
    marginBottom:10, 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  expenseValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009C3B',
  },
  expenseDate: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  expenseSupplier: {
    fontSize: 13,
    color: '#666666',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  voteLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  voteOption: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  sim: {
    backgroundColor: '#009C3B',
  },
  nao: {
    backgroundColor: '#FF3B30',
  },
  abstenção: {
    backgroundColor: '#FF9500',
  },
  obstrução: {
    backgroundColor: '#8E8E93',
  },
  infoBox: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: 100,
    height: 80,
    maxWidth: 100,
    maxHeight: 80,
    margin: 5,
    // flex: 1,
  },
  infoBoxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  infoBoxTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },


});
