import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Linking } from 'react-native';
import { useRoute } from '@/navigation/routerShim';
import { RootStackParamList } from '@/types/navigation';
import { dataService } from '@/services/dataService';
import { ExpenseDto } from '@/types/api';
import { Card, Paragraph, Title, Button } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import FiscalizaLoading from "@/components/FiscalizaLoading";

type PoliticianExpensesRouteParams = { politicianId: number };

export function PoliticianExpensesScreen() {
  const route = useRoute<PoliticianExpensesRouteParams>();
  const { politicianId } = route.params;

  const [expenses, setExpenses] = useState<ExpenseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadExpenses = useCallback(async (isInitialLoad = false) => {
    if (loading || loadingMore) return <FiscalizaLoading message="Carregando..." />;
    if (!isInitialLoad && page >= totalPages) return;

    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    const nextPage = isInitialLoad ? 0 : page;

    try {
      const response = await dataService.getPoliticianExpenses(politicianId, { page: nextPage, size: 10 });
      setExpenses(prev => isInitialLoad ? response.data : [...prev, ...response.data]);
      setTotalPages(response.totalPages);
      setPage(nextPage + 1);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [loading, loadingMore, page, totalPages, politicianId]);

  useEffect(() => {
    loadExpenses(true);
  }, [politicianId]);

  const handleDownload = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const renderItem = ({ item }: { item: ExpenseDto }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.cardTitle}>{item.expenseType}</Title>
        <Paragraph>Fornecedor: {item.supplier}</Paragraph>
        <Paragraph>Valor: R$ {item.netValue}</Paragraph>
        <Paragraph>
          Data: {item.documentDate ? format(parseISO(item.documentDate), 'dd/MM/yyyy') : `${item.month}/${item.year}`}
        </Paragraph>
      </Card.Content>
      {item.documentUrl && (
        <Card.Actions>
          <Button
            icon="download"
            mode="contained"
            onPress={() => handleDownload(item.documentUrl)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Baixar Nota Fiscal
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  if (loading && page === 0) {
    return <ActivityIndicator style={styles.loader} size="large" color="#009C3B" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={() => loadExpenses()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.loader} size="large" color="#009C3B" /> : null}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#009C3B',
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
});
