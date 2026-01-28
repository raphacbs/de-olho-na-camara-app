import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SDUIError } from '@/types/sdui';

interface LoadingScreenProps {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

/**
 * Componente de loading genérico para telas SDUI
 */
export function LoadingScreen({
  message = 'Carregando...',
  color = '#009C3B',
  size = 'large',
  fullScreen = true
}: LoadingScreenProps) {
  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.inlineContainer;

  const content = (
    <View style={styles.content}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[styles.message, { color }]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <SafeAreaView style={containerStyle} edges={['top']}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyle}>
      {content}
    </View>
  );
}

interface ErrorScreenProps {
  error: SDUIError;
  onRetry?: () => void;
  fullScreen?: boolean;
}

/**
 * Componente de erro genérico para telas SDUI
 */
export function ErrorScreen({ error, onRetry, fullScreen = true }: ErrorScreenProps) {
  const containerStyle = fullScreen
    ? styles.fullScreenContainer
    : styles.inlineContainer;

  const content = (
    <View style={styles.content}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorEmoji}>⚠️</Text>
      </View>

      <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>

      <Text style={styles.errorMessage}>
        {error.message}
      </Text>

      {error.code && (
        <Text style={styles.errorCode}>
          Código: {error.code}
        </Text>
      )}

      {error.retry && onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <SafeAreaView style={containerStyle} edges={['top']}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View style={containerStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  inlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  errorCode: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#009C3B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
