import axios from "axios";
import axiosInstance from "../../config/axiosInstance";
import handleErrorResponse from "../../utils/errors/ErrorHandler";

const AUTH_URL = "/auth";

const baseAxios = axios.create({
  baseURL: "http://localhost:5271/api/",
});

// Đăng nhập
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/login`, {
      email,
      password,
    });
    

    let token = response.data.access_token; 

    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// REFRESH TOKEN - Dùng token hiện tại
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem("token"); // Lấy token hiện tại
    if (!token) throw new Error("Token not found");

    const response = await baseAxios.post(
      `${AUTH_URL}/refresh`,
      {}, // Body rỗng
      {
        headers: {
          Authorization: `Bearer ${token}`, // Dùng token hiện tại để refresh
        },
      }
    );

    // Lưu token mới
    const newToken = response.data.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
    }

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};


export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  } 
};

// Gửi OTP
export const sendOtp = async (identifier, type) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/send-otp`, {
      identifier,
      type,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Gửi lại OTP
export const resendOtp = async (identifier) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/resend-otp`, {
      identifier,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

export const verifyEmailOtp = async (identifier, otp) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/verify-email-otp`, {
      email: identifier,
      otp,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Xác thực OTP
export const verifyOtp = async (identifier, otp) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/verify-otp`, {
      email: identifier,
      otp,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/reset-password`, {
      email,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};

// Đăng xuất
export const logout = async (userId) => {
  try {
    await axiosInstance.post(`${AUTH_URL}/logout`, {
      userId,
    });
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  } finally {
    // CHỈ XÓA 1 TOKEN
    localStorage.removeItem("token");
    localStorage.removeItem("userDetail");
  }
  
};

export const socialLogin = async (provider, accessToken) => {
  try {
    const response = await axiosInstance.post(`${AUTH_URL}/social-login`, {
      provider,
      access_token: accessToken,
    });

    let token = response.data.access_token;

    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userDetail", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    handleErrorResponse(error);
    throw error;
  }
};