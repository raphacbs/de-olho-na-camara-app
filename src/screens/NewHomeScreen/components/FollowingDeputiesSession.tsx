import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@/navigation/routerShim';
import { dataService } from '@/services/dataService';
import { styles } from '../styles';
import { PoliticianDto } from '@/types/api';
import DeputiesCard from './DeputiesCard';
import FiscalizaLoading from "@/components/FiscalizaLoading";

export const FollowingDeputiesSession = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { data: followedData, isLoading } = useQuery({
    queryKey: ['followedPoliticians', { page: 0, size: 5 }],
    queryFn: () => dataService.getFollowedPoliticians({ page: 0, size: 5 }),
  });

  const deputies = followedData?.data || [];
  const totalFollowed = followedData?.total || 0;

  const unfollowMutation = useMutation({
    mutationFn: (politicianId: number) => dataService.unfollowPolitician(politicianId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['followedPoliticians'] });
      Alert.alert('Sucesso', 'Você deixou de seguir este deputado.');
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível deixar de seguir o deputado. Tente novamente.');
    }
  });

  if (isLoading) {
    return <FiscalizaLoading message="Carregando..." />;
  }

  if (deputies.length === 0) {
    return null;
  }

  const handleToggleFollow = (deputyId: number) => {
    unfollowMutation.mutate(deputyId);
  };

  return (
    <View style={styles.followingDeputiesContainer}>
      <View style={styles.followingDeputiesHeader}>
        <View style={localStyles.titleContainer}>
          <Text style={styles.followingDeputiesTitle}>Deputados que Você Segue</Text>
          <View style={localStyles.badge}>
            <Text style={localStyles.badgeText}>{totalFollowed}</Text>
          </View>
        </View>
      </View>

      {deputies.map((deputy: PoliticianDto) => (
        <TouchableOpacity
          key={deputy.id}
          onPress={() => navigation.navigate('PoliticianDetails', { id: deputy.id })}
        >
          <DeputiesCard
            name={deputy.name}
            party={deputy.party}
            state={deputy.state}
            photoUrl={deputy.photoUrl}
            isFollowed={deputy.isFollowed}
            onToggleFollow={() => handleToggleFollow(deputy.id)}
            expenseTotal={deputy.expenseTotal}
            propositionsTotal={deputy.propositionsTotal}
          />
        </TouchableOpacity>
      ))}

      {totalFollowed > 5 && (
        <TouchableOpacity
          style={localStyles.seeMoreButton}
          onPress={() => navigation.navigate('DeputadosSeguidosScreen')}
        >
          <Text style={localStyles.seeMoreText}>Ver mais</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#009C3B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seeMoreButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  seeMoreText: {
    color: '#009C3B',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
