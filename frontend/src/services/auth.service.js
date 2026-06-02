import api from "./api";

const authService = {
  login: (email, password) => api.post("/auth/login/", { email, password }),
  register: (username, email, password) => api.post("/auth/register/", { username, email, password, password2: password }),
  logout: (refresh) => api.post("/auth/logout/", { refresh }),
  getProfile: () => api.get("/users/profile/"),
  updateProfile: (data) => api.patch("/users/profile/", data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/users/avatar/", formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
  deleteAvatar: () => api.delete("/users/avatar/"),
  changePassword: (data) => api.post("/users/change-password/", data),
  dailyLogin: () => api.post("/users/daily-login/"),
};

export default authService;
