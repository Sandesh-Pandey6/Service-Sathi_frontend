import { CalendarDays, MapPin, Wrench } from 'lucide-react';
import { Provider } from '@/components/user/ProviderCard';

interface BookingSummaryCardProps {
  provider: Provider;
  bookingDate: Date | null;
  slot: string;
  serviceDetailMessage?: string;
  showPromo?: boolean;
}

export default function BookingSummaryCard({
  provider,
  bookingDate,
  slot,
  serviceDetailMessage = 'Full Home Wiring Inspection',
  showPromo = false,
}: BookingSummaryCardProps) {
  const serviceCharge = provider.price;
  const platformFee = Math.round(provider.price * 0.05); // Example: 5% platform fee
  const total = serviceCharge + platformFee;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">
        Booking Summary
      </h3>

      {/* Provider & Service Info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-[14px] bg-red-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {provider.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
            {provider.name}
          </h4>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1 mb-2">
            <Wrench size={12} className="text-slate-400" />
            <span className="text-[12px] font-medium">{provider.service}</span>
          </div>
          <p className="text-[14px] font-medium text-slate-700 mb-2 truncate">
            {serviceDetailMessage}
          </p>

          {/* Time & Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
              <CalendarDays size={14} className="text-slate-400" />
              {bookingDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })},{' '}
              {slot}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium truncate">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{provider.area}, {provider.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full my-5" />

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-[13.5px]">
          <span className="text-slate-500 font-medium">Service Charge</span>
          <span className="font-medium text-slate-700">Rs. {serviceCharge.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-[13.5px]">
          <span className="text-slate-500 font-medium">Platform Fee</span>
          <span className="font-medium text-slate-700">Rs. {platformFee.toLocaleString()}</span>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-4" />

      {/* Total */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[16px] font-extrabold text-slate-900">Total</span>
        <span className="text-[18px] font-extrabold text-red-600">Rs. {total.toLocaleString()}</span>
      </div>

      {/* Promo Code section */}
      {showPromo && (
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            <span className="text-slate-400 font-bold text-[13px] mr-2">%</span>
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 placeholder:text-slate-400 uppercase"
            />
          </div>
          <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl transition-colors">
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
