import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { ArrowLeftOutlined, EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { resetPassword } from "../../../../services/site/AuthService";

function ResetPasswordModal({
  show,
  handleClose,
  handleShowLoginModal,
  handleBack,
  otpInfo,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = otpInfo?.identifier;

  useEffect(() => {
    // Kiểm tra nếu không có identifier, chuyển hướng về trang login
    if (show && !email) {
      toast.error("Truy cập không hợp lệ, vui lòng thử lại!");
      handleShowLoginModal();
    }
  }, [email, show, handleShowLoginModal]);

  const validatePassword = () => {
    const newErrors = {};
    if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validatePassword()) {
      try {
        setIsLoading(true);
        const response = await resetPassword(email, password);
        toast.success(response.message);
        handleShowLoginModal();
      } catch (error) {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
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
              Đặt lại mật khẩu
            </h2>
          </div>

          {/* Body */}
          <div className="px-2">
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại mật khẩu.
            </p>

            {/* New Password Field */}
            <div className="mb-4">
              <label 
                htmlFor="passwordField" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="passwordField"
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mt-1.5">{errors.password}</div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label 
                htmlFor="confirmPasswordField" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPasswordField"
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword 
                      ? "border-red-500 focus:ring-red-200" 
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleResetPassword();
                    }
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors text-lg"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1.5">{errors.confirmPassword}</div>
              )}
            </div>

            {/* Reset Button */}
            <button
              type="button"
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingOutlined className="mr-2" />
                  Đang xử lý...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </button>

            {/* Back to Login Link */}
            <p className="text-center">
              <span 
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
                onClick={handleShowLoginModal}
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

export default ResetPasswordModal;