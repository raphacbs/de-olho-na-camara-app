import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import * as biometricsService from '@/services/biometrics';
import { authService } from '@/services/authService';

export function SettingsScreen() {
  const { user, logout, disableBiometricLogin, enableBiometricLogin } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const enabled = await biometricsService.isBiometricEnabled();
        setBiometricEnabled(enabled);
      } catch (err) {
        setBiometricEnabled(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => { void logout(); },
        },
      ]
    );
  };

  const toggleBiometric = async (value: boolean) => {
    try {
      if (!value) {
        // disable
        await disableBiometricLogin();
        setBiometricEnabled(false);
      } else {
        // If no user/email available, ask to login first
        if (!user?.email) {
          Alert.alert('Conta não identificada', 'Faça login primeiro para habilitar o login por biometria.');
          return;
        }

        const supported = await biometricsService.isBiometricSupported();
        if (!supported) {
          Alert.alert('Biometria não disponível', 'Este dispositivo não suporta autenticação biométrica ou não há biometria cadastrada.');
          return;
        }

        // Show modal to ask for current password to save credentials
        setPasswordConfirm('');
        setShowPasswordModal(true);
      }
    } catch (err) {
      console.warn('Erro ao alternar biometria:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a configuração de biometria.');
    }
  };

  const handleConfirmPassword = async () => {
    if (!passwordConfirm) {
      Alert.alert('Senha requerida', 'Digite sua senha para confirmar.');
      return;
    }

    try {
      setIsSaving(true);
      // Validate credentials by calling authService.login first (avoids saving incorrect password)
      try {
        await authService.login({ email: user!.email, password: passwordConfirm });
      } catch (err) {
        throw new Error('Senha incorreta');
      }

      // If validation passed, save credentials securely
      await enableBiometricLogin(user!.email, passwordConfirm);
      setBiometricEnabled(true);
      setShowPasswordModal(false);
      Alert.alert('Pronto', 'Login por biometria habilitado.');
    } catch (err) {
      console.warn('Erro ao salvar credenciais biométricas no settings:', err);
      Alert.alert('Erro', 'Não foi possível salvar as credenciais. Verifique sua senha e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPasswordModal = () => {
    setShowPasswordModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Profile Section */}
        <View style={styles.section}>
          <View style={styles.userHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, color: '#333' }}>Login com biometria</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometric}
            />
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versão</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Password modal for enabling biometric from settings */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Confirmar senha</Text>
            <Text style={{ marginBottom: 12 }}>Digite sua senha para salvar as credenciais de login de forma segura.</Text>
            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 12 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={handleCancelPasswordModal} style={{ padding: 8, marginRight: 8 }}>
                <Text style={{ color: '#666' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmPassword} style={{ padding: 8 }}>
                <Text style={{ color: '#009C3B', fontWeight: '600' }}>{isSaving ? 'Salvando...' : 'Confirmar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#009C3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666666',
  },
});
