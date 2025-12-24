import { configureStore } from "@reduxjs/toolkit";
import authModalReducer from "./slices/authModalSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    authModal: authModalReducer,
    theme: themeReducer,
  },
});

export default store;
