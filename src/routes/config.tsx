// routesConfig.tsx — Route definitions (data-only, no component exports)
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ProviderRegister from '@/pages/auth/ProviderRegister';
import RoleSelection from '@/pages/auth/RoleSelection';
import RegisterRoleSelector from '@/pages/auth/RegisterRoleSelector';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import UserLayout from '@/components/layout/UserLayout';
import UserDashboard from '@/pages/user/Dashboard';
import UserServices from '@/pages/user/Services';
import NewBooking from '@/pages/user/NewBooking';
import ProfileSettings from '@/pages/user/ProfileSettings';
import UserSettings from '@/pages/user/UserSettings';
import UserBookings from '@/pages/user/UserBookings';
import CategoryProviders from '@/pages/user/CategoryProviders';
import ProviderDetailPage from '@/pages/user/ProviderDetail';
import PaymentPage from '@/pages/user/PaymentPage';
import KhaltiCallbackPage from '@/pages/user/KhaltiCallbackPage';
import InvoicePage from '@/pages/user/InvoicePage';
import UserMessages from '@/pages/user/Messages';
import UserNotifications from '@/pages/user/UserNotifications';
import UserPayments from '@/pages/user/UserPayments';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';

import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminProviders from '@/pages/admin/AdminProviders';
import AdminServices from '@/pages/admin/AdminServices';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminReviews from '@/pages/admin/AdminReviews';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSupport from '@/pages/admin/AdminSupport';
import AdminSettings from '@/pages/admin/AdminSettings';

import ProviderLayout from '@/components/layout/ProviderLayout';
import ProviderDashboard from '@/pages/provider/ProviderDashboard';
import ProviderBookings from '@/pages/provider/ProviderBookings';
import ProviderServices from '@/pages/provider/ProviderServices';
import ProviderEarnings from '@/pages/provider/ProviderEarnings';
import ProviderReviews from '@/pages/provider/ProviderReviews';
import ProviderProfile from '@/pages/provider/ProviderProfile';
import ProviderAvailability from '@/pages/provider/ProviderAvailability';
import ProviderMessages from '@/pages/provider/Messages';
import ProviderSettings from '@/pages/provider/ProviderSettings';
import ProviderNotifications from '@/pages/provider/ProviderNotifications';

const ServicesPage = () => (
  <div className="container py-5">
    <h1>Services</h1>
    <p>Browse all available services.</p>
  </div>
);

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'login', element: <Login /> },
      { path: 'login-role', element: <RoleSelection /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'register', element: <RegisterRoleSelector /> },
      { path: 'register/form', element: <Register /> },
      { path: 'register/provider', element: <ProviderRegister /> },
    ],
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute allowedRoles={['CUSTOMER']}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'services', element: <UserServices /> },
      { path: 'services/:categoryId', element: <CategoryProviders /> },
      { path: 'services/:categoryId/:providerId', element: <ProviderDetailPage /> },
      { path: 'bookings', element: <UserBookings /> },
      { path: 'payments', element: <UserPayments /> },
      { path: 'bookings/:id/invoice', element: <InvoicePage /> },
      { path: 'bookings/new', element: <NewBooking /> },
      { path: 'booking/payment', element: <PaymentPage /> },
      { path: 'booking/payment/verify', element: <KhaltiCallbackPage /> },
      { path: 'favourites', element: <div className="p-8"><h1 className="text-xl font-bold text-slate-900 mb-2">My Favourites</h1><p className="text-slate-500 text-sm">Your favourite service providers will appear here.</p></div> },
      { path: 'messages', element: <UserMessages /> },
      { path: 'notifications', element: <UserNotifications /> },
      { path: 'profile', element: <ProfileSettings /> },
      { path: 'settings', element: <UserSettings /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'providers', element: <AdminProviders /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'bookings', element: <AdminBookings /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'notifications', element: <AdminNotifications /> },
      { path: 'support', element: <AdminSupport /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  {
    path: '/provider',
    element: (
      <ProtectedRoute allowedRoles={['PROVIDER']}>
        <ProviderLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/provider/dashboard" replace /> },
      { path: 'dashboard', element: <ProviderDashboard /> },
      { path: 'services', element: <ProviderServices /> },
      { path: 'bookings', element: <ProviderBookings /> },
      { path: 'availability', element: <ProviderAvailability /> },
      { path: 'earnings', element: <ProviderEarnings /> },
      { path: 'messages', element: <ProviderMessages /> },
      { path: 'reviews', element: <ProviderReviews /> },
      { path: 'profile', element: <ProviderProfile /> },
      { path: 'notifications', element: <ProviderNotifications /> },
      { path: 'settings', element: <ProviderSettings /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];
