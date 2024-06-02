import React, { createContext, useContext, useState } from 'react';
import { Category } from '../types/Category';

interface FilterContextType {
  filters: {
    searchQuery: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    selectedCategories: Category[];
    selectedMaterials: string[];
  };
  applyFilters: (searchQuery: string, minPrice: number | undefined, maxPrice: number | undefined, selectedCategories: Category[], selectedMaterials: string[]) => void;
  resetFilters: () => void;
}

const defaultContextValue: FilterContextType = {
  filters: {
    searchQuery: '',
    minPrice: undefined,
    maxPrice: undefined,
    selectedCategories: [],
    selectedMaterials: []
  },
  applyFilters: () => {},
  resetFilters: () => {}
};

const FilterContext = createContext<FilterContextType>(defaultContextValue);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    selectedCategories: [] as Category[],
    selectedMaterials: [] as string[],
  });

  const applyFilters = (searchQuery: string, minPrice: number | undefined, maxPrice: number | undefined, selectedCategories: Category[], selectedMaterials: string[]) => {
    setFilters({ searchQuery, minPrice, maxPrice, selectedCategories, selectedMaterials });
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      minPrice: undefined,
      maxPrice: undefined,
      selectedCategories: [],
      selectedMaterials: [],
    });
  };

  return (
    <FilterContext.Provider value={{ filters, applyFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);

