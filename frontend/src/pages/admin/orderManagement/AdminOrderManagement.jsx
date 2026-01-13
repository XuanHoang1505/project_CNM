import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Descriptions,
  Image,
  Divider,
  Spin,
  message,
  Modal,
  Button,
} from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import TableManagement from "@/components/admin/common/table/TableManagement";
import OrderService from "@/services/admin/OrderService";
import Page500 from "@/pages/page500/Page500";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const { Option } = Select;
const { TextArea } = Input;

const AdminOrderManagement = () => {
  const [form] = Form.useForm();
  const [orderData, setOrderData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    order_code: "",
    user_id: "",
    customer_info: {
      name: "",
      email: "",
      phone: "",
    },
    shipping_address: {
      address: "",
      city: "",
      district: "",
      ward: "",
    },
    items: [],
    payment_method: "cod",
    payment_status: "unpaid",
    order_status: "pending",
    subtotal: 0,
    discount: 0,
    delivery_fee: 0,
    total: 0,
    note: "",
  });

  const [statistics, setStatistics] = useState({
    total_revenue: 0,
    pending_orders: 0,
    processing_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
  });

  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });

  const button = {
    btnAdd: false,
    btnEdit: true,
    btnDelete: true,
    btnDetail: true,
    btnSetting: false,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [errorServer, setErrorServer] = useState(null);
  const [filters, setFilters] = useState({
    order_status: "",
    payment_status: "",
    payment_method: "",
  });

  const orderColumns = [
    { key: "order_code", label: "Mã đơn hàng" },
    { key: "full_name", label: "Khách hàng" },
    { key: "phone", label: "Số điện thoại" },
    { key: "total", label: "Tổng tiền" },
    { key: "payment_method", label: "Thanh toán" },
    { key: "payment_status", label: "TT Thanh toán" },
    { key: "order_status", label: "TT Đơn hàng" },
    { key: "created_at", label: "Ngày tạo" },
  ];

  const keysToRemove = ["id"];
  const defaultColumns = orderColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  const fetchStatistics = async () => {
    try {
      const stats = await OrderService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  // Fetch order data
  const fetchOrderData = async () => {
    setLoadingPage(true);
    try {
      const data = await OrderService.getOrders();
      const formattedData = data.data.map((order) => ({
        ...order,
        customer_name: order.customer_info?.fullName || "N/A",
        customer_phone: order.customer_info?.phone || "N/A",
        customer_email: order.customer_info?.email || "N/A",
        created_at: order.created_at
          ? dayjs(order.created_at).format("DD/MM/YYYY HH:mm")
          : "",
      }));
      setOrderData(formattedData);
      await fetchStatistics();
    } catch (err) {
      setErrorServer(err.message);
      console.error(err);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
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
    updateStatus({ isAdd: false, isEditing: false, isViewDetail: false });
  };

  const handleReset = () => {
    setFormData({
      id: "",
      order_code: "",
      order_status: "pending",
      payment_status: "unpaid",
    });
    form.resetFields();
    handleResetStatus();
  };

  const handleEdit = (item) => {
    setFormData(item);
    form.setFieldsValue({
      order_status: item.order_status,
      payment_status: item.payment_status,
      note: item.note,
    });
    updateStatus({ isEditing: true });
  };

  const handleViewDetail = async (item) => {
    updateStatus({ isAdd: false, isEditing: false, isViewDetail: true });
    setFormData(item);
  };

  const handleSaveItem = async () => {
    try {
      await form.validateFields();
      setIsLoading(true);

      if (statusFunction.isEditing) {
        const updatedOrder = await OrderService.updateOrderStatus(formData.id, {
          order_status: formData.order_status,
          payment_status: formData.payment_status,
          note: formData.note,
        });

        const updatedOrders = orderData.map((order) =>
          order.id === updatedOrder.id
            ? {
                ...updatedOrder,
                customer_name: updatedOrder.customer_info?.name || "N/A",
                customer_phone: updatedOrder.customer_info?.phone || "N/A",
                created_at: dayjs(updatedOrder.created_at).format(
                  "DD/MM/YYYY HH:mm"
                ),
              }
            : order
        );

        setOrderData(updatedOrders);
        toast.success("Cập nhật đơn hàng thành công!");
        await fetchStatistics();
      }

      handleReset();
      return true;
    } catch (error) {
      if (error.errorFields) {
        toast.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        console.error("Lỗi khi lưu đơn hàng:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    if (!deleteId) return;

    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setIsLoading(true);
        try {
          await OrderService.deleteOrder(deleteId);
          setOrderData((prevData) =>
            prevData.filter((item) => item.id !== deleteId)
          );
          message.success("Xóa đơn hàng thành công!");
          await fetchStatistics();
        } catch (error) {
          message.error("Xóa không thành công!");
          console.error("Lỗi khi xóa đơn hàng:", error);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const renderOrderStatus = (status) => {
    const statusConfig = {
      pending: { color: "gold", text: "Chờ xử lý" },
      processing: { color: "blue", text: "Đang xử lý" },
      shipped: { color: "purple", text: "Đang giao" },
      delivered: { color: "green", text: "Đã giao" },
      cancelled: { color: "red", text: "Đã hủy" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderPaymentStatus = (status) => {
    const statusConfig = {
      unpaid: { color: "default", text: "Chưa thanh toán" },
      paid: { color: "green", text: "Đã thanh toán" },
      refunded: { color: "orange", text: "Đã hoàn tiền" },
      failed: { color: "red", text: "Thất bại" },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };
  console.log(">> check", formData);

  const modalContent = (
    <>
      {statusFunction.isViewDetail ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserOutlined className="text-blue-500 text-lg" />
              <span className="font-semibold text-base">
                Thông tin khách hàng
              </span>
            </div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Họ tên">
                {formData.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {formData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {formData.phone}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <Divider />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <EnvironmentOutlined className="text-green-500 text-lg" />
              <span className="font-semibold text-base">Địa chỉ giao hàng</span>
            </div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Địa chỉ">
                {formData.shipping_address?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Phường/Xã">
                {formData.shipping_address?.ward || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Quận/Huyện">
                {formData.shipping_address?.district}
              </Descriptions.Item>
              <Descriptions.Item label="Tỉnh/Thành phố">
                {formData.shipping_address?.city}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <Divider />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingOutlined className="text-purple-500 text-lg" />
              <span className="font-semibold text-base">
                Sản phẩm ({formData.items?.length || 0})
              </span>
            </div>
            <div className="space-y-3">
              {formData.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <Image
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-base">{item.name}</div>
                    <div className="text-gray-500 text-sm mt-1">
                      Giá: {formatCurrency(item.price)} x {item.quantity}
                    </div>
                    <div className="font-semibold text-blue-600 mt-1">
                      = {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Divider />
          Order Summary
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarOutlined className="text-red-500 text-lg" />
              <span className="font-semibold text-base">Tổng đơn hàng</span>
            </div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tạm tính">
                {formatCurrency(formData.subtotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                -{formatCurrency(formData.discount)}
              </Descriptions.Item>
              <Descriptions.Item label="Phí vận chuyển">
                {formatCurrency(formData.delivery_fee)}
              </Descriptions.Item>
              <Descriptions.Item label={<strong>Tổng cộng</strong>}>
                <strong className="text-red-500 text-lg">
                  {formatCurrency(formData.total)}
                </strong>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <Divider />
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Mã đơn hàng" span={2}>
              <strong>{formData.order_code}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {formData.payment_method?.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              {renderPaymentStatus(formData.payment_status)}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
              {renderOrderStatus(formData.order_status)}
            </Descriptions.Item>
            {formData.note && (
              <Descriptions.Item label="Ghi chú" span={2}>
                {formData.note}
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            order_status: formData.order_status,
            payment_status: formData.payment_status,
            note: formData.note,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Trạng thái đơn hàng"
              name="order_status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái đơn hàng!",
                },
              ]}
            >
              <Select
                onChange={(value) => handleInputChange("order_status", value)}
              >
                <Option value="pending">Chờ xác nhận</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái thanh toán"
              name="payment_status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái thanh toán!",
                },
              ]}
            >
              <Select
                onChange={(value) => handleInputChange("payment_status", value)}
              >
                <Option value="unpaid">Chưa thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Ghi chú" name="note">
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú cho đơn hàng..."
              onChange={(e) => handleInputChange("note", e.target.value)}
            />
          </Form.Item>

          {/* Order Info Display */}
          <Divider>Thông tin đơn hàng</Divider>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Mã đơn">
              {formData.order_code}
            </Descriptions.Item>
            <Descriptions.Item label="Khách hàng">
              {formData.full_name} -{" "}
              {formData.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <strong className="text-red-500">
                {formatCurrency(formData.total)}
              </strong>
            </Descriptions.Item>
          </Descriptions>
        </Form>
      )}
    </>
  );

  // Statistics Cards
  const statisticsCards = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 mx-4">
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <div className="text-gray-500 text-sm">Tổng doanh thu</div>
        <div className="text-xl font-bold text-blue-600">
          {formatCurrency(statistics.total_revenue)}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
        <div className="text-gray-500 text-sm">Chờ xử lý</div>
        <div className="text-xl font-bold text-yellow-600">
          {statistics.pending_orders}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <div className="text-gray-500 text-sm">Đang xử lý</div>
        <div className="text-xl font-bold text-blue-600">
          {statistics.processing_orders}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
        <div className="text-gray-500 text-sm">Đang giao</div>
        <div className="text-xl font-bold text-purple-600">
          {statistics.shipped_orders}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
        <div className="text-gray-500 text-sm">Đã giao</div>
        <div className="text-xl font-bold text-green-600">
          {statistics.delivered_orders}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
        <div className="text-gray-500 text-sm">Đã hủy</div>
        <div className="text-xl font-bold text-red-600">
          {statistics.cancelled_orders}
        </div>
      </div>
    </div>
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
          {statisticsCards}
          <TableManagement
            columns={orderColumns}
            data={orderData}
            title={"Quản lý đơn hàng"}
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
            renderCustomCell={(column, record) => {
              if (column === "order_status") {
                return renderOrderStatus(record.order_status);
              }
              if (column === "payment_status") {
                return renderPaymentStatus(record.payment_status);
              }
              if (column === "payment_method") {
                return record.payment_method?.toUpperCase();
              }
              if (column === "total") {
                return formatCurrency(record.total);
              }
              return record[column];
            }}
          />
        </section>
      )}
    </>
  );
};

export default AdminOrderManagement;
