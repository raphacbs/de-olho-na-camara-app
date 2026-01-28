import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { MetricCard, MetricCardSkeleton } from './MetricCard';
import { metricConfig } from '../config';
import { MetricData } from '../types';
import { styles } from '../styles';

interface StatsSessionProps {
  metrics: MetricData[] | undefined;
  isLoading: boolean;
  fontScale: number;
}

export const StatsSession = ({ metrics, isLoading, fontScale }: StatsSessionProps) => {
  const { width } = useWindowDimensions();
  const cardWidth = width < 360 ? '100%' : '48%';
  const data = metrics || [];

  return (
    <View style={styles.grid}>
      {isLoading
        ? metricConfig.map(item => <View key={item.key} style={{ width: cardWidth }}><MetricCardSkeleton /></View>)
        : metricConfig.map(config => {
            const metric = data.find((d: MetricData) => d.key === config.key);
            return (
              <View key={config.key} style={{ width: cardWidth }}>
                <MetricCard
                  label={config.label}
                  value={metric?.value ?? '--'}
                  icon={config.icon}
                  backgroundColor={config.backgroundColor}
                  fontScale={fontScale}
                />
              </View>
            );
          })}
    </View>
  );
};
