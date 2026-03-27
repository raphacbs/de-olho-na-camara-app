import React from 'react';
import { YearFilter } from '@/components/YearFilter';
import { YearSelectorBannerProperties } from '@/types/sdui';

interface YearSelectorBannerProps {
  id?: string;
  type?: string;
  properties?: YearSelectorBannerProperties;
}

/**
 * SDUI component for the YEAR_SELECTOR_BANNER type.
 * Wraps the existing YearFilter component so the BFF can control
 * the year-selector section declaratively.
 */
export function YearSelectorBanner(_props: YearSelectorBannerProps) {
  return <YearFilter />;
}
