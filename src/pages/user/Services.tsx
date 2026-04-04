import { Link } from 'react-router-dom';
import {
  Star,
  Search,
  MapPin,
  ChevronDown,
  Wrench
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { servicesApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

/* ── Predefined Visual Colors ── */
const COLORS = [
  { bg: 'bg-yellow-50/50', border: 'border-yellow-200/60', text: 'text-yellow-500', outer: 'border-yellow-200' },
  { bg: 'bg-blue-50/50', border: 'border-blue-200/60', text: 'text-blue-500', outer: 'border-blue-200' },
  { bg: 'bg-pink-50/50', border: 'border-pink-200/60', text: 'text-pink-500', outer: 'border-pink-200' },
  { bg: 'bg-slate-50/50', border: 'border-slate-200/60', text: 'text-slate-500', outer: 'border-slate-200' },
  { bg: 'bg-orange-50/50', border: 'border-orange-200/60', text: 'text-orange-500', outer: 'border-orange-200' },
  { bg: 'bg-cyan-50/50', border: 'border-cyan-200/60', text: 'text-cyan-500', outer: 'border-cyan-200' },
  { bg: 'bg-purple-50/50', border: 'border-purple-200/60', text: 'text-purple-500', outer: 'border-purple-200' },
  { bg: 'bg-emerald-50/50', border: 'border-emerald-200/60', text: 'text-emerald-500', outer: 'border-emerald-200' },
  { bg: 'bg-lime-50/50', border: 'border-lime-200/60', text: 'text-lime-500', outer: 'border-lime-200' },
];

export default function UserServices() {
  const [categories, setCategories] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [catsRes, provRes] = await Promise.all([
        servicesApi.listCategories(),
        servicesApi.search({ limit: 4 }) // top 4 based on backend default sorting
      ]);
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : (catsRes.data.categories || []));
      setProviders(Array.isArray(provRes.data) ? provRes.data : (provRes.data.services || []));
    } catch (err) {
      console.error('Failed to load initial data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      loadInitialData();
      return;
    }
    const delayDebounceFx = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await servicesApi.search({ q: searchTerm, limit: 10 });
        setProviders(Array.isArray(res.data) ? res.data : (res.data.services || []));
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFx);
  }, [searchTerm]);
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {isSearching && <Loader2 size={16} className="text-slate-400 animate-spin mr-2" />}
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
      {!searchTerm && !loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '40px',
        }}>
          {categories.map((cat, index) => {
            const visual = COLORS[index % COLORS.length];
            return (
              <Link
                key={cat.id}
                to={`/user/services/${cat.id}`}
                className={`flex flex-col items-start justify-between p-6 rounded-[20px] border ${visual.bg} ${visual.border} hover:shadow-sm transition-all min-h-[140px] group`}
                style={{ textDecoration: 'none' }}
              >
                <div className={`w-10 h-10 rounded-full border ${visual.outer} flex items-center justify-center bg-transparent mt-1 ml-1 text-[18px]`}>
                  {cat.icon || <Wrench size={18} className={visual.text} />}
                </div>
                <div className="mt-auto ml-1">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1">{cat.name}</h3>
                  <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                    <span className={`w-[5px] h-[5px] rounded-full ${visual.text.replace('text-', 'bg-')}`} />
                    {cat._count?.services || 0} providers
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Top Rated Providers / Search Results ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {searchTerm ? 'Search Results' : 'Top Rated Providers'}
          </h2>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>
            {searchTerm ? `Found ${providers.length} matches` : 'Across all categories'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
             <Loader2 size={32} className="animate-spin text-red-500" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-slate-400 font-medium">No services found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {providers.map((service) => {
              const provider = service.provider || {};
              const user = provider.user || {};
              const initials = user.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'P';
              const name = user.full_name || 'Provider';
              const location = provider.city || 'Nepal';
              return (
              <div
                key={service.id}
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
                    {initials}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <Link to={`/user/services/${service.category_id}/${provider.id}`} style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, textDecoration: 'none' }}>
                         {name}
                      </Link>
                      {provider.is_verified && (
                        <span style={{
                          background: '#e0e7ff', color: '#4f46e5', fontSize: '10px',
                          fontWeight: 700, padding: '2px 8px', borderRadius: '6px', letterSpacing: '0.05em',
                        }}>Verified</span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', margin: '0 0 6px 0' }}>
                      {service.title} · {location}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={14} fill="#facc15" color="#facc15" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{provider.rating || 0}</span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>({provider.total_reviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Rs. {service.price}</div>
                  <Link
                    to={`/user/services/${service.category_id}/${provider.id}`}
                    style={{
                      background: '#dc2626', color: '#fff', fontSize: '13px', fontWeight: 700,
                      padding: '6px 24px', borderRadius: '8px', textDecoration: 'none',
                      display: 'inline-block',
                    }}
                  >
                    View
                  </Link>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
