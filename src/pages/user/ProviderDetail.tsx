import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, CalendarDays, Loader2, MessageSquare } from 'lucide-react';
import { usersApi, servicesApi, chatApi, providerApi } from '@/lib/api';
import toast from 'react-hot-toast';
import BookingCalendar from '@/components/user/BookingCalendar';
import TimeSlots from '@/components/user/TimeSlots';

export default function ProviderDetailPage() {
  const { categoryId, providerId } = useParams<{ categoryId: string; providerId: string }>();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableSlotsForDay, setAvailableSlotsForDay] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!providerId) return;
      try {
        setLoading(true);
        // Try to fetch as provider profile
        const provRes = await usersApi.getProvider(providerId);
        setProvider(provRes.data.provider || provRes.data);

        // Fetch provider's services
        try {
          const svcRes = await servicesApi.getProviderServices(providerId);
          const svcData = svcRes.data;
          setServices(Array.isArray(svcData) ? svcData : (svcData.services || []));
        } catch {}

        // Fetch reviews
        try {
          const { default: apiClient } = await import('@/api/apiClient');
          const revRes = await apiClient.get(`/reviews/provider/${providerId}`);
          setReviews(revRes.data.reviews || []);
        } catch {}

        // Fetch availability
        try {
          const availRes = await providerApi.getPublicAvailability(providerId);
          const availabilities = availRes.data.availabilities || [];
          setAvailabilityData(availabilities);
          
          // Extract unique dates
          const dates = availabilities.map((a: any) => new Date(a.available_date));
          setAvailableDates(dates);
        } catch (err) {
          console.error('Failed to fetch availability', err);
        }
      } catch (err) {
        console.error('Failed to fetch provider:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [providerId]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlotsForDay([]);
      return;
    }
    const dateQuery = new Date(selectedDate);
    dateQuery.setHours(0,0,0,0);
    
    // Find matching availabilities
    const slots = availabilityData
      .filter((a: any) => {
         const ad = new Date(a.available_date);
         ad.setHours(0,0,0,0);
         return ad.getTime() === dateQuery.getTime();
      })
      .map((a: any) => {
         // Format Start Time
         const [shh, smm] = a.start_time.split(':');
         let sh = parseInt(shh, 10);
         const sampm = sh >= 12 ? 'PM' : 'AM';
         sh = sh % 12 || 12;
         return `${sh.toString().padStart(2, '0')}:${smm} ${sampm}`;
      });
      
    // Deduplicate the array to prevent overlapping schedules causing double buttons
    const uniqueSlots = Array.from(new Set<string>(slots));
      
    // Sort slots by time correctly (optional if backend already sorts)
    setAvailableSlotsForDay(uniqueSlots.sort((a: string, b: string) => {
      const parseTime = (t: string) => {
        const [time, ampm] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };
      return parseTime(a) - parseTime(b);
    }));
  }, [selectedDate, availabilityData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-red-500" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 font-medium">Provider not found.</p>
        <Link to="/user/services" className="text-red-600 font-bold mt-2 inline-block">Back to Services</Link>
      </div>
    );
  }

  const pUser = provider.user || provider;
  const providerName = pUser.full_name || provider.business_name || 'Provider';
  const initials = providerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const isVerified = provider.is_verified;
  const rating = Number(provider.rating || 0).toFixed(1);
  const totalReviews = provider.total_reviews || 0;
  const isAvailable = provider.is_available;

  const badgeStyle = isVerified ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600';

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    navigate(`/user/booking/payment?provider=${providerId}&date=${selectedDate.toISOString()}&slot=${encodeURIComponent(selectedSlot)}&category=${categoryId}`);
  };

  const handleMessage = async () => {
    try {
      // Find or create a conversation with this provider (no booking needed)
      const res = await chatApi.startConversation(providerId!);
      const conversationId = res.data.conversation_id;
      navigate(`/user/messages?booking=${conversationId}`);
    } catch (err: any) {
      console.error('Failed to start conversation:', err);
      toast.error(err.response?.data?.error || 'Could not start conversation');
    }
  };

  return (
    <div className="p-8 w-full max-w-3xl mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Link to={`/user/services/${categoryId}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 transition-colors mb-6">
        <ChevronLeft size={16} /> Back to providers
      </Link>

      {/* Provider Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-[20px] font-extrabold text-slate-900">{providerName}</h1>
              {isVerified && (
                <span className={`${badgeStyle} text-[10px] font-bold px-2.5 py-0.5 rounded-md tracking-wide`}>Verified</span>
              )}
            </div>
            <p className="text-[13px] text-slate-500 font-medium mb-2">
              {provider.skills_summary || provider.description || ''} · {provider.experience_years || 0} years experience
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.round(Number(rating)) ? '#facc15' : '#e2e8f0'} color={s <= Math.round(Number(rating)) ? '#facc15' : '#e2e8f0'} />
                ))}
                <span className="text-[13px] font-bold text-slate-900 ml-1">{Number(rating).toFixed(1)}</span>
                <span className="text-[12px] text-slate-400 font-medium">({totalReviews} reviews)</span>
              </div>
              {isAvailable && (
                <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available now
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleMessage}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] rounded-xl transition-colors self-start mt-1"
          >
            <MessageSquare size={16} /> Message
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
          <div className="text-center">
            <p className="text-[20px] font-extrabold text-slate-900">{provider.total_bookings || 0}</p>
            <p className="text-[12px] text-slate-400 font-medium">Jobs Done</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-extrabold text-slate-900">
              Rs. {services.length > 0 ? Math.min(...services.map((s: any) => s.price || 0)) : 0}
            </p>
            <p className="text-[12px] text-slate-400 font-medium">Starting Rate</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-extrabold text-slate-900">{provider.city || 'Nepal'}</p>
            <p className="text-[12px] text-slate-400 font-medium">Location</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
        <h2 className="text-[15px] font-bold text-slate-900 mb-2">About</h2>
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
          {provider.description || 'No description provided yet.'}
        </p>
      </div>

      {/* Services */}
      {services.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">Services Offered</h2>
          <div className="flex flex-col gap-3">
            {services.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-[14px] font-bold text-slate-800">{s.title}</p>
                  <p className="text-[12px] text-slate-500">{s.duration_minutes ? `${s.duration_minutes} min` : 'Flexible'}</p>
                </div>
                <span className="text-[15px] font-bold text-slate-900">Rs. {s.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Area */}
      {provider.city && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">Service Area</h2>
          <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
            <MapPin size={15} className="text-red-500 flex-shrink-0" />
            {[provider.address, provider.city, provider.state].filter(Boolean).join(', ')}
          </div>
        </div>
      )}

      {/* Verified Documents — only show approved certificates */}
      {(() => {
        const docs = (provider.documents || {}) as Record<string, string>;
        const docsVerified = (provider.documents_verified || {}) as Record<string, any>;
        const approvedDocs = Object.entries(docs).filter(
          ([key]) => docsVerified[key]?.status === 'approved'
        );
        if (approvedDocs.length === 0) return null;
        return (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Documents
            </h2>
            <div className="flex flex-col gap-2">
              {approvedDocs.map(([key, url]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-bold text-slate-800 capitalize">{key.replace(/_/g, ' ')}</span>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-4">Recent Reviews</h2>
          <div className="flex flex-col gap-5">
            {reviews.slice(0, 5).map((review: any) => (
              <div key={review.id} className="pb-5 border-b border-slate-50 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-600">
                      {review.customer?.user?.full_name?.[0] || '?'}
                    </div>
                    <span className="text-[14px] font-bold text-slate-900">{review.customer?.user?.full_name || 'Customer'}</span>
                  </div>
                  <span className="text-[12px] text-slate-400 font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
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

      {/* Booking Section */}
      {showBooking && (
        <div className="mb-5">
          <h2 className="text-[17px] font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-[#5f48fb]" /> Choose Date & Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BookingCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} availableDates={availableDates} />
            <TimeSlots selectedSlot={selectedSlot} onSlotSelect={setSelectedSlot} availableSlots={availableSlotsForDay} />
          </div>
          {selectedDate && selectedSlot && (
            <div className="mt-4 bg-indigo-50 border border-indigo-200/50 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-slate-500 font-medium">Selected</p>
                <p className="text-[15px] font-bold text-slate-900">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {selectedSlot}
                </p>
              </div>
              <button onClick={handleConfirmBooking} className="bg-[#5f48fb] hover:bg-[#4d38e0] text-white font-bold text-[14px] px-6 py-3 rounded-xl shadow-lg shadow-indigo-200/50 transition-all flex items-center gap-2">
                <CalendarDays size={16} /> Confirm Booking
              </button>
            </div>
          )}
        </div>
      )}

      {!showBooking && (
        <button onClick={() => setShowBooking(true)} className="w-full bg-[#5f48fb] hover:bg-[#4d38e0] text-white font-bold text-[15px] py-4 rounded-xl shadow-lg shadow-indigo-200/50 transition-all flex items-center justify-center gap-2">
          <CalendarDays size={18} /> Book Now — Choose Date & Time
        </button>
      )}
    </div>
  );
}
