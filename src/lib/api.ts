import axios from 'axios';
import Cookies from 'universal-cookie';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const cookies = new Cookies();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = cookies.get('accessToken') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = cookies.get('refreshToken') || localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
          const { access_token } = data;
          cookies.set('accessToken', access_token, { path: '/' });
          localStorage.setItem('accessToken', access_token);
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return api.request(error.config);
        } catch (refreshError) {
          cookies.remove('accessToken');
          cookies.remove('refreshToken');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; password: string; full_name: string; role?: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refresh_token: refreshToken }),
  me: () => api.get('/auth/me'),
};

// Users
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { full_name?: string; phone?: string }) => api.put('/users/profile', data),
  listProviders: (params?: { page?: number; limit?: number; city?: string }) =>
    api.get('/users/providers', { params }),
  getProvider: (id: string) => api.get(`/users/providers/${id}`),
};

// Services
export const servicesApi = {
  list: (params?: Record<string, unknown>) => api.get('/services', { params }),
  getById: (id: string) => api.get(`/services/${id}`),
  search: (params?: Record<string, unknown>) => api.get('/services/search', { params }),
  listCategories: () => api.get('/services/categories'),
};

// Bookings
export const bookingsApi = {
  create: (data: Record<string, unknown>) => api.post('/bookings', data),
  getCustomerBookings: (params?: Record<string, unknown>) => api.get('/bookings/customer', { params }),
  getProviderBookings: (params?: Record<string, unknown>) => api.get('/bookings/provider', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  updateStatus: (id: string, data: { status: string }) => api.put(`/bookings/${id}/status`, data),
};
