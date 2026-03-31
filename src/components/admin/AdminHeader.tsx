import React from 'react';
import { Search, Bell, RotateCcw } from 'lucide-react';

interface Props {
  title: string;
  breadcrumbs?: string[];
}

export const AdminHeader: React.FC<Props> = ({ title, breadcrumbs }) => {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center text-sm font-medium text-slate-400">
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

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-56 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Actions */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white"></span>
        </button>
        
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
          <RotateCcw size={20} />
        </button>

        {/* Profile */}
        <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs ml-2 cursor-pointer shadow-md shadow-red-600/20 border-2 border-white ring-1 ring-slate-100">
          SA
        </div>
      </div>
    </header>
  );
};
