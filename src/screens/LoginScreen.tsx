import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/Input';

interface LoginFormData {
  email: string;
  password: string;
  fullName?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  general?: string;
}

export function LoginScreen() {
  const { login, register, isLoading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha
    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validar nome no modo cadastro
    if (!isLoginMode && !formData.fullName?.trim()) {
      newErrors.fullName = 'Nome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setErrors({}); // Limpar erros anteriores

      if (isLoginMode) {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email.trim(),
          password: formData.password,
          fullName: formData.fullName?.trim() || '',
        });
      }
    } catch (error) {
      console.error('❌ Erro capturado na tela de login:', error);

      let errorMessage = 'Erro desconhecido';

      if (error instanceof Error) {
        errorMessage = error.message;

        // Logs específicos para diferentes tipos de erro
        if (error.message.includes('Network request failed')) {
          console.error('🌐 Erro de rede detectado - possível problema de conectividade');
          console.error('💡 Verifique se o servidor está rodando e acessível');
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('timeout')) {
          console.error('⏱️ Timeout na requisição');
          errorMessage = 'Tempo limite excedido. Tente novamente.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          console.error('🔐 Erro de autenticação');
          errorMessage = 'Credenciais inválidas. Verifique email e senha.';
        }
      }

      setErrors({ general: errorMessage });
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
    // Preservar email e senha ao alternar entre modos
    setFormData(prev => ({
      email: prev.email,
      password: prev.password,
      fullName: isLoginMode ? '' : prev.fullName, // Limpar fullName apenas quando vai para cadastro
    }));
  };

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🇧🇷</Text>
            <Text style={styles.title}>Fiscaliza Aí</Text>
            <Text style={styles.subtitle}>
              Acompanhe em tempo real as atividades legislativas
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {isLoginMode ? 'Entrar na sua conta' : 'Criar nova conta'}
            </Text>

            {/* Campo Nome (apenas no cadastro) */}
            {!isLoginMode && (
              <Input
                label="Nome completo"
                placeholder="Digite seu nome"
                value={formData.fullName}
                onChangeText={(value) => updateField('fullName', value)}
                error={errors.fullName}
                autoCapitalize="words"
                autoComplete="name"
              />
            )}

            {/* Campo Email */}
            <Input
              label="Email"
              placeholder="Digite seu email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />

            {/* Campo Senha */}
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete={isLoginMode ? "password" : "password-new"}
              autoCorrect={false}
            />

            {/* Erro geral */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {/* Botão Principal */}
            <TouchableOpacity
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              onPress={() => { void handleSubmit(); }}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLoginMode ? 'Entrar' : 'Cadastrar'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle entre Login/Cadastro */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={toggleMode}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>
                {isLoginMode
                  ? 'Não tem conta? Criar agora'
                  : 'Já tem conta? Fazer login'
                }
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009C3B',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F5E8',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#009C3B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#009C3B',
    fontSize: 16,
    fontWeight: '500',
  },
});
