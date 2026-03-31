import { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  MessageSquare,
  User,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Settings,
  MapPin,
  CreditCard,
  ClipboardList,
} from 'lucide-react';

const cookies = new Cookies();

const ICON_MAP: Record<string, any> = {
  dashboard: LayoutDashboard,
  services: Wrench,
  bookings: CalendarCheck,
  messages: MessageSquare,
  profile: User,
  settings: Settings,
  'my bookings': ClipboardList,
  'profile settings': User,
  'address book': MapPin,
  payments: CreditCard,
  support: HelpCircle,
};

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

export interface DashboardConfig {
  roleLabel: string;
  accentColor?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaPath?: string;
  userName?: string;
  userSubLabel?: string;
  userAvatarSeed?: string;
  userAvatarUrl?: string;
  headerContext?: ReactNode;
  settingsPath?: string;
}

export default function DashboardLayout({ config }: { config: DashboardConfig }) {
  const location = useLocation();
  const navigate = useNavigate();
  const accent = config.accentColor ?? '#00d4d4';

  const handleLogout = () => {
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside className="w-[200px] flex-shrink-0 bg-white h-full flex flex-col border-r border-gray-100">
        {/* Brand */}
        <div className="px-5 pt-7 pb-5">
          <p className="text-[15px] font-extrabold text-slate-900 leading-none tracking-tight uppercase">
            Service Sathi
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em] mt-1"
            style={{ color: accent }}
          >
            {config.roleLabel}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {config.navItems.map(({ label, icon, path }) => {
            const active = location.pathname.startsWith(path);
            const IconComp = ICON_MAP[icon] || ICON_MAP[label.toLowerCase()] || LayoutDashboard;
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all group relative"
                style={
                  active
                    ? {
                        backgroundColor: `${accent}12`,
                        color: accent,
                      }
                    : {}
                }
              >
                {active && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
                <IconComp
                  size={18}
                  className={`transition-all flex-shrink-0 ${active ? '' : 'text-slate-400 group-hover:text-slate-600'}`}
                  style={active ? { color: accent } : {}}
                />
                <span
                  className={`${active ? 'font-bold' : 'text-slate-500 group-hover:text-slate-700'}`}
                  style={active ? { color: accent } : {}}
                >
                  {label}
                </span>
                {active && (
                  <span className="ml-auto text-slate-300 text-xs font-bold">)</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-2 border-t border-gray-100 pt-4">
          {config.ctaLabel && config.ctaPath && (
            <Link
              to={config.ctaPath}
              className="flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-xl text-xs w-full transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: accent }}
            >
              <Plus size={16} />
              {config.ctaLabel}
            </Link>
          )}
          <Link
            to={config.settingsPath || config.navItems.find(n => n.icon === 'settings' || n.label.toLowerCase() === 'settings')?.path || '/user/settings'}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:bg-gray-50 hover:text-slate-700 text-[12px] font-semibold transition-all"
          >
            <Settings size={16} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 text-[12px] font-semibold transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
          {/* Search Bar */}
          <div className="flex items-center bg-[#f3f4f6] rounded-full px-4 py-2 w-[360px] border border-gray-200 hover:border-gray-300 transition-colors">
            <Search size={16} className="text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for services..."
              className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors font-medium">
              <HelpCircle size={18} />
              <span className="hidden lg:inline">Support</span>
            </button>
            <button className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{config.userName ?? 'User'}</p>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: accent }}
                >
                  {config.userSubLabel ?? config.roleLabel}
                </p>
              </div>
              <img
                src={config.userAvatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${config.userAvatarSeed ?? 'user'}&backgroundColor=b6e3f4`}
                alt={config.userName ?? 'user'}
                className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                style={{ border: `2px solid ${accent}` }}
              />
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
