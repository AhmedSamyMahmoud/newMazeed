import { useContext, createContext, useState } from "react";
import axios from "axios";
import { ToasterContext } from "../helpers/toasterProvider";
type LoginType = {
  email: string;
  password: string;
};
type SignUpType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};
type VerifyOTPType = {
  email: string;
  OTPCode: string;
  purpose: number;
};
type ResetPasswordType = {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmNewPassword: string;
};

interface ProviderProps {
  token: any;
  login(data: LoginType): void;
  signUp(data: SignUpType): void;
  verifyOTP(data: VerifyOTPType): void;
  sendResetEmail(email: string): void;
  resetPassword(data: ResetPasswordType): void;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  token: {},
  login: () => {},
  signUp: () => {},
  verifyOTP: () => {},
  sendResetEmail: () => {},
  resetPassword: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { showToast } = useContext(ToasterContext);
  const storedToken = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") || "")
    : null;
  const [token, setToken] = useState(storedToken);
  //TODO: add loading state

  const login = async (data: LoginType) => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/Auth/login`, data)
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          setToken(res.data.token);
          localStorage.setItem("token", JSON.stringify(res.data.token));
          window.location.href = "/";
        }
      })
      .catch((err) => {
        showToast({
          message: err?.response?.data?.message || "Something went wrong",
          type: "error",
          title: "Error",
        });
      });
  };
  const signUp = async (data: SignUpType) => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/Auth/register`, data)
      .then((res) => {
        if (res.status === 200) {
          showToast({
            message: "OTP sent to your email",
            type: "success",
            title: "Success",
          });
          axios.post(`${import.meta.env.VITE_API_BASE_URL}/Auth/verifyOTP`, {
            email: data.email,
            purpose: 0,
          });
          setToken(res.data.token);
          localStorage.setItem("token", JSON.stringify(res.data.token));
          window.location.href = "/verifyOTP";
        }
      })
      .catch((err) => {
        showToast({
          message: err?.response?.data?.message || "Something went wrong",
          type: "error",
          title: "Error",
        });
      });
  };
  const verifyOTP = async (data: VerifyOTPType) => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/Auth/verify-otp`, data)
      .then((res) => {
        console.log(res);

        if (res.status === 200) {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        showToast({
          message: err?.response?.data?.message || "Something went wrong",
          type: "error",
          title: "Error",
        });
      });
  };
  const sendResetEmail = async (email: string) => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/Auth/forgot-password`, {
        email: email,
      })
      .then((res) => {
        if (res.status === 200) {
          showToast({
            message: "Reset password email has been sent!",
            type: "success",
            title: "success",
          });
          setTimeout(() => {
            window.location.href = `/reset-password?email=${email}`;
          }, 1000);
        }
      })
      .catch((err) => {
        showToast({
          message: err?.response?.data?.message || "Something went wrong",
          type: "error",
          title: "Error",
        });
      });
  };
  const resetPassword = async (data: ResetPasswordType) => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/Auth/reset-password`, data)
      .then((res) => {
        if (res.status === 200) {
          showToast({
            message: "Password reset successfully",
            type: "success",
            title: "success",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
      })
      .catch((err) => {
        showToast({
          message: err?.response?.data?.message || "Something went wrong",
          type: "error",
          title: "Error",
        });
      });
  };
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        verifyOTP,
        sendResetEmail,
        signUp,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
