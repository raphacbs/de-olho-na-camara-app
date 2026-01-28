/**
 * Exemplo de uso do sistema de autenticação
 * Este arquivo demonstra como usar o AuthContext e authService
 * com o formato correto da API BFF
 */

import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export function AuthExample() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Simula login com credenciais de teste
      await login({
        email: 'admin@email.com',
        password: 'password123'
      });

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Simula cadastro
      await register({
        email: 'novo@email.com',
        password: 'senha123',
        fullName: 'Novo Usuário'
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Deseja sair da conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            logout();
            Alert.alert('Sucesso', 'Logout realizado!');
          }
        }
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Exemplo de Autenticação
      </Text>

      {isAuthenticated ? (
        <View>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            ✅ Usuário autenticado!
          </Text>
          <Text>Email: {user?.email}</Text>
          <Text>Nome: {user?.name || 'Não informado'}</Text>
          <Text>ID: {user?.id}</Text>

          <View style={{ marginTop: 20 }}>
            <Button
              title="Logout"
              onPress={handleLogout}
              color="#dc3545"
            />
          </View>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            ❌ Usuário não autenticado
          </Text>

          <View style={{ marginTop: 10 }}>
            <Button
              title={loading ? "Processando..." : "Fazer Login"}
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button
              title={loading ? "Processando..." : "Cadastrar"}
              onPress={handleRegister}
              disabled={loading}
              color="#28a745"
            />
          </View>
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 14, color: '#666' }}>
          📋 Formato esperado da API BFF:
        </Text>
        <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
          {JSON.stringify({
            accessToken: "eyJhbGciOiJIUzUxMiJ9...",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9...",
            tokenType: "JWT",
            expireIn: 31
          }, null, 2)}
        </Text>
      </View>
    </View>
  );
}
