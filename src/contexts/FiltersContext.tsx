import React, { createContext, useContext, useState, ReactNode } from 'react';

type FiltersState = {
  year: number | null;
  setYear: (y: number | null) => void;
  allowedYears: number[];
  toggleAllowedYear: (y: number) => void;
  setAllowedYears: (years: number[]) => void;
};

const defaultState: FiltersState = {
  year: null,
  setYear: () => {},
  allowedYears: [],
  toggleAllowedYear: () => {},
  setAllowedYears: () => {},
};

export const FiltersContext = createContext<FiltersState>(defaultState);

export function FiltersProvider({ children }: { children: ReactNode }) {
  // determine current year dynamically
  const currentYear = new Date().getFullYear();

  // Default allowed years (initial available options) - keep project's previous defaults but ensure current year included
  const baseAllowed = [2025, 2026];
  const initialAllowed = Array.from(new Set([...baseAllowed, currentYear])).sort((a, b) => a - b);

  // Default selected year: current year
  const [year, setYear] = useState<number | null>(currentYear);

  const [allowedYears, setAllowedYears] = useState<number[]>(initialAllowed);

  const toggleAllowedYear = (y: number) => {
    setAllowedYears((prev) => {
      if (prev.includes(y)) {
        const next = prev.filter((v) => v !== y);
        // If the currently selected year was disabled, reset selection to currentYear or null
        if (year === y) {
          // prefer to keep currentYear selected if still allowed, otherwise clear
          if (next.includes(currentYear)) {
            setYear(currentYear);
          } else {
            setYear(null);
          }
        }
        return next;
      }
      return [...prev, y].sort((a, b) => a - b);
    });
  };

  return (
    <FiltersContext.Provider value={{ year, setYear, allowedYears, toggleAllowedYear, setAllowedYears }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
