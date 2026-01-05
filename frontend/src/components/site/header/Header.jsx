import { User, ShoppingCart, LogOut, Settings, ShoppingBag, Heart, MapPin, Search, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { UserContext } from "@/contexts/UserContext";
import {
  openModal,
  closeModal,
  setOtpInfo,
  resetAllModals,
} from "@/redux/slices/authModalSlice";

import LoginSelectionModal from "@/pages/site/auth/loginSelectionModal/LoginSelectionModal";
import LoginModal from "@/pages/site/auth/loginModal/LoginModal";
import SignUpSelectionModal from "@/pages/site/auth/signUpSelectionModal/SignUpSelectionModal";
import SignUpModal from "@/pages/site/auth/signUpModal/SignUpModal";
import VerifyOtpModal from "@/pages/site/auth/verifyOtpModal/VerifyOtpModal";
import ForgotPasswordModal from "@/pages/site/auth/forgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "@/pages/site/auth/resetPasswordModal/ResetPasswordModal";

import { logout } from "@/services/site/AuthService";
import { Dropdown } from "antd";

const Header = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Update cart count whenever localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates in the same tab
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  const handleCloseBanner = () => {
    setIsBannerVisible(false);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    showLoginSelectionModal,
    showLoginModal,
    showSignUpSelectionModal,
    showSignUpModal,
    showVerifyOtpModal,
    showForgotPasswordModal,
    showResetPasswordModal,
    otpInfo,
  } = useSelector((state) => state.authModal);
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      dispatch(resetAllModals());
    }
  }, [user, dispatch]);

  const handleShowVerifyOtpModal = (info) => {
    dispatch(setOtpInfo(info));
    dispatch(closeModal("showSignUpModal"));
    dispatch(openModal("showVerifyOtpModal"));
  };

  const handleForgotPassword = (info) => {
    dispatch(setOtpInfo(info));
    dispatch(closeModal("showForgotPasswordModal"));
    dispatch(openModal("showVerifyOtpModal"));
  };

  const handleLogout = async () => {
    logout(user.id);
    updateUser(null);
    navigate("/");
  };

  // Handle search navigation
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery(""); 
    }
  };

  // Handle Enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  console.log(">>>check user",user);
  

  const menuItems = [
    {
      key: "profile",
      label: (
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-600" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{user?.fullName}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
        </div>
      ),
      onClick: () => navigate("/account/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "orders",
      label: (
        <div className="flex items-center gap-3 py-1">
          <ShoppingBag size={18} className="text-gray-600" />
          <span>Đơn hàng của tôi</span>
        </div>
      ),
      onClick: () => navigate("/account/my-order"),
    },
    {
      key: "wishlist",
      label: (
        <div className="flex items-center gap-3 py-1">
          <Heart size={18} className="text-gray-600" />
          <span>Danh sách yêu thích</span>
        </div>
      ),
      onClick: () => navigate("/wishlist"),
    },
    {
      key: "addresses",
      label: (
        <div className="flex items-center gap-3 py-1">
          <MapPin size={18} className="text-gray-600" />
          <span>Địa chỉ của tôi</span>
        </div>
      ),
      onClick: () => navigate("/addresses"),
    },
    {
      key: "settings",
      label: (
        <div className="flex items-center gap-3 py-1">
          <Settings size={18} className="text-gray-600" />
          <span>Cài đặt tài khoản</span>
        </div>
      ),
      onClick: () => navigate("/account/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center gap-3 py-1 text-red-600">
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];
  
  return (
    <>
      {/* Top Banner */}
      {isBannerVisible && !user && (
        <div className=" text-white bg-black text-center py-2 text-sm">
          Sign up and get 20% off to your first order.{" "}
          <span className="underline cursor-pointer" onClick={() => dispatch(openModal("showSignUpSelectionModal"))}>Sign Up Now</span>
          <button
            className="absolute right-4 top-1 text-white text-lg cursor-pointer"
            onClick={handleCloseBanner}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={'/'} className="text-4xl font-extrabold cursor-pointer text-black">SHOP.CO</Link>
          
          <nav className="hidden md:flex space-x-6 text-md">
            <NavLink to={'/shop'} className={({ isActive }) => isActive ? "text-gray-900 font-semibold" : "hover:text-gray-600"}>
              Shop
            </NavLink>
            <a href="#" className="hover:text-gray-600">
              On Sale
            </a>
            <a href="#" className="hover:text-gray-600">
              New Arrivals
            </a>
            <a href="#" className="hover:text-gray-600">
              Brands
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Search Input with Enter Key Support */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search for products..."
                className="border rounded-full pl-10 pr-10 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Shopping Cart with Badge */}
            <div className="relative">
              <ShoppingCart
                size={24}
                className="cursor-pointer hover:text-gray-900 transition-colors"
                onClick={() => navigate("/cart")}
              />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </div>
            
            {!user ? (
              <User
                size={24}
                className="cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => dispatch(openModal("showLoginSelectionModal"))}
              />
            ) : (
              <Dropdown
                menu={{ items: menuItems }}
                trigger={["click"]}
                placement="bottomRight"
                overlayClassName="user-dropdown"
              >
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="text-gray-600" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.fullName}
                  </span>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </header>

      <LoginSelectionModal
        show={showLoginSelectionModal}
        handleClose={() => dispatch(closeModal("showLoginSelectionModal"))}
        handleShowLoginModal={() => {
          dispatch(closeModal("showLoginSelectionModal"));
          dispatch(openModal("showLoginModal"));
        }}
        handleShowSignUpModal={() => {
          dispatch(closeModal("showLoginSelectionModal"));
          dispatch(openModal("showSignUpSelectionModal"));
        }}
      />
      <SignUpSelectionModal
        show={showSignUpSelectionModal}
        handleClose={() => dispatch(closeModal("showSignUpSelectionModal"))}
        handleShowSignUpModal={() => {
          dispatch(closeModal("showSignUpSelectionModal"));
          dispatch(openModal("showSignUpModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showSignUpSelectionModal"));
          dispatch(openModal("showLoginSelectionModal"));
        }}
      />
      <LoginModal
        show={showLoginModal}
        handleClose={() => dispatch(closeModal("showLoginModal"))}
        handleBack={() => {
          dispatch(closeModal("showLoginModal"));
          dispatch(openModal("showLoginSelectionModal"));
        }}
        handleShowSignUpModal={() => {
          dispatch(closeModal("showLoginModal"));
          dispatch(openModal("showSignUpSelectionModal"));
        }}
        handleShowForgotPasswordModal={() => {
          dispatch(closeModal("showLoginModal"));
          dispatch(openModal("showForgotPasswordModal"));
        }}
      />
      <SignUpModal
        show={showSignUpModal}
        handleClose={() => dispatch(closeModal("showSignUpModal"))}
        handleBack={() => {
          dispatch(closeModal("showSignUpModal"));
          dispatch(openModal("showSignUpSelectionModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showSignUpModal"));
          dispatch(openModal("showLoginSelectionModal"));
        }}
        handleShowVerifyOtpModal={handleShowVerifyOtpModal}
      />
      <VerifyOtpModal
        show={showVerifyOtpModal}
        otpInfo={otpInfo}
        handleCloseModal={() => dispatch(closeModal("showVerifyOtpModal"))}
        handleBack={() => {
          dispatch(closeModal("showVerifyOtpModal"));
          dispatch(openModal("showSignUpModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showVerifyOtpModal"));
          dispatch(openModal("showLoginModal"));
        }}
        handleShowResetPasswordModal={() => {
          dispatch(closeModal("showVerifyOtpModal"));
          dispatch(openModal("showResetPasswordModal"));
        }}
      />
      <ForgotPasswordModal
        show={showForgotPasswordModal}
        handleClose={() => dispatch(closeModal("showForgotPasswordModal"))}
        handleBack={() => {
          dispatch(closeModal("showForgotPasswordModal"));
          dispatch(openModal("showLoginModal"));
        }}
        handleShowVerifyOtpModal={() => {
          dispatch(closeModal("showForgotPasswordModal"));
          dispatch(openModal("showVerifyOtpModal"));
        }}
        handleForgotPassword={handleForgotPassword}
      />
      <ResetPasswordModal
        show={showResetPasswordModal}
        otpInfo={otpInfo}
        handleClose={() => dispatch(closeModal("showResetPasswordModal"))}
        handleBack={() => {
          dispatch(closeModal("showResetPasswordModal"));
          dispatch(openModal("showVerifyOtpModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showResetPasswordModal"));
          dispatch(openModal("showLoginModal"));
        }}
      />
    </>
  );
};

export default Header;