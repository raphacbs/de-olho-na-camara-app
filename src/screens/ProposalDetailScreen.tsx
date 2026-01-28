import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Linking, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// use shim
import { useRoute, useNavigation } from '@/navigation/routerShim';
import { PoliticianDto, PropositionDto } from '@/types/api';
import { format, parseISO } from 'date-fns';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export function ProposalDetailScreen() {
  const route = useRoute<{ proposal: PropositionDto }>();
  const navigation = useNavigation();
  const { proposal } = route.params;
  const [authorSearch, setAuthorSearch] = useState('');

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const handlePoliticianPress = (politician: PoliticianDto) => {
    // @ts-ignore
    navigation.navigate('PoliticianDetails', { id: politician.id });
  };

  const uniqueAuthors = useMemo(() => {
    const seen = new Set<number>();
    return proposal.politicians?.filter((p: PoliticianDto) => {
      const duplicate = seen.has(p.id);
      seen.add(p.id);
      return !duplicate;
    }) || [];
  }, [proposal.politicians]);

  const filteredAuthors = uniqueAuthors.filter((p: PoliticianDto) =>
    p.name.toLowerCase().includes(authorSearch.toLowerCase()) ||
    p.party.toLowerCase().includes(authorSearch.toLowerCase()) ||
    p.state.toLowerCase().includes(authorSearch.toLowerCase())
  );

  const data = [
    { type: 'summary', title: 'Ementa', content: proposal.summary },
    { type: 'detailedSummary', title: 'Ementa Detalhada', content: proposal.detailedSummary },
    { type: 'status', title: 'Situação', content: `${proposal.statusSituationDescription} - ${proposal.statusTramitationDescription}` },
    { type: 'appreciation', title: 'Apreciação', content: proposal.statusAppreciation },
    { type: 'dispatch', title: 'Despacho', content: proposal.statusDispatch },
    { type: 'link', title: 'Inteiro Teor', content: proposal.urlInteiroTeor },
    { type: 'authors', title: 'Autores', content: filteredAuthors },
  ];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'authors') {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>{`${item.title} (${filteredAuthors.length})`}</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome, partido ou estado..."
                value={authorSearch}
                onChangeText={setAuthorSearch}
              />
              {authorSearch.length > 0 && (
                <TouchableOpacity onPress={() => setAuthorSearch('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={styles.authorsScrollView} nestedScrollEnabled={true}>
              {filteredAuthors.length > 0 ? (
                filteredAuthors.map((author: PoliticianDto, index: number) => (
                  <TouchableOpacity key={`${author.id}-${index}`} onPress={() => handlePoliticianPress(author)}>
                    <View style={styles.authorContainer}>
                      <Image source={{ uri: author.photoUrl }} style={styles.authorImage} />
                      <View>
                        <Text style={styles.authorName}>{author.name}</Text>
                        <Text style={styles.authorParty}>{`${author.party}-${author.state}`}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>Nenhum autor encontrado.</Text>
              )}
            </ScrollView>
          </Card.Content>
        </Card>
      );
    }
    if (item.type === 'link' && item.content) {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity onPress={() => openLink(item.content)}>
              <Text style={styles.label}>{item.title}</Text>
              <Text style={[styles.value, styles.link]}>Visualizar documento</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      );
    }
    if (item.content && item.type !== 'authors') {
      return (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>{item.title}</Text>
            <Text style={styles.value}>{item.content}</Text>
          </Card.Content>
        </Card>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{`${proposal.typeDescription} ${proposal.number}/${proposal.year}`}</Text>
        <Text style={styles.date}>{`Apresentada em: ${format(parseISO(proposal.presentationDate), 'dd/MM/yyyy')}`}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + index}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333333', textAlign: 'center' },
  date: { fontSize: 14, color: '#666', marginTop: 4, textAlign: 'center' },
  contentContainer: { padding: 16 },
  card: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333333', marginBottom: 8 },
  value: { fontSize: 14, color: '#666666', lineHeight: 20 },
  link: { color: '#009C3B', textDecorationLine: 'underline' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  searchInput: { flex: 1, height: 40, borderColor: '#DDD', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: '#FFF' },
  clearButton: { position: 'absolute', right: 10 },
  authorsScrollView: { maxHeight: 250 },
  authorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingVertical: 4 },
  authorImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  authorName: { fontSize: 14, fontWeight: '600' },
  authorParty: { fontSize: 12, color: '#666' },
  noResultsText: { textAlign: 'center', color: '#666', marginTop: 20 },
});
