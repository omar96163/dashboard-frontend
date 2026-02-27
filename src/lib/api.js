import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة token إلى جميع الطلبات
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// معالجة الأخطاء والـ 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إزالة token المنتهي الصلاحية
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // إعادة توجيه إلى صفحة تسجيل الدخول
        // يتم استخدام window.location.href بدلاً من router لتجنب dependency issues
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
