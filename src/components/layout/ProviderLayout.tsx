import DashboardLayout from './DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', icon: '⊞', path: '/provider/dashboard' },
  { label: 'My Services', icon: '⚡', path: '/provider/services' },
  { label: 'Bookings', icon: '📅', path: '/provider/bookings' },
  { label: 'Availability', icon: '🗓', path: '/provider/availability' },
  { label: 'Earnings', icon: '💰', path: '/provider/earnings' },
  { label: 'Messages', icon: '💬', path: '/provider/messages' },
  { label: 'Reviews', icon: '⭐', path: '/provider/reviews' },
  { label: 'Profile', icon: '👤', path: '/provider/profile' },
  { label: 'Settings', icon: '⚙', path: '/provider/settings' },
];

export default function ProviderLayout() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout config={{
      roleLabel: 'Provider Portal',
      accentColor: '#f59e0b', // Amber accent to differentiate providers
      navItems,
      ctaLabel: '+ Add New Service',
      ctaPath: '/provider/services/new',
      userName: user?.full_name || 'Provider',
      userSubLabel: 'Lead Technician',
      userAvatarSeed: user?.full_name || 'provider',
      userAvatarUrl: user?.profile_image || undefined,
      headerContext: (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="text-base">🛠</span>
          <span className="font-semibold text-slate-700">Service Provider Mode</span>
        </div>
      ),
    }} />
  );
}
