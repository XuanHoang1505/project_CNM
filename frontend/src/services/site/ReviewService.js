import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

// Đường dẫn API gốc cho sản phẩm
const API_URL = "/reviews";

// 🧩 Tạo đánh giá 
const createReview = async (formData) => {
    try {
        const response = await axiosInstance.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        handleErrorResponse(error);
        return { success: false, message: "Upload review failed" };
    }
};


const getReviewsByProduct = async (productId) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${productId}`);

        if (response.data && response.data.success) {
            return {
                success: true,
                data: response.data.data || [],
                message: response.data.message || "Success"
            };
        }

        return {
            success: false,
            data: [],
            message: response.data.message || "Failed to load reviews"
        };

    } catch (error) {
        console.error("Error fetching reviews:", error);

        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Server error"
        };
    }
};


const ReviewService = {
    createReview,
    getReviewsByProduct
};
export default ReviewService;

