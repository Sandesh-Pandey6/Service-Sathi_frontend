import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string; // Tailwind color base
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

const colorMap: Record<string, { iconBg: string; text: string }> = {
  blue:    { iconBg: 'bg-blue-50 text-blue-500',    text: 'text-blue-600' },
  emerald: { iconBg: 'bg-emerald-50 text-emerald-500', text: 'text-emerald-600' },
  amber:   { iconBg: 'bg-amber-50 text-amber-500',   text: 'text-amber-600' },
  violet:  { iconBg: 'bg-purple-50 text-purple-500', text: 'text-purple-600' },
  red:     { iconBg: 'bg-rose-50 text-rose-500',     text: 'text-rose-600' },
  cyan:    { iconBg: 'bg-cyan-50 text-cyan-500',     text: 'text-cyan-600' },
  orange:  { iconBg: 'bg-orange-50 text-orange-500', text: 'text-orange-500' },
  yellow:  { iconBg: 'bg-yellow-50 text-yellow-500', text: 'text-yellow-500' },
  rose:    { iconBg: 'bg-rose-50 text-rose-500',     text: 'text-rose-600' },
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change, changeType }) => {
  const c = colorMap[color] || colorMap.blue;
  
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-start h-full">
      <div className={`p-2 sm:p-2.5 rounded-full mb-3 sm:mb-4 ${c.iconBg}`}>
        {icon}
      </div>
      <p className="text-xl sm:text-[28px] font-bold text-slate-800 leading-tight mb-1 truncate w-full">{value}</p>
      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mb-3 sm:mb-4 truncate w-full">{title}</p>
      
      {change && (
        <div className="mt-auto">
          <p className={`text-[12px] sm:text-[13px] font-bold flex items-center gap-1 ${
            changeType === 'up' ? 'text-emerald-500' : 
            changeType === 'down' ? 'text-rose-500' : 'text-slate-400'
          }`}>
            {changeType === 'up' ? <TrendingUp size={14} strokeWidth={2.5} /> : 
             changeType === 'down' ? <TrendingDown size={14} strokeWidth={2.5} /> : 
             <Minus size={14} strokeWidth={2.5} />} 
            {change}
          </p>
        </div>
      )}
    </div>
  );
};
