import DashboardLayout from './DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/user/dashboard' },
  { label: 'My Bookings', icon: 'my bookings', path: '/user/bookings' },
  { label: 'Services', icon: 'services', path: '/user/services' },

  { label: 'Messages', icon: 'messages', path: '/user/messages', badge: '2' },
  { label: 'My Profile', icon: 'profile', path: '/user/profile' },
  { label: 'Settings', icon: 'settings', path: '/user/settings' },
  { label: 'Help & Support', icon: 'support', path: '/user/support' },
];

export default function UserLayout() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout config={{
      navItems,
      userName: user?.full_name || 'Anita Sharma',
      userEmail: user?.email || 'anita@email.com',
      userAvatarSeed: user?.full_name || 'Anita',
      userAvatarUrl: user?.profile_image || undefined,
    }} />
  );
}
