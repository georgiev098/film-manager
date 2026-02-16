import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // send cookies (JWT stored as httpOnly cookie)
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any local auth state and redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
