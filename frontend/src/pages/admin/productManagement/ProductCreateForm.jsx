import React, { useEffect, useState } from "react";
import {
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Switch,
  message,
  Modal,
  Divider,
  Typography,
  Steps,
  Space,
  Select,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import ProductService from "@/services/site/ProductService";
import { useNavigate } from "react-router-dom";
import CategoryService from "@/services/admin/CategoryService";
import BrandService from "@/services/admin/BrandService";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const ProductCreateForm = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
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

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    compare_price: 0,
    material: "",
    care_instructions: "",
    category_id: null,
    brand_id: null,
    dress_style: null,
    variants: [
      { size: "S", color: "black", stock: 0, price: 0 },
      { size: "M", color: "black", stock: 0, price: 0 },
      { size: "L", color: "black", stock: 0, price: 0 },
    ],
    images: [],
    is_featured: false,
    is_active: true,
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }finally {
      setLoading(false);
    }
  }

  const fetchBrands = async () => {
    try {
      const data = await BrandService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Lỗi khi tải thương hiệu:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const updateField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
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
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "M", color: "black", stock: 0, price: product.price || 0 },
      ],
    }));
  };

  const removeVariant = (index) => {
    if (product.variants.length <= 1) {
      message.warning("Phải có ít nhất 1 biến thể");
      return;
    }
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
      },
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        message.error(`${file.name} không phải là file ảnh`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        message.error(`${file.name} vượt quá 5MB`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      validFiles.push(file);
      newPreviews.push(previewUrl);
    });

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!product.name?.trim()) {
          message.error("Vui lòng nhập tên sản phẩm");
          return false;
        }
        if (product.price <= 0) {
          message.error("Giá sản phẩm phải lớn hơn 0");
          return false;
        }
        return true;
      case 1:
        return true;
      case 2:
        if (product.variants.length === 0) {
          message.error("Phải có ít nhất 1 biến thể");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreate = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description || "");
      formData.append("price", product.price);
      formData.append("compare_price", product.compare_price || 0);

      if (product.category_id) {
        formData.append("category_id", product.category_id);
      }
      if (product.brand_id) {
        formData.append("brand_id", product.brand_id);
      }

      formData.append("material", product.material || "");
      formData.append("care_instructions", product.care_instructions || "");
      if (product.dress_style) {
        formData.append("dress_style", product.dress_style);
      }

      formData.append("variants", JSON.stringify(product.variants));

      product.images.forEach((file) => {
        formData.append("images[]", file);
      });

      formData.append("is_featured", product.is_featured ? 1 : 0);
      formData.append("is_active", product.is_active ? 1 : 0);

      const response = await ProductService.createProduct(formData);
      toast.success("Tạo sản phẩm thành công!");
      navigate(`/admin/product/${response.data.slug}`);
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi khi tạo sản phẩm");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

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
      width: 120,
      render: (stock) => {
        if (stock === 0) {
          return (
            <Tag icon={<CloseCircleOutlined />} color="default">
              Chưa nhập
            </Tag>
          );
        } else if (stock < 10) {
          return (
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              Ít
            </Tag>
          );
        }
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đủ
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

  const steps = [
    {
      title: "Thông tin cơ bản",
      content: (
        <div className="space-y-4">
          <Row gutter={16}>
            <Col span={24}>
              <div>
                <label className="block mb-2 font-medium">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <Input
                  size="large"
                  placeholder="Nhập tên sản phẩm"
                  value={product.name}
                  onChange={(e) => updateField("name", e.target.value)}
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
                <label className="block mb-2 font-medium">
                  Giá bán <span className="text-red-500">*</span>
                </label>
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
                <Text type="secondary" className="text-xs">
                  Giá gốc để hiển thị giảm giá
                </Text>
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
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
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
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
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

          <Row gutter={16}>
            <Col span={12}>
              <Card size="small">
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Sản phẩm nổi bật</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      Hiển thị ở trang chủ
                    </Text>
                  </div>
                  <Switch
                    checked={product.is_featured}
                    onChange={(checked) => updateField("is_featured", checked)}
                  />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Kích hoạt</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      Hiển thị trên website
                    </Text>
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
    {
      title: "Chi tiết sản phẩm",
      content: (
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
                  value={product.dress_style}
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
      title: "Biến thể & Kho",
      content: (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <div>
              <Title level={4} className="mb-1">
                Quản lý biến thể
              </Title>
              <Text type="secondary">
                Thêm các phiên bản khác nhau của sản phẩm (size, màu sắc...)
              </Text>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={addVariant}>
              Thêm biến thể
            </Button>
          </div>

          <Table
            columns={variantColumns}
            dataSource={product.variants}
            pagination={false}
            rowKey={(record, index) => index}
            bordered
          />

          <div className="mt-4 p-4 bg-blue-50 rounded">
            <Text type="secondary">
              <strong>Tip:</strong> Giá của biến thể sẽ mặc định bằng giá sản phẩm nếu không chỉnh sửa.
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      content: (
        <div>
          <Title level={4} className="mb-4">
            Hình ảnh sản phẩm
          </Title>
          <Text type="secondary" className="block mb-4">
            Thêm ảnh sản phẩm để khách hàng có thể xem chi tiết
          </Text>

          <Row gutter={16}>
            {imagePreviews.map((img, index) => (
              <Col span={6} key={index}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={`Product ${index + 1}`}
                      src={img}
                      className="h-48 object-cover"
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeImage(index)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <Card.Meta description={`Ảnh ${index + 1}`} />
                </Card>
              </Col>
            ))}
            <Col span={6}>
              <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                <Card
                  hoverable
                  className="h-full flex items-center justify-center"
                  style={{ minHeight: "280px" }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <PlusOutlined className="text-3xl mb-2 text-gray-400" />
                    <div className="text-gray-600">Thêm ảnh</div>
                    <Text type="secondary" className="text-xs mt-2">
                      (Tối đa 5MB/ảnh)
                    </Text>
                  </div>
                </Card>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </Col>
          </Row>

          {product.images.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <Text type="warning">
                ⚠️ Sản phẩm chưa có hình ảnh. Bạn có thể thêm ảnh sau khi tạo sản phẩm.
              </Text>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Đang tải dữ liệu...</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6 shadow-sm">
          <Title level={2} className="mb-2">
            Tạo sản phẩm mới
          </Title>
          <Text type="secondary">
            Điền thông tin để tạo sản phẩm mới cho cửa hàng
          </Text>
        </Card>

        <Card className="shadow-sm">
          <Steps current={currentStep} className="mb-8">
            {steps.map((item) => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div className="min-h-[400px] mb-6">{steps[currentStep].content}</div>

          <Divider />

          <div className="flex justify-between">
            <Button
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Quay lại
            </Button>

            <Space>
              {currentStep < steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  onClick={handleNext}
                >
                  Tiếp theo
                </Button>
              )}

              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={handleCreate}
                  loading={saving}
                >
                  {saving ? "Đang tạo..." : "Tạo sản phẩm"}
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductCreateForm;