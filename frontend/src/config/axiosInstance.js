import axios from "axios";
import { jwtDecode } from "jwt-decode";
import handleErrorResponse from "../utils/errors/ErrorHandler";
import { toast } from "react-toastify";

// Axios có interceptor (dùng cho toàn site)
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Hàm refresh token riêng (không import từ AuthService)
const refreshTokenRequest = async (oldToken) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/auth/refresh",
    {},
    {
      headers: {
        Authorization: `Bearer ${oldToken}`,
      },
    }
  );
  return response.data.token; // Lấy token mới từ response
};

// Interceptor request: tự gắn token vào header
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token"); // CHỈ 1 TOKEN

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Kiểm tra token sắp hết hạn (trong vòng 5 phút)
      if (decodedToken.exp < currentTime + 300) {
        // Token hết hạn hoặc sắp hết hạn
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshTokenRequest(token); // Dùng token cũ để refresh
            localStorage.setItem("token", newToken); // Lưu token mới
            isRefreshing = false;
            onRefreshed(newToken);
            token = newToken;
          } catch (error) {
            isRefreshing = false;
            localStorage.removeItem("token");
            localStorage.removeItem("userDetail");

            toast.warning(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
            );
            window.location.href = "/";
            return Promise.reject(error);
          }
        } else {
          // Nếu đang refresh, queue request lại
          return new Promise((resolve) => {
            addSubscriber((newToken) => {
              config.headers["Authorization"] = `Bearer ${newToken}`;
              resolve(config);
            });
          });
        }
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Xử lý 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const oldToken = localStorage.getItem("token");

        if (!oldToken) {
          toast.warning("Vui lòng đăng nhập!");
          window.location.href = "/";
          return Promise.reject(error);
        }

        try {
          const newToken = await refreshTokenRequest(oldToken);
          localStorage.setItem("token", newToken);
          isRefreshing = false;
          onRefreshed(newToken);

          // Retry request gốc với token mới
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.removeItem("token");
          localStorage.removeItem("userDetail");

          toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      } else {
        // Đang refresh, queue request
        return new Promise((resolve, reject) => {
          addSubscriber((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
