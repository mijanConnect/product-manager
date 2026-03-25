import type { FormValues, Product } from '../types';

export const validateProductForm = (values: FormValues): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.title || values.title.trim().length === 0) {
    errors.title = 'Product title is required';
  } else if (values.title.length < 3) {
    errors.title = 'Product title must be at least 3 characters';
  } else if (values.title.length > 100) {
    errors.title = 'Product title must not exceed 100 characters';
  }

  if (!values.description || values.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (values.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (values.description.length > 500) {
    errors.description = 'Description must not exceed 500 characters';
  }

  if (!values.price || values.price <= 0) {
    errors.price = 'Price must be greater than 0';
  } else if (values.price > 1000000) {
    errors.price = 'Price cannot exceed 1,000,000';
  }

  if (!values.category || values.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (values.rating < 0 || values.rating > 5) {
    errors.rating = 'Rating must be between 0 and 5';
  }

  if (values.stock < 0) {
    errors.stock = 'Stock cannot be negative';
  } else if (!Number.isInteger(values.stock)) {
    errors.stock = 'Stock must be a whole number';
  }

  if (values.discountPercentage && (values.discountPercentage < 0 || values.discountPercentage > 100)) {
    errors.discountPercentage = 'Discount percentage must be between 0 and 100';
  }

  return errors;
};

export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getInitialFormValues = (product?: Product): FormValues => {
  if (product) {
    return {
      title: product.title,
      description: product.description,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      discountPercentage: product.discountPercentage,
    };
  }

  return {
    title: '',
    description: '',
    price: 0,
    rating: 0,
    stock: 0,
    category: '',
    brand: '',
    discountPercentage: 0,
  };
};
