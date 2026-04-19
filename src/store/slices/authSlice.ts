import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  /** True while the app is bootstrapping the user from /auth/me on refresh */
  loading: boolean;
}

const storedToken = localStorage.getItem('accessToken');
const storedRefresh = localStorage.getItem('refreshToken');

const initialState: AuthState = {
  user: null,
  accessToken: storedToken || null,
  refreshToken: storedRefresh || null,
  isAuthenticated: !!storedToken,
  // If we have a stored token but no user, we need to bootstrap → start loading
  loading: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access_token: string; refresh_token?: string }>
    ) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.accessToken = access_token;
      state.refreshToken = refresh_token ?? state.refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('accessToken', access_token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      // Once we have resolved the user (or confirmed null), stop loading
      state.loading = false;
    },
    setTokens: (
      state,
      action: PayloadAction<{ access_token: string; refresh_token?: string }>
    ) => {
      state.accessToken = action.payload.access_token;
      if (action.payload.refresh_token) {
        state.refreshToken = action.payload.refresh_token;
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setCredentials, setUser, setTokens, setAuthLoading, logout } = authSlice.actions;
export default authSlice.reducer;
