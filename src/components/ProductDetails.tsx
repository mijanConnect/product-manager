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
          style={{ marginTop: 16 }}
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
        style={{ marginBottom: 24 }}
      >
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="product-image-section">
          {product.images && product.images.length > 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = product.thumbnail || "";
                }}
              />
            </div>
          ) : product.thumbnail ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
              categoryMap[product.category] ||
            </div>
          ) : (
            <Empty description="No image available" />
          )}
        </div>

        {/* Details Section */}
        <div className="product-info-section">
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8 }}>
              <span className="text-sm text-gray-500">
                {categoryMap[product.category] || product.category}
              </span>
            </div>
            <h1>{product.title}</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: 8,
              }}
            >
              <Rate
                value={product.rating}
                disabled
                allowHalf
                style={{ fontSize: 20 }}
              />
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                {product.rating.toFixed(1)}/5
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div
            style={{
              marginBottom: 24,
              padding: "16px 0",
              backgroundColor: "#f0f2f5",
              borderRadius: "8px",
            }}
          >
            {discountedPrice && product.discountPercentage ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#999",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  <span
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      borderRadius: "4px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    -{product.discountPercentage}%
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#ff4d4f",
                    marginTop: 8,
                  }}
                >
                  {formatPrice(discountedPrice)}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1890ff" }}>
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="product-metrics">
            <div className="metric-item">
              <label>Stock Status</label>
              <div style={{ color: product.stock > 0 ? "#52c41a" : "#f5222d" }}>
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
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      </div>

      {/* Description Section */}
      <Divider style={{ margin: "32px 0" }} />
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
          Description
        </h2>
        <p style={{ lineHeight: 1.6, color: "#595959", fontSize: 14 }}>
          {product.description}
        </p>
      </div>

      {/* Additional Info */}
      {product.dimensions && (
        <>
          <Divider style={{ margin: "32px 0" }} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Dimensions
            </h2>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                    Width
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>
                    {product.dimensions.width} cm
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                    Height
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>
                    {product.dimensions.height} cm
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                    Depth
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>
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
          <Divider style={{ margin: "32px 0" }} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Return Policy
            </h2>
            <p style={{ lineHeight: 1.6, color: "#595959", fontSize: 14 }}>
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
