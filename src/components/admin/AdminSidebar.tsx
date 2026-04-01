import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Cookies from 'universal-cookie';

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
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Bell,
  HelpCircle,
  X
} from 'lucide-react';

const cookies = new Cookies();

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
      { label: 'Users', icon: Users, path: '/admin/users', badge: 12 },
      { label: 'Providers', icon: Wrench, path: '/admin/providers', badge: 4 },
      { label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Services & Categories', icon: Clipboard, path: '/admin/services' },
      { label: 'Payments & Revenue', icon: CreditCard, path: '/admin/payments' },
      { label: 'Reviews & Ratings', icon: Star, path: '/admin/reviews' },
      { label: 'Reports & Analytics', icon: BarChart3, path: '/admin/reports' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Notifications', icon: Bell, path: '/admin/notifications', badge: 7 },
      { label: 'Support Tickets', icon: HelpCircle, path: '/admin/tickets' },
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
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out');
    navigate('/login');
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
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          <Wrench size={20} className="text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <p className="font-bold text-sm text-white">Service Sathi</p>
            <p className="text-[10px] text-slate-400">Admin Panel</p>
          </div>
        )}

        {/* Mobile close button */}
        {isMobileOpen && onMobileClose ? (
          <button
            onClick={onMobileClose}
            className="ml-auto text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg border border-slate-700 lg:hidden"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className={`ml-auto text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg border border-slate-700 hidden lg:block ${isCollapsed ? 'mx-auto mb-2' : ''}`}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto custom-scrollbar space-y-6">
        {navGroups.map((group) => (
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
            {user?.profile_image ? (
              <img src={user.profile_image} alt="Admin" className="w-8 h-8 rounded-full border border-slate-600 object-cover flex-shrink-0" />
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
           className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors hidden lg:flex"
           onClick={onToggle}
        >
          <ChevronLeft size={16} className="transform -rotate-90" />
          {!isCollapsed && <span>Collapse</span>}
        </button>
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
