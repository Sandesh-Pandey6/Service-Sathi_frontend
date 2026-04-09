import { api } from '@/lib/api';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  image?: string;
  is_read: boolean;
  read_at?: string;
  is_clicked: boolean;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: PaginationMeta;
  unread_count: number;
}

export const notificationsApi = {
  async getNotifications(params?: { page?: number; limit?: number; unread_only?: boolean }) {
    const response = await api.get<{ success: boolean; data: NotificationsResponse }>('/notifications', { params });
    return response.data.data;
  },

  async markAsRead(id: string) {
    const response = await api.put<{ success: boolean; message: string }>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put<{ success: boolean; message: string }>('/notifications/read-all');
    return response.data;
  },
};
