import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ThemeProvider from "./utils/ThemeContext";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>
);
