import axios from "axios";
import loadingService from "./loadingService";

const API = "http://localhost:8000";

const api = axios.create({
  baseURL: API,
})

api.interceptors.request.use((config) => {
  // show global loader for each outgoing request
  loadingService.increment();
  if (typeof window !== "undefined" ){
    const token = localStorage.getItem("token");
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
})

api.interceptors.response.use(
  (res) => {
    loadingService.decrement();
    return res;
  },
  (err) => {
    loadingService.decrement();
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login?reason=Session expired";
    }
    return Promise.reject(err);
  }
);

export default api;