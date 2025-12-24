import { useState, useEffect, useRef } from "react";
import { Modal, Spin } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { verifyEmailOtp, resendOtp, verifyOtp } from "@/services/site/AuthService";

function VerifyOtpModal({
  show,
  handleCloseModal,
  otpInfo,
  handleBack,
  handleShowLoginModal,
  handleShowResetPasswordModal,
}) {
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const identifier = otpInfo?.identifier;
  const type = otpInfo?.type;
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Kiểm tra nếu không có identifier, chuyển hướng về trang login
    if (show && !identifier) {
      toast.error("Truy cập không hợp lệ, vui lòng thử lại!");
      handleShowLoginModal();
    }
    // Đặt countdown ban đầu
    setCountdown(60);
    setIsResendEnabled(false);

    // Focus vào ô đầu tiên khi modal mở
    if (show) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [identifier, show, handleShowLoginModal]);

  const handleChangeOtp = (index, value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d$/.test(value)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto verify when all 6 digits are entered
    if (newOtpArray.every((digit) => digit !== "") && index === 5) {
      handleVerifyOtp(newOtpArray.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePasteOtp = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      const newOtpArray = pasteData.split("");
      setOtpArray(newOtpArray);
      inputRefs.current[5]?.focus();
      handleVerifyOtp(pasteData);
    }
    e.preventDefault();
  };

  const validateOtp = (otp) => {
    const newErrors = {};
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "Mã OTP phải gồm 6 chữ số.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async (otp = otpArray.join("")) => {
    if (validateOtp(otp)) {
      try {
        setIsLoading(true);
        if (type === "SignUp") {
          const response = await verifyEmailOtp(identifier, otp);
          toast.success(response.message || "Xác thực OTP thành công!");
          handleShowLoginModal();
        } else if (type === "ForgotPassword") {
          const response = await verifyOtp(identifier, otp);
          toast.success(
            response.message ||
              "Xác thực OTP thành công! Vui lòng đặt lại mật khẩu."
          );
          handleShowResetPasswordModal({ identifier });
        }
      } catch (error) {
        if (!error.response) {
          toast.error(
            "Không thể kết nối đến server, vui lòng kiểm tra kết nối internet!"
          );
        } else {
          toast.error(error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (isResendEnabled) {
      try {
        setIsLoading(true);
        const message = await resendOtp(identifier);
        toast.success(message);

        // Clear các trường OTP
        setOtpArray(Array(6).fill(""));
        inputRefs.current[0]?.focus();

        // Đặt lại countdown và vô hiệu hóa nút gửi lại OTP
        setCountdown(60);
        setIsResendEnabled(false);
      } catch (error) {
        toast.error("Không thể gửi lại OTP, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    handleCloseModal();
    setOtpArray(Array(6).fill(""));
    setErrors({});
    setCountdown(60);
    setIsResendEnabled(false);
  };

  return (
    <>
      <Modal
        open={show}
        onCancel={handleClose}
        footer={null}
        centered
        width={500}
        closeIcon={
          <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
        }
      >
        <div className="pt-2">
          {/* Header */}
          <div className="flex items-center mb-6">
            <ArrowLeftOutlined
              className="text-xl cursor-pointer hover:text-gray-600 transition-colors"
              onClick={handleBack}
            />
            <h2 className="flex-1 text-center text-xl font-bold text-gray-900 pr-6">
              Xác thực OTP
            </h2>
          </div>

          {/* Body */}
          <div className="px-2">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Vui lòng nhập mã OTP được gửi đến email của bạn để tiếp tục quá
              trình xác thực.
            </p>

            <h3 className="text-center text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Nhập mã OTP
            </h3>

            {/* OTP Input Fields */}
            <div
              className="flex justify-center gap-2 mb-4"
              onPaste={handlePasteOtp}
            >
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.otp
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
                  value={digit}
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            {errors.otp && (
              <div className="text-red-500 text-sm text-center mb-4">
                {errors.otp}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="button"
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={() => handleVerifyOtp()}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingOutlined className="mr-2" />
                  Đang xác thực...
                </>
              ) : (
                "Xác thực"
              )}
            </button>

            {/* Resend OTP Section */}
            <div className="text-center mb-4">
              {isResendEnabled ? (
                <button
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors disabled:opacity-50"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Gửi lại mã OTP
                </button>
              ) : (
                <span className="text-gray-500 text-sm">
                  Gửi lại mã sau {countdown} giây
                </span>
              )}
            </div>

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

export default VerifyOtpModal;
