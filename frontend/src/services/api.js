import axios from "axios";
import useAuthStore from "@/store/authStore";

// Auth endpoints that should never trigger a token refresh on 401
const AUTH_ENDPOINTS = ["/auth/login/", "/auth/register/", "/auth/refresh/"];

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => original.url?.includes(ep));

    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh: refreshToken });
        const newAccess = res.data.access;
        const newRefresh = res.data.refresh; // rotated refresh token

        // Update Zustand state synchronously — no race conditions
        useAuthStore.setState((s) => ({
          accessToken: newAccess,
          refreshToken: newRefresh ?? s.refreshToken,
        }));

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        if (!window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/register")) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
