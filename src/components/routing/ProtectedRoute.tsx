import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser, setAuthLoading, logout as logoutAction } from '@/store/slices/authSlice';

type AllowedRole = 'ADMIN' | 'CUSTOMER' | 'PROVIDER';

interface ProtectedRouteProps {
  allowedRoles: AllowedRole[];
  children: ReactNode;
}

function getDashboardPath(role?: string | null) {
  if (role === 'ADMIN') return '/admin/dashboard';
  if (role === 'PROVIDER') return '/provider/dashboard';
  return '/user/dashboard';
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      console.log('[ProtectedRoute] bootstrap start', {
        path: location.pathname,
        allowedRoles,
        hasToken: !!accessToken,
        hasUser: !!user,
        userRole: user?.role,
        loading,
      });

      // No token → nothing to bootstrap
      if (!accessToken) {
        console.log('[ProtectedRoute] No token, stopping loading');
        if (active) dispatch(setAuthLoading(false));
        return;
      }

      // User already loaded → done
      if (user) {
        console.log('[ProtectedRoute] User already loaded:', user.role);
        if (active) dispatch(setAuthLoading(false));
        return;
      }

      // Fetch the current user from the backend
      try {
        console.log('[ProtectedRoute] Calling /auth/me...');
        const { data } = await authApi.me();
        console.log('[ProtectedRoute] /auth/me response:', {
          role: data.user?.role,
          email: data.user?.email,
          id: data.user?.id,
        });
        if (active) {
          dispatch(setUser(data.user ?? null));
        }
      } catch (err) {
        console.error('[ProtectedRoute] /auth/me failed:', err);
        if (active) {
          dispatch(logoutAction());
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [accessToken, user, dispatch]);

  console.log('[ProtectedRoute] render', {
    path: location.pathname,
    allowedRoles,
    loading,
    hasUser: !!user,
    userRole: user?.role,
    hasToken: !!accessToken,
  });

  // Show spinner while bootstrapping — prevents wrong redirects
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
      </div>
    );
  }

  // Not authenticated → send to login
  if (!accessToken || !user) {
    console.log('[ProtectedRoute] Not authenticated, redirecting...');
    if (location.pathname.startsWith('/provider') || location.pathname.startsWith('/user') || location.pathname.startsWith('/admin')) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated but wrong role → redirect to the correct dashboard
  if (!allowedRoles.includes(user.role as AllowedRole)) {
    console.log('[ProtectedRoute] Role mismatch!', {
      userRole: user.role,
      allowedRoles,
      redirectTo: getDashboardPath(user.role),
    });
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
}
