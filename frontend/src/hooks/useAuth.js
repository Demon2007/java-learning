import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import authService from "@/services/auth.service";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    try {
      const res = await authService.login(email, password);
      const { tokens, user } = res.data.data;
      setAuth(user, tokens.access, tokens.refresh);
      toast.success(`Welcome back, ${user.username}!`);
      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(message);
      return { success: false, message };
    }
  }, [setAuth, navigate]);

  // Returns field-level errors so the form can show them inline
  const register = useCallback(async (username, email, password, setFormError) => {
    try {
      const res = await authService.register(username, email, password);
      const { tokens, user } = res.data.data;
      setAuth(user, tokens.access, tokens.refresh);
      toast.success(`Welcome to JavaQuest, ${user.username}!`);
      navigate("/dashboard");
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors || {};
      // Set inline errors on the form fields if setFormError is provided
      if (setFormError && Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, messages]) => {
          const msg = Array.isArray(messages) ? messages[0] : messages;
          setFormError(field, { type: "server", message: msg });
        });
      } else {
        const message = Object.values(errors).flat().join(" ") || "Registration failed.";
        toast.error(message);
      }
      return { success: false, errors };
    }
  }, [setAuth, navigate]);

  const logout = useCallback(async () => {
    try {
      const refresh = useAuthStore.getState().refreshToken;
      if (refresh) await authService.logout(refresh);
    } catch {}
    storeLogout();
    navigate("/");
    toast.success("Logged out successfully.");
  }, [storeLogout, navigate]);

  return { user, isAuthenticated, isLoading, login, register, logout };
}
