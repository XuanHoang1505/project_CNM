import { NavLink } from "react-router-dom";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

const Page404 = () => {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-4 max-w-2xl">
        {/* 404 Number with Icon */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-9xl font-bold text-gray-800">4</span>
            <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full animate-pulse">
              <SearchOutlined className="text-5xl text-gray-600" />
            </div>
            <span className="text-9xl font-bold text-gray-800">4</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Không tìm thấy trang này!
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        {/* Back to Home Button */}
        <NavLink
          to={userDetail && userDetail.role === "ADMIN" ? "/admin/" : "/"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 text-base"
        >
          <HomeOutlined className="text-lg" />
          <span>Quay lại trang chủ</span>
        </NavLink>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Một số trang hữu ích:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <NavLink 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Trang chủ
            </NavLink>
            <span className="text-gray-300">•</span>
            <NavLink 
              to="/products" 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Sản phẩm
            </NavLink>
            <span className="text-gray-300">•</span>
            <NavLink 
              to="/contact" 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Liên hệ
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;