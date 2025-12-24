// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// Tạo Context cho theme
const ThemeContext = createContext();

// Custom hook để sử dụng ThemeContext dễ dàng hơn
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  return useContext(ThemeContext);
};

// ThemeProvider sẽ cung cấp giá trị context cho các component con
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
