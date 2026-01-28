import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigationData } from '@/sdui/hooks/useNavigationData';
import { useSDUIActions } from '@/sdui/hooks/useSDUIActions';
import { PropositionDto, PoliticianDto } from '@/types/api';

type NavParams = {
  propositionId?: string;
  deputyId?: string;
  screen?: string;
};

/**
 * Exemplo de como implementar uma tela que recebe dados de navegação
 * Este arquivo serve como referência para implementar telas que precisam
 * de dados passados via navegação SDUI
 */
export function NavigationDataExample(): React.ReactElement {
  const { params, getParam, routeName } = useNavigationData<NavParams>();
  const { getNavigationData } = useSDUIActions();

  // Exemplos de como acessar diferentes tipos de dados:

  // 1. Parâmetros diretos da navegação
  const propositionId = getParam('propositionId');
  const deputyId = getParam('deputyId');
  const screen = getParam('screen');

  // 2. Dados armazenados no contexto (útil para objetos complexos)
  const propositionData = propositionId ? getNavigationData<PropositionDto>(`proposition_${propositionId}`) ?? null : null;
  const deputyData = deputyId ? getNavigationData<PoliticianDto>(`deputy_${deputyId}`) ?? null : null;

  // 3. Simular chamada de API usando os dados
  React.useEffect(() => {
    if (propositionId) {
      console.log('Fazer chamada de API para proposição:', propositionId);
      console.log('Dados da proposição:', propositionData);

      // Exemplo de chamada de API:
      // fetchPropositionDetails(propositionId)
      //   .then(data => setPropositionDetails(data));
    }

    if (deputyId) {
      console.log('Fazer chamada de API para deputado:', deputyId);
      console.log('Dados do deputado:', deputyData);

      // Exemplo de chamada de API:
      // fetchDeputyDetails(deputyId)
      //   .then(data => setDeputyDetails(data));
    }
  }, [propositionId, deputyId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados de Navegação Recebidos</Text>

      <Text style={styles.subtitle}>Tela atual: {String(routeName ?? '')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parâmetros diretos:</Text>
        <Text>Proposition ID: {propositionId || 'Nenhum'}</Text>
        <Text>Deputy ID: {deputyId || 'Nenhum'}</Text>
        <Text>Screen: {screen || 'Nenhum'}</Text>
      </View>

      {propositionData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da Proposição:</Text>
          <Text>Título: {propositionData.summary}</Text>
          <Text>Tipo: {propositionData.typeDescription || propositionData.type}</Text>
          <Text>Ano: {propositionData.year}</Text>
          <Text>Status: {String(propositionData.status?.toString?.() ?? JSON.stringify(propositionData.status))}</Text>
        </View>
      )}

      {deputyData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Deputado:</Text>
          <Text>Nome: {deputyData.name}</Text>
          <Text>Partido: {deputyData.party}</Text>
          <Text>Estado: {deputyData.state}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todos os parâmetros:</Text>
        <Text>{JSON.stringify(params, null, 2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});
