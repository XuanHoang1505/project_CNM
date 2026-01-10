import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Spin, message } from "antd";
import TableManagement from "@/components/admin/common/table/TableManagement";
import ShippingFeeService from "@/services/admin/ShippingFeeService";
import { formatNumber } from "@/utils/Formatter";
import AddressService from "@/services/site/AddressService";
import Page500 from "@/pages/page500/Page500";

const { Option } = Select;

const ShippingFeeManagement = () => {
  const [form] = Form.useForm();
  const [shippingFeeData, setShippingFeeData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [wards, setWards] = useState([]);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    province_code: "",
    province_name: "",
    ward_code: "",
    ward_name: "",
    fee: 0,
    note: "",
  });

  // Lấy danh sách tỉnh khi load
  useEffect(() => {
    AddressService.getProvinces().then((data) => {
      if (data) setProvinces(data);
    });
  }, []);

  // Load wards khi chọn province
  useEffect(() => {
    if (!selectedProvince) {
      setWards([]);
      setSelectedWard("");
      return;
    }

    setIsLoadingWards(true);
    AddressService.getWards(selectedProvince)
      .then((data) => {
        setWards(data || []);
      })
      .finally(() => {
        setIsLoadingWards(false);
      });
  }, [selectedProvince]);

  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });

  const button = {
    btnAdd: true,
    btnEdit: true,
    btnDelete: true,
    btnDetail: true,
    btnSetting: false,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);

  const shippingFeeColumns = [
    { key: "id", label: "ID" },
    { key: "province_name", label: "Tỉnh/Thành phố" },
    { key: "province_code", label: "Mã Tỉnh" },
    { key: "ward_name", label: "Phường/Xã" },
    { key: "ward_code", label: "Mã Phường/Xã" },
    { key: "fee", label: "Phí Vận Chuyển (VND)" },
    { key: "note", label: "Ghi Chú" },
  ];

  const keysToRemove = ["id"];
  const defaultColumns = shippingFeeColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchShippingFeeData = async () => {
    setLoadingPage(true);
    try {
      const response = await ShippingFeeService.getShippingFees();
      console.log("ShippingFee data:", response);

      const list = Array.isArray(response.data) ? response.data : [];

      const formattedData = list.map((fee) => ({
        ...fee,
        province_code: fee.province_code || "",
        province_name: fee.province_name || "",
        ward_code: fee.ward_code || "",
        ward_name: fee.ward_name || "",
        fee: fee.fee || 0,
        note: fee.note || "",
      }));

      setShippingFeeData(formattedData);
    } catch (err) {
      setErrorServer(err.message);
      console.log(err);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchShippingFeeData();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus,
      ...newStatus,
    }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      id: "",
      province_code: "",
      province_name: "",
      ward_code: "",
      ward_name: "",
      fee: 0,
      note: "",
    });

    // Reset select dropdowns
    setSelectedProvince("");
    setSelectedWard("");
    setWards([]);

    form.resetFields();
    handleResetStatus();
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
    });

    // Set province và ward khi edit
    setSelectedProvince(item.province_code);
    setSelectedWard(item.ward_code);

    form.setFieldsValue({
      province_code: item.province_code,
      province_name: item.province_name,
      ward_code: item.ward_code,
      ward_name: item.ward_name,
      fee: item.fee,
      note: item.note,
    });

    updateStatus({ isEditing: true });
  };

  const handleViewDetail = async (item) => {
    updateStatus({ isAdd: false, isEditing: false, isViewDetail: true });
    setFormData({
      ...item,
    });

    // Set giá trị cho view detail
    setSelectedProvince(item.province_code);
    setSelectedWard(item.ward_code);
  };

  const handleSaveItem = async () => {
    console.log("=== handleSaveItem called ===");
    console.log("formData:", formData);
    console.log("statusFunction:", statusFunction);

    try {
      // Validate các field bắt buộc từ dropdown trước
      if (!formData.province_code || !formData.province_name) {
        message.error("Vui lòng chọn tỉnh/thành phố!");
        return false;
      }

      if (!formData.ward_code || !formData.ward_name) {
        message.error("Vui lòng chọn phường/xã!");
        return false;
      }

      // Validate form fields (fee, note)
      try {
        await form.validateFields(["fee", "note"]);
      } catch (validationError) {
        console.log("Validation error:", validationError);
        message.error("Vui lòng kiểm tra lại thông tin!");
        return false;
      }

      setIsLoading(true);

      if (statusFunction.isEditing) {
        console.log("Updating existing fee...");

        // Đảm bảo fee là số
        const feeValue =
          typeof formData.fee === "string"
            ? parseFloat(formData.fee)
            : formData.fee;

        const updatedFormData = {
          province_code: String(formData.province_code),
          province_name: String(formData.province_name),
          ward_code: String(formData.ward_code),
          ward_name: String(formData.ward_name),
          fee: feeValue,
          note: formData.note || "",
        };

        console.log("Data to update:", updatedFormData);
        const updatedFee = await ShippingFeeService.updateShippingFee(
          formData.id,
          updatedFormData
        );

        const updatedFees = shippingFeeData.map((fee) =>
          fee.id === updatedFee.id ? updatedFee : fee
        );

        setShippingFeeData(updatedFees);
        message.success("Cập nhật phí ship thành công!");
      } else if (statusFunction.isAdd) {
        console.log("Creating new fee...");

        // Đảm bảo fee là số, không phải string
        const feeValue =
          typeof formData.fee === "string"
            ? parseFloat(formData.fee)
            : formData.fee;

        const newFormData = {
          province_code: String(formData.province_code),
          province_name: String(formData.province_name),
          ward_code: String(formData.ward_code),
          ward_name: String(formData.ward_name),
          fee: feeValue,
          note: formData.note || "",
        };

        console.log("Data to create:", newFormData);
        const newFee = await ShippingFeeService.createShippingFee(newFormData);
        console.log("Created fee:", newFee);

        setShippingFeeData([...shippingFeeData, newFee]);
        message.success("Thêm phí ship thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      console.error("Error in handleSaveItem:", error);
      console.error("Error response:", error.response?.data);

      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        const errorMsg =
          error.response?.data?.message || error.message || "Có lỗi xảy ra!";
        message.error(errorMsg);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    setIsLoading(true);
    try {
      await ShippingFeeService.deleteShippingFee(deleteId);
      setShippingFeeData((prevData) =>
        prevData.filter((item) => item.id !== deleteId)
      );
      message.success("Shipping fee deleted successfully!");
    } catch (error) {
      message.error("Failed to delete shipping fee!");
      console.error("Error while deleting shipping fee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        province_code: formData.province_code,
        province_name: formData.province_name,
        ward_code: formData.ward_code,
        ward_name: formData.ward_name,
        fee: formData.fee,
        note: formData.note,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Province */}
        <Form.Item label="Tỉnh/Thành phố" required>
          <select
            value={selectedProvince}
            onChange={(e) => {
              const code = e.target.value;
              console.log("Selected province code:", code);

              setSelectedProvince(code);
              setSelectedWard(""); // Reset ward khi đổi province

              const provinceObj = provinces.find(
                (p) => String(p.code) === String(code)
              );
              console.log("Found province:", provinceObj);

              if (provinceObj) {
                setFormData((prev) => ({
                  ...prev,
                  province_code: String(provinceObj.code),
                  province_name: String(provinceObj.name),
                }));
              }
            }}
            className="w-full px-3 py-2 border rounded"
            disabled={statusFunction.isViewDetail}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </Form.Item>

        {/* Ward */}
        <Form.Item label="Phường/Xã" required>
          <select
            value={selectedWard}
            onChange={(e) => {
              const code = e.target.value;
              console.log("Selected ward code:", code);

              setSelectedWard(code);

              const wardObj = wards.find(
                (w) => String(w.code) === String(code)
              );
              console.log("Found ward:", wardObj);

              if (wardObj) {
                setFormData((prev) => ({
                  ...prev,
                  ward_code: String(wardObj.code),
                  ward_name: String(wardObj.name),
                }));
              }
            }}
            disabled={
              !selectedProvince || isLoadingWards || statusFunction.isViewDetail
            }
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">
              {isLoadingWards ? "Đang tải..." : "Chọn Phường/Xã"}
            </option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item
          label="Shipping Fee (VND)"
          name="fee"
          rules={[
            { required: true, message: "Shipping fee cannot be empty." },
            {
              type: "number",
              min: 0,
              message: "Shipping fee must be greater than or equal to 0.",
            },
          ]}
        >
          <InputNumber
            placeholder="Enter shipping fee"
            min={0}
            max={10000000}
            step={1000}
            value={formData.fee}
            onChange={(value) => handleInputChange("fee", value)}
            className="w-full"
            disabled={statusFunction.isViewDetail}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/,/g, "")}
          />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input
            placeholder="Enter note (optional)"
            maxLength={255}
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
            disabled={statusFunction.isViewDetail}
          />
        </Form.Item>
      </div>
    </Form>
  );

  return (
    <>
      {loadingPage ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="m-0 p-0">
          <TableManagement
            columns={shippingFeeColumns}
            data={shippingFeeData}
            title={"Manage shipping fees"}
            defaultColumns={defaultColumns}
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
            buttonCustom={button}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};

export default ShippingFeeManagement;
