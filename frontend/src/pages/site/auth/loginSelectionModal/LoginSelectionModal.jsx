import React, { useState } from "react";
import { Modal } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { toast } from "react-toastify";
import iconFB from "@/assets/site/icons/facebook.png";
import iconGG from "@/assets/site/icons/google.png";

import { googleLogin, facebookLogin } from "../../../../services/site/ExternalAuthService";
import { useNavigate } from "react-router-dom";

const LoginSelectionModal = ({
  show,
  handleClose,
  handleShowLoginModal,
  handleShowSignUpModal,
}) => {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const navigate = useNavigate();


  const handleGoogleSuccess = async (credentialResponse) => {
    setLoadingGoogle(true);
    try {
      const result = await googleLogin(credentialResponse.credential);
      console.log("Google login success:", result);
      
      toast.success("Đăng nhập thành công!");
      handleClose();

      if(result.user.role == "ADMIN")
        navigate('/admin');
      
      // Reload hoặc redirect sau khi đăng nhập thành công
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Đăng nhập Google thất bại!");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    toast.error("Đăng nhập Google thất bại!");
  };

  // ===== FACEBOOK LOGIN =====
  const handleFacebookSuccess = async (response) => {
    if (response.accessToken) {
      setLoadingFacebook(true);
      try {
        const result = await facebookLogin(response.accessToken);
        console.log("Facebook login success:", result);
        
        toast.success("Đăng nhập thành công!");
        handleClose();
        
        // Reload hoặc redirect sau khi đăng nhập thành công
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (err) {
        console.error("Facebook login failed:", err);
        toast.error("Đăng nhập Facebook thất bại!");
      } finally {
        setLoadingFacebook(false);
      }
    }
  };

  const handleFacebookError = (error) => {
    console.error("Facebook login error:", error);
    toast.error("Đăng nhập Facebook thất bại!");
  };

  return (
    <Modal
      open={show}
      onCancel={handleClose}
      footer={null}
      centered
      width={480}
      closeIcon={
        <span className="text-gray-400 hover:text-gray-600 text-xl">×</span>
      }
    >
      <div className="pt-2 pb-4">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Đăng nhập
        </h2>

        {/* Body */}
        <div className="px-4">
          <p className="text-center text-gray-600 text-sm leading-relaxed mb-8">
            Bạn có thể quản lý tài khoản sau khi đăng nhập, đồng bộ lịch sử xem
            và mục yêu thích trên nhiều thiết bị.
          </p>

          {/* Login Buttons */}
          <div className="space-y-3 mb-6">
            {/* Account Login Button */}
            <button
              onClick={handleShowLoginModal}
              disabled={loadingGoogle || loadingFacebook}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LockOutlined className="text-lg" />
              <span>Đăng nhập bằng Tài khoản Clothes Shop</span>
            </button>

            {/* Google Login Button - Wrapper */}
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="continue_with"
                shape="rectangular"
                logo_alignment="left"
                width="100%"
                disabled={loadingGoogle || loadingFacebook}
              />
            </div>

            {/* Facebook Login Button */}
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              onSuccess={handleFacebookSuccess}
              onFail={handleFacebookError}
              onProfileSuccess={(response) => {
                console.log("Get Profile Success:", response);
              }}
              render={({ onClick }) => (
                <button
                  onClick={onClick}
                  disabled={loadingGoogle || loadingFacebook}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={iconFB}
                    width={24}
                    height={24}
                    alt="Facebook"
                    className="object-contain"
                  />
                  <span>
                    {loadingFacebook ? "Đang xử lý..." : "Đăng nhập bằng Facebook"}
                  </span>
                </button>
              )}
            />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Bạn không có tài khoản?{" "}
            <span
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-semibold transition-colors"
              onClick={handleShowSignUpModal}
            >
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginSelectionModal;