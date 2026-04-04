import { get, post } from './apiClient';

// ---------- API Functions ----------

export const getConversationsApi = () =>
  get<{ conversations: Record<string, unknown>[] }>('/chat/conversations');

export const getMessagesApi = (bookingId: string, params?: { page?: number; limit?: number }) =>
  get<{ messages: Record<string, unknown>[]; total: number }>(`/chat/${bookingId}/messages`, { params });

export const sendMessageApi = (bookingId: string, data: { message_text: string; attachments?: string[] }) =>
  post<Record<string, unknown>>(`/chat/${bookingId}/messages`, data);
