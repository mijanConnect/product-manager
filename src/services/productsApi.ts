import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product, ProductsResponse, Category } from "../types";

const BASE_URL = "https://dummyjson.com";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
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
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
