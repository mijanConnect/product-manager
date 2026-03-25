import { useMemo } from 'react';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductsByCategoryQuery,
} from '../services/productsApi';

interface UseProductsParams {
  limit?: number;
  skip?: number;
}

interface UseProductsFilterParams {
  category: string;
  limit?: number;
  skip?: number;
}

export const useProducts = (params: UseProductsParams = {}) => {
  const { limit = 10, skip = 0 } = params;
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    limit,
    skip,
  });

  return useMemo(
    () => ({
      products: data?.products || [],
      total: data?.total || 0,
      isLoading,
      error,
      refetch,
      limit,
      skip,
    }),
    [data, isLoading, error, refetch, limit, skip]
  );
};

export const useProductSearch = (query: string) => {
  const { data, isLoading, error } = useSearchProductsQuery(query, {
    skip: !query || query.trim().length === 0,
  });

  return useMemo(
    () => ({
      products: data?.products || [],
      total: data?.total || 0,
      isLoading,
      error,
    }),
    [data, isLoading, error]
  );
};

export const useProductsByCategory = (params: UseProductsFilterParams) => {
  const { category, limit = 10, skip = 0 } = params;
  const { data, isLoading, error } = useGetProductsByCategoryQuery(
    { category, limit, skip },
    { skip: !category }
  );

  return useMemo(
    () => ({
      products: data?.products || [],
      total: data?.total || 0,
      isLoading,
      error,
      limit,
      skip,
    }),
    [data, isLoading, error, limit, skip]
  );
};
