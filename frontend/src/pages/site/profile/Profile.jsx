import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import DynamicBreadcrumb from "@/components/site/breadcrumb/Breadcrumb";
import {
  FacebookFilled,
  InstagramFilled,
  TwitterCircleFilled,
  YoutubeFilled,
  EditOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";

function Profile() {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                    <img
                      src={
                        user?.avatar ||
                        "https://cdn-img.thethao247.vn/resize_400x460//base/comment/img/avatar.png"
                      }
                      alt={user?.fullName || "User"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                    <EditOutlined className="text-base" />
                  </button>
                </div>

                {/* Info Section */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {user?.fullName || "Nguyễn Xuân Hoàng"}
                  </h1>
                  <p className="text-gray-600 mb-4">Người dùng</p>

                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6 text-gray-700">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <MailOutlined className="text-blue-600" />
                      <span className="text-sm">{user?.email || "email@example.com"}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <PhoneOutlined className="text-blue-600" />
                      <span className="text-sm">{user?.phoneNumber || "0123456789"}</span>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a
                      href="https://www.facebook.com/xuanhoang1505/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-110 shadow-md"
                    >
                      <FacebookFilled className="text-xl" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all hover:scale-110 shadow-md"
                    >
                      <InstagramFilled className="text-xl" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all hover:scale-110 shadow-md"
                    >
                      <TwitterCircleFilled className="text-xl" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-all hover:scale-110 shadow-md"
                    >
                      <YoutubeFilled className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Giới thiệu</h2>
            <p className="text-gray-600 leading-relaxed">
              Tôi là một tác giả đam mê viết lách và chia sẻ kiến thức.
              Chuyên về các chủ đề công nghệ, thể thao và đời sống.
              Luôn cập nhật những tin tức mới nhất và xu hướng nổi bật.
            </p>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
            <div className="space-y-4">

              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">Cập nhật thông tin cá nhân</p>
                  <p className="text-sm text-gray-500 mt-1">1 ngày trước</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">Đã bình luận trên bài viết</p>
                  <p className="text-sm text-gray-500 mt-1">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;