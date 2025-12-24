import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Page500 = () => {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem("userDetail"));
    setUserDetail(userDetail);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600">
          5<span> 0 </span>0
        </h1>
        <h1 className="mb-3 text-3xl text-gray-900">Lỗi máy chủ!</h1>
        <p className="mb-4 text-xl text-gray-600 px-3">
          Xin lỗi, máy chủ hiện không phản hồi vui lòng thử lại sau.
        </p>
        <NavLink
          to={userDetail && userDetail.role === "ADMIN" ? "/admin/dashboard" : "/home"}
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Quay lại trang chủ
        </NavLink>
      </div>
    </div>
  );
};

export default Page500;