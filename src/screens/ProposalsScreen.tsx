import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, TextInput, Button, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dataService } from '@/services/dataService';
import { PropositionDto, PoliticianDto } from '@/types/api';
// use router shim instead of react-navigation
import { useNavigation } from '@/navigation/routerShim';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import FiscalizaLoading from "@/components/FiscalizaLoading";

const propositionTypes = [
  { label: "Projeto de Lei", value: "PL" },
  { label: "Projeto de Lei Complementar", value: "PLP" },
  { label: "Projeto de Lei de Conversão", value: "PLV" },
  { label: "Proposta de Emenda Constitucional", value: "PEC" },
  { label: "Medida Provisória", value: "MPV" },
  { label: "Projeto de Decreto Legislativo", value: "PDC" },
  { label: "Projeto de Lei do Congresso", value: "PFC" },
  { label: "Projeto de Resolução do Congresso", value: "PRC" },
  { label: "Requerimento", value: "REQ" },
  { label: "Requerimento de Informação", value: "RIC" },
  { label: "Indicação", value: "INC" },
  { label: "Recurso", value: "RCP" },
  { label: "Mensagem", value: "MSC" },
  { label: "Mensagem", value: "MSG" },
  { label: "Aviso", value: "AVN" },
];

const typeColors: { [key: string]: string } = {
  PL: '#3498db',
  PLP: '#2ecc71',
  PLV: '#f1c40f',
  PEC: '#e74c3c',
  MPV: '#9b59b6',
  PDC: '#1abc9c',
  PFC: '#e67e22',
  PRC: '#34495e',
  REQ: '#f39c12',
  RIC: '#d35400',
  INC: '#c0392b',
  RCP: '#8e44ad',
  MSC: '#27ae60',
  MSG: '#2980b9',
  AVN: '#7f8c8d',
  DEFAULT: '#bdc3c7',
};

const getColorForType = (type: string) => {
  return typeColors[type] || typeColors.DEFAULT;
};

const Chip = ({ text, color }: { text: string, color: string }) => (
  <View style={[styles.chip, { backgroundColor: color }]}>
    <Text style={styles.chipText}>{text}</Text>
  </View>
);

