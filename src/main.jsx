import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./apis/auth.tsx";
import Login from "./pages/login/index.tsx";
import Home from "./pages/home/index.tsx";
import Signup from "./pages/signup/index.tsx";
import OTPVerify from "./pages/verifyOTP/index.tsx";
import { ThemeProvider } from "./theme/ThemeProvider.tsx";
import { ToastProvider } from "./helpers/toasterProvider.tsx";
import ForgotPassword from "./pages/forgot-password/index.tsx";
import ResetPassword from "./pages/reset-password/index.tsx";
import Pricing from "./pages/plan/index.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/dashboard",
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
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/plans",
    element: <Pricing />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
