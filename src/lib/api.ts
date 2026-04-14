import axios from 'axios';
import Cookies from 'universal-cookie';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const cookies = new Cookies();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout — prevents hanging when backend is unreachable
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
  register: (data: { email: string; password: string; full_name: string; role?: string; phone?: string; documents?: any; categories?: string[]; experience?: string; city?: string; bio?: string }) =>
    api.post('/auth/register', data),
  verifyOtp: (data: { email: string; otp: string }) => api.post('/auth/verify-otp', data),
  resendOtp: (data: { email: string }) => api.post('/auth/resend-otp', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: (refreshToken?: string) => api.post('/auth/logout', { refresh_token: refreshToken }),
  me: () => api.get('/auth/me'),
};

export const adminApi = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  // Users
  listUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) =>
    api.get('/admin/users', { params }),
  verifyProvider: (userId: string) => api.put(`/admin/users/${userId}/verify`),
  rejectProvider: (userId: string, reason?: string) => api.put(`/admin/users/${userId}/reject`, { reason }),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  blockUser: (userId: string) => api.post(`/admin/users/${userId}/block`),
  unblockUser: (userId: string) => api.post(`/admin/users/${userId}/unblock`),
  updateUserRole: (userId: string, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
  // Bookings
  listBookings: (params?: { page?: number; limit?: number; status?: string; from_date?: string; to_date?: string }) =>
    api.get('/admin/bookings', { params }),
  // Reviews
  listReviews: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/reviews', { params }),
  // Payments
  listPayments: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/payments', { params }),
  // Analytics
  getRevenueAnalytics: (params?: { from_date?: string; to_date?: string }) =>
    api.get('/admin/analytics/revenue', { params }),
  getPopularServices: (params?: { limit?: number }) =>
    api.get('/admin/analytics/popular-services', { params }),
  // Reports
  getReports: (params: { type: string; from_date?: string; to_date?: string }) =>
    api.get('/admin/reports', { params }),
  // Settings — categories
  createCategory: (data: { name: string; description?: string; icon?: string }) =>
    api.post('/services/categories', data),
  // Document approval
  approveDocument: (providerId: string, docKey: string) =>
    api.put(`/admin/providers/${providerId}/documents/approve`, { doc_key: docKey }),
  rejectDocument: (providerId: string, docKey: string, reason?: string) =>
    api.put(`/admin/providers/${providerId}/documents/reject`, { doc_key: docKey, reason }),
};

// Users
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { full_name?: string; phone?: string; address?: string; city?: string; state?: string; bio?: string; documents?: any; latitude?: number | null; longitude?: number | null }) => api.put('/users/profile', data),
  changePassword: (data: any) => api.put('/users/change-password', data),
  uploadAvatar: async (formData: FormData) => {
    const token = new Cookies().get('accessToken') || localStorage.getItem('accessToken');
    const res = await fetch(`${BASE_URL}/users/upload-avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const d = await res.json();
    if (!res.ok) throw { response: { status: res.status, data: d } };
    return { data: d };
  },
  listProviders: (params?: { page?: number; limit?: number; city?: string }) =>
    api.get('/users/providers', { params }),
  getProvider: (id: string) => api.get(`/users/providers/${id}`),
};

// Services
export const servicesApi = {
  list: (params?: Record<string, unknown>) => api.get('/services', { params }),
  getById: (id: string) => api.get(`/services/${id}`),
  search: (params?: Record<string, unknown>) => api.get('/services/search', { params }),
  nearby: (params: { latitude: number; longitude: number; radius_km?: number; q?: string; category_id?: string; page?: number; limit?: number }) =>
    api.get('/services/nearby', { params }),
  listCategories: () => api.get('/services/categories'),
  listCategoriesAdmin: () => api.get('/services/categories/admin'),
  getProviderCities: () => api.get('/services/cities'),
  getProviderServices: (providerId: string) => api.get(`/services/provider/${providerId}`),
  create: (data: Record<string, unknown>) => api.post('/services', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
  deleteCategory: (id: string) => api.delete(`/services/categories/${id}`),
};

// Bookings
export const bookingsApi = {
  create: (data: Record<string, unknown>) => api.post('/bookings', data),
  getCustomerBookings: (params?: Record<string, unknown>) => api.get('/bookings/customer', { params }),
  getProviderBookings: (params?: Record<string, unknown>) => api.get('/bookings/provider', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  updateStatus: (id: string, data: { status: string }) => api.put(`/bookings/${id}/status`, data),
  updatePayment: (id: string, data: { payment_method?: string; payment_status?: string; transaction_id?: string }) => api.put(`/bookings/${id}/payment`, data),
};

// Provider Specific
export const providerApi = {
  getDashboardStats: () => api.get('/users/provider-stats'),
  getEarnings: () => api.get('/users/provider-earnings'),
  getServices: (providerId: string) => api.get(`/services/provider/${providerId}`),
  getBookings: (params?: Record<string, unknown>) => api.get('/bookings/provider', { params }),
  getAvailability: (providerId: string) => api.get(`/services/providers/${providerId}/availability`),
  getPublicAvailability: (providerId: string) => api.get(`/services/providers/${providerId}/availability/public`),
  createAvailability: (providerId: string, data: Record<string, unknown>) => api.post(`/services/providers/${providerId}/availability`, data),
  updateAvailability: (id: string, data: Record<string, unknown>) => api.put(`/services/availability/${id}`, data),
  deleteAvailability: (id: string) => api.delete(`/services/availability/${id}`),
  getReviews: (providerId: string) => api.get(`/reviews/provider/${providerId}`),
};

// Chat
export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId: string, params?: Record<string, unknown>) => api.get(`/chat/messages/${conversationId}`, { params }),
  sendMessage: (data: Record<string, unknown>) => api.post('/chat/send', data),
  markAsRead: (messageId: string) => api.put(`/chat/read/${messageId}`),
  uploadAttachment: (formData: FormData) => api.post('/chat/upload', formData, { headers: { 'Content-Type': undefined }, timeout: 30000 }),
  startConversation: (providerId: string) => api.post('/chat/start', { provider_id: providerId }),
};
