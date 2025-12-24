import React, { useEffect } from "react";
import { Modal } from "antd";
import { LockOutlined } from "@ant-design/icons";
import iconFB from "@/assets/site/icons/facebook.png";
import iconGG from "@/assets/site/icons/google.png";

// import { googleLogin, facebookLogin } from "../../../../services/site/ExternalAuthService";

const LoginSelectionModal = ({
  show,
  handleClose,
  handleShowLoginModal,
  handleShowSignUpModal,
}) => {
  // useEffect(() => {
  //   // Load Facebook SDK
  //   window.fbAsyncInit = function () {
  //     window.FB.init({
  //       appId: "YOUR_FACEBOOK_APP_ID", // ⚠️ thay bằng AppId FB của bạn
  //       cookie: true,
  //       xfbml: true,
  //       version: "v19.0",
  //     });
  //   };

  //   (function (d, s, id) {
  //     let js,
  //       fjs = d.getElementsByTagName(s)[0];
  //     if (d.getElementById(id)) {
  //       return;
  //     }
  //     js = d.createElement(s);
  //     js.id = id;
  //     js.src = "https://connect.facebook.net/en_US/sdk.js";
  //     fjs.parentNode.insertBefore(js, fjs);
  //   })(document, "script", "facebook-jssdk");
  // }, []);

  // // ===== GOOGLE LOGIN =====
  // const handleGoogleLogin = () => {
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id: "727146363826-0vlu2b0jg50faur3fu9rpmktnpuaqumi.apps.googleusercontent.com",
  //     callback: async (response) => {
  //       try {
  //         const id_token = response.credential;
  //         const result = await googleLogin(id_token); // gọi API backend
  //         console.log("Google login success:", result);
  //         handleClose();
  //       } catch (err) {
  //         console.error("Google login failed:", err);
  //       }
  //     },
  //   });

  //   google.accounts.id.prompt(); // hiện popup chọn tài khoản
  // };

  // ===== FACEBOOK LOGIN =====
  // const handleFacebookLogin = () => {
  //   window.FB.login(
  //     async (response) => {
  //       if (response.authResponse) {
  //         const accessToken = response.authResponse.accessToken;
  //         try {
  //           const result = await facebookLogin(accessToken); // gọi API backend
  //           console.log("Facebook login success:", result);
  //           handleClose();
  //         } catch (err) {
  //           console.error("Facebook login failed:", err);
  //         }
  //       }
  //     },
  //     { scope: "public_profile,email" }
  //   );
  // };

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
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
            >
              <LockOutlined className="text-lg" />
              <span>Đăng nhập bằng Tài khoản Clothes Shop</span>
            </button>

            {/* Google Login Button */}
            <button
              // onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
            >
              <img
                src={iconGG}
                width={24}
                height={24}
                alt="Google"
                className="object-contain"
              />
              <span>Đăng nhập bằng Google</span>
            </button>

            {/* Facebook Login Button */}
            <button
              // onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
            >
              <img
                src={iconFB}
                width={24}
                height={24}
                alt="Facebook"
                className="object-contain"
              />
              <span>Đăng nhập bằng Facebook</span>
            </button>
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
