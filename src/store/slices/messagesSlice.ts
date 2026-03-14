import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '@/types';

interface Conversation {
  bookingId: string;
  messages: Message[];
  unreadCount: number;
}

interface MessagesState {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  conversations: {},
  activeConversationId: null,
  isLoading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setConversation: (
      state,
      action: PayloadAction<{ bookingId: string; messages: Message[]; unreadCount?: number }>
    ) => {
      const { bookingId, messages, unreadCount = 0 } = action.payload;
      state.conversations[bookingId] = {
        bookingId,
        messages,
        unreadCount,
      };
    },
    addMessage: (state, action: PayloadAction<{ bookingId: string; message: Message }>) => {
      const { bookingId, message } = action.payload;
      if (!state.conversations[bookingId]) {
        state.conversations[bookingId] = {
          bookingId,
          messages: [],
          unreadCount: 0,
        };
      }
      state.conversations[bookingId].messages.push(message);
    },
    markAsRead: (state, action: PayloadAction<{ bookingId: string; messageId: string }>) => {
      const conv = state.conversations[action.payload.bookingId];
      if (conv) {
        const msg = conv.messages.find((m) => m.id === action.payload.messageId);
        if (msg && !msg.is_read) {
          msg.is_read = true;
          conv.unreadCount = Math.max(0, conv.unreadCount - 1);
        }
      }
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = {};
      state.activeConversationId = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConversation,
  addMessage,
  markAsRead,
  setActiveConversation,
  clearConversations,
  setLoading,
  setError,
} = messagesSlice.actions;
export default messagesSlice.reducer;
