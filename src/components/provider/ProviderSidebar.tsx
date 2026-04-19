import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  DollarSign,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  EyeOff,
  Wrench,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  icon: React.FC<any>;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, path: '/provider/dashboard' },
  { label: 'Bookings', icon: CalendarCheck, path: '/provider/bookings', badge: 2 },
  { label: 'Availability', icon: CalendarDays, path: '/provider/availability' },
  { label: 'Earnings', icon: DollarSign, path: '/provider/earnings' },
  { label: 'Reviews', icon: Star, path: '/provider/reviews' },
  { label: 'Chat', icon: MessageSquare, path: '/provider/messages', badge: 3 },
  { label: 'My Profile', icon: Settings, path: '/provider/profile' },
];

interface ProviderSidebarProps {
  collapsed?: boolean;
}

export const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Hardcoded for UI presentation
  const initials = user?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'KP';
  const name = user?.full_name || 'Kamal Prasad';
  const subtitle = 'Electrician • Kathmandu';

  return (
    <div className="w-[260px] flex-shrink-0 bg-white h-screen flex flex-col border-r border-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Brand */}
      <div className="px-6 py-8">
        <Link to="/provider/dashboard" className="flex items-center gap-2">
          <img src="/provider-logo.png" alt="Service Sathi" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-[17px] font-bold text-slate-900 tracking-tight">ServiceSathi</span>
        </Link>
        <p className="text-[12px] font-medium text-slate-400 mt-1 ml-10">Provider Portal</p>
      </div>

      {/* User Info & Status */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {initials}
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate-900 leading-tight">{name}</p>
            <p className="text-[12px] text-slate-500">{subtitle}</p>
          </div>
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          <span className="text-[13px] font-semibold text-slate-600">Unavailable</span>
          <EyeOff size={16} className="text-slate-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path, badge }) => {
          const isActive = location.pathname.includes(path) || (path === '/provider/dashboard' && location.pathname === '/provider');
          
          return (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center justify-between px-4 py-3 rounded-lg text-[14px] font-semibold transition-all group relative
                ${isActive 
                  ? 'bg-indigo-50/50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[4px] rounded-r-md bg-indigo-600" />
              )}
              
              <div className="flex items-center gap-3">
                <Icon 
                  size={18} 
                  className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{label}</span>
              </div>
              
              {badge && (
                <span className={`
                  w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold
                  ${isActive ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white'}
                `}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-slate-700 text-[14px] font-semibold transition-colors"
        >
          <LogOut size={18} className="text-slate-400" strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
