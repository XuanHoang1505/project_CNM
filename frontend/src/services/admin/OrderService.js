import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

// Đường dẫn API gốc cho đơn hàng
const API_URL = "/orders";

// 🧩 Lấy tất cả đơn hàng (có phân trang)
const getOrders = async (current = 1, pageSize = 15) => {
  try {
    const response = await axiosInstance.get(API_URL, {
      params: {
        page: current,
        per_page: pageSize,
      },
    });
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// 🔍 Lấy đơn hàng theo ID
const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy đơn hàng ID: ${id}`, error);
    throw error;
  }
};

// 📧 Lấy đơn hàng theo Email
const getOrderByEmail = async (email) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/by-email`, {
      params: { email },
    });
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy đơn hàng theo email: ${email}`, error);
    throw error;
  }
};

// 🔢 Lấy đơn hàng theo mã đơn
const getOrderByCode = async (orderCode) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/code/${orderCode}`);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy đơn hàng theo mã: ${orderCode}`, error);
    throw error;
  }
};

// 👤 Lấy đơn hàng theo User ID
const getOrdersByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy đơn hàng theo user ID: ${userId}`, error);
    throw error;
  }
};

// 🔍 Tìm kiếm đơn hàng với bộ lọc
const searchOrders = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/search`, {
      params: filters,
    });
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi tìm kiếm đơn hàng:", error);
    throw error;
  }
};

// 📊 Lấy thống kê đơn hàng
const getStatistics = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/statistics`, {
      params: filters,
    });
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi lấy thống kê đơn hàng:", error);
    throw error;
  }
};

// ➕ Tạo đơn hàng mới
const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(API_URL, orderData);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

// ✏️ Cập nhật đơn hàng
const updateOrder = async (id, orderData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, orderData);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi cập nhật đơn hàng ID: ${id}`, error);
    throw error;
  }
};

// 🔄 Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/${id}/status`,
      status
    );
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi cập nhật trạng thái đơn hàng ID: ${id}`, error);
    throw error;
  }
};

// 💳 Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (id, paymentStatus) => {
  try {
    const response = await axiosInstance.patch(
      `${API_URL}/${id}/payment-status`,
      {
        payment_status: paymentStatus,
      }
    );
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi cập nhật trạng thái thanh toán ID: ${id}`, error);
    throw error;
  }
};

// ❌ Hủy đơn hàng
const cancelOrder = async (id, reason = null) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${id}/cancel`, {
      reason,
    });
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi hủy đơn hàng ID: ${id}`, error);
    throw error;
  }
};

// ✅ Hoàn thành đơn hàng
const completeOrder = async (id) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${id}/complete`);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi hoàn thành đơn hàng ID: ${id}`, error);
    throw error;
  }
};

// 🗑️ Xóa đơn hàng
const deleteOrder = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi xóa đơn hàng ID: ${id}`, error);
    throw error;
  }
};

// 📦 Export tất cả các functions
const OrderService = {
  // GET methods
  getOrders,
  getOrderById,
  getOrderByEmail,
  getOrderByCode,
  getOrdersByUserId,
  searchOrders,
  getStatistics,

  // POST/PUT methods
  createOrder,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,

  // Action methods
  cancelOrder,
  completeOrder,
  deleteOrder,
};

export default OrderService;
