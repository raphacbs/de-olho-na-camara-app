import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BottomFilterModal } from './BottomFilterModal';
import { STATES } from '@/constants';
import { dataService } from '@/services/dataService';
import { PartyDto } from '@/types/api';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedStates: string[];
  selectedParties: string[];
  onStateToggle: (state: string) => void;
  onPartyToggle: (party: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FilterModal({
  visible,
  onClose,
  selectedStates,
  selectedParties,
  onStateToggle,
  onPartyToggle,
  onApply,
  onClear,
}: FilterModalProps) {
  const [parties, setParties] = useState<PartyDto[]>([]);
  const [loadingParties, setLoadingParties] = useState(false);

  useEffect(() => {
    if (visible && parties.length === 0) {
      fetchParties();
    }
  }, [visible]);

  const fetchParties = async () => {
    setLoadingParties(true);
    try {
      const data = await dataService.getParties();
      setParties(data);
    } catch (error) {
      console.error('Failed to fetch parties:', error);
    } finally {
      setLoadingParties(false);
    }
  };

  return (
    <BottomFilterModal
      visible={visible}
      onClose={onClose}
      onApply={onApply}
      onClear={onClear}
      title="Filtros"
    >
      <Text style={styles.label}>Estado</Text>
      <View style={styles.chipsContainer}>
        {STATES.map(state => (
          <TouchableOpacity
            key={state}
            style={[styles.chip, selectedStates.includes(state) && styles.chipSelected]}
            onPress={() => onStateToggle(state)}
          >
            <Text style={[styles.chipText, selectedStates.includes(state) && styles.chipTextSelected]}>
              {state}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Partido</Text>
      {loadingParties ? (
        <ActivityIndicator size="small" color="#009C3B" />
      ) : (
        <View style={styles.chipsContainer}>
          {parties.map(party => (
            <TouchableOpacity
              key={party.id}
              style={[styles.chip, selectedParties.includes(party.acronym) && styles.chipSelected]}
              onPress={() => onPartyToggle(party.acronym)}
            >
              <Text style={[styles.chipText, selectedParties.includes(party.acronym) && styles.chipTextSelected]}>
                {party.acronym}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </BottomFilterModal>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#009C3B',
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: '#FFF',
  },
});
