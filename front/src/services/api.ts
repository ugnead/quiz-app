import axios from "axios";
import { refreshAccessToken } from './refreshToken';

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      await refreshAccessToken();
      return api(originalRequest);
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
});

export default api;
