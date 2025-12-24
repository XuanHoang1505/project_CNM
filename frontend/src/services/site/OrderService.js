import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

const API_URL = "/orders/by-email";
/**
 * Lấy danh sách đơn hàng theo email
 * @param {string} email
 * @returns {Promise<Array>} danh sách đơn hàng
 */
const getOrdersByEmail = async (email) => {
    try {
        const response = await axiosInstance.get(`${API_URL}`, {
            params: { email }, // gửi email dưới dạng query param
        });
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
        return [];
    }
};
const OrderService = {
    getOrdersByEmail,
};
export default OrderService;