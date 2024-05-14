import {useQuery} from '@tanstack/react-query';
import apiClient from '../apiClient';
import {Product} from '../types/Product';

interface SearchParams {
  searchText?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  inStock?: boolean;
  materials?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useSearchProducts = ({
  searchText,
  minPrice,
  maxPrice,
  categories,
  inStock,
  materials,
  sortBy,
  sortOrder,
}: SearchParams) => {
  console.log('SearchParams:', {
    searchText,
    minPrice,
    maxPrice,
    categories,
    inStock,
    materials,
    sortBy,
    sortOrder,
  });
  return useQuery<Product[], Error>({
    queryKey: [
      'searchProducts',
      {
        searchText,
        minPrice,
        maxPrice,
        categories,
        inStock,
        materials,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: () =>
      apiClient
        .get('/api/products/search', {
          params: {
            searchText,
            minPrice,
            maxPrice,
            categories: categories?.join(','),
            inStock,
            materials: materials?.join(','),
            sortBy,
            sortOrder,
          },
        })
        .then(res => {
          console.log('API Response:', res.data.results);
          return res.data.results;
        }),
  });
};
