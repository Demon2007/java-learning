import api from "./api";

const lessonsService = {
  getCategories: () => api.get("/lessons/categories/"),
  getCategory: (slug) => api.get(`/lessons/categories/${slug}/`),
  getLessons: (params) => api.get("/lessons/", { params }),
  getLesson: (slug) => api.get(`/lessons/${slug}/`),
  completeLesson: (id) => api.post(`/lessons/${id}/complete/`),
  getQuiz: (lessonId) => api.get(`/lessons/${lessonId}/quiz/`),
  submitQuiz: (quizId, answers) => api.post(`/lessons/quiz/${quizId}/submit/`, { answers }),
  getProgress: () => api.get("/lessons/progress/overview/"),
};

export default lessonsService;
