import { useState } from "react";
import { Modal, Spin } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

import { forgotPassword } from "@/services/site/AuthService";

function ForgotPasswordModal({
  show,
  handleClose,
  handleBack,
  handleForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (validateEmail()) {
      try {
        setIsLoading(true);
        const response = await forgotPassword(email);
        toast.success(response.message);
        handleForgotPassword({ identifier: email, type: "ForgotPassword" });
      } catch (error) {
        console.error("Lỗi handleSendOTP:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setEmail("");
    setErrors({});
    handleClose();
  };

  return (
    <>
      <Modal
        open={show}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={500}
        closeIcon={<span className="text-gray-400 hover:text-gray-600 text-xl">×</span>}
      >
        <div className="pt-2">
          {/* Header */}
          <div className="flex items-center mb-6">
            <ArrowLeftOutlined 
              className="text-xl cursor-pointer hover:text-gray-600 transition-colors"
              onClick={handleBack}
            />
            <h2 className="flex-1 text-center text-xl font-bold text-gray-900 pr-6">
              Quên mật khẩu
            </h2>
          </div>

          {/* Body */}
          <div className="px-2">
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Đừng lo, hãy nhập email của bạn để đặt lại mật khẩu. Chúng tôi sẽ
              hướng dẫn bạn các bước tiếp theo.
            </p>

            <div className="mb-6">
              <label 
                htmlFor="emailField" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="emailField"
                placeholder="Nhập vào email của bạn"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendOtp();
                  }
                }}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1.5">{errors.email}</div>
              )}
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingOutlined className="mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi mã OTP"
              )}
            </button>

            <p className="text-center">
              <span 
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
                onClick={handleBack}
              >
                Quay lại đăng nhập
              </span>
            </p>
          </div>
        </div>
      </Modal>

      {/* Global Loading Overlay */}
      {/* {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-[9999]">
          <Spin size="large" />
        </div>
      )} */}
    </>
  );
}

export default ForgotPasswordModal;