import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL, // http://localhost:5000
  withCredentials: true, // for credentials like cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh-token", {});
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        throw new Error(
          refreshError.response?.data?.message ||
            "Session expired. Please log in again."
        );
      }
    }

    const errorResponse = error.response?.data || {
      message: "An unexpected error occurred",
      success: false,
    };
    console.error("API call error:", error);
    throw new Error(errorResponse.message);
  }
);

// --- API Call Functions ---
export const adminLogin = (data) => api.post("/auth/login", data);
export const refreshAccessToken = () => api.post("/auth/refresh-token", {});
export const logout = () => api.post("/auth/logout", {});
export const registerAdmin = (data) => api.post("/auth/register", data);

// ✅ Corrected paths (remove /api)
export const getReturns = () => api.get("/api/returns");

export const updateReturnStatus = (returnId, status) =>
  api.put(`/api/returns/${returnId}`, { status });

export default api;
