import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
// WebSocket URL is typically the domain root
const WS_URL = BASE_URL.replace('/api/v1', '');

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');
  
  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('error', (err) => {
    console.error('[Socket] Error:', err);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
