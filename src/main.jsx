import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./apis/auth.tsx";
import Login from "./pages/login/index.tsx";
import Home from "./pages/home/index.tsx";
import Signup from "./pages/signup/index.tsx";
import OTPVerify from "./pages/verifyOTP/index.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import { ToastProvider } from "./helpers/toasterProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verifyOTP",
    element: <OTPVerify />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
