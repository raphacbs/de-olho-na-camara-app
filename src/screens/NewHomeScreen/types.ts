import React from 'react';

export interface MetricConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  backgroundColor: string;
}

export interface MetricData {
  key: string;
  value: string | number;
}
