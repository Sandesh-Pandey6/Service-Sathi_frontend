import { Link } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Wind,
  Scissors,
  Star,
  Hammer,
  PaintBucket,
  Search,
  MapPin,
  ChevronDown,
  Droplets,
  Car,
  Leaf
} from 'lucide-react';

/* ── Service Categories ── */
const categories = [
  { id: 1, name: 'Electrician', icon: Zap, count: 24, bg: 'bg-yellow-50/50', border: 'border-yellow-200/60', text: 'text-yellow-500', outer: 'border-yellow-200' },
  { id: 2, name: 'Plumber', icon: Droplets, count: 18, bg: 'bg-blue-50/50', border: 'border-blue-200/60', text: 'text-blue-500', outer: 'border-blue-200' },
  { id: 3, name: 'Beautician', icon: Scissors, count: 15, bg: 'bg-pink-50/50', border: 'border-pink-200/60', text: 'text-pink-500', outer: 'border-pink-200' },
  { id: 4, name: 'Mechanic', icon: Car, count: 12, bg: 'bg-slate-50/50', border: 'border-slate-200/60', text: 'text-slate-500', outer: 'border-slate-200' },
  { id: 5, name: 'Carpenter', icon: Hammer, count: 9, bg: 'bg-orange-50/50', border: 'border-orange-200/60', text: 'text-orange-500', outer: 'border-orange-200' },
  { id: 6, name: 'AC Repair', icon: Wind, count: 11, bg: 'bg-cyan-50/50', border: 'border-cyan-200/60', text: 'text-cyan-500', outer: 'border-cyan-200' },
  { id: 7, name: 'Painter', icon: PaintBucket, count: 8, bg: 'bg-purple-50/50', border: 'border-purple-200/60', text: 'text-purple-500', outer: 'border-purple-200' },
  { id: 8, name: 'Appliance Repair', icon: Wrench, count: 13, bg: 'bg-emerald-50/50', border: 'border-emerald-200/60', text: 'text-emerald-500', outer: 'border-emerald-200' },
  { id: 9, name: 'Gardener', icon: Leaf, count: 6, bg: 'bg-lime-50/50', border: 'border-lime-200/60', text: 'text-lime-500', outer: 'border-lime-200' },
];

/* ── Top Rated Providers ── */
const topProviders = [
  { id: 1, initials: 'RP', name: 'Ram Prasad Shrestha', service: 'Electrician', location: 'Kathmandu', rating: 4.9, reviews: 134, price: 800 },
  { id: 2, initials: 'ST', name: 'Sita Tamang', service: 'Beautician', location: 'Lalitpur', rating: 4.8, reviews: 112, price: 500 },
  { id: 3, initials: 'PS', name: 'Priya Shrestha', service: 'Beautician', location: 'Kathmandu', rating: 4.9, reviews: 201, price: 700 },
];

export default function UserServices() {
  return (
    <div style={{ padding: '32px', width: '100%', boxSizing: 'border-box' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, marginBottom: '4px' }}>
          Browse Services
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, margin: 0 }}>
          Choose a category to find verified professionals near you
        </p>
      </div>

      {/* ── Search Bar — single unified row ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '32px',
        boxSizing: 'border-box',
        minWidth: 0,
      }}>
        {/* Left: search input */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flex: '1 1 0%',
          padding: '11px 16px',
          minWidth: 0,
        }}>
          <Search size={18} color="#94a3b8" style={{ marginRight: '10px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search services or providers..."
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '14px',
              color: '#334155',
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: '#e2e8f0', flexShrink: 0 }} />

        {/* Right: location button */}
        <button
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px',
            padding: '11px 20px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            color: '#334155',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            fontFamily: 'inherit',
          }}
        >
          <MapPin size={16} color="#ef4444" />
          All Locations
          <ChevronDown size={14} color="#94a3b8" strokeWidth={3} style={{ marginLeft: '2px' }} />
        </button>
      </div>

      {/* ── Categories Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {categories.map((cat) => {
          const IconComp = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/user/services/${cat.id}`}
              className={`flex flex-col items-start justify-between p-6 rounded-[20px] border ${cat.bg} ${cat.border} hover:shadow-sm transition-all min-h-[140px] group`}
              style={{ textDecoration: 'none' }}
            >
              <div className={`w-10 h-10 rounded-full border ${cat.outer} flex items-center justify-center bg-transparent mt-1 ml-1`}>
                <IconComp size={18} className={cat.text} strokeWidth={1.5} />
              </div>
              <div className="mt-auto ml-1">
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">{cat.name}</h3>
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                  <span className={`w-[5px] h-[5px] rounded-full ${cat.text.replace('text-', 'bg-')}`} />
                  {cat.count} providers
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Top Rated Providers ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Top Rated Providers</h2>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>Across all categories</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topProviders.map((provider) => (
            <div
              key={provider.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  background: '#dc2626', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 700,
                  fontSize: '15px', flexShrink: 0,
                }}>
                  {provider.initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{provider.name}</h3>
                    <span style={{
                      background: '#fef2f2', color: '#dc2626', fontSize: '10px',
                      fontWeight: 700, padding: '2px 8px', borderRadius: '6px', letterSpacing: '0.05em',
                    }}>Top Rated</span>
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', margin: '0 0 6px 0' }}>
                    {provider.service} · {provider.location}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={14} fill="#facc15" color="#facc15" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{provider.rating}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>({provider.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Rs. {provider.price}</div>
                <Link
                  to="/user/bookings/new"
                  style={{
                    background: '#dc2626', color: '#fff', fontSize: '13px', fontWeight: 700,
                    padding: '6px 24px', borderRadius: '8px', textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
