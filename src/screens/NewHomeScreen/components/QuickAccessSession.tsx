import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@/navigation/routerShim';
import { FileText, CheckSquare, Users, Settings } from 'lucide-react-native';
import { styles } from '../styles';

export const QuickAccessSession = () => {
  const navigation = useNavigation<any>();

  const items = [
    {
      label: 'Proposições',
      icon: <FileText size={24} color="#2F6FED" />,
      route: 'ProposalsScreen',
    },
    {
      label: 'Votações',
      icon: <CheckSquare size={24} color="#2F6FED" />,
      route: 'VotesScreen',
    },
    {
      label: 'Deputados',
      icon: <Users size={24} color="#2F6FED" />,
      route: 'PoliticianList',
    },
    {
      label: 'Configurações',
      icon: <Settings size={24} color="#2F6FED" />,
      route: 'SettingsScreen',
    },
  ];

  return (
    <View style={styles.quickAccessContainer}>
      <Text style={styles.quickAccessTitle}>Acesso Rápido</Text>
      <View style={styles.quickAccessGrid}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickAccessButton}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.quickAccessIconContainer}>
              {item.icon}
            </View>
            <Text style={styles.quickAccessLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
