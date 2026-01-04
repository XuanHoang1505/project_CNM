import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

// Đường dẫn API gốc cho sản phẩm
const API_URL = "/products";

// 🧩 Lấy tất cả sản phẩm
const getProducts = async (current = 1, pageSize = 9) => {
  try {
    const response = await axiosInstance.get(API_URL, {
      params: {
        current: current,
        pageSize: pageSize,
      }
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};


// 🔍 Lấy sản phẩm theo ID
const getProductById = async (id) => {
  try {
    // dùng query param id
    const res = await axiosInstance.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error('Lỗi khi lấy product ID:', id, err);
    throw err;
  }
};


// Lấy sản phẩm theo slug
const getProductBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi lấy product slug: ${slug}`, error);
    throw error;
  }
};

const getProductsByCategory = async (categorySlug, page = 1, pageSize = 9) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/category/${categorySlug}`, {
      params: {
        current: page,
        pageSize: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm theo danh mục: ${categorySlug}`, error);
    throw error;
  }
};

// 🔍 Search sản phẩm
const searchProducts = async (keyword, current = 1, pageSize = 9) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/search`, {
      params: {
        keyword: keyword,
        current: current,
        pageSize: pageSize
      }
    });

    return response.data;   // backend trả pagination + data
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi search sản phẩm:", keyword, error);
    throw error;
  }
};


//Filter products
const filtersProduct = async (current = 1, pageSize = 9, filters = {}) => {
  console.log(filters);

  try {
    const response = await axiosInstance.get(`${API_URL}/filters`, {
      params: {
        current: current,
        pageSize: pageSize,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};


const createProduct = async (formData) => {
  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
}

const updateProduct = async (id, productData) => {
  try {
    if (productData instanceof FormData) {
      productData.append('_method', 'PUT');
      const response = await axiosInstance.post(`${API_URL}/${id}`, productData);
      return response.data;
    }
    
    const response = await axiosInstance.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// 🗑️ Xoá sản phẩm
const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error(`Lỗi khi xoá sản phẩm ID: ${id}`, error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
}

const getDressStyles = async () => {
  try {
    const response = await axiosInstance.get('/dress-styles');
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// 🔥 Lấy sản phẩm bán chạy nhất
const getBestsellerProducts = async (limit = 4) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/bestseller`, {
      params: {
        limit: limit
      }
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi lấy sản phẩm bestseller:", error);
    throw error;
  }
};

// ✨ Lấy sản phẩm mới nhất
const getNewProducts = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/new`, {
      params: {
        limit: limit
      }
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    console.error("Lỗi khi lấy sản phẩm mới:", error);
    throw error;
  }
};

const ProductService = {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  filtersProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getDressStyles,
  getBestsellerProducts,
  getNewProducts
};

export default ProductService;
