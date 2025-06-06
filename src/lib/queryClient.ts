import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios from "axios";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function isTokenExpired() {
  const expiresAt = JSON.parse(
    localStorage.getItem("token") || "null"
  )?.expiresAt;
  return Date.now() >= new Date(expiresAt).getTime();
}

const token = JSON.parse(localStorage.getItem("token") || "null")?.accessToken;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "text/plain",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${token}`;
  if (isTokenExpired()) {
    try {
      const response = await axios.post(
        "https://api.mazeed.ai/api/Auth/refresh-token",
        {
          refreshToken: JSON.parse(localStorage.getItem("token") || "{}")
            ?.refreshToken,
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.setItem("token", JSON.stringify(response.data));
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("Refresh token error:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  }
  return config;
});

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
