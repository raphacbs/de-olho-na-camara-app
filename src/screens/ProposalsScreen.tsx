import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dataService } from '@/services/dataService';
import { PropositionDto } from '@/types/api';

// Como não há um endpoint direto para listar todas as proposições no swagger fornecido,
// vamos assumir que precisamos listar proposições de um político específico ou criar um mock temporário
// ou usar um endpoint de sincronização se disponível.
// Observando o swagger, temos /api/v1/politicians/{id}/propositions.
// Para uma tela geral de proposições, talvez precisemos de um endpoint diferente ou listar de vários.
// Vou criar uma estrutura básica que pode ser adaptada. Por enquanto, vou deixar um placeholder
// ou tentar buscar de um político "exemplo" se não houver endpoint geral.
// O usuário pediu para remover SDUI. Vou manter a estrutura de tela nativa.

// NOTA: O swagger não mostra um endpoint GET /api/v1/propositions geral.
// Apenas /api/v1/politicians/{id}/propositions.
// Vou deixar a tela com uma mensagem ou buscar de um ID fixo para demonstração,
// ou talvez o usuário queira implementar a busca geral no BFF depois.
// Vou assumir que por enquanto vamos listar proposições de um deputado aleatório ou deixar vazio.

export function ProposalsScreen() {
  const [propositions, setPropositions] = useState<PropositionDto[]>([]);
  const [loading, setLoading] = useState(false); // Inicialmente false pois não temos endpoint geral
  const [refreshing, setRefreshing] = useState(false);

  const fetchPropositions = async () => {
    // TODO: Implementar endpoint geral de proposições no BFF ou ajustar lógica
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPropositions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPropositions();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009C3B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Proposições</Text>
      </View>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Selecione um deputado para ver suas proposições ou aguarde a implementação da busca geral.
        </Text>
      </View>
      {/*
      <FlatList
        data={propositions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.type}>{item.typeDescription} {item.number}/{item.year}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
      */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  listContent: {
    padding: 16,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
