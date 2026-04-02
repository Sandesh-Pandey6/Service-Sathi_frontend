import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  trendText: string;
  trendColor?: string;
}

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  trendText,
  trendColor = 'text-emerald-500'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-[16px] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] border border-gray-100">
      <div className={`w-10 h-10 rounded-[12px] mb-3.5 flex items-center justify-center ${iconBg}`}>
        <Icon size={18} className={iconColor} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-[24px] font-extrabold text-slate-900 leading-none mb-1">{value}</h3>
        <p className="text-[12px] font-bold text-slate-500 mb-1.5">{label}</p>
        <p className={`text-[11px] font-bold ${trendColor}`}>
          {trendText}
        </p>
      </div>
    </div>
  );
}
