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
      // Navigate to tab: MainTabs -> 'Proposições'
      route: { name: 'MainTabs', params: { screen: 'Proposições' } },
    },
    {
      label: 'Votações',
      icon: <CheckSquare size={24} color="#2F6FED" />,
      route: { name: 'MainTabs', params: { screen: 'Votações' } },
    },
    {
      label: 'Deputados',
      icon: <Users size={24} color="#2F6FED" />,
      // PoliticianList is a stack route; navigate to it directly
      route: { name: 'PoliticianList' },
    },
    {
      label: 'Configurações',
      icon: <Settings size={24} color="#2F6FED" />,
      route: { name: 'MainTabs', params: { screen: 'Configurações' } },
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
            onPress={() => {
              const r = item.route as any;
              if (r && r.name) {
                navigation.navigate(r.name, r.params);
              } else {
                // eslint-disable-next-line no-console
                console.warn('[QuickAccessSession] invalid route configuration', item);
              }
            }}
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
