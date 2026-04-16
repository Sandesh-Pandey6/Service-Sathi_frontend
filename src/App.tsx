import { useEffect } from 'react';
import AppRoutes from './routes';
import { useAppSelector } from './hooks/useAppSelector';
import { useAuth } from './hooks/useAuth';
import { authApi } from './lib/api';

export default function App() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { user, updateUser } = useAuth();

  // On app load (or page refresh), if we have a token but no user data,
  // fetch the full profile from /auth/me so settings fields are populated.
  useEffect(() => {
    if (accessToken && !user) {
      authApi
        .me()
        .then(({ data }) => {
          if (data.user) updateUser(data.user);
        })
        .catch(() => {
          // Token is invalid/expired — interceptor will handle refresh or logout
        });
    }
  }, [accessToken, user, updateUser]);

  return <AppRoutes />;
}
