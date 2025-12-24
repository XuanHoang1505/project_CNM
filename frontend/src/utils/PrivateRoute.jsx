import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, roles }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleInvalidToken = (message) => {
    localStorage.removeItem("token"); // CHỈ XÓA 1 TOKEN
    localStorage.removeItem("userDetail");
    toast.warning(message);
    setIsTokenValid(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // CHỈ LẤY 1 TOKEN
    const userDetail = JSON.parse(localStorage.getItem("userDetail"));

    if (!token || !userDetail) {
      handleInvalidToken("Vui lòng đăng nhập để tiếp tục!");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Kiểm tra token đã hết hạn chưa
      if (decodedToken.exp < currentTime) {
        // Token đã hết hạn, nhưng axiosInstance sẽ tự động refresh
        // Ở đây chỉ cần kiểm tra refresh_ttl
        
        // Nếu đã quá refresh_ttl (14 ngày), bắt buộc login lại
        // Có thể kiểm tra thêm một trường trong localStorage
        const tokenCreatedAt = localStorage.getItem("tokenCreatedAt");
        if (tokenCreatedAt) {
          const tokenAge = (Date.now() - parseInt(tokenCreatedAt)) / 1000; // giây
          const refreshTTL = 20160 * 60; // 14 ngày = 20160 phút
          
          if (tokenAge > refreshTTL) {
            handleInvalidToken(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
            );
            return;
          }
        }
        
        // Token hết hạn nhưng còn trong thời gian refresh
        // axiosInstance sẽ tự động refresh khi gọi API
        setIsTokenValid(true);
      } else {
        // Token còn hạn
        setIsTokenValid(true);
      }

      // Kiểm tra quyền truy cập
      if (roles && roles.length > 0) {
        if (roles.includes(userDetail.role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } else {
        // Không yêu cầu role cụ thể
        setIsAuthorized(true);
      }

      setIsLoading(false);
    } catch (error) {
      handleInvalidToken("Token không hợp lệ, vui lòng đăng nhập lại!");
    }
  }, [roles]);

  // Khi đang load, hiển thị loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Chuyển hướng đến trang đăng nhập nếu token không hợp lệ
  if (!isTokenValid) {
    return <Navigate to="/" replace />;
  }

  // Nếu token hợp lệ nhưng không có quyền, điều hướng đến trang 403
  if (!isAuthorized) {
    return <Navigate to="/page403" replace />;
  }

  // Render children nếu token hợp lệ và có quyền
  return children;
};

export default PrivateRoute;