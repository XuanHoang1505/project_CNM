// src/redux/slices/authModalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showLoginSelectionModal: false,
  showLoginModal: false,
  showSignUpSelectionModal: false,
  showSignUpModal: false,
  showVerifyOtpModal: false,
  showForgotPasswordModal: false,
  showResetPasswordModal: false,
  otpInfo: null,
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const modalName = action.payload;
      state[modalName] = true;
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      state[modalName] = false;
    },
    setOtpInfo: (state, action) => {
      state.otpInfo = action.payload;
    },
    resetAllModals: (state) => {
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    },
  },
});

export const { openModal, closeModal, setOtpInfo, resetAllModals } =
  authModalSlice.actions;
export default authModalSlice.reducer;
