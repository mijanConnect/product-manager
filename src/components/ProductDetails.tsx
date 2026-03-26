import React, { useState, useMemo } from "react";
import {
  Button,
  Drawer,
  Spin,
  Empty,
  Rate,
  Divider,
  Row,
  Col,
  Alert,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} from "../services/productsApi";
import { EditProductForm } from "./EditProductForm";
import { formatPrice } from "../utils/validation";
import type { FormValues } from "../types";
import "../styles/components.scss";

export const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const productId = id ? parseInt(id, 10) : null;
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId!);

  const { data: categories = [] } = useGetCategoriesQuery();

  // Create category slug to name mapping
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.slug] = cat.name;
    });
    return map;
  }, [categories]);

  const handleBack = () => {
    navigate("/products");
  };

  const handleOpenEdit = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseEdit = () => {
    setIsDrawerOpen(false);
  };

  const handleFormSubmit = (values: FormValues) => {
    console.log("Form values submitted:", values);
    handleCloseEdit();
  };

  if (!productId) {
    return (
      <div className="product-detail-container">
        <div className="error-message">Invalid product ID</div>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Back to Products
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          Failed to load product details. Please try again.
        </div>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Back to Products
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <Empty description="Product not found" />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="mt-4"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className="product-detail-container rounded-lg shadow-md">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        className="mb-6"
      >
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="product-image-section">
          {product.images && product.images.length > 0 ? (
            <div className="flex justify-center items-center">
              <img
                src={product.images[0]}
                alt={product.title}
                className="max-w-full max-h-96 object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = product.thumbnail || "";
                }}
              />
            </div>
          ) : product.thumbnail ? (
            <div className="flex justify-center items-center">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          ) : (
            <Empty description="No image available" />
          )}
        </div>

        {/* Details Section */}
        <div className="product-info-section">
          <div className="mb-6">
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                {categoryMap[product.category] || product.category}
              </span>
            </div>
            <h1>{product.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Rate
                value={product.rating}
                disabled
                allowHalf
                className="text-lg"
              />
              <span className="text-base font-semibold">
                {product.rating.toFixed(1)}/5
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            {discountedPrice && product.discountPercentage ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-semibold">
                    -{product.discountPercentage}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-500 mt-2">
                  {formatPrice(discountedPrice)}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-blue-500">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="product-metrics">
            <div className="metric-item">
              <label>Stock Status</label>
              <div className={product.stock > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {product.stock > 0
                  ? `${product.stock} Available`
                  : "Out of Stock"}
              </div>
            </div>
            <div className="metric-item">
              <label>Brand</label>
              <div>{product.brand || "N/A"}</div>
            </div>
            {product.sku && (
              <div className="metric-item">
                <label>SKU</label>
                <div>{product.sku}</div>
              </div>
            )}
            {product.weight && (
              <div className="metric-item">
                <label>Weight</label>
                <div>{product.weight} kg</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="action-button-group">
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
              onClick={handleOpenEdit}
              disabled={product.stock === 0}
            >
              Edit Product
            </Button>
          </div>

          {product.stock === 0 && (
            <Alert
              type="warning"
              message="This product is currently out of stock"
              className="mt-4"
            />
          )}
        </div>
      </div>

      {/* Description Section */}
      <Divider className="my-8" />
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Description
        </h2>
        <p className="leading-relaxed text-gray-600 text-sm">
          {product.description}
        </p>
      </div>

      {/* Additional Info */}
      {product.dimensions && (
        <>
          <Divider className="my-8" />
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Dimensions
            </h2>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <div className="text-xs text-gray-400 mb-1">
                    Width
                  </div>
                  <div className="text-2xl font-semibold">
                    {product.dimensions.width} cm
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <div className="text-xs text-gray-400 mb-1">
                    Height
                  </div>
                  <div className="text-2xl font-semibold">
                    {product.dimensions.height} cm
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <div className="text-xs text-gray-400 mb-1">
                    Depth
                  </div>
                  <div className="text-2xl font-semibold">
                    {product.dimensions.depth} cm
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}

      {product.returnPolicy && (
        <>
          <Divider className="my-8" />
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Return Policy
            </h2>
            <p className="leading-relaxed text-gray-600 text-sm">
              {product.returnPolicy}
            </p>
          </div>
        </>
      )}

      {/* Edit Form Drawer */}
      <Drawer
        title="Edit Product Information"
        placement="right"
        onClose={handleCloseEdit}
        open={isDrawerOpen}
        width={500}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {product && (
          <EditProductForm
            product={product}
            onClose={handleCloseEdit}
            onSubmit={handleFormSubmit}
          />
        )}
      </Drawer>
    </div>
  );
};
