import { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
import { Form, Input, Spin, message } from "antd";
import TableManagement from "@/components/admin/common/table/TableManagement";
import BrandService from "@/services/admin/BrandService";
import Page500 from "@/pages/page500/Page500";
import { toast } from "react-toastify";

const BrandManagement = () => {
  const [brandData, setBrandData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);
  const [form] = Form.useForm();

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: false,
    btnSetting: false,
  };

  // Cột hiển thị theo model
  const brandColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên thương hiệu" },
    { key: "slug", label: "Slug" },
  ];

  const defaultColumns = brandColumns;

  const fetchBrandData = async () => {
    setLoadingPage(true);
    try {
      const data = await BrandService.getBrands();
      setBrandData(data);
    } catch (err) {
      setErrorServer(err.message);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchBrandData();
  }, []);

  const validateField = (key, value) => {
    let error = "";
    switch (key) {
      case "name":
        if (!value || value.trim() === "") {
          error = "Tên không được để trống.";
        }
        break;
      default:
        break;
    }
    setErrorFields((prev) => ({ ...prev, [key]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên thương hiệu không được để trống.";
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prev) => ({ ...prev, ...newStatus }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      name: "",
    });
    form.resetFields();
    handleResetStatus();
    setErrorFields({});
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    form.setFieldsValue({
      name: item.name,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);
    try {
      const service = statusFunction.isEditing
        ? () => BrandService.updateBrand(formData.id, formData)
        : () => BrandService.createBrand(formData);

      const result = await service();
      console.log(result);
      

      setBrandData((prev) =>
        statusFunction.isEditing
          ? prev.map((b) => (b.id === result.data.id ? result.data : b))
          : [...prev, result.data]
      );

      toast.success(
        statusFunction.isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      handleReset();
      return true;
    } catch (error) {
      message.error(error?.response?.data?.message || "Đã xảy ra lỗi.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await BrandService.deleteBrand(deleteId);
      setBrandData((prev) => prev.filter((b) => b.id !== deleteId));
      toast.success("Xóa thành công!");
    } catch (error) {
      const msg = error?.response?.data?.message || "Đã xảy ra lỗi khi xóa.";
      message.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <Form form={form} layout="vertical" className="w-full">
      <div className="grid grid-cols-1 gap-4">
        <Form.Item
          label={
            <span>
              Tên thương hiệu <span className="text-red-500">(*)</span>
            </span>
          }
          validateStatus={errorFields.name ? "error" : ""}
          help={errorFields.name}
          className="mb-3"
        >
          <Input
            name="name"
            value={formData.name || ""}
            maxLength={100}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nhập tên thương hiệu"
            className="w-full"
          />
        </Form.Item>
      </div>
    </Form>
  );

  return (
    <>
      {/* <Helmet>
        <title>Quản lý thương hiệu - Thể Thao 247</title>
      </Helmet> */}
      {loadingPage ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="w-full m-0 p-0">
          <TableManagement
            columns={brandColumns}
            data={brandData}
            title="Quản lý thương hiệu"
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
            buttonCustom={button}
          />
        </section>
      )}
    </>
  );
};

export default BrandManagement;