export function ProposalsScreen() {
  const navigation = useNavigation();

  // UI and filter selection states
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isPoliticianModalVisible, setPoliticianModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end' | null>(null);
  const [politicianSearch, setPoliticianSearch] = useState('');

  // Filter states for the modal
  const [selectedPolitician, setSelectedPolitician] = useState<PoliticianDto | undefined>();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Applied filters to trigger query
  const [appliedFilters, setAppliedFilters] = useState({
    politicianId: undefined as number | undefined,
    types: [] as string[],
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const isFilterActive = !!appliedFilters.politicianId || appliedFilters.types.length > 0 || !!appliedFilters.startDate || !!appliedFilters.endDate;

  // Fetch all politicians for the filter modal
  const { data: politiciansData } = useQuery({
    queryKey: ['allPoliticiansForFilter'],
    queryFn: () => dataService.getPoliticians({ size: 513 }), // Fetch all
    staleTime: Infinity, // This data is static
  });
  const allPoliticians = politiciansData?.data || [];

  // Fetch propositions with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['propositions', appliedFilters],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        page: pageParam as number,
        size: 10,
        politicianId: appliedFilters.politicianId,
        types: appliedFilters.types.length > 0 ? appliedFilters.types : undefined,
        startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : undefined,
        endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : undefined,
      };
      return dataService.getPropositions(params);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const propositions = data?.pages.flatMap(page => page.data) || [];

  const onRefresh = () => {
    void refetch();
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const handleApplyFilters = () => {
    setFilterModalVisible(false);
    setAppliedFilters({
      politicianId: selectedPolitician?.id,
      types: selectedTypes,
      startDate,
      endDate,
    });
  };

  const handleClearFilters = () => {
    setSelectedPolitician(undefined);
    setSelectedTypes([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setAppliedFilters({
      politicianId: undefined,
      types: [],
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleItemPress = (item: PropositionDto) => {
    // @ts-ignore
    navigation.navigate('ProposalDetail', { proposal: item });
  };

  const toggleTypeSelection = (typeValue: string) => {
    setSelectedTypes(prev => prev.includes(typeValue) ? prev.filter(t => t !== typeValue) : [...prev, typeValue]);
  };

  const handleConfirmDate = (date: Date) => {
    if (datePickerTarget === 'start') setStartDate(date);
    if (datePickerTarget === 'end') setEndDate(date);
    setDatePickerVisible(false);
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={{ paddingVertical: 20 }} size="large" color="#009C3B" />;
  };

  const filteredPoliticians = politicianSearch
    ? allPoliticians.filter(p => p.name.toLowerCase().includes(politicianSearch.toLowerCase()))
    : allPoliticians;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Propostas</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={[styles.filterIconContainer, isFilterActive && styles.filterIconActive]}>
          <Ionicons name="filter" size={24} color={isFilterActive ? '#FFF' : '#009C3B'} />
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={isFilterModalVisible} onRequestClose={() => setFilterModalVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setFilterModalVisible(false)} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={handleClearFilters}><Text style={styles.clearButton}>Limpar</Text></TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Político</Text>
            <TouchableOpacity style={styles.input} onPress={() => setPoliticianModalVisible(true)}>
              <Text style={selectedPolitician ? {} : { color: '#999' }}>{selectedPolitician?.name || 'Selecione um político'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Tipos de Proposição</Text>
            <View style={styles.typesContainer}>
              {propositionTypes.map(type => (
                <TouchableOpacity key={type.value} style={[styles.typeChip, selectedTypes.includes(type.value) && styles.typeChipSelected]} onPress={() => toggleTypeSelection(type.value)}>
                  <Text style={[styles.typeChipText, selectedTypes.includes(type.value) && styles.typeChipTextSelected]}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Data de Início</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => { setDatePickerTarget('start'); setDatePickerVisible(true); }}>
                  <Text>{startDate ? format(startDate, 'dd/MM/yyyy') : 'DD/MM/YYYY'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Data de Fim</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => { setDatePickerTarget('end'); setDatePickerVisible(true); }}>
                  <Text>{endDate ? format(endDate, 'dd/MM/yyyy') : 'DD/MM/YYYY'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View style={styles.modalFooter}><Button title="Aplicar Filtros" onPress={handleApplyFilters} color="#009C3B" /></View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />

      <Modal animationType="slide" visible={isPoliticianModalVisible} onRequestClose={() => setPoliticianModalVisible(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Político</Text>
            <TouchableOpacity onPress={() => setPoliticianModalVisible(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
          </View>
          <TextInput style={styles.searchInput} placeholder="Buscar por nome..." value={politicianSearch} onChangeText={setPoliticianSearch} />
          <FlatList
            data={filteredPoliticians}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.politicianItem} onPress={() => { setSelectedPolitician(item); setPoliticianModalVisible(false); }}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {isLoading ? (
          <FiscalizaLoading message="Carregando..." />
      ) : propositions.length === 0 ? (
        <View style={styles.emptyContainer}><Text style={styles.emptyText}>Nenhuma proposição encontrada.</Text></View>
      ) : (
        <FlatList
          data={propositions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
              <View style={styles.itemHeader}>
                <Chip text={item.type} color={getColorForType(item.type)} />
                <Text style={styles.typeDescription} numberOfLines={1} ellipsizeMode='tail'>{`${item.typeDescription} ${item.number}/${item.year}`}</Text>
                <Text style={styles.date}>{format(parseISO(item.presentationDate), 'dd/MM/yyyy')}</Text>
              </View>
              <Text style={styles.summary} numberOfLines={3}>{item.summary}</Text>
              <Text style={styles.appreciationStatus}>{`Apreciação: ${item.statusAppreciation}`}</Text>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={isRefetching && !isFetchingNextPage} onRefresh={onRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333333' },
  filterIconContainer: {
    padding: 4,
    borderRadius: 8,
  },
  filterIconActive: {
    backgroundColor: '#009C3B',
  },
  listContent: { padding: 16 },
  item: { backgroundColor: '#FFFFFF', padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  typeDescription: { fontSize: 16, fontWeight: '600', color: '#333333', flex: 1, marginLeft: 8 },
  date: { fontSize: 12, color: '#999999' },
  summary: { fontSize: 14, color: '#666666', lineHeight: 20 },
  appreciationStatus: { fontSize: 12, color: '#666', marginTop: 8, fontStyle: 'italic' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, color: '#666666', textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '85%', backgroundColor: '#F5F5F5', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, elevation: 20 },
  modalHandle: { width: 40, height: 5, backgroundColor: '#CCC', borderRadius: 2.5, alignSelf: 'center', marginBottom: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  clearButton: { fontSize: 14, color: '#009C3B' },
  modalContent: { flex: 1, marginTop: 10 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { height: 45, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFF', justifyContent: 'center' },
  typesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  typeChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E0E0E0', marginRight: 8, marginBottom: 8 },
  typeChipSelected: { backgroundColor: '#009C3B' },
  typeChipText: { color: '#333' },
  typeChipTextSelected: { color: '#FFF' },
  dateInput: { height: 45, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#FFF' },
  modalFooter: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  searchInput: { margin: 16, height: 45, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFF' },
  politicianItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  chip: { borderRadius: 16, paddingVertical: 4, paddingHorizontal: 12, marginRight: 8 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
});
