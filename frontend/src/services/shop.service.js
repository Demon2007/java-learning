import api from "./api";

const shopService = {
  getItems: (type) => api.get("/shop/", { params: type ? { type } : {} }),
  purchase: (id) => api.post(`/shop/${id}/purchase/`),
};

export default shopService;
