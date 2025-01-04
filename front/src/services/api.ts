import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { refreshAccessToken } from "./refreshToken";
import { logoutUser } from "./auth";

interface FailedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (value: AxiosError) => void;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1/",
});

let isRefreshing = false;
let failedRequestsQueue: FailedRequest[] = [];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await refreshAccessToken();

          failedRequestsQueue.forEach(async ({ resolve, reject }) => {
            try {
              const response = await api(originalRequest);
              resolve(response);
            } catch (error) {
              reject(error as AxiosError);
            }
          });

          return await api(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);

          failedRequestsQueue.forEach(({ reject }) =>
            reject(refreshError as AxiosError)
          );
          window.dispatchEvent(new Event("logout"));

          return Promise.reject(refreshError);
        } finally {
          failedRequestsQueue = [];
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: async () => {
              resolve(await api(originalRequest));
            },
            reject,
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
