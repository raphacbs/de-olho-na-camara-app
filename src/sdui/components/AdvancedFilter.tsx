import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Modal, SafeAreaView } from 'react-native';
import {
  Text, Button, Chip, Searchbar, Divider, IconButton, useTheme,
} from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '@/types/navigation';
import { useSDUIActionsContext } from '../SDUIActionsContext'; // <--- SEU CONTEXTO
import { useScreenParams } from '../ScreenParamsContext';

// --- Tipos ---
type FilterOption = { id: string; label: string; selected: boolean };
type FilterSection = {
  id: string;
  title: string;
  type: 'single' | 'multi';
  options: FilterOption[];
};

interface AdvancedFilterProps {
  id?: string;
  triggerLabel?: string; // Texto do botão que abre o filtro
  title?: string;
  primaryColor?: string;
  searchPlaceholder?: string;
  sections?: FilterSection[];
  applyActionId?: string; // ID da ação no useSDUIActions (ex: 'filter_apply')
  actionParams?: Record<string, unknown>; // Parâmetros extras
  props?: { // Propriedades específicas vindas do JSON
    searchPlaceholder?: string;
    primaryColor?: string;
    applyActionId?: string;
    triggerLabel?: string;
    sections?: FilterSection[];
  };
}

export function AdvancedFilter(props: AdvancedFilterProps) {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { handleAction } = useSDUIActionsContext(); // <--- USANDO SEU HOOK
  const { getScreenParams, updateScreenParams } = useScreenParams();

  // Extrair propriedades de props ou usar diretamente
  const searchPlaceholder = props.props?.searchPlaceholder || props.searchPlaceholder;
  const primaryColor = props.props?.primaryColor || props.primaryColor;
  const applyActionId = props.props?.applyActionId || props.applyActionId;
  const triggerLabel = props.props?.triggerLabel || props.triggerLabel;
  const sections = props.props?.sections || props.sections || [];

  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localSections, setLocalSections] = useState<FilterSection[]>([]);

  const PRIMARY_COLOR = primaryColor || '#009C3B'; // Vermelho iFood padrão

  // Identificar a tela atual baseada na rota atual
  const currentRoute = navigation.getState().routes[navigation.getState().index];
  const currentScreenName = currentRoute?.name;

  // Mapear nomes de tela para IDs de tela no contexto
  const screenIdMap: Record<string, string> = {
    'Proposições': 'propositions',
    'Deputados': 'politicians',
    'Votações': 'votings',
    'Home': 'home',
  };

  const currentScreenId = screenIdMap[currentScreenName as keyof typeof screenIdMap];

  // Verificar se há filtros aplicados na tela atual
  const currentScreenParams = currentScreenId ? getScreenParams(currentScreenId) : undefined;
  const hasAppliedFilters = currentScreenParams && (
    (currentScreenParams.search && currentScreenParams.search.length > 0) ||
    (currentScreenParams.filters && Object.keys(currentScreenParams.filters).length > 0)
  );

  // Sincroniza estado quando abre
  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setLocalSections(JSON.parse(JSON.stringify(sections)));
      setSearchQuery('');
    }
  }, [visible, sections]);

  const toggleOption = (sectionId: string, optionId: string) => {
    setLocalSections(prev => prev.map(section => {
      if (section.id !== sectionId) return section;

      if (section.type === 'single') {
        return {
          ...section,
          options: section.options.map(opt => ({
            ...opt,
            selected: opt.id === optionId
          }))
        };
      } else {
        return {
          ...section,
          options: section.options.map(opt => 
            opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
          )
        };
      }
    }));
  };

  const handleApply = () => {
    // Coleta os IDs selecionados
    const selections: Record<string, string[]> = {};

    localSections.forEach(sec => {
      const selectedIds = sec.options.filter(o => o.selected).map(o => o.id);
      if (selectedIds.length > 0) {
        selections[sec.id] = selectedIds;
      }
    });

    const payload = {
      ...props.actionParams, // Mantém params que vieram do JSON
      search: searchQuery,
      filters: selections
    };

    // Dispara a ação usando sua arquitetura
    handleAction(applyActionId || 'apply_filters', payload);
    setVisible(false);
  };

  const handleClearFilters = () => {
    // Limpar filtros aplicados
    if (currentScreenId) {
      updateScreenParams(currentScreenId, {});
    }
    setVisible(false);
  };

  return (
    <>
      {/* 1. O Gatilho (Botão que aparece na tela) */}
      <View style={styles.triggerContainer}>
        <Button
          mode={hasAppliedFilters ? "contained" : "outlined"}
          icon="filter-variant"
          onPress={() => setVisible(true)}
          buttonColor={hasAppliedFilters ? PRIMARY_COLOR : undefined}
          textColor={hasAppliedFilters ? "#fff" : undefined}
          style={{
            borderColor: hasAppliedFilters ? PRIMARY_COLOR : theme.colors.outline
          }}
        >
          {triggerLabel || 'Filtrar Busca'}
          {hasAppliedFilters && ' ✓'}
        </Button>
      </View>

      {/* 2. O Modal Estilo iFood */}
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          
          <View style={[styles.header, { backgroundColor: PRIMARY_COLOR }]}>
            <IconButton icon="chevron-down" iconColor="#fff" onPress={() => setVisible(false)} />
            <Text variant="titleMedium" style={styles.headerTitle}>{props.title || 'Filtros'}</Text>
            <Button textColor="#fff" onPress={handleClearFilters}>Limpar</Button>
          </View>

          <View style={styles.content}>
            {searchPlaceholder && (
              <View style={styles.searchContainer}>
                <Searchbar
                  placeholder={searchPlaceholder}
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  mode="bar"
                  elevation={0}
                  style={styles.searchBar}
                />
              </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {localSections.map((section) => (
                <View key={section.id} style={styles.sectionContainer}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>{section.title}</Text>
                  
                  <View style={styles.chipsWrapper}>
                    {section.options.map((opt) => (
                      <Chip
                        key={opt.id}
                        selected={opt.selected}
                        showSelectedOverlay
                        onPress={() => toggleOption(section.id, opt.id)}
                        style={[
                          styles.chip,
                          opt.selected 
                            ? { backgroundColor: PRIMARY_COLOR + '20', borderColor: PRIMARY_COLOR } 
                            : { backgroundColor: '#fff', borderColor: '#e0e0e0' }
                        ]}
                        textStyle={{
                          color: opt.selected ? PRIMARY_COLOR : '#555',
                          fontWeight: opt.selected ? '700' : '400'
                        }}
                        mode="outlined"
                      >
                        {opt.label}
                      </Chip>
                    ))}
                  </View>
                  <Divider style={styles.divider} />
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <Button 
              mode="contained" 
              onPress={handleApply}
              buttonColor={PRIMARY_COLOR}
              contentStyle={{ height: 50 }}
              style={{ borderRadius: 8 }}
            >
              Ver Resultados
            </Button>
          </View>

        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerContainer: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 4 },
  headerTitle: { color: '#fff', fontWeight: 'bold' },
  content: { flex: 1 },
  searchContainer: { padding: 16, paddingBottom: 8 },
  searchBar: { backgroundColor: '#f5f5f5' },
  scrollContent: { paddingBottom: 20 },
  sectionContainer: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontWeight: 'bold', color: '#333', marginBottom: 12 },
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 8, borderWidth: 1 },
  divider: { marginTop: 24, backgroundColor: '#eee' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#eee' }
});