export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  images: string[];
  thumbnail: string;
  discountPercentage?: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  returnPolicy?: string;
  availabilityStatus?: string;
  reviews?: Review[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url?: string;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface FormValues {
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  brand?: string;
  discountPercentage?: number;
}
