import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@/navigation/routerShim';
import { dataService } from '@/services/dataService';
import { styles } from '../styles';
import { PropositionDto } from '@/types/api';

export const RecentActivitySession = () => {
  const navigation = useNavigation<any>();

  // Fetch recent propositions as "Recent Activity"
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['recentActivity', { page: 0, size: 3 }],
    queryFn: () => dataService.getPropositions({ page: 0, size: 3 }),
  });

  const activities = activityData?.data || []; // PaginationResponse has 'data' field, not 'content'

  if (isLoading) {
    // Simple skeleton or loading state could be added here
    return null;
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <View style={styles.recentActivityContainer}>
      <Text style={styles.recentActivityTitle}>Atividade Recente</Text>
      
      {activities.map((item: PropositionDto) => (
        <TouchableOpacity
          key={item.id}
          style={styles.activityCard}
          onPress={() => navigation.navigate('ProposalDetail', { proposal: item })}
        >
          <View style={styles.activityHeader}>
            <Text style={styles.activityType}>{item.type}</Text>
            <Text style={styles.activityDate}>{new Date(item.presentationDate).toLocaleDateString('pt-BR')}</Text> 
          </View>
          <Text style={styles.activityTitle} numberOfLines={2}>
            {item.summary}
          </Text>
          <Text style={styles.activityDescription} numberOfLines={1}>
            {item.number}/{item.year}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
