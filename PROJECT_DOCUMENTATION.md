# Product Management System

A modern, full-featured product management application built with React, TypeScript, Redux Toolkit, and Ant Design.

## Tech Stack

- **Frontend Framework**: React 19+ with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: Ant Design 5+
- **Styling**: 
  - Tailwind CSS 3+
  - SCSS
  - Styled Components
- **Routing**: React Router v7
- **Data Fetching**: RTK Query (integrated with Redux)
- **API**: DummyJSON public API

## Features Implemented

### Task 1 - Product Management
✅ **Product List Page**
- Ant Design Table component with responsive design
- Fetch products from `/products` API endpoint
- Pagination support (10 items per page)
- Product search functionality using `/products/search` API
- Category filtering with Select Dropdown
- Display columns: Title, Price, Rating, Stock, Category
- View button to navigate to product details page
- Real-time status indicators (in stock/out of stock)

### Task 2 - Product Details & Form
✅ **Product Details Page**
- Dynamic routing with `/products/:id` route
- Display product information:
  - Product images with carousel gallery
  - Title, description, price, rating, stock
  - Brand, SKU, weight, dimensions
  - Return policy
- Edit form in a drawer component
- Form validation with custom rules:
  - Title: Required, 3-100 characters
  - Description: Required, 10-500 characters
  - Price: Required, > 0, max 1,000,000
  - Category: Required
  - Rating: 0-5
  - Stock: Non-negative integer
  - Discount: 0-100 percentage
- Loading and error states
- Frontend-only implementation (no backend persistence)

## Project Structure

```
src/
├── components/
│   ├── EditProductForm.tsx      # Product edit form in drawer
│   ├── ProductList.tsx          # Main product list table
│   └── ProductDetails.tsx       # Product detail page
├── pages/
│   ├── ProductsPage.tsx         # Products listing page
│   └── ProductDetailPage.tsx    # Product detail page wrapper
├── services/
│   └── productsApi.ts           # RTK Query API slices
├── store/
│   └── index.ts                 # Redux store configuration
├── hooks/
│   └── useProducts.ts           # Custom hooks for product queries
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   └── validation.ts            # Form validation and utilities
├── styles/
│   └── components.ts            # Styled components
├── App.tsx                      # Main app with routing
└── main.tsx                     # React entry point
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5176/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Endpoints Used

All APIs are from [DummyJSON](https://dummyjson.com/docs/):

- `GET /products` - Get all products with pagination
- `GET /products/search?q=keyword` - Search products
- `GET /products/{id}` - Get product details
- `GET /products/categories` - Get all categories
- `GET /products/category/{category}` - Get products by category

## Key Features & Best Practices

### State Management
- Redux Toolkit for centralized state
- RTK Query for automatic API caching and synchronization
- Efficient data fetching with minimal boilerplate

### Component Design
- Reusable, well-typed components
- Proper separation of concerns
- Custom hooks for data fetching logic
- Styled components for component-specific styling

### TypeScript
- Strong typing throughout the application
- Type-only imports where appropriate
- Proper interface definitions for API responses

### Error Handling
- Error boundaries and error states
- User-friendly error messages
- Loading states with spinners

### Styling
- Tailwind CSS for utility-first styling
- Styled Components for dynamic styling
- Ant Design components for consistent UI
- Responsive design for mobile, tablet, and desktop

### Form Validation
- Custom validation rules
- Real-time error display
- Field-level validation
- User feedback for validation errors

## Performance Optimizations

- RTK Query caching to reduce API calls
- Lazy loading of components
- Memoized hook results
- Optimized re-renders with useMemo

## Responsive Design

- Mobile-first approach
- Tablet and desktop breakpoints
- Responsive table layout
- Mobile-optimized forms and modals

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Product creation and deletion
- Advanced filtering (price range, rating)
- Wishlist functionality
- Shopping cart
- User authentication
- Backend integration for data persistence
- Image upload for products
- Product reviews and ratings

## Development Notes

### Form Submission
Currently, the edit form submits to the console. In a real application, this would:
- Send data to a backend API
- Update the Redux store
- Show success/error notifications
- Persist data to a database

### Data Persistence
This is a frontend-only implementation using DummyJSON's read-only API. For production:
- Implement a backend API
- Store product changes in a database
- Add user authentication
- Implement proper data validation on the server

## License

MIT

## Author

Built as a demonstration of modern React + TypeScript development practices.
