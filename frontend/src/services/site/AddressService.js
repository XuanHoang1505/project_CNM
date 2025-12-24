import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "@/utils/errors/ErrorHandler";

const API_URL = "/provinces";

const AddressService = {
    getProvinces: async () => {
        try {
            const response = await axiosInstance.get(API_URL);
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        } catch (error) {
            return handleErrorResponse(error);
        }
    },

    getWards: async (provinceCode) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/${provinceCode}/wards`);
            return response.data;
        } catch (error) {
            return handleErrorResponse(error);
        }
    }
};


export default AddressService;
