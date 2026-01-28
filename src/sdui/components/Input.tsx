import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { InputComponent } from '@/types/sdui';

interface InputProps extends InputComponent {
  onValueChange?: (value: string) => void;
  onValidationError?: (error: string | null) => void;
}

export function Input({
  placeholder,
  value: initialValue = '',
  inputType = 'text',
  disabled = false,
  required = false,
  validation,
  onValueChange,
  onValidationError,
  style,
  ...props
}: InputProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Mapeia inputType para keyboardType
  const getKeyboardType = (): KeyboardTypeOptions => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'numeric';
      case 'password':
        return 'default'; // password será tratado com secureTextEntry
      default:
        return 'default';
    }
  };

  // Validação básica
  const validate = (text: string): string | null => {
    if (required && !text.trim()) {
      return 'Este campo é obrigatório';
    }

    if (validation) {
      if (validation.minLength && text.length < validation.minLength) {
        return `Mínimo de ${validation.minLength} caracteres`;
      }

      if (validation.maxLength && text.length > validation.maxLength) {
        return `Máximo de ${validation.maxLength} caracteres`;
      }

      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(text)) {
          return 'Formato inválido';
        }
      }
    }

    // Validações específicas por tipo
    if (inputType === 'email' && text) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        return 'Email inválido';
      }
    }

    return null;
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    onValueChange?.(text);

    // Validação em tempo real
    const validationError = validate(text);
    setError(validationError);
    onValidationError?.(validationError);
  };

  // Não repassamos `onChange` (TextInput espera um evento). Extrair e não encaminhar.
  const { onChange: _onChange, ...nativeProps } = props as any;

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        keyboardType={getKeyboardType()}
        secureTextEntry={inputType === 'password'}
        autoCapitalize={inputType === 'email' ? 'none' : 'sentences'}
        autoCorrect={inputType !== 'password'}
        editable={!disabled}
        onChangeText={handleChangeText}
        {...nativeProps}
      />

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
  },
});