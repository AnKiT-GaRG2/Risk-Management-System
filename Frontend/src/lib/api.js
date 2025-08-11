import axios from 'axios';

// Determine the API URL based on environment
const getApiUrl = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // If in production, use relative URLs (assumes frontend and backend are on same domain)
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.status);
    return response.data;
  },
  async (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true; 

      try {
        const res = await api.post('/auth/refresh-token', {}); 
        return api(originalRequest);
      } catch (refreshError) { 
        console.error('Refresh token failed (from interceptor):', refreshError);
        // Redirect to login page or clear stored tokens
        window.location.href = '/login';
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

export const getAnalyticsData = async (period = '12months') => {
  try {
    // Log the request being made
    console.log(`Fetching analytics data with period: ${period}`);
    
    // Make the API call
    const response = await api.get(`/analytics?period=${period}`);
    
    // Log success
    console.log('Analytics API call successful:', response);
    
    return response; // response interceptor already returns response.data
  } catch (error) {
    // Log detailed error information
    console.error("Analytics API call failed:", error);
    throw error;
  }
};
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

export const getReturnStats = async () => api.get('/returns/stats');
export const getReturns = async (params) => api.get('/returns', { params });
export const getReturnById = async (id) => api.get(`/returns/${id}`);


export default api;