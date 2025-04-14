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

interface ProviderProps {
  token: string;
  login(data: LoginType): void;
  signUp(data: SignUpType): void;
  verifyOTP(data: VerifyOTPType): void;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  token: "",
  login: () => {},
  signUp: () => {},
  verifyOTP: () => {},
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
          // setToken(res.data.token.accessToken);
          // localStorage.setItem(
          //   "token",
          //   JSON.stringify(res.data.token.accessToken)
          // );
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
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <AuthContext.Provider value={{ token, login, verifyOTP, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
