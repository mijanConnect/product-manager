# Technology Stack Integration Guide

This document explains how **RTK Query**, **Redux Toolkit**, **Tailwind CSS**, and **SCSS** are integrated into this project.

## 1. Redux Toolkit & RTK Query Setup

### Redux Store Configuration
**File:** `src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '../services/productsApi';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Key Points:**
- Uses `configureStore` from Redux Toolkit for simplified setup
- Integrates RTK Query reducer and middleware
- Provides proper TypeScript typing with `RootState` and `AppDispatch`

### RTK Query API Slice
**File:** `src/services/productsApi.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsResponse } from '../types';

const BASE_URL = 'https://dummyjson.com';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, { limit?: number; skip?: number }>({
      query: ({ limit = 10, skip = 0 }) =>
        `/products?limit=${limit}&skip=${skip}`,
    }),
    
    searchProducts: builder.query<ProductsResponse, string>({
      query: (query) => `/products/search?q=${query}`,
    }),
    
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),
    
    getCategories: builder.query<string[], void>({
      query: () => '/products/categories',
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
```

**Key Points:**
- Uses `createApi` for REST API handling
- Automatic caching and synchronization
- Generated hooks for each endpoint
- Type-safe queries with TypeScript

### Provider Setup
**File:** `src/main.tsx`

```typescript
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

---

## 2. Tailwind CSS Integration

### Configuration
**File:** `tailwind.config.ts`

```typescript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        success: '#52c41a',
        warning: '#faad14',
        error: '#f5222d',
      },
    },
  },
  plugins: [],
}
```

### PostCSS Configuration
**File:** `postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### CSS Entry Point
**File:** `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background-color: #f5f5f5;
}

.ant-layout {
  background-color: #f0f2f5;
}

.ant-btn-primary {
  background-color: #1890ff;
}
```

### Usage in Components
Tailwind CSS classes are used directly in JSX:

```typescript
<div className="p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-3xl font-bold mb-4">Product Management</h1>
  <table className="w-full border-collapse">
    {/* ... */}
  </table>
</div>
```

---

## 3. SCSS Integration

### Global Styles
**File:** `src/styles/globals.scss`

Contains:
- SCSS variables for colors, spacing, shadows
- Useful mixins for responsive design and common patterns
- Base styling for HTML elements
- Animation keyframes

### Component-Specific SCSS Files

#### Product List Styles
**File:** `src/styles/ProductList.scss`

```scss
.product-list-container {
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  
  @include respond-to('mobile') {
    padding: 16px;
  }
  
  .search-wrapper {
    flex: 1;
    min-width: 200px;
    
    input {
      width: 100%;
      &:focus {
        border-color: $primary-color;
      }
    }
  }
}
```

#### Product Details Styles
**File:** `src/styles/ProductDetails.scss`

Includes:
- Product grid layout
- Image gallery styling
- Price and metrics sections
- Responsive dimension cards
- Alert and warning styles

#### Form Styles
**File:** `src/styles/EditProductForm.scss`

Includes:
- Form field styling
- Input focus states and validation
- Error message styling
- Grid-based form layout
- Action button styling
- Responsive form behavior

### SCSS Features Used

1. **Variables**
   ```scss
   $primary-color: #1890ff;
   $text-primary: #1f2937;
   $border-radius: 4px;
   ```

2. **Mixins**
   ```scss
   @mixin respond-to($breakpoint) {
     @if $breakpoint == 'mobile' {
       @media (max-width: 640px) {
         @content;
       }
     }
   }
   ```

3. **Nesting**
   ```scss
   .form-group {
     label { /* ... */ }
     input { /* ... */ }
   }
   ```

4. **Functions & Operators**
   ```scss
   background-color: darken($primary-color, 10%);
   color: rgba(24, 144, 255, 0.2);
   ```

---

## 4. Styled Components Usage

**File:** `src/styles/components.ts`

Styled Components are used for dynamic styling that depends on props:

```typescript
import styled from 'styled-components';

export const ProductContainer = styled.div`
  padding: 24px;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .ant-rate {
    font-size: 22px;
  }
`;
```

---

## 5. Styling Strategy

### Hierarchy
1. **Tailwind CSS** - Utility-first styling for rapid development
2. **SCSS** - Component-scoped styling for complex layouts and state management
3. **Styled Components** - Dynamic styling based on component props
4. **Ant Design** - Pre-built components with consistent styling

### When to Use Each

| Technology | Use Case |
|-----------|----------|
| Tailwind CSS | Quick styling, spacing, colors, responsive helpers |
| SCSS | Complex layouts, reusable mixins, variable organization |
| Styled Components | Dynamic styles based on props, theme switching |
| Ant Design | Pre-built components (Table, Form, Button, etc.) |

### Example: Product Card

```typescript
import styled from 'styled-components';

// Component-specific styled component
const StyledCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

// Component using multiple styling approaches
export const ProductCard = ({ product }) => (
  <StyledCard className="bg-white mb-4">
    {/* Tailwind CSS for layout */}
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">
        {product.title}
      </h3>
    </div>
    
    {/* Ant Design components */}
    <Rate value={product.rating} disabled />
    
    {/* Inline Tailwind for fine-tuning */}
    <p className="text-sm text-gray-600 mt-2">
      {product.description}
    </p>
  </StyledCard>
);
```

---

## 6. RTK Query Usage in Components

### Using Hooks in Components

```typescript
import { useGetProductsQuery } from '../services/productsApi';

export const ProductList = () => {
  const { data, isLoading, error } = useGetProductsQuery({ limit: 10, skip: 0 });
  
  if (isLoading) return <Spin />;
  if (error) return <Alert type="error" message="Failed to load" />;
  
  return (
    <Table
      columns={columns}
      dataSource={data?.products}
      loading={isLoading}
    />
  );
};
```

### Automatic Features
- **Caching** - Same query params return cached results
- **Refetching** - Manual refetch control
- **Polling** - Automatic data refresh
- **Invalidation** - Cache invalidation strategies
- **Error Handling** - Built-in error states
- **Loading States** - Automatic loading indicators

---

## 7. Package Dependencies

### Production Dependencies
```json
{
  "@reduxjs/toolkit": "^2.0.0",      // Redux Toolkit
  "react-redux": "^9.0.0",            // React-Redux bindings
  "antd": "^5.14.0",                 // Ant Design
  "react-router-dom": "^7.0.0",      // Routing
  "styled-components": "^6.0.0"      // Styled Components
}
```

### Development Dependencies
```json
{
  "tailwindcss": "^3.4.0",           // Tailwind CSS
  "sass": "^1.70.0",                 // SASS/SCSS compiler
  "postcss": "^8.0.0",               // PostCSS processor
  "autoprefixer": "^10.4.27"         // Browser vendor prefixes
}
```

---

## 8. Development Workflow

### Running Development Server
```bash
npm run dev
```
- Hot Module Replacement (HMR) enabled
- Tailwind CSS JIT compilation
- SCSS compilation on save
- RTK Query DevTools integration

### Building for Production
```bash
npm run build
```
- TypeScript compilation
- Tailwind CSS purging
- SCSS to CSS compilation
- Code splitting and minification

---

## 9. Best Practices

### RTK Query
✅ Use hooks in functional components
✅ Leverage automatic caching
✅ Handle loading and error states
✅ Use type-safe queries

### Tailwind CSS
✅ Use utility classes for common patterns
✅ Extend theme in `tailwind.config.ts`
✅ Use responsive prefixes (`sm:`, `md:`, `lg:`)
✅ Keep custom CSS minimal

### SCSS
✅ Use variables for consistency
✅ Create reusable mixins
✅ Organize by component
✅ Use nesting wisely
✅ Keep specificity low

### Styled Components
✅ Use for component-specific dynamic styling
✅ Keep styled component definitions near usage
✅ Use proper TypeScript typing
✅ Avoid over-nesting

---

## 10. Useful Resources

- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **RTK Query Guide**: https://redux.js.org/redux-toolkit/rtk-query/overview
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **SASS/SCSS Guide**: https://sass-lang.com/guide
- **Ant Design Components**: https://ant.design/components/overview/
- **Styled Components**: https://styled-components.com/

---

## Summary

This project effectively combines four complementary technologies:

1. **Redux Toolkit & RTK Query** - Predictable state management with automatic API handling
2. **Tailwind CSS** - Rapid utility-first styling
3. **SCSS** - Advanced styling with variables and mixins
4. **Styled Components** - Dynamic component-level styling

This combination provides:
- ✅ Type-safe state management
- ✅ Efficient data fetching and caching
- ✅ Flexible styling options
- ✅ Easy maintenance and scalability
- ✅ Great developer experience
