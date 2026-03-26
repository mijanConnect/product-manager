import { baseApi } from "./baseApi";
import type { Product, ProductsResponse, Category } from "../types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ProductsResponse,
      { limit?: number; skip?: number }
    >({
      query: ({ limit = 10, skip = 0 }) =>
        `/products?limit=${limit}&skip=${skip}`,
    }),

    searchProducts: builder.query<ProductsResponse, string>({
      query: (query) => `/products/search?q=${query}`,
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),

    getCategories: builder.query<Category[], void>({
      query: () => "/products/categories",
    }),

    getProductsByCategory: builder.query<
      ProductsResponse,
      { category: string; limit?: number; skip?: number }
    >({
      query: ({ category, limit = 10, skip = 0 }) =>
        `/products/category/${category}?limit=${limit}&skip=${skip}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
