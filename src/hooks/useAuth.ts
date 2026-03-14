import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { setCredentials, setUser, logout as logoutAction } from '@/store/slices/authSlice';
import type { AuthResponse } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (response: AuthResponse) => {
      dispatch(
        setCredentials({
          user: response.user,
          access_token: response.access_token,
        })
      );
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (user: AuthResponse['user']) => {
      dispatch(setUser(user));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    updateUser,
    logout,
    isCustomer: user?.role === 'CUSTOMER',
    isProvider: user?.role === 'PROVIDER',
    isAdmin: user?.role === 'ADMIN',
  };
}
