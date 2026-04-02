import { Star } from 'lucide-react';

interface FavouriteProviderCardProps {
  providerInitials: string;
  providerName: string;
  service: string;
  rating: string | number;
  onBook?: () => void;
}

export default function FavouriteProviderCard({
  providerInitials,
  providerName,
  service,
  rating,
  onBook
}: FavouriteProviderCardProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-slate-50/50 -mx-4 px-4 transition-colors rounded-xl">
      <div className="flex items-center gap-3.5">
        <div className="w-[42px] h-[42px] rounded-full bg-red-500 flex items-center justify-center text-white font-extrabold text-[14px] shrink-0 shadow-sm shadow-red-500/20">
          {providerInitials}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900 mb-1">{providerName}</h4>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <div className="flex items-center text-yellow-500 gap-0.5">
              <Star size={11} className="fill-yellow-500" />
              <span>{rating}</span>
            </div>
            <span className="mx-0.5">•</span>
            <span>{service}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={onBook}
        className="text-[12px] font-extrabold text-red-600 hover:text-white hover:bg-red-500 bg-red-50 px-4 py-1.5 rounded-full transition-all leading-none"
      >
        Book
      </button>
    </div>
  );
}
