import React from 'react';
import { Bell } from 'lucide-react';

interface ProviderHeaderProps {
  title: string;
  userName?: string;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ title, userName = 'Kamal Prasad' }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="h-[88px] bg-[#fafbfc] border-b border-gray-100 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-[13px] font-medium text-slate-400 mt-1">
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer shadow-sm">
          {initials}
        </div>
      </div>
    </header>
  );
};
