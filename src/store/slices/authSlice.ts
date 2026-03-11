import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const cookies = new Cookies();
const storedToken = cookies.get('accessToken') || localStorage.getItem('accessToken');

const initialState: AuthState = {
  user: null,
  accessToken: storedToken || null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.accessToken = access_token;
      state.isAuthenticated = true;
      cookies.set('accessToken', access_token, { path: '/' });
      localStorage.setItem('accessToken', access_token);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      cookies.remove('accessToken');
      cookies.remove('refreshToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
