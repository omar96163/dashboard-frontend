import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL = "https://dashboard-backend-production-bbd4.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
