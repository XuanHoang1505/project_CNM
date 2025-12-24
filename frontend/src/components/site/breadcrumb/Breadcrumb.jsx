import { NavLink, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

function DynamicBreadcrumb({ category }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  let breadcrumbItems = [
    {
      title: (
        <NavLink to="/" className="flex items-center gap-1 hover:text-blue-600">
          <HomeOutlined />
          <span>Trang chủ</span>
        </NavLink>
      ),
    },
  ];

  if (category) {
    // ---- Trường hợp trang tin tức / danh mục
    if (category.parentName && category.parentSlug) {
      breadcrumbItems.push({
        title: (
          <NavLink
            to={`/category/${category.parentSlug}`}
            className="hover:text-blue-600"
          >
            {category.parentName}
          </NavLink>
        ),
      });
    }

    breadcrumbItems.push({
      title: category.name,
    });
  } else {
    // ---- Trường hợp trang account (hoặc các page khác không có category)
    const filteredPathnames = pathnames.filter((name) => name !== "account");

    filteredPathnames.forEach((name, index, arr) => {
      let label;
      switch (name) {
        case "update-info":
          label = "Quản lý tài khoản";
          break;
        case "change-password":
          label = "Đổi mật khẩu";
          break;
        case "watch-history":
          label = "Tin đã xem";
          break;
        case "profile":
          label = "Trang cá nhân";
          break;
        case "my-order":
          label = "Đơn hàng của tôi";
          break;
        case "submit":
          label = "Gửi bài báo";
          break;
        default:
          label = name;
      }

      const path = "/" + arr.slice(0, index + 1).join("/");
      const isLast = index === filteredPathnames.length - 1;

      breadcrumbItems.push({
        title: isLast ? (
          label
        ) : (
          <NavLink to={path} className="hover:text-blue-600">
            {label}
          </NavLink>
        ),
      });
    });
  }

  return (
    <div className="border-b border-dotted border-gray-300 py-3">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </div>
  );
}

export default DynamicBreadcrumb;