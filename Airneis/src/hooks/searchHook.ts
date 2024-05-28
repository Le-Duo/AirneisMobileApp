import {useQuery} from '@tanstack/react-query';
import apiClient from '../apiClient';
import {Product} from '../types/Product';
import { Stock } from '../types/Stock';

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

const fetchStocks = async (productIds: string[]) => {
  const stockPromises = productIds.map(id =>
    apiClient.get(`/api/stocks/products/${id}`)
  );
  const stockResponses = await Promise.all(stockPromises);
  return stockResponses.map(response => response.data);
};

export const useSearchProductsAndStock = ({
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
  return useQuery<[Product[], Stock[]], Error>({
    queryKey: [
      'searchProductsAndStock',
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
    queryFn: async () => {
      console.log('Fetching products with params:', {
        searchText,
        minPrice,
        maxPrice,
        categories,
        inStock,
        materials,
        sortBy,
        sortOrder,
      });
      const productsResponse = await apiClient.get('/api/products/search', {
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
      });

      console.log('Products response:', productsResponse.data);
      const products = productsResponse.data.results;
      console.log('Products:', products);
      const productIds = products.map((product: Product) => product._id);
      console.log('Product IDs:', productIds);
      const stocks = await fetchStocks(productIds);

      console.log('Stocks response:', stocks);
      return [products, stocks];
    },
  });
};

