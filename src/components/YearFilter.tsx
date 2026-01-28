import React, { useState } from 'react';
import { View, StyleSheet, Platform, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Surface, Portal, Dialog } from 'react-native-paper';
import { useFilters } from '@/contexts/FiltersContext';

export function YearFilter() {
  const { year, setYear, allowedYears } = useFilters();
  const [modalVisible, setModalVisible] = useState(false);

  const displayLabel = year ? String(year) : (allowedYears && allowedYears.length > 0 ? String(allowedYears[0]) : 'Ano');

  const onSelect = (y: number) => {
    setYear(y);
    // close modal after selection
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper} accessibilityLabel={`Filtro de ano. Ano selecionado: ${displayLabel}`}>
      <Text style={styles.title}>Dados exibidos referentes ao ano selecionado</Text>
      <Text style={styles.subtitle}>Altere o ano para filtrar todas as consultas</Text>

      <View style={styles.centerRow}>
        <Surface style={styles.pillSurface} elevation={3}>
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            contentStyle={styles.pillContent}
            labelStyle={styles.pillLabel}
            accessibilityLabel={`Selecionar ano, atualmente ${displayLabel}`}
            icon="calendar"
            buttonColor="#E53935"
            color="#E53935"
          >
            {displayLabel}
          </Button>
        </Surface>
      </View>

      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Selecione o ano</Dialog.Title>
          <Dialog.Content>
            {allowedYears && allowedYears.length > 0 ? (
              <FlatList
                data={allowedYears}
                keyExtractor={(item) => String(item)}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => {
                  const selected = year === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => onSelect(item)}
                      style={[styles.yearButton, selected && styles.yearButtonSelected]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.yearButtonText, selected && styles.yearButtonTextSelected]}>{String(item)}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <Text style={styles.noYearsText}>Nenhum ano disponível</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  centerRow: {
    width: '100%',
    alignItems: 'center',
  },
  pillSurface: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  pillContent: {
    height: 48,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  pillLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  dialog: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dialogTitle: {
    fontWeight: '700',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  yearButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  yearButtonSelected: {
    backgroundColor: '#E53935',
    borderColor: '#E53935',
    elevation: 6,
  },
  yearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  yearButtonTextSelected: {
    color: '#fff',
  },
  noYearsText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 12,
  },
});

export default YearFilter;
