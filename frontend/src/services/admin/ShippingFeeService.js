import axiosInstance from "../../config/axiosInstance";

const API_URL = "/admin/shipping-fees";
const API_URL_PUBLIC = "/shipping-fees";

// ========================== SHIPPING FEE CRUD SERVICE ==========================

const handleError = (error, message) => {
    console.error(message, error);
    throw error;
};

/**
 * Lấy danh sách phí ship
 */
const getAll = async (params = {}) => {
    try {
        const response = await axiosInstance.get(API_URL_PUBLIC, { params });
        return response.data;
    } catch (error) {
        handleError(error, "Lỗi khi lấy danh sách all:");
    }
};


const getShippingFees = async (params = {}) => {
    try {
        const response = await axiosInstance.get(API_URL, { params });
        return response.data;
    } catch (error) {
        handleError(error, "Lỗi khi lấy danh sách phí ship:");
    }
};

/**
 * Lấy phí ship theo ID
 */
const getShippingFeeById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data.data;
    } catch (error) {
        handleError(error, `Lỗi khi lấy phí ship với ID: ${id}`);
    }
};

/**
 * Tạo phí ship mới
 */
const createShippingFee = async (data) => {
    try {
        const response = await axiosInstance.post(API_URL, data);
        return response.data.data;
    } catch (error) {
        handleError(error, "Lỗi khi tạo phí ship:");
    }
};

/**
 * Cập nhật phí ship
 */
const updateShippingFee = async (id, data) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data.data;
    } catch (error) {
        handleError(error, `Lỗi khi cập nhật phí ship với ID: ${id}`);
    }
};

/**
 * Xóa phí ship
 */
const deleteShippingFee = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, `Lỗi khi xóa phí ship với ID: ${id}`);
    }
};

/**
 * Tra cứu phí ship theo province_code & ward_code
 */
const lookupShippingFee = async (province_code, ward_code = null) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/lookup`, {
            params: { province_code, ward_code },
        });
        return response.data.data;
    } catch (error) {
        handleError(error, "Lỗi khi tra cứu phí ship:");
    }
};

const ShippingFeeService = {
    getShippingFees,
    getShippingFeeById,
    createShippingFee,
    updateShippingFee,
    deleteShippingFee,
    lookupShippingFee,
    getAll,
};

export default ShippingFeeService;
