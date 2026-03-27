import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GreetingHeaderProperties } from '@/types/sdui';

interface GreetingHeaderProps {
  id?: string;
  type?: string;
  properties?: GreetingHeaderProperties;
}

/**
 * SDUI component for the GREETING_HEADER type.
 * Renders a personalised greeting and a subtitle line.
 */
export function GreetingHeader({ properties }: GreetingHeaderProps) {
  if (!properties) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{properties.greeting}</Text>
      <Text style={styles.subtitle}>{properties.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
    marginBottom: 8,
  },
});
