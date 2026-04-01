import React from 'react';
import { Search, Bell, RotateCcw, Menu } from 'lucide-react';

interface Props {
  title: string;
  breadcrumbs?: string[];
  onMobileMenuToggle?: () => void;
}

export const AdminHeader: React.FC<Props> = ({ title, breadcrumbs, onMobileMenuToggle }) => {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        {/* Left side: Hamburger + Title + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">{title}</h1>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-400">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb}>
                  <span className={i === breadcrumbs.length - 1 ? 'text-slate-600' : 'text-slate-400'}>
                    {crumb}
                  </span>
                  {i < breadcrumbs.length - 1 && <span className="mx-2 text-slate-300">&gt;</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Search + Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Search - hidden on very small screens, icon-only on medium, full on large */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-40 lg:w-56 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Search icon for small screens */}
          <button className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <Search size={20} />
          </button>

          {/* Actions */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white"></span>
          </button>
          
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
            <RotateCcw size={20} />
          </button>

          {/* Profile */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs ml-1 sm:ml-2 cursor-pointer shadow-md shadow-red-600/20 border-2 border-white ring-1 ring-slate-100">
            SA
          </div>
        </div>
      </div>
    </header>
  );
};
