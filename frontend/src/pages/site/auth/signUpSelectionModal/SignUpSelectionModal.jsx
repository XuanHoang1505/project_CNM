import React from "react";
import { Modal } from "antd";
import { MailOutlined } from "@ant-design/icons";
import iconFB from "@/assets/site/icons/facebook.png";
import iconGG from "@/assets/site/icons/google.png";

const SignUpSelectionModal = ({
  show,
  handleClose,
  handleShowSignUpModal,
  handleShowLoginModal,
}) => {
  return (
    <Modal
      open={show}
      onCancel={handleClose}
      footer={null}
      centered
      width={480}
      closeIcon={<span className="text-gray-400 hover:text-gray-600 text-xl">×</span>}
    >
      <div className="pt-2 pb-4">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Đăng ký
        </h2>

        {/* Body */}
        <div className="px-4">
          <p className="text-center text-gray-600 text-sm leading-relaxed mb-8">
            Tạo tài khoản của bạn, có thể lưu lại lịch sử xem và mục yêu thích
            trên nhiều thiết bị.
          </p>

          {/* Sign Up Buttons */}
          <div className="space-y-3 mb-6">
            {/* Email Sign Up Button */}
            <button
              onClick={handleShowSignUpModal}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
            >
              <MailOutlined className="text-lg" />
              <span>Sử dụng Email để Đăng ký</span>
            </button>

            {/* Google Sign Up Button */}
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
            >
              <img src={iconGG} width={24} height={24} alt="Google" className="object-contain" />
              <span>Sử dụng Google để Đăng ký</span>
            </button>

            {/* Facebook Sign Up Button */}
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
            >
              <img src={iconFB} width={24} height={24} alt="Facebook" className="object-contain" />
              <span>Sử dụng Facebook để Đăng ký</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <span
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold transition-colors"
              onClick={handleShowLoginModal}
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpSelectionModal;