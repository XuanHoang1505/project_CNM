import axiosInstance from "../../config/axiosInstance"; 

const API_URL = "/admin/users";

// ========================== USER CRUD SERVICE ==========================

const handleError = (error, message) => {
  console.error(message, error);
  throw error;
};


const getUsers = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return  response.data.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách người dùng:");
  }
};

const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    handleError(error, `Lỗi khi lấy người dùng với ID: ${id}`);
  }
};

const getUserByUsername = async (username) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/search-by-username/${username}`
    );
   return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      handleError(error, "Người dùng này không tồn tại!");
    } else {
      handleError(error, `Lỗi khi lấy người dùng với username: ${username}`);
    }
  }
};

const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(API_URL, userData);
    return response.data.data;
  } catch (error) {
    handleError(error, "Lỗi khi thêm người dùng:");
  }
};

const updateUser = async (id, userData, avatar) => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await axiosInstance.post(`${API_URL}/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data;
  
};

const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi xóa người dùng với ID: ${id}`);
  }
};

// Hàm xác thực mật khẩu
const verifyPassword = async (userId, password) => {
  try {
    const response = await axiosInstance.post(`/auth/verify-password`, {
      userId,
      password,
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi xác thực mật khẩu!`);
  }
};

// Hàm thay đổi mật khẩu
const changePassword = async (email, currentPassword, newPassword) => {
  try {
    const response = await axiosInstance.post(`/auth/change-password`, {
      email: email,
      password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    handleError(error, `Lỗi khi đổi mật khẩu!`);
  }
};

const UserService = {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  verifyPassword,
  changePassword,
};

export default UserService;
