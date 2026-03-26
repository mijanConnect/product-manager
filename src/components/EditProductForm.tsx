import { useState, useMemo } from "react";
import { Form, Input, InputNumber, Select, Button, Space } from "antd";
import type { FormValues, Product, Category } from "../types";
import { validateProductForm, getInitialFormValues } from "../utils/validation";
import { useGetCategoriesQuery } from "../services/productsApi";
import "../styles/EditProductForm.scss";

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSubmit?: (values: FormValues) => void;
  categories?: Category[];
}

export const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: categories = [] } = useGetCategoriesQuery();
  const initialValues = useMemo(() => getInitialFormValues(product), [product]);

  const handleValuesChange = () => {
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const validationErrors = validateProductForm(values);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      onSubmit?.(values);
      onClose();
    } catch (err) {
      console.error("Form validation error:", err);
    }
  };

  return (
    <div className="form-container">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        <div className="form-section">
          <div>
            <Form.Item
              label="Product Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input
                placeholder="Enter product title"
                maxLength={100}
                status={errors.title ? "error" : ""}
              />
            </Form.Item>
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>

          <div>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select
                placeholder="Select category"
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat.slug,
                }))}
                status={errors.category ? "error" : ""}
              />
            </Form.Item>
            {errors.category && (
              <div className="error-message">{errors.category}</div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Price is required" }]}
            >
              <InputNumber
                prefix="$"
                placeholder="Enter price"
                min={0}
                max={1000000}
                step={0.01}
                precision={2}
                className="w-full"
                status={errors.price ? "error" : ""}
              />
            </Form.Item>
            {errors.price && (
              <div className="error-message">{errors.price}</div>
            )}
          </div>

          <div>
            <Form.Item
              label="Stock"
              name="stock"
              rules={[{ required: true, message: "Stock is required" }]}
            >
              <InputNumber
                placeholder="Enter stock quantity"
                min={0}
                step={1}
                precision={0}
                className="w-full"
                status={errors.stock ? "error" : ""}
              />
            </Form.Item>
            {errors.stock && (
              <div className="error-message">{errors.stock}</div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div>
            <Form.Item label="Discount %" name="discountPercentage">
              <InputNumber
                min={0}
                max={100}
                step={1}
                placeholder="0"
                className="w-full"
                status={errors.discountPercentage ? "error" : ""}
              />
            </Form.Item>
            {errors.discountPercentage && (
              <div className="error-message">{errors.discountPercentage}</div>
            )}
          </div>
        </div>

        <div className="full-width-field">
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter product description"
              maxLength={500}
              status={errors.description ? "error" : ""}
            />
          </Form.Item>
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>

        <div className="full-width-field">
          <Form.Item label="Brand" name="brand">
            <Input placeholder="Enter brand name (optional)" />
          </Form.Item>
        </div>

        <div className="full-width-field">
          <Space className="w-full flex justify-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};
