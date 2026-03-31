import DashboardLayout from './DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/user/dashboard' },
  { label: 'Services', icon: 'services', path: '/user/services' },
  { label: 'Bookings', icon: 'bookings', path: '/user/bookings' },
  { label: 'Messages', icon: 'messages', path: '/user/messages' },
  { label: 'Profile', icon: 'profile', path: '/user/profile' },
];

export default function UserLayout() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout config={{
      roleLabel: 'Urban Concierge',
      accentColor: '#00d4d4',
      navItems,
      settingsPath: '/user/settings',

      userName: user?.full_name || 'Customer',
      userSubLabel: 'Premium Member',
      userAvatarSeed: user?.full_name || 'user',
      userAvatarUrl: user?.profile_image || undefined,
    }} />
  );
}
