import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token to requests if present in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("yt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;