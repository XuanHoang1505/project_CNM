import React, { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DynamicBreadcrumb from "@/components/site/breadcrumb/Breadcrumb";
import { logout } from "@/services/site/AuthService";

function AccountLayout() {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(user.userId);
    updateUser(null);
    navigate("/");
  };

  return (
    <>
      <DynamicBreadcrumb />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center mb-4">
                <img
                  src={
                    user?.avatar ||
                    "https://cdn-img.thethao247.vn/resize_400x460//base/comment/img/avatar.png"
                  }
                  alt={user?.fullName || "User"}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
                <h5 className="font-semibold text-lg mb-1">{user?.fullName}</h5>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
            </div>

            <nav className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-100">
                <li>
                  <NavLink
                    to="/account/profile"
                    end
                    className={({ isActive }) =>
                      `block py-3 px-4 text-gray-700 font-normal transition-colors hover:bg-gray-50 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : ""
                      }`
                    }
                  >
                    Trang cá nhân
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account/my-order"
                    end
                    className={({ isActive }) =>
                      `block py-3 px-4 text-gray-700 font-normal transition-colors hover:bg-gray-50 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : ""
                      }`
                    }
                  >
                    Đơn hàng của tôi
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account/update-info"
                    className={({ isActive }) =>
                      `block py-3 px-4 text-gray-700 font-normal transition-colors hover:bg-gray-50 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : ""
                      }`
                    }
                  >
                    Cập nhật thông tin
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account/change-password"
                    className={({ isActive }) =>
                      `block py-3 px-4 text-gray-700 font-normal transition-colors hover:bg-gray-50 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : ""
                      }`
                    }
                  >
                    Đổi mật khẩu
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/account/tin-da-xem"
                    className={({ isActive }) =>
                      `block pt-3 px-4 pb-3 text-gray-700 font-normal transition-colors hover:bg-gray-50 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : ""
                      }`
                    }
                  >
                    Tin đã xem
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to=""
                    className="block py-3 px-4 text-red-600 font-normal transition-colors hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Thoát
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Outlet />
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-0">
                Cần hỗ trợ, vui lòng liên hệ:{" "}
                <a
                  href="mailto:contact@clotheshop.vn"
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  contact@clotheshop.vn
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountLayout;
