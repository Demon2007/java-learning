import api from "./api";

const gamificationService = {
  getAchievements: () => api.get("/gamification/achievements/"),
  getTitles: () => api.get("/gamification/titles/"),
  getUserTitles: () => api.get("/gamification/my-titles/"),
  setActiveTitle: (id) => api.post(`/gamification/titles/${id}/activate/`),
  removeTitle: () => api.post("/gamification/titles/remove/"),
  getUserFrames: () => api.get("/gamification/my-frames/"),
  setActiveFrame: (id) => api.post(`/gamification/frames/${id}/activate/`),
  getLeaderboard: () => api.get("/gamification/leaderboard/"),
};

export default gamificationService;
