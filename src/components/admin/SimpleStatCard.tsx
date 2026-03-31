import React from 'react';

interface SimpleStatCardProps {
  title: string;
  value: string | number;
  color: 'blue' | 'emerald' | 'slate' | 'rose' | 'amber' | 'orange';
}

const colorMap = {
  blue:    { bg: 'bg-blue-50/70',    text: 'text-blue-600',    label: 'text-slate-500' },
  emerald: { bg: 'bg-emerald-50/70', text: 'text-emerald-600', label: 'text-slate-500' },
  slate:   { bg: 'bg-slate-100/50',  text: 'text-slate-700',   label: 'text-slate-500' },
  rose:    { bg: 'bg-rose-50/70',    text: 'text-rose-600',    label: 'text-slate-500' },
  amber:   { bg: 'bg-amber-50/70',   text: 'text-amber-600',   label: 'text-slate-500' },
  orange:  { bg: 'bg-orange-50/70',  text: 'text-orange-600',  label: 'text-slate-500' },
};

export const SimpleStatCard: React.FC<SimpleStatCardProps> = ({ title, value, color }) => {
  const c = colorMap[color] || colorMap.blue;
  
  return (
    <div className={`${c.bg} rounded-2xl p-6 transition-transform hover:scale-[1.02] cursor-default`}>
      <p className={`text-[26px] font-bold ${c.text} leading-tight mb-0.5`}>{value}</p>
      <p className={`text-[13px] font-medium ${c.label}`}>{title}</p>
    </div>
  );
};
