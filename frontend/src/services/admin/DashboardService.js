import axiosInstance from "../../config/axiosInstance";

const API_URL = "/dashboard";

// ========================== DASHBOARD SERVICE ==========================

const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};

/**
 * Lấy toàn bộ dữ liệu dashboard (cards + charts + tables)
 */
const getDashboard = async (year) => {
  try {
    const response = await axiosInstance.get(API_URL, {
      params: { year }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy dữ liệu dashboard:");
  }
};

/**
 * Lấy dữ liệu cards
 */
const getDashboardCards = async (year) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/cards`, {
      params: { year }
    });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy dữ liệu cards dashboard:");
  }
};

/**
 * Lấy dữ liệu charts
 */
const getDashboardCharts = async (year) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/charts`, {
      params: { year }
    });
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy dữ liệu charts dashboard:");
  }
};

/**
 * Lấy dữ liệu tables
 */
const getDashboardTables = async (year) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/tables`, {
      params: { year }
    });
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy dữ liệu tables dashboard:");
  }
};

const DashboardService = {
  getDashboard,
  getDashboardCards,
  getDashboardCharts,
  getDashboardTables,
};

export default DashboardService;
