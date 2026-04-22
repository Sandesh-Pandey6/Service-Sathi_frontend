import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi, adminApi } from '@/lib/api';
import { notificationsApi } from '@/api/notifications.api';
import toast from 'react-hot-toast';

import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Clipboard, 
  Calendar, 
  CreditCard, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  HelpCircle,
  Flag,
  X
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
      { label: 'Users', icon: Users, path: '/admin/users' },
      { label: 'Providers', icon: Wrench, path: '/admin/providers' },
      { label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Services & Categories', icon: Clipboard, path: '/admin/services' },
      { label: 'Payments & Revenue', icon: CreditCard, path: '/admin/payments' },
      { label: 'Reviews & Ratings', icon: Star, path: '/admin/reviews' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
    ]
  }
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
  isMobileOpen?: boolean;
}

export const AdminSidebar: React.FC<Props> = ({ collapsed, onToggle, onMobileClose, isMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [badgeCounts, setBadgeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const [providersRes, notifRes] = await Promise.all([
          adminApi.listUsers({ role: 'PROVIDER', page: 1, limit: 1 }).catch(() => null),
          notificationsApi.getNotifications({ limit: 1, unread_only: true }).catch(() => null),
        ]);
        if (!mounted) return;
        const counts: Record<string, number> = {};
        // Only show badge for unread notifications
        // The provider total count was misleading as a red notification badge
        // Unread notifications count (notificationsApi returns unwrapped data)
        const unreadNotif = (notifRes as any)?.unread_count;
        if (unreadNotif && unreadNotif > 0) counts['/admin/notifications'] = unreadNotif;
        setBadgeCounts(counts);
      } catch {
        // silently ignore
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Inject dynamic badges into nav groups
  const dynamicNavGroups = navGroups.map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      badge: badgeCounts[item.path] || undefined,
    })),
  }));

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    // Close mobile sidebar on navigation
    if (onMobileClose) onMobileClose();
  };

  // On mobile, always show expanded sidebar
  const isCollapsed = isMobileOpen ? false : collapsed;

  return (
    <aside
      className={`h-screen bg-[#0f172a] text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-9 h-9 rounded-xl object-contain flex-shrink-0" />

        {!isCollapsed && (
          <div>
            <p className="font-bold text-sm text-white">Service Sathi</p>
            <p className="text-[10px] text-slate-400">Admin Panel</p>
          </div>
        )}

        {/* Mobile close button */}
        {isMobileOpen && onMobileClose && (
          <button
            onClick={onMobileClose}
            className="ml-auto text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg border border-slate-700 lg:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto custom-scrollbar space-y-6">
        {dynamicNavGroups.map((group) => (
          <div key={group.title}>
            {!isCollapsed && (
              <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      
                      {/* Badge */}
                      {item.badge && !isCollapsed && (
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-600 font-bold text-[10px] text-white flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                      {item.badge && isCollapsed && !isActive && (
                         <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 mb-2 border border-slate-700/50">
            {((user as any)?.admin_profile?.profile_image || user?.profile_image) ? (
              <img src={(user as any)?.admin_profile?.profile_image || user?.profile_image} alt="Admin" className="w-8 h-8 rounded-full border border-slate-600 object-cover flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                SA
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">Super Admin</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@servicesathi.np'}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
