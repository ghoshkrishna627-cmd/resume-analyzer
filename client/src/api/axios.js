// ============================================================
// api/axios.js - Axios Configuration
// ============================================================

import axios from "axios";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // Backend server URL
  timeout: 30000,                   // 30 second timeout
});

// ─── Request Interceptor ──────────────────────────────────────
// Automatically attach JWT token to every request if user is logged in
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────
// Handle global errors (like expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired/invalid, clear auth data
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
