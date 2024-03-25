import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Function to attach JWT with each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default api;
