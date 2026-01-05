import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeProvider from "./utils/ThemeContext";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import '@ant-design/v5-patch-for-react-19';
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <UserProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </UserProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
