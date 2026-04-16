import { Link } from 'react-router-dom';
import { Star, MapPin, Navigation } from 'lucide-react';

export interface Provider {
  id: number;
  initials: string;
  name: string;
  service: string;
  experience: string;
  location: string;
  area: string;
  rating: number;
  reviews: number;
  price: number;
  available: boolean;
  badge?: 'Top Rated' | 'Verified' | 'New';
  description: string;
  distance_km?: number;
}

interface ProviderCardProps {
  provider: Provider;
  category: string;
}

const badgeStyles: Record<string, { bg: string; text: string }> = {
  'Top Rated': { bg: 'bg-red-50', text: 'text-red-600' },
  Verified: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  New: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
};

export default function ProviderCard({ provider, category }: ProviderCardProps) {
  const badge = provider.badge ? badgeStyles[provider.badge] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 px-6 py-5 flex items-center justify-between gap-4 hover:shadow-sm transition-all">
      {/* Left side */}
      <div className="flex items-start gap-4 min-w-0">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {provider.initials}
        </div>

        <div className="min-w-0">
          {/* Name + Badge */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <Link
              to={`/user/services/${category}/${provider.id}`}
              className="text-[15px] font-bold text-slate-900 hover:text-red-600 transition-colors truncate"
            >
              {provider.name}
            </Link>
            {badge && (
              <span className={`${badge.bg} ${badge.text} text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide`}>
                {provider.badge}
              </span>
            )}
          </div>

          {/* Meta */}
          <p className="text-[12px] text-slate-500 font-medium mb-1.5">
            {provider.experience} exp · {provider.location}
          </p>

          {/* Rating + Area + Available */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Star size={13} fill="#facc15" color="#facc15" />
              <span className="text-[13px] font-bold text-slate-900">{Number(provider.rating || 0).toFixed(1)}</span>
              <span className="text-[12px] text-slate-400 font-medium">({provider.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium">
              <MapPin size={12} />
              {provider.area}
            </div>
            {provider.available && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Available
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[12.5px] text-slate-500 font-medium mt-2 line-clamp-1">
            {provider.description}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
        <span className="text-[16px] font-bold text-slate-900">Rs. {provider.price}</span>
        {provider.distance_km != null && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            <Navigation size={11} />
            {provider.distance_km < 1 ? `${Math.round(provider.distance_km * 1000)} m` : `${provider.distance_km} km`}
          </span>
        )}
        <Link
          to={`/user/services/${category}/${provider.id}`}
          className="bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
