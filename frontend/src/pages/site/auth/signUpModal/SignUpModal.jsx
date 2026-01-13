import { useState } from "react";
import { Modal } from "antd";
import { ArrowLeftOutlined, EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { register } from "@/services/site/AuthService";

function SignUpModal({
  show,
  handleClose,
  handleBack,
  handleShowLoginModal,
  handleShowVerifyOtpModal,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    }

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      try {
        setIsLoading(true);
        const userData = {
          full_name: fullName,
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        };

        const response = await register(userData);
        toast.success(response.message || "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");

        handleShowVerifyOtpModal({ identifier: email, type: "SignUp" });
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Đã xảy ra lỗi vui lòng thử lại sau!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Modal
      open={show}
      onCancel={handleCloseModal}
      footer={null}
      centered
      width={520}
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
            Đăng ký bằng tài khoản
          </h2>
        </div>

        {/* Body */}
        <div className="px-2">
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            {/* Full Name Field */}
            <div className="mb-4">
              <label 
                htmlFor="fullNameField" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="fullNameField"
                placeholder="Nhập họ và tên"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <div className="text-red-500 text-sm mt-1.5">{errors.fullName}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label 
                htmlFor="emailField" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="emailField"
                placeholder="Nhập vào email"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1.5">{errors.email}</div>
              )}
            </div>

            {/* Password Fields - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Password Field */}
              <div>
                <label 
                  htmlFor="passwordField" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordField"
                    placeholder="Mật khẩu"
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
              <div>
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
                    placeholder="Xác nhận mật khẩu"
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword 
                        ? "border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingOutlined className="mr-2" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <span
                  className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors"
                  onClick={handleShowLoginModal}
                >
                  Đăng nhập
                </span>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 leading-relaxed">
              Nhấn chọn "Đăng ký" có nghĩa là bạn đã đọc và đồng ý{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Thỏa thuận quyền riêng tư
              </a>{" "}
              &{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                Điều khoản dịch vụ
              </a>
              , đồng thời có nghĩa là bạn xác nhận đã tròn 18 tuổi có thể sử dụng dịch vụ của chúng tôi
            </p>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default SignUpModal;