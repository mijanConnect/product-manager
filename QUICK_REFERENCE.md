# Quick Reference Guide - Redux, RTK Query, Tailwind & SCSS

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5176)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Redux Toolkit & RTK Query Examples

### 1. Create API Slice

```typescript
// src/services/productsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
    updateProduct: builder.mutation<Product, Product>({
      query: (product) => ({
        url: `/products/${product.id}`,
        method: 'PUT',
        body: product,
      }),
    }),
  }),
});

export const { useGetProductsQuery, useUpdateProductMutation } = productsApi;
```

### 2. Configure Store

```typescript
// src/store/index.ts
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

### 3. Use in Component

```typescript
// src/components/ProductList.tsx
import { useGetProductsQuery } from '../services/productsApi';

export const ProductList = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
};
```

### 4. Use Mutation (Create/Update/Delete)

```typescript
import { useUpdateProductMutation } from '../services/productsApi';

export const EditProduct = ({ product }: { product: Product }) => {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleSave = async (updatedData: Product) => {
    try {
      await updateProduct(updatedData).unwrap();
      message.success('Product updated!');
    } catch (error) {
      message.error('Failed to update product');
    }
  };

  return <button onClick={() => handleSave(product)}>Save</button>;
};
```

---

## Tailwind CSS Examples

### Basic Layout

```jsx
// Container with responsive padding
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
  // Grid layout
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map(product => (
      <div key={product.id} className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    ))}
  </div>
</div>
```

### Common Patterns

```jsx
// Flex centering
<div className="flex items-center justify-center min-h-screen">
  <Spinner />
</div>

// Button styles
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  Click me
</button>

// Text truncation
<p className="truncate">{longText}</p>

// Responsive typography
<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
  Heading
</h1>

// Gradient
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient background
</div>

// Shadow
<div className="shadow-sm hover:shadow-lg transition-shadow">
  Card with shadow
</div>
```

### Responsive Design

```jsx
// Mobile first - styles apply to mobile by default
<div className="
  flex           // Mobile: flex
  md:flex-row    // Medium+: flex-row
  lg:flex-col    // Large+: flex-col
  p-4            // Mobile: 16px padding
  md:p-6         // Medium+: 24px padding
  lg:p-8         // Large+: 32px padding
">
  Content
</div>
```

---

## SCSS Examples

### Variables

```scss
// colors
$primary: #1890ff;
$secondary: #666;
$error: #f5222d;

// spacing
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Mixins

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// Responsive
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'mobile' {
    @media (max-width: 640px) {
      @content;
    }
  } @else if $breakpoint == 'tablet' {
    @media (max-width: 1024px) {
      @content;
    }
  }
}

// Usage
.card {
  padding: 24px;
  
  @include respond-to('mobile') {
    padding: 16px;
  }
}
```

### Nesting

```scss
.product-list {
  padding: 20px;
  background: white;

  .header {
    font-size: 24px;
    font-weight: bold;
  }

  .item {
    padding: 16px;
    border-bottom: 1px solid #eee;

    &:hover {
      background: #f5f5f5;
    }

    .title {
      font-weight: 600;
    }

    .price {
      color: $primary;
      font-weight: bold;
    }
  }

  .empty {
    text-align: center;
    color: #999;
  }
}
```

### Functions & Operators

```scss
// Darken/Lighten
.btn-hover {
  background: darken($primary, 10%);
  &:hover {
    background: lighten($primary, 10%);
  }
}

// Transparency
.overlay {
  background: rgba($primary, 0.2);
}

// Math
.grid {
  width: calc(100% - 20px);
  padding: $spacing-md + 8px;
}

// Extend colors
$colors: (
  'primary': $primary,
  'success': #52c41a,
  'error': $error,
);

@each $name, $color in $colors {
  .text-#{$name} {
    color: $color;
  }
}
```

---

## Styled Components Examples

### Basic Styled Component

```typescript
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #40a9ff;
  }
`;

// Usage
<Button>Click me</Button>
```

### Props-Based Styling

```typescript
interface ContainerProps {
  isHighlight?: boolean;
  gap?: number;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  gap: ${props => props.gap || 16}px;
  padding: 16px;
  background: ${props => props.isHighlight ? '#fff3e0' : 'white'};
  border: 2px solid ${props => props.isHighlight ? '#ff9800' : '#eee'};
`;

// Usage
<Container isHighlight gap={24}>
  Content
