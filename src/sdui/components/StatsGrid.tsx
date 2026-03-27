import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { StatsGridProperties, BFFStatCardItem } from '@/types/sdui';
import { useSDUIActionsContext } from '../SDUIActionsContext';

interface StatsGridProps {
  id?: string;
  type?: string;
  properties?: StatsGridProperties;
}

const SMALL_SCREEN_BREAKPOINT = 360;

function StatCard({ item }: { item: BFFStatCardItem }) {
  const { handleAction } = useSDUIActionsContext();

  const onPress = () => {
    if (item.action) {
      handleAction('NAVIGATE', { route: item.action.route });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.backgroundColor }]}
      onPress={onPress}
      activeOpacity={item.action ? 0.7 : 1}
      accessibilityRole={item.action ? 'button' : 'none'}
      accessibilityLabel={`${item.label}: ${item.value}`}
    >
      <Text style={styles.value}>{item.value}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );
}

/**
 * SDUI component for the STATS_GRID type.
 * Renders a 2-column grid of coloured stat cards from the BFF.
 */
export function StatsGrid({ properties }: StatsGridProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width < SMALL_SCREEN_BREAKPOINT ? '100%' : '48%';

  if (!properties?.items?.length) return null;

  return (
    <View style={styles.grid}>
      {properties.items.map((item) => (
        <View key={item.id} style={{ width: cardWidth }}>
          <StatCard item={item} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    minHeight: 90,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.95,
  },
});
