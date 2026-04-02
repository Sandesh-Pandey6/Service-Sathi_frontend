import { ReactNode } from 'react';

interface UpcomingBookingCardProps {
  providerInitials: string;
  providerName: string;
  service: string;
  dateStr: string;
  price: string;
  status: string;
  statusColor?: string;
  icon?: ReactNode;
}

export default function UpcomingBookingCard({
  providerInitials,
  providerName,
  service,
  dateStr,
  price,
  status,
  statusColor = 'bg-emerald-100 text-emerald-700',
  icon
}: UpcomingBookingCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-[16px] border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.01)] hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3.5">
        <div className="w-[42px] h-[42px] rounded-full bg-red-600 flex items-center justify-center text-white font-extrabold text-[14px] shrink-0 group-hover:scale-105 transition-transform duration-300">
          {providerInitials}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">{providerName}</h4>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            {icon && <span className="text-slate-300">{icon}</span>} 
            <span>{service}</span> 
            <span className="mx-0.5">•</span> 
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="text-[14px] font-extrabold text-slate-900 mb-1.5">{price}</div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
