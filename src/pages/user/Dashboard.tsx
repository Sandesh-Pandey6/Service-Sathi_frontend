import { useState, useEffect, useRef } from 'react';
import { bookingsApi, authApi, servicesApi } from '@/lib/api';
import { Link } from 'react-router-dom';
import {
  Plus,
  CalendarCheck,
  MessageSquare,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  User,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Service {
  id: string;
  title: string;
  price: number;
  price_type: string;
  discount_price?: number | null;
  images: string[];
  rating?: number;
  total_bookings?: number;
  is_featured?: boolean;
  provider?: {
    id: string;
    city?: string;
    rating?: number;
    user?: { full_name: string; profile_image?: string | null };
  };
  category?: { id: string; name: string; icon?: string };
}

interface Booking {
  id: string;
  booking_number?: string;
  service?: { title?: string; images?: string[]; category?: { icon?: string } };
  scheduled_date?: string;
  provider?: { user?: { full_name?: string; profile_image?: string | null } };
  status: string;
  total_amount?: number;
  currency?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:     { bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-400',  label: 'Pending'   },
  CONFIRMED:   { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    label: 'Scheduled' },
  IN_PROGRESS: { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400',  label: 'Ongoing'   },
  COMPLETED:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Completed' },
  CANCELLED:   { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400',     label: 'Cancelled' },
  SCHEDULED:   { bg: 'bg-slate-100',  text: 'text-slate-700',   dot: 'bg-slate-400',   label: 'Scheduled' },
};

function formatCurrency(amount: number, currency = 'NPR') {
  if (currency === 'NPR') return `₹ ${amount.toLocaleString()}`;
  return `${currency} ${amount.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function ServiceCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[260px] bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-5 bg-slate-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, featuredRes, recommendedRes, bookingsRes] = await Promise.allSettled([
          authApi.me(),
          servicesApi.list({ is_featured: true, limit: 8, is_available: true }),
          servicesApi.list({ sort: 'rating', order: 'desc', limit: 6, is_available: true }),
          bookingsApi.getCustomerBookings({ page: 1, limit: 5 }),
        ]);

        if (meRes.status === 'fulfilled') setUser(meRes.value.data.user);
        if (featuredRes.status === 'fulfilled') setFeaturedServices(featuredRes.value.data.services || []);
        if (recommendedRes.status === 'fulfilled') setRecommendedServices(recommendedRes.value.data.services || []);
        if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.bookings || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  return (
    <div className="p-6 space-y-8 max-w-[1100px]">

      {/* ── Greeting ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
          Hello, {firstName}!
        </h1>
        <p className="text-sm text-slate-500 mt-1">What can Service Sathi do for you today?</p>
      </div>

      {/* ── Quick Action Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5">
        {/* Book Service */}
        <Link
          to="/user/bookings/new"
          className="group flex flex-col items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e6fbfb] flex items-center justify-center group-hover:bg-[#00d4d4] transition-colors">
            <Plus size={22} className="text-[#00b0b0] group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Book Service</h3>
            <p className="text-xs text-slate-400 mt-0.5">Find local experts for your needs.</p>
          </div>
        </Link>

        {/* My Bookings */}
        <Link
          to="/user/bookings"
          className="group flex flex-col items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e6fbfb] flex items-center justify-center group-hover:bg-[#00d4d4] transition-colors">
            <CalendarCheck size={22} className="text-[#00b0b0] group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">My Bookings</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage your service schedule.</p>
          </div>
        </Link>

        {/* Inbox */}
        <Link
          to="/user/messages"
          className="group flex flex-col items-start gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e6fbfb] flex items-center justify-center group-hover:bg-[#00d4d4] transition-colors">
            <MessageSquare size={22} className="text-[#00b0b0] group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Inbox</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chat with providers or support.</p>
          </div>
        </Link>
      </div>

      {/* ── Featured Services ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">Featured Services</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : featuredServices.length > 0
            ? featuredServices.map((svc) => (
                <Link
                  key={svc.id}
                  to={`/user/services`}
                  className="flex-shrink-0 w-[260px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {svc.images?.[0] ? (
                      <img
                        src={svc.images[0]}
                        alt={svc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e6fbfb] to-[#b3eaea]">
                        <ShieldCheck size={40} className="text-[#00b0b0] opacity-40" />
                      </div>
                    )}
                    {svc.is_featured && (
                      <span className="absolute top-3 left-3 bg-[#00b0b0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Premium
                      </span>
                    )}
                    {svc.provider?.rating != null && (
                      <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        {Number(svc.provider.rating).toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{svc.title}</h4>
                    {/* Provider row */}
                    {svc.provider?.user && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <img
                          src={
                            svc.provider.user.profile_image ||
                            `https://api.dicebear.com/9.x/avataaars/svg?seed=${svc.provider.user.full_name}&backgroundColor=b6e3f4`
                          }
                          alt={svc.provider.user.full_name}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-[11px] text-[#00b0b0] font-semibold">{svc.provider.user.full_name}</span>
                        <ShieldCheck size={11} className="text-[#00b0b0]" />
                      </div>
                    )}
                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-[#00b0b0] font-extrabold text-sm">
                        {formatCurrency(svc.price)}
                        {svc.price_type === 'HOURLY' && ' / Hr'}
                      </span>
                      {svc.discount_price && (
                        <span className="text-slate-400 line-through text-xs">
                          {formatCurrency(svc.discount_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <ShieldCheck size={40} className="text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-400">No featured services yet</p>
                <p className="text-xs text-slate-300 mt-1">Check back soon for curated offerings.</p>
              </div>
            )}
        </div>
      </div>

      {/* ── Recommended Services ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">Recommended Services</h2>
          <Link
            to="/user/services"
            className="text-xs font-bold text-[#00b0b0] hover:text-[#009999] transition-colors flex items-center gap-1 uppercase tracking-wide"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-36 bg-slate-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            : recommendedServices.length > 0
            ? recommendedServices.slice(0, 3).map((svc) => (
                <Link
                  key={svc.id}
                  to={`/user/services`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    {svc.images?.[0] ? (
                      <img
                        src={svc.images[0]}
                        alt={svc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e6fbfb] to-[#b3eaea]">
                        <ShieldCheck size={32} className="text-[#00b0b0] opacity-40" />
                      </div>
                    )}
                    {svc.provider?.rating != null && (
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Star size={9} className="text-yellow-400 fill-yellow-400" />
                        {Number(svc.provider.rating).toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{svc.title}</h4>
                      <p className="text-[#00b0b0] font-extrabold text-sm mt-0.5">
                        {formatCurrency(svc.price)}
                        {svc.price_type === 'HOURLY' && ' / Hr'}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#e6fbfb] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00d4d4] transition-colors">
                      <ArrowRight size={14} className="text-[#00b0b0] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            : (
              <div className="col-span-3 py-10 text-center text-slate-400 text-sm">
                No recommendations available right now.
              </div>
            )}
        </div>
      </div>

      {/* ── Recent Bookings ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-slate-900 text-base">Recent Bookings</h2>
          <Link
            to="/user/bookings"
            className="text-xs font-bold text-[#00b0b0] hover:text-[#009999] uppercase tracking-wide transition-colors"
          >
            View All History
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="animate-spin text-[#00b0b0]" size={28} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <CalendarCheck size={36} className="text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-400">No bookings yet</p>
            <p className="text-xs text-slate-300 mt-1">
              <Link to="/user/bookings/new" className="text-[#00b0b0] font-bold">Book a service</Link> to get started.
            </p>
          </div>
        ) : (
          <div>
            {/* Table Head */}
            <div className="grid grid-cols-[2fr_1.2fr_1.3fr_1fr_0.8fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
              {['Service', 'Provider', 'Date', 'Amount', 'Status'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {bookings.map((b) => {
              const statusInfo = STATUS_STYLES[b.status] || STATUS_STYLES.PENDING;
              const providerName = b.provider?.user?.full_name || 'Unassigned';
              const providerImg = b.provider?.user?.profile_image;

              return (
                <div
                  key={b.id}
                  className="grid grid-cols-[2fr_1.2fr_1.3fr_1fr_0.8fr] gap-4 px-6 py-4 border-b border-gray-50 items-center hover:bg-gray-50/60 transition-colors last:border-b-0"
                >
                  {/* Service */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#e6fbfb] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {b.service?.images?.[0] ? (
                        <img src={b.service.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ShieldCheck size={16} className="text-[#00b0b0]" />
                      )}
                    </div>
                    <span className="font-bold text-slate-800 text-sm truncate">
                      {b.service?.title || '—'}
                    </span>
                  </div>

                  {/* Provider */}
                  <div className="flex items-center gap-2 min-w-0">
                    {providerImg ? (
                      <img src={providerImg} alt={providerName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${providerName}&backgroundColor=b6e3f4`}
                        alt={providerName}
                        className="w-7 h-7 rounded-full flex-shrink-0"
                      />
                    )}
                    <span className="text-sm text-[#00b0b0] font-semibold truncate">{providerName}</span>
                  </div>

                  {/* Date */}
                  <span className="text-sm text-slate-500">
                    {b.scheduled_date ? formatDate(b.scheduled_date) : '—'}
                  </span>

                  {/* Amount */}
                  <span className="text-sm font-bold text-slate-700">
                    {b.total_amount != null ? formatCurrency(b.total_amount, b.currency) : '—'}
                  </span>

                  {/* Status */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide w-fit ${statusInfo.bg} ${statusInfo.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
