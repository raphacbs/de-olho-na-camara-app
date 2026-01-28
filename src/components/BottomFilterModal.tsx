import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Button } from 'react-native';

interface BottomFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: React.ReactNode;
  title?: string;
}

export function BottomFilterModal({
  visible,
  onClose,
  onApply,
  onClear,
  children,
  title = 'Filtros'
}: BottomFilterModalProps) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalContainer}>
        <View style={styles.modalHandle} />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearButton}>Limpar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          {children}
        </ScrollView>
        <View style={styles.modalFooter}>
          <Button title="Aplicar Filtros" onPress={onApply} color="#009C3B" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '85%', backgroundColor: '#F5F5F5', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, elevation: 20 },
  modalHandle: { width: 40, height: 5, backgroundColor: '#CCC', borderRadius: 2.5, alignSelf: 'center', marginBottom: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  clearButton: { fontSize: 14, color: '#009C3B' },
  modalContent: { flex: 1, marginTop: 10 },
  modalFooter: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
});
