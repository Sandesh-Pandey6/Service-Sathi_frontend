import { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  LayoutDashboard,
  CalendarCheck,
  LayoutGrid,
  Heart,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronsLeft,
  Search,
  Bell,
  Wrench
} from 'lucide-react';

const cookies = new Cookies();

const ICON_MAP: Record<string, any> = {
  dashboard: LayoutDashboard,
  'my bookings': CalendarCheck,
  services: LayoutGrid,
  favourites: Heart,
  messages: MessageSquare,
  profile: User,
  settings: Settings,
  support: HelpCircle,
};

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: string;
}

export interface DashboardConfig {
  navItems: NavItem[];
  userName?: string;
  userEmail?: string;
  userAvatarSeed?: string;
  userAvatarUrl?: string;
  headerContext?: ReactNode;
}

export default function DashboardLayout({ config }: { config: DashboardConfig }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const getDayStr = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside className="w-[260px] flex-shrink-0 bg-white h-full flex flex-col border-r border-gray-100">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-6 pt-7 pb-6">
          <div className="bg-red-600 rounded-lg p-1.5 flex items-center justify-center shrink-0">
            <Wrench size={16} className="text-white" />
          </div>
          <p className="text-[18px] font-extrabold tracking-tight">
            <span className="text-slate-900">Service</span><span className="text-red-600">Sathi</span>
          </p>
        </div>

        {/* Profile Banner */}
        <div className="mx-5 mb-5 bg-red-50 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full bg-red-600 flex items-center justify-center text-white font-extrabold text-[13px] shrink-0">
            {config.userAvatarSeed?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">
              {config.userName ?? 'User Name'}
            </p>
            <p className="text-[11px] font-semibold text-slate-500 truncate">
              {config.userEmail ?? 'user@email.com'}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-5 space-y-1.5 scrollbar-hide pb-4">
          {config.navItems.map(({ label, icon, path, badge }) => {
            const active = location.pathname.startsWith(path);
            const IconComp = ICON_MAP[icon] || LayoutDashboard;
            
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-[14px] transition-colors group relative
                  ${active 
                    ? 'bg-red-600 text-white font-bold shadow-sm shadow-red-600/20' 
                    : 'text-slate-500 hover:bg-red-50/50 hover:text-slate-900 font-semibold'
                  }`}
              >
                <IconComp
                  size={18}
                  className={`flex-shrink-0 transition-colors 
                    ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className="truncate">{label}</span>
                
                {badge && (
                  <span className={`ml-auto w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-extrabold
                    ${active ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-5 pb-6 pt-4 space-y-1 bg-white">
          <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-[14px] text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-[14px] font-semibold transition-colors">
            <ChevronsLeft size={18} className="text-slate-400" />
            Collapse
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-[14px] text-slate-500 hover:bg-red-50 hover:text-red-600 text-[14px] font-semibold transition-colors"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
          
          {/* Left Title Area */}
           <div>
             <h1 className="text-[18px] font-extrabold text-slate-900 leading-tight">
               {config.navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
             </h1>
             <p className="text-[12px] font-semibold text-slate-400 mt-0.5">{getDayStr()}</p>
           </div>

          {/* Right Area */}
          <div className="flex items-center gap-6">
            {/* Search Pill */}
            <div className="flex items-center bg-slate-50 rounded-full px-4 py-2 w-[240px] border border-gray-100/80 transition-colors focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm">
              <Search size={15} className="text-slate-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-[13px] text-slate-600 placeholder-slate-400 outline-none w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
              {/* Bell */}
              <button className="relative flex items-center justify-center transition-colors hover:scale-105">
                <Bell size={20} className="text-slate-500" strokeWidth={2} />
                <span className="absolute top-[1px] right-[2px] w-[7px] h-[7px] bg-red-600 rounded-full border border-white" />
              </button>

              {/* Avatar Bubble */}
              <div className="cursor-pointer transition-transform hover:scale-105">
                {config.userAvatarUrl ? (
                  <img
                    src={config.userAvatarUrl}
                    alt={config.userName ?? 'user'}
                    className="w-10 h-10 rounded-full object-cover shadow-sm shadow-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-extrabold text-[14px] shadow-sm shadow-red-600/30">
                    {config.userAvatarSeed?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
