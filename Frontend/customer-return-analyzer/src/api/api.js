import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
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
export const adminLogin = async (data) =>
  await api.post("/auth/login", data);

export const refreshAccessToken = async () =>
  await api.post("/auth/refresh-token", {});

export const logout = async () =>
  await api.post("/auth/logout", {});

export const registerAdmin = async (data) =>
  await api.post("/auth/register", data);

export const getReturns = async () =>
  await api.get("/returns");

export const updateReturnStatus = async (returnId, status) =>
  await api.put(`/returns/${returnId}`, { status });

export default api;
