
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true; 

      try {
        const res = await api.post('/auth/refresh-token', {}); 
        return api(originalRequest);
      } catch (refreshError) { 
        console.error('Refresh token failed (from interceptor):', refreshError);
        throw new Error(refreshError.response?.data?.message || 'Session expired. Please log in again.');
      }
    }

    const errorResponse = error.response?.data || { message: 'An unexpected error occurred', success: false };
    console.error("API call error:", error);
    throw new Error(errorResponse.message || 'An unexpected error occurred.');
  }
);


// --- API Call Functions ---
export const adminLogin = async (data) => {
    const response = await api.post('/auth/login', data);
    return response; 
};

export const refreshAccessToken = async () => {
    const response = await api.post('/auth/refresh-token', {});
    return response; 
};
export const logout = async () => api.post('/auth/logout', {});


export const registerAdmin = async (data) => api.post('/auth/register', data);

//api call for fetching the dashboard data
export const getDashboardData = async () => api.get('/dashboard');

export const getCustomers = async (params) => api.get('/customers', { params }); // Removed type annotation

/**
 * Fetches a single customer's data by ID.
 * @param {string} id - The Mongoose _id of the customer.
 * @returns {Promise<object>} - A single customer object.
 */
export const getCustomerById = async (id) => api.get(`/customers/${id}`); // Removed type annotation


export default api;