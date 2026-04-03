import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, Shield, CheckCircle2, CalendarDays } from 'lucide-react';
import { PROVIDER_DETAILS, getProviderById } from '@/data/providers';
import BookingCalendar from '@/components/user/BookingCalendar';
import TimeSlots from '@/components/user/TimeSlots';

export default function ProviderDetailPage() {
  const { categoryId, providerId } = useParams<{ categoryId: string; providerId: string }>();
  const navigate = useNavigate();
  const pid = parseInt(providerId || '0');

  // Use detailed data if available, otherwise fall back to basic data
  const detail = PROVIDER_DETAILS[pid];
  const provider = detail || getProviderById(pid);

  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!provider) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 font-medium">Provider not found.</p>
        <Link to="/user/services" className="text-red-600 font-bold mt-2 inline-block">
          Back to Services
        </Link>
      </div>
    );
  }

  const badge = provider.badge;
  const badgeStyle = badge === 'Top Rated'
    ? 'bg-red-50 text-red-600'
    : badge === 'Verified'
      ? 'bg-indigo-50 text-indigo-600'
      : 'bg-emerald-50 text-emerald-600';

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    // Navigate to payment with booking info
    navigate(`/user/booking/payment?provider=${pid}&date=${selectedDate.toISOString()}&slot=${encodeURIComponent(selectedSlot)}&category=${categoryId}`);
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Back link */}
      <Link
        to={`/user/services/${categoryId}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back to providers
      </Link>

      {/* ═══ Provider Header ═══ */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {provider.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-[20px] font-extrabold text-slate-900">{provider.name}</h1>
              {badge && (
                <span className={`${badgeStyle} text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[13px] text-slate-500 font-medium mb-2">
              {provider.service} · {provider.experience} experience
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.round(provider.rating) ? '#facc15' : '#e2e8f0'} color={s <= Math.round(provider.rating) ? '#facc15' : '#e2e8f0'} />
                ))}
                <span className="text-[13px] font-bold text-slate-900 ml-1">{provider.rating}</span>
                <span className="text-[12px] text-slate-400 font-medium">({provider.reviews} reviews)</span>
              </div>
              {provider.available && (
                <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Available now
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
          <div className="text-center">
            <p className="text-[20px] font-extrabold text-slate-900">{detail?.jobsDone || '100'}+</p>
            <p className="text-[12px] text-slate-400 font-medium">Jobs Done</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-extrabold text-slate-900">Rs. {provider.price}</p>
            <p className="text-[12px] text-slate-400 font-medium">Rate</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-extrabold text-slate-900">{provider.location}</p>
            <p className="text-[12px] text-slate-400 font-medium">Location</p>
          </div>
        </div>
      </div>

      {/* ═══ About ═══ */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
        <h2 className="text-[15px] font-bold text-slate-900 mb-2">About</h2>
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
          {detail?.about || provider.description}
        </p>
      </div>

      {/* ═══ Service Area ═══ */}
      {detail?.serviceAreas && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">Service Area</h2>
          <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
            <MapPin size={15} className="text-red-500 flex-shrink-0" />
            {detail.serviceAreas.join(', ')}
          </div>
        </div>
      )}

      {/* ═══ Highlights ═══ */}
      {detail?.highlights && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-4">Highlights</h2>
          <div className="grid grid-cols-2 gap-3">
            {detail.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                <Shield size={15} className="text-red-500 flex-shrink-0" />
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Certificates ═══ */}
      {detail?.certificates && (
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/50 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-bold text-slate-900">Certificates</h2>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg">
              {detail.certificates.length} verified
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {detail.certificates.map((cert, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <div>
                    <p className="text-[13px] font-bold text-emerald-700">{cert.name}</p>
                    <p className="text-[11px] text-emerald-600/70 font-medium">Verified & uploaded by provider</p>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  ✓ {cert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Recent Reviews ═══ */}
      {detail?.recentReviews && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-4">Recent Reviews</h2>
          <div className="flex flex-col gap-5">
            {detail.recentReviews.map((review, i) => (
              <div key={i} className="pb-5 border-b border-slate-50 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-600">
                      {review.initial}
                    </div>
                    <span className="text-[14px] font-bold text-slate-900">{review.name}</span>
                  </div>
                  <span className="text-[12px] text-slate-400 font-medium">{review.timeAgo}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={13} fill={s <= review.rating ? '#facc15' : '#e2e8f0'} color={s <= review.rating ? '#facc15' : '#e2e8f0'} />
                  ))}
                </div>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Booking Section (calendar + time) ═══ */}
      {showBooking && (
        <div className="mb-5">
          <h2 className="text-[17px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-red-500" />
            Choose Date & Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BookingCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            <TimeSlots selectedSlot={selectedSlot} onSlotSelect={setSelectedSlot} />
          </div>

          {/* Selected summary + Confirm */}
          {selectedDate && selectedSlot && (
            <div className="mt-4 bg-red-50 border border-red-200/50 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-slate-500 font-medium">Selected</p>
                <p className="text-[15px] font-bold text-slate-900">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  {' · '}
                  {selectedSlot}
                </p>
              </div>
              <button
                onClick={handleConfirmBooking}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-[14px] px-6 py-3 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center gap-2"
              >
                <CalendarDays size={16} />
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ Book Now CTA (sticky) ═══ */}
      {!showBooking && (
        <button
          onClick={() => setShowBooking(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-[15px] py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
        >
          <CalendarDays size={18} />
          Book Now — Choose Date & Time
        </button>
      )}
    </div>
  );
}
