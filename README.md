# Product Manager - React + TypeScript Application

A modern product management system built with **React 19**, **TypeScript**, **Redux Toolkit**, and **Vite**. Features product listing, search, filtering, and edit functionality with URL state persistence.

## 🎯 Features

- ✨ **Product Listing** - Browse products in paginated table (10 items per page)
- 🔍 **Search & Filter** - By product title and category
- 📄 **Product Details** - View full product information with image
- ✏️ **Edit Products** - Modify product details with validation
- 🔗 **URL State** - Search/filter/pagination persisted in URL: `?page=2&search=phone&category=electronics`
- 🐛 **API Visibility** - All API endpoint calls logged to browser console with 🔗 icon

## 📦 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19.2.4 |
| **Language** | TypeScript | 5.9.3 |
| **Build** | Vite | 8.0.1 |
| **State** | Redux Toolkit + RTK Query | 2.0.0 |
| **UI** | Ant Design | 5.14.0 |
| **Styling** | SCSS + Tailwind CSS | 1.70.0 + 3.4.0 |
| **Routing** | React Router DOM | 7.0.0 |
| **API** | DummyJSON | - |

## 🏗️ Architecture

- **Redux Toolkit + RTK Query** - State management with automatic API caching
- **SCSS with Global Variables** - Centralized design tokens in `globals.scss`
- **Component Organization** - Feature-based folder structure
- **TypeScript Strict Mode** - Full type safety throughout
- **URL Query Params** - Search, pagination, and filters persisted in URL

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation & Run

```bash
# Clone repository
git clone https://github.com/mijanConnect/product-manager.git
cd product-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

App available at `http://localhost:5176`

### Build & Preview

```bash
npm run build
npm run preview
```

## 📋 Scripts

```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run preview     # Preview build
npm run lint        # Lint code
npm run type-check  # TypeScript check
```

## 🔌 API Endpoints

All endpoints from **https://dummyjson.com**:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/products` | GET | List products (limit, skip) |
| `/products/search` | GET | Search by query |
| `/products/:id` | GET | Product details |
| `/products/categories` | GET | All categories |
| `/products/category/:cat` | GET | Products by category |

**Console Logs:** Every API call logs with 🔗 icon → Open DevTools Console to view

## 📁 Project Structure

```
src/
├── components/      # ProductList, ProductDetails, EditProductForm
├── pages/          # ProductsPage, ProductDetailPage
├── services/       # RTK Query API slice
├── hooks/          # useProducts custom hooks
├── store/          # Redux store
├── styles/         # SCSS (globals, components, page-specific)
├── types/          # TypeScript types
└── utils/          # Helper functions
```

## ⚙️ Key Design Decisions

1. **Redux + RTK Query** - Scalable state management with caching
2. **SCSS Global Variables** - DRY styling without duplication
3. **URL Query Params** - Shareable, bookmarkable filtered views
4. **TypeScript Strict** - Compile-time error prevention
5. **Ant Design + Tailwind** - Rich components + utility classes
6. **Vite** - Fast dev builds with optimized production output

## 📝 License

MIT License - Open source
