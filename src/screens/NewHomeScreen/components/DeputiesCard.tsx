import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { stateFlags } from '../../../assets/stateFlags';

interface DeputiesCardProps {
  name: string;
  party: string;
  state: string;
  photoUrl: string;
  isFollowed: boolean;
  expenseTotal: number;
  propositionsTotal: number;
  onToggleFollow: () => void;
}

const DeputiesCard: React.FC<DeputiesCardProps> = ({
  name,
  party,
  state,
  photoUrl,
  isFollowed,
  expenseTotal,
  propositionsTotal,
  onToggleFollow,
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getCurrentDateRange = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('pt-BR', { month: 'long' });
    
    // Capitalize first letter of month
    const formattedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
    
    return `Janeiro de ${currentYear} até ${formattedMonth} de ${currentYear}`;
  };

  // Get state flag from assets
  const stateFlag = stateFlags[state];

  return (
    <View style={styles.card}>
      <Image source={{ uri: photoUrl }} style={styles.photo} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.partyContainer}>
          <Text style={styles.party}>{`${party} - ${state}`}</Text>
          {stateFlag && <Image source={stateFlag} style={styles.flagIcon} />}
        </View>
        
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, styles.expenseTag]}>
            <Text
              style={[styles.tagText, styles.expenseText]}
              accessibilityLabel={`Gastos: ${formatCurrency(expenseTotal)}`}
            >
              💸 {formatCurrency(expenseTotal)}
            </Text>
          </View>
          
          <View style={[styles.tag, styles.proposalTag]}>
            <Text
              style={[styles.tagText, styles.proposalText]}
              accessibilityLabel={`Propostas: ${propositionsTotal}`}
            >
              📃 {propositionsTotal}
            </Text>
          </View>
        </View>
        
        <Text style={styles.footerText}>{getCurrentDateRange()}</Text>
      </View>
      <TouchableOpacity onPress={onToggleFollow} style={styles.starContainer}>
        <Star
          size={24}
          color={isFollowed ? '#FFD700' : '#C0C0C0'}
          fill={isFollowed ? '#FFD700' : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 5,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  party: {
    fontSize: 14,
    color: '#666',
    marginRight: 6,
  },
  flagIcon: {
    width: 20,
    height: 14,
    borderRadius: 2,
    borderWidth: 1
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  expenseTag: {
    backgroundColor: '#ffebee', // Light red background
  },
  expenseText: {
    color: '#c62828', // Red text
  },
  proposalTag: {
    backgroundColor: '#e3f2fd', // Light blue background
  },
  proposalText: {
    color: '#1565c0', // Blue text
  },
  footerText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  starContainer: {
    padding: 5,
  },
});

export default DeputiesCard;
