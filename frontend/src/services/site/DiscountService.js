import handleErrorResponse from "@/utils/errors/ErrorHandler";
import axiosInstance from "../../config/axiosInstance";
// Đường dẫn API gốc cho sản phẩm
const API_URL = "/discounts";

// 🔍 Lấy mã giảm giá theo code
const getDiscountByCode = async (code) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${code}`);
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
        console.error(`Lỗi khi lấy code giảm giá: ${code}`, error);
        throw error;
    }
};

const DiscountService = {
    getDiscountByCode
};

export default DiscountService;