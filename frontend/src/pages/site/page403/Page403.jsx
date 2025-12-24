import { NavLink } from "react-router-dom";
import { HomeOutlined, LockOutlined } from "@ant-design/icons";

const Page403 = () => {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-4 max-w-2xl">
        {/* 403 Number with Icon */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-9xl font-bold text-red-500">4</span>
            <div className="flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
              <LockOutlined className="text-5xl text-red-500" />
            </div>
            <span className="text-9xl font-bold text-red-500">3</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Không đủ quyền truy cập!
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Xin lỗi, bạn không có quyền truy cập vào trang này.
        </p>

        {/* Back to Home Button */}
        <NavLink
          to={userDetail && userDetail.role === "ADMIN" ? "/admin/dashboard" : "/"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 text-base"
        >
          <HomeOutlined className="text-lg" />
          <span>Quay lại trang chủ</span>
        </NavLink>

        {/* Additional Info */}
        <p className="text-sm text-gray-500 mt-8">
          Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ với quản trị viên.
        </p>
      </div>
    </div>
  );
};

export default Page403;