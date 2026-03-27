import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuickAccessGridProperties, BFFQuickAccessItem } from '@/types/sdui';
import { useSDUIActionsContext } from '../SDUIActionsContext';

interface QuickAccessGridProps {
  id?: string;
  type?: string;
  properties?: QuickAccessGridProperties;
}

// Maps BFF icon names (Material icon convention) to emoji fallbacks.
// The app uses Lucide/Ionicons which don't share Material naming, so emojis
// serve as a portable interim solution. TODO: migrate to app icon library if
// the BFF starts sending Ionicons names or a separate icon set is adopted.
const ICON_LABEL_MAP: Record<string, string> = {
  description: '📄',
  how_to_vote: '🗳️',
  people: '👥',
  settings: '⚙️',
};

function QuickAccessItem({ item }: { item: BFFQuickAccessItem }) {
  const { handleAction } = useSDUIActionsContext();

  const onPress = () => {
    if (item.action) {
      handleAction('NAVIGATE', { route: item.action.route });
    }
  };

  const emoji = ICON_LABEL_MAP[item.icon] ?? '▶️';

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );
}

/**
 * SDUI component for the QUICK_ACCESS_GRID type.
 * Renders a labelled grid of quick-navigation buttons.
 */
export function QuickAccessGrid({ properties }: QuickAccessGridProps) {
  if (!properties?.items?.length) return null;

  return (
    <View style={styles.container}>
      {properties.title ? (
        <Text style={styles.title}>{properties.title}</Text>
      ) : null}
      <View style={styles.grid}>
        {properties.items.map((item) => (
          <QuickAccessItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});
