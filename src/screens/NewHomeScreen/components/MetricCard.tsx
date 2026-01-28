import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor: string;
  fontScale: number;
}

export const MetricCard = ({
  label,
  value,
  icon,
  backgroundColor,
  fontScale,
}: MetricCardProps) => (
  <View
    accessible
    accessibilityRole="summary"
    accessibilityLabel={`${label}: ${value}`}
    style={[styles.card, { backgroundColor }]}
  >
    <View style={styles.icon}>{icon}</View>
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.4}
      style={[styles.value, { fontSize: 22 * fontScale }]}
    >
      {value}
    </Text>
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.3}
      style={[styles.label, { fontSize: 13 * fontScale }]}
    >
      {label}
    </Text>
  </View>
);

export const MetricCardSkeleton = () => (
  <View style={[styles.card, styles.skeleton]} />
);
