import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SectionHeaderWithBadgeProperties } from '@/types/sdui';
import { useSDUIActionsContext } from '../SDUIActionsContext';

interface SectionHeaderWithBadgeProps {
  id?: string;
  type?: string;
  properties?: SectionHeaderWithBadgeProperties;
}

/**
 * SDUI component for the SECTION_HEADER_WITH_BADGE type.
 * Renders a section title with an optional count badge and an action button.
 */
export function SectionHeaderWithBadge({ properties }: SectionHeaderWithBadgeProps) {
  const { handleAction } = useSDUIActionsContext();

  if (!properties) return null;

  const onPress = () => {
    if (properties.action) {
      handleAction('NAVIGATE', { route: properties.action.route });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{properties.title}</Text>
        {properties.badgeCount > 0 ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: properties.badgeBackgroundColor || '#E65100' },
            ]}
          >
            <Text style={styles.badgeText}>{properties.badgeCount}</Text>
          </View>
        ) : null}
      </View>
      {properties.action ? (
        <TouchableOpacity
          onPress={onPress}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="Ver todos"
        >
          <Text style={styles.actionText}>Ver todos</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    color: '#2F6FED',
    fontWeight: '600',
    fontSize: 14,
  },
});
