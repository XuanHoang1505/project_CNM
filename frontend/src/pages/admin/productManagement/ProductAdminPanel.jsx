import React, { useEffect, useState } from "react";
import {
  Input,
  InputNumber,
  Button,
  Tabs,
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Tag,
  Switch,
  Upload,
  message,
  Modal,
  Select,
  Divider,
  Typography,
  Badge,
  Spin,
  Alert,
  Image,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
  DollarOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import ProductService from "@/services/site/ProductService";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "@/services/admin/CategoryService";
import BrandService from "@/services/admin/BrandService";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const ProductAdminPanel = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState([]); 
  const [newImageFiles, setNewImageFiles] = useState([]); 
  const [newImagePreviews, setNewImagePreviews] = useState([]); 

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const dressStyles = [
    { value: "Casual", label: "Casual - Thường ngày" },
    { value: "Formal", label: "Formal - Trang trọng" },
    { value: "Sport", label: "Sport - Thể thao" },
    { value: "Business", label: "Business - Công sở" },
    { value: "Street", label: "Street - Đường phố" },
    { value: "Vintage", label: "Vintage - Cổ điển" },
  ];

  useEffect(() => {
    fetchProductData();
    fetchMasterData();
  }, [slug]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const fetchMasterData = async () => {
    try {
      const categories = await CategoryService.getCategories();
      setCategories(categories);

      const brands = await BrandService.getBrands();
      setBrands(brands);
     
    } catch (error) {
      console.error("Error fetching master data:", error);
    }
  };

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProductBySlug(slug);

      const productData = response.data;
      setProduct(productData);

      setExistingImages(productData.images || []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateVariant = (index, field, value) => {
    setProduct((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = {
        ...newVariants[index],
        [field]: field === "stock" || field === "price" ? value || 0 : value,
      };
      return { ...prev, variants: newVariants };
    });
    setIsDirty(true);
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "M", color: "black", stock: 0, price: product?.price || 0 },
      ],
    }));
    setIsDirty(true);
  };

  const removeVariant = (index) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa biến thể này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setProduct((prev) => ({
          ...prev,
          variants: prev.variants.filter((_, i) => i !== index),
        }));
        setIsDirty(true);
      },
    });
  };

  // Xử lý upload ảnh mới
  const handleImageUpload = ({ file }) => {
    if (!file.type.startsWith("image/")) {
      message.error(`${file.name} không phải là file ảnh`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error(`${file.name} vượt quá 5MB`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setNewImageFiles((prev) => [...prev, file]);
    setNewImagePreviews((prev) => [...prev, previewUrl]);
    setIsDirty(true);

    message.success(`Đã thêm ${file.name}`);
  };

  // Xóa ảnh cũ (chỉ xóa khỏi state, sẽ xóa thật khi save)
  const removeExistingImage = (index) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa ảnh này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
        setIsDirty(true);
      },
    });
  };

  // Xóa ảnh mới
  const removeNewImage = (index) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa ảnh này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setIsDirty(true);
      },
    });
  };

  const handleSave = async () => {
    // Validation
    if (!product.name?.trim()) {
      message.error("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!product.slug?.trim()) {
      message.error("Vui lòng nhập slug");
      return;
    }
    if (product.price <= 0) {
      message.error("Giá sản phẩm phải lớn hơn 0");
      return;
    }

    try {
      setSaving(true);

      // Tạo FormData
      const formData = new FormData();

      // Basic info
      formData.append("name", product.name);
      formData.append("description", product.description || "");
      formData.append("price", product.price);
      formData.append("compare_price", product.compare_price || 0);

      // Foreign keys
      if (product.category_id) {
        formData.append("category_id", product.category_id);
      }
      if (product.brand_id) {
        formData.append("brand_id", product.brand_id);
      }

      // Product details
      formData.append("material", product.material || "");
      formData.append("care_instructions", product.care_instructions || "");
      if (product.dress_style) {
        formData.append("dress_style", product.dress_style);
      }

      // Variants - gửi dạng JSON string
      formData.append("variants", JSON.stringify(product.variants || []));

      // Status
      formData.append("is_featured", product.is_featured ? 1 : 0);
      formData.append("is_active", product.is_active ? 1 : 0);

      // Images
      // existing_images: array of URLs cần giữ lại
      const existingImageUrls = existingImages.map((img) => img.image_url);
      formData.append("existing_images", JSON.stringify(existingImageUrls));

      // new_images: File objects
      newImageFiles.forEach((file) => {
        formData.append("new_images[]", file);
      });

      // Debug log
      console.log("=== Saving product ===");
      console.log("Product ID:", product.id);
      console.log("Existing images:", existingImageUrls);
      console.log("New images:", newImageFiles.length);

      // Gửi request
      const response = await ProductService.updateProduct(product.id, formData);

      message.success("Lưu sản phẩm thành công!");
      setIsDirty(false);

      // Cleanup
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setNewImageFiles([]);
      setNewImagePreviews([]);

      const updatedProduct = response.data;
      if (updatedProduct.slug !== slug) {
        navigate(`/admin/product/${updatedProduct.slug}`, { replace: true });
      }

      // Refresh data
      await fetchProductData();
    } catch (error) {
      console.error("Save error:", error);
      message.error(error.response?.data?.message || "Có lỗi khi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  // Calculate statistics
  const totalStock =
    product.variants?.reduce((sum, v) => sum + (v?.stock || 0), 0) || 0;
  const lowStockCount =
    product.variants?.filter((v) => (v?.stock || 0) < 10 && (v?.stock || 0) > 0)
      .length || 0;
  const outOfStockCount =
    product.variants?.filter((v) => (v?.stock || 0) === 0).length || 0;
  const discount =
    product.compare_price > 0
      ? Math.round((1 - product.price / product.compare_price) * 100)
      : 0;
  const totalImages = existingImages.length + newImageFiles.length;

  const variantColumns = [
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: 100,
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateVariant(index, "size", e.target.value)}
        />
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 120,
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateVariant(index, "color", e.target.value)}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
      width: 120,
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => updateVariant(index, "stock", value)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (text, record, index) => (
        <InputNumber
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          value={text}
          onChange={(value) => updateVariant(index, "price", value)}
          style={{ width: "100%" }}
          addonAfter="đ"
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "stock",
      key: "status",
      width: 150,
      render: (stock) => {
        if (stock === 0) {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Hết hàng
            </Tag>
          );
        } else if (stock < 10) {
          return (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              Sắp hết
            </Tag>
          );
        }
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Còn hàng
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeVariant(index)}
        />
      ),
    },
  ];

  const tabItems = [
    {
      key: "basic",
      label: "Thông tin cơ bản",
      children: (
        <div className="space-y-4">
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Tên sản phẩm *</label>
                <Input
                  size="large"
                  placeholder="Nhập tên sản phẩm"
                  value={product.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Slug *</label>
                <Input
                  size="large"
                  placeholder="ao-thun-premium"
                  value={product.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                />
              </div>
            </Col>
          </Row>

          <div>
            <label className="block mb-2 font-medium">Mô tả sản phẩm</label>
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết sản phẩm"
              value={product.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Giá bán *</label>
                <InputNumber
                  size="large"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: "100%" }}
                  addonAfter="đ"
                  value={product.price}
                  onChange={(value) => updateField("price", value)}
                />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Giá so sánh</label>
                <InputNumber
                  size="large"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: "100%" }}
                  addonAfter="đ"
                  value={product.compare_price}
                  onChange={(value) => updateField("compare_price", value)}
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Danh mục</label>
                <Select
                  size="large"
                  placeholder="Chọn danh mục"
                  style={{ width: "100%" }}
                  value={product.category_id}
                  onChange={(value) => updateField("category_id", value)}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Thương hiệu</label>
                <Select
                  size="large"
                  placeholder="Chọn thương hiệu"
                  style={{ width: "100%" }}
                  value={product.brand_id}
                  onChange={(value) => updateField("brand_id", value)}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {brands.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "details",
      label: "Chi tiết sản phẩm",
      children: (
        <div className="space-y-4">
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Chất liệu</label>
                <Input
                  size="large"
                  placeholder="Cotton 100%, Polyester..."
                  value={product.material}
                  onChange={(e) => updateField("material", e.target.value)}
                />
              </div>
            </Col>
            <Col span={12}>
              <div>
                <label className="block mb-2 font-medium">Phong cách</label>
                <Select
                  size="large"
                  placeholder="Chọn phong cách"
                  style={{ width: "100%" }}
                  value={product.dressStyle}
                  onChange={(value) => updateField("dress_style", value)}
                  allowClear
                >
                  {dressStyles.map((style) => (
                    <Option key={style.value} value={style.value}>
                      {style.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          <div>
            <label className="block mb-2 font-medium">Hướng dẫn bảo quản</label>
            <TextArea
              rows={4}
              placeholder="Giặt máy nước lạnh, không sử dụng chất tẩy..."
              value={product.care_instructions}
              onChange={(e) => updateField("care_instructions", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      key: "variants",
      label: (
        <Badge count={product.variants?.length || 0} offset={[10, 0]}>
          Biến thể & Kho
        </Badge>
      ),
      children: (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <Title level={4}>Quản lý biến thể</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={addVariant}>
              Thêm biến thể
            </Button>
          </div>

          {lowStockCount > 0 && (
            <Alert
              message={`Có ${lowStockCount} biến thể sắp hết hàng`}
              type="warning"
              showIcon
              closable
              className="mb-4"
            />
          )}

          {outOfStockCount > 0 && (
            <Alert
              message={`Có ${outOfStockCount} biến thể đã hết hàng`}
              type="error"
              showIcon
              closable
              className="mb-4"
            />
          )}

          <Table
            columns={variantColumns}
            dataSource={product.variants || []}
            pagination={false}
            rowKey={(record, index) => record.id || index}
            bordered
          />
        </div>
      ),
    },
    {
      key: "images",
      label: (
        <Badge count={totalImages} offset={[10, 0]}>
          Hình ảnh
        </Badge>
      ),
      children: (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <Title level={4}>Hình ảnh sản phẩm</Title>
            <Text type="secondary">
              {existingImages.length} ảnh hiện tại • {newImageFiles.length} ảnh
              mới
            </Text>
          </div>

          {newImageFiles.length > 0 && (
            <Alert
              message={`Bạn đang thêm ${newImageFiles.length} ảnh mới. Nhớ nhấn "Lưu thay đổi" để upload.`}
              type="info"
              showIcon
              closable
              className="mb-4"
            />
          )}

          <Row gutter={16}>
            {/* Hiển thị ảnh cũ */}
            {existingImages.map((img, index) => (
              <Col
                span={6}
                key={`existing-${img.id || index}`}
                className="mb-4"
              >
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={`Ảnh ${index + 1}`}
                      src={img.image_url}
                      className="h-48 object-cover"
                      preview={{ mask: "Xem ảnh" }}
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeExistingImage(index)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    description={
                      <>
                        <Tag color="blue">Ảnh hiện tại #{index + 1}</Tag>
                        {img.is_primary && <Tag color="gold">Primary</Tag>}
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}

            {/* Hiển thị ảnh mới */}
            {newImagePreviews.map((preview, index) => (
              <Col span={6} key={`new-${index}`} className="mb-4">
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={`Ảnh mới ${index + 1}`}
                      src={preview}
                      className="h-48 object-cover"
                      preview={{ mask: "Xem ảnh" }}
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeNewImage(index)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    description={<Tag color="green">Ảnh mới #{index + 1}</Tag>}
                  />
                </Card>
              </Col>
            ))}

            {/* Upload button */}
            <Col span={6} className="mb-4">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageUpload}
              >
                <Card
                  hoverable
                  className="h-full flex items-center justify-center"
                >
                  <div className="flex flex-col items-center justify-center h-48 cursor-pointer">
                    <PlusOutlined className="text-3xl mb-2 text-gray-400" />
                    <div className="text-gray-500">Thêm ảnh mới</div>
                    <div className="text-xs text-gray-400 mt-1">Tối đa 5MB</div>
                  </div>
                </Card>
              </Upload>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "seo",
      label: "Cài đặt",
      children: (
        <div className="space-y-4">
          <Divider>Cài đặt hiển thị</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <div className="flex justify-between items-center">
                  <div>
                    <Title level={5} className="mb-1">
                      Sản phẩm nổi bật
                    </Title>
                    <Text type="secondary">Hiển thị ở trang chủ</Text>
                  </div>
                  <Switch
                    checked={product.is_featured}
                    onChange={(checked) => updateField("is_featured", checked)}
                  />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <div className="flex justify-between items-center">
                  <div>
                    <Title level={5} className="mb-1">
                      Kích hoạt
                    </Title>
                    <Text type="secondary">Hiển thị trên website</Text>
                  </div>
                  <Switch
                    checked={product.is_active}
                    onChange={(checked) => updateField("is_active", checked)}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Title level={2} className="mb-2">
                {product.name}
              </Title>
              <Text type="secondary">Slug: {product.slug}</Text>
              {isDirty && (
                <div className="mt-2">
                  <Tag color="warning" icon={<ExclamationCircleOutlined />}>
                    Có thay đổi chưa lưu
                  </Tag>
                </div>
              )}
            </div>
            <Button
              type="primary"
              size="large"
              icon={saving ? <Spin size="small" /> : <SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              disabled={!isDirty}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>

          <Row gutter={16}>
            <Col span={6}>
              <Card bordered={false} className="bg-blue-50">
                <Statistic
                  title="Tổng số lượng"
                  value={totalStock}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false} className="bg-green-50">
                <Statistic
                  title="Giá bán"
                  value={product.price}
                  prefix={<DollarOutlined />}
                  suffix="đ"
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false} className="bg-orange-50">
                <Statistic
                  title="Giảm giá"
                  value={discount}
                  suffix="%"
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false} className="bg-red-50">
                <Statistic
                  title="Cảnh báo tồn kho"
                  value={lowStockCount + outOfStockCount}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        <Card className="shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProductAdminPanel;
