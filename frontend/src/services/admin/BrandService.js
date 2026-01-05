import axiosInstance from "../../config/axiosInstance"; // Import axiosInstance
import handleErrorResponse from "../../utils/errors/ErrorHandler";

// Cấu hình URL API chung
const API_URL = "/admin/brands";

// Lấy tất cả brand
const getBrands = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Lấy brand theo ID
const getBrandById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Tạo brand
const createBrand = async (brandData) => {
  try {
    const response = await axiosInstance.post(API_URL, brandData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi thêm brand:", error);
    throw error;
  }
};

// Cập nhật brand
const updateBrand = async (id, brandData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, brandData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi cập nhật brand với ID: ${id}`, error);
    throw error;
  }
};

// Xoá brand
const deleteBrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi xoá category với ID: ${id}`, error);
    throw error;
  }
};

// Export service
const BrandService = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};

export default BrandService;