</Container>
```

### Extending Styled Components

```typescript
const BaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PrimaryButton = styled(BaseButton)`
  background: #1890ff;
  color: white;

  &:hover {
    background: #40a9ff;
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: white;
  border: 1px solid #ccc;
  color: #333;

  &:hover {
    border-color: #1890ff;
  }
`;
```

---

## Common Patterns

### Loading State

```typescript
const { data, isLoading, error } = useGetProductsQuery();

if (isLoading) {
  return (
    <div className="flex justify-center items-center min-h-96">
      <Spin size="large" tip="Loading..." />
    </div>
  );
}

if (error) {
  return (
    <Alert
      type="error"
      message="Failed to load products"
      showIcon
    />
  );
}

return <ProductTable data={data} />;
```

### Form with Validation

```typescript
const [form] = Form.useForm<FormValues>();
const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    const validationErrors = validateProductForm(values);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Handle success
  } catch (error) {
    console.error('Form error:', error);
  }
};

return (
  <Form form={form} layout="vertical">
    <Form.Item
      label="Product Name"
      name="title"
      rules={[{ required: true }]}
    >
      <Input status={errors.title ? 'error' : ''} />
    </Form.Item>
    {errors.title && <span className="text-red-500">{errors.title}</span>}
  </Form>
);
```

### Pagination

```typescript
const [currentPage, setCurrentPage] = useState(1);
const { data, isLoading } = useGetProductsQuery({
  limit: 10,
  skip: (currentPage - 1) * 10,
});

return (
  <Table
    pagination={{
      current: currentPage,
      pageSize: 10,
      total: data?.total,
      onChange: (page) => setCurrentPage(page),
    }}
    dataSource={data?.products}
    loading={isLoading}
  />
);
```

---

## File Organization

```
src/
├── api/                    # API slices
│   ├── productsApi.ts
│   └── usersApi.ts
├── components/             # Reusable components
│   ├── ProductCard/
│   │   ├── index.tsx
│   │   └── ProductCard.scss
│   └── Layout/
├── hooks/                  # Custom hooks
│   ├── useProducts.ts
│   └── usePagination.ts
├── pages/                  # Page components
│   ├── ProductList.tsx
│   └── ProductDetail.tsx
├── store/                  # Redux store
│   └── index.ts
├── styles/                 # Global styles
│   ├── globals.scss
│   └── variables.scss
├── types/                  # TypeScript types
│   └── index.ts
├── utils/                  # Utility functions
│   ├── validation.ts
│   └── formatting.ts
└── App.tsx
```

---

## Environment Variables

Create `.env.local` file:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
```

Usage:

```typescript
const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT;
```

---

## Debugging Tips

### Redux DevTools
```bash
# Install redux-devtools-extension
npm install redux-devtools-extension

# Use in store
import { composeWithDevTools } from 'redux-devtools-extension';
const store = composeWithDevTools(configureStore(...));
```

### React DevTools
- Install [React DevTools](https://chromewebstore.google.com/detail/react-developer-tools/) extension
- Inspect component tree, props, and hooks

### RTK Query DevTools
```typescript
// Built-in RTK Query DevTools available in development
// Access via Redux DevTools under "RTK Query" tab
```

### Tailwind CSS IntelliSense
- Install [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) VS Code extension
- Get IntelliSense for Tailwind class names

---

## Performance Tips

✅ Use RTK Query's automatic caching
✅ Leverage Tailwind's tree-shaking in production
✅ Optimize SCSS with mixins to reduce file size
✅ Use React.memo for expensive components
✅ Implement code splitting with React.lazy
✅ Monitor bundle size with `npm run build`

---

## Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### SCSS Not Compiling
```bash
# Ensure sass is installed
npm install -D sass

# Check file imports
@import './variables.scss';
```

### Tailwind Not Working
```bash
# Rebuild Tailwind
npm run build

# Check content paths in tailwind.config.ts
content: ["./src/**/*.{js,ts,jsx,tsx}"]
```

### RTK Query Issues
```typescript
// Set up Redux DevTools
import { EnhancedStore, configureStore } from '@reduxjs/toolkit';

// Monitor network requests
const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (gDM) => gDM().concat(api.middleware),
});
```

---

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Guide](https://redux-toolkit.js.org/rtk-query/overview)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [SASS/SCSS Guide](https://sass-lang.com/documentation)
- [Styled Components](https://styled-components.com/)
- [Ant Design components](https://ant.design/components/overview/)

---

**Happy Coding!** 🚀
