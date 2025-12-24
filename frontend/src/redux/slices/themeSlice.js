// src/store/slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarShow: true,
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setSidebarShow, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
