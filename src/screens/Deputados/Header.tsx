import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  onOpenFilters: () => void;
  isFilterActive: boolean;
}

export default function Header({ searchQuery, setSearchQuery, onOpenFilters, isFilterActive }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Deputados</Text>
        <TouchableOpacity
          onPress={onOpenFilters}
          style={[styles.filterIconContainer, isFilterActive && styles.filterIconActive]}
        >
          <Ionicons name="filter" size={24} color={isFilterActive ? '#FFF' : '#009C3B'} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por nome..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
}
