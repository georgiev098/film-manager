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
    // If we get a 401, we just pass it along.
    if (error.response?.status === 401) {
      console.warn("Unauthorized! User session may have expired.");
    }
    return Promise.reject(error);
  },
);

export default api;
