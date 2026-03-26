import React, { useState, useMemo, useEffect } from "react";
import { Table, Input, Select, Button, Spin, Empty } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useProducts,
  useProductSearch,
  useProductsByCategory,
} from "../hooks/useProducts";
import { useGetCategoriesQuery } from "../services/productsApi";
import type { Product } from "../types";
import { formatPrice } from "../utils/validation";
import "../styles/components.scss";

const ITEMS_PER_PAGE = 10;

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL parameters
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "",
  );
  const [isSearching, setIsSearching] = useState(
    (searchParams.get("search") || "").trim().length > 0,
  );

  // Sync URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    if (selectedCategory && selectedCategory.trim() !== "") {
      params.set("category", selectedCategory);
    }
    setSearchParams(params);
  }, [currentPage, searchQuery, selectedCategory, setSearchParams]);

  const { data: categories = [] } = useGetCategoriesQuery();

  // Create category slug to name mapping
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.slug] = cat.name;
    });
    return map;
  }, [categories]);

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch products based on current filters
  const {
    products: allProducts,
    total: allTotal,
    isLoading: allLoading,
  } = useProducts({
    limit: ITEMS_PER_PAGE,
    skip,
  });

  const {
    products: searchResults,
    total: searchTotal,
    isLoading: searchLoading,
  } = useProductSearch(searchQuery);

  const {
    products: categoryProducts,
    total: categoryTotal,
    isLoading: categoryLoading,
  } = useProductsByCategory({
    category: selectedCategory || "",
    limit: ITEMS_PER_PAGE,
    skip,
  });

  // Determine which data source to use
  const displayProducts = useMemo(() => {
    if (searchQuery && isSearching) {
      return searchResults.slice(skip, skip + ITEMS_PER_PAGE);
    }
    if (selectedCategory && selectedCategory.trim() !== "") {
      return categoryProducts;
    }
    return allProducts;
  }, [
    searchQuery,
    isSearching,
    selectedCategory,
    searchResults,
    categoryProducts,
    allProducts,
    skip,
  ]);

  const totalRecords = useMemo(() => {
    if (searchQuery && isSearching) {
      return searchTotal;
    }
    if (selectedCategory && selectedCategory.trim() !== "") {
      return categoryTotal;
    }
    return allTotal;
  }, [
    searchQuery,
    isSearching,
    selectedCategory,
    searchTotal,
    categoryTotal,
    allTotal,
  ]);

  const isLoading = useMemo(() => {
    if (searchQuery && isSearching) {
      return searchLoading;
    }
    if (selectedCategory && selectedCategory.trim() !== "") {
      return categoryLoading;
    }
    return allLoading;
  }, [
    searchQuery,
    isSearching,
    selectedCategory,
    searchLoading,
    categoryLoading,
    allLoading,
  ]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setIsSearching(value.trim().length > 0);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSearchQuery("");
    setCurrentPage(1);
    setIsSearching(false);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text: string) => <span className="font-semibold">{text}</span>,
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (slug: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          {categoryMap[slug] || slug}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => (
        <span className="font-semibold">{formatPrice(price)}</span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating: number) => (
        <span className="text-yellow-500 font-semibold">
          ★ {rating.toFixed(1)}/5
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 80,
      render: (stock: number) => (
        <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
          {stock > 0 ? `${stock} units` : "Out of Stock"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, record: Product) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewProduct(record.id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Product Management</h1>

        <div className="product-list-header">
          <div className="search-wrapper">
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="large"
            />
          </div>
          <div className="filter-wrapper">
            <Select
              placeholder="Filter by category"
              className="category-select"
              style={{ width: 200 }}
              value={selectedCategory || undefined}
              onChange={handleCategoryChange}
              allowClear
              size="large"
              options={[
                { label: "All Categories", value: "" },
                ...categories.map((cat) => ({
                  label: cat.name,
                  value: cat.slug,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-96">
          <Spin size="large" tip="Loading products..." />
        </div>
      ) : displayProducts.length === 0 ? (
        <Empty
          description={
            searchQuery || selectedCategory
              ? "No products found"
              : "No products"
          }
          style={{ marginTop: 48 }}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={displayProducts}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: ITEMS_PER_PAGE,
            total: totalRecords,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} products`,
          }}
          scroll={{ x: 1200 }}
          className="mt-4"
        />
      )}
    </div>
  );
};
