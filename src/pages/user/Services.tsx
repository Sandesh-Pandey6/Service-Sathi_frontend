import { Link, useSearchParams } from 'react-router-dom';
import {
  Star,
  Search,
  MapPin,
  ChevronDown,
  Wrench,
  Navigation,
  X,
  Crosshair,
  Check,
} from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
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

/* ── City type for dynamic provider cities ── */
type CityInfo = { name: string; latitude: number | null; longitude: number | null; count?: number };

type LocationState =
  | { type: 'none' }
  | { type: 'city'; name: string; latitude?: number | null; longitude?: number | null }
  | { type: 'gps'; latitude: number; longitude: number };

export default function UserServices() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);

  // Dynamic cities from API
  const [dynamicCities, setDynamicCities] = useState<CityInfo[]>([]);

  // Location state
  const [location, setLocation] = useState<LocationState>({ type: 'none' });
  const [locationOpen, setLocationOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch provider cities from API
  useEffect(() => {
    servicesApi.getProviderCities().then(({ data }) => {
      setDynamicCities(data.cities || []);
    }).catch(() => {});
  }, []);

  // Parse URL params on mount (from HomePage navigation)
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const city = searchParams.get('city');
    if (lat && lng) {
      setLocation({ type: 'gps', latitude: parseFloat(lat), longitude: parseFloat(lng) });
    } else if (city) {
      const found = dynamicCities.find(c => c.name.toLowerCase() === city.toLowerCase());
      if (found) {
        setLocation({ type: 'city', name: found.name, latitude: found.latitude, longitude: found.longitude });
      } else {
        // City not in dynamic list yet, still set it by name
        setLocation({ type: 'city', name: city });
      }
    }
  }, [dynamicCities]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [location]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFx = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(delayDebounceFx);
  }, [searchTerm]);

  const loadData = async () => {
    try {
      setIsSearching(true);

      // Always load categories
      const catsPromise = servicesApi.listCategories();

      let provPromise;
      const hasCoords = location.type === 'gps' || location.type === 'city';

      if (hasCoords) {
        const coords = location as { latitude?: number | null; longitude?: number | null };
        if (coords.latitude != null && coords.longitude != null) {
          provPromise = servicesApi.nearby({
            latitude: coords.latitude,
            longitude: coords.longitude,
            radius_km: 50,
            q: searchTerm || undefined,
            limit: 20,
          });
        } else {
          // City without coordinates — search by city name
          const cityName = location.type === 'city' ? (location as any).name : undefined;
          provPromise = servicesApi.search({ q: searchTerm || undefined, city: cityName, limit: 20 });
        }
      } else if (searchTerm) {
        provPromise = servicesApi.search({ q: searchTerm, limit: 20 });
      } else {
        provPromise = servicesApi.search({ limit: 4 });
      }

      const [catsRes, provRes] = await Promise.all([catsPromise, provPromise]);
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : (catsRes.data.categories || []));
      setProviders(Array.isArray(provRes.data) ? provRes.data : (provRes.data.services || []));
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          type: 'gps',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGpsLoading(false);
        setLocationOpen(false);
      },
      (err) => {
        setGpsError(
          err.code === 1
            ? 'Permission denied. Please allow location access.'
            : 'Could not get your location. Try again.'
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCitySelect = (city: CityInfo) => {
    setLocation({ type: 'city', name: city.name, latitude: city.latitude, longitude: city.longitude });
    setLocationOpen(false);
  };

  const clearLocation = () => {
    setLocation({ type: 'none' });
    setLocationOpen(false);
  };

  const locationLabel =
    location.type === 'gps'
      ? 'My Location'
      : location.type === 'city'
        ? location.name
        : 'All Locations';

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
        overflow: 'visible',
        marginBottom: '12px',
        boxSizing: 'border-box',
        minWidth: 0,
        position: 'relative',
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

        {/* Right: location dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '6px',
              padding: '11px 20px',
              border: 'none',
              outline: 'none',
              background: location.type !== 'none' ? '#eff6ff' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              color: location.type !== 'none' ? '#2563eb' : '#334155',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'inherit',
              borderRadius: '0 12px 12px 0',
              transition: 'background 0.15s',
            }}
          >
            {location.type === 'gps' ? (
              <Crosshair size={16} color="#2563eb" />
            ) : (
              <MapPin size={16} color={location.type !== 'none' ? '#2563eb' : '#ef4444'} />
            )}
            {locationLabel}
            {location.type !== 'none' ? (
              <X
                size={14}
                color="#94a3b8"
                strokeWidth={3}
                style={{ marginLeft: '2px', cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); clearLocation(); }}
              />
            ) : (
              <ChevronDown size={14} color="#94a3b8" strokeWidth={3} style={{ marginLeft: '2px' }} />
            )}
          </button>

          {/* Dropdown panel */}
          {locationOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: '280px',
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              zIndex: 100,
              padding: '8px',
              animation: 'fadeIn 0.15s ease-out',
            }}>
              {/* GPS button */}
              <button
                onClick={handleUseMyLocation}
                disabled={gpsLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  outline: 'none',
                  background: location.type === 'gps' ? '#eff6ff' : '#f8fafc',
                  borderRadius: '12px',
                  cursor: gpsLoading ? 'wait' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1e40af',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                  marginBottom: '4px',
                }}
              >
                {gpsLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Crosshair size={16} />
                )}
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {gpsLoading ? 'Detecting location...' : 'Use My Location'}
                </span>
                {location.type === 'gps' && <Check size={16} color="#2563eb" />}
              </button>

              {gpsError && (
                <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, padding: '4px 14px', margin: 0 }}>
                  {gpsError}
                </p>
              )}

              {/* Divider + cities label */}
              <div style={{ padding: '8px 14px 6px', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Provider Locations
              </div>

              {/* City list */}
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {dynamicCities.length === 0 && (
                  <div style={{ padding: '12px 14px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No provider locations available</div>
                )}
                {dynamicCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '9px 14px',
                      border: 'none',
                      outline: 'none',
                      background: location.type === 'city' && (location as any).name === city.name ? '#eff6ff' : 'transparent',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      fontFamily: 'inherit',
                      transition: 'background 0.1s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = location.type === 'city' && (location as any).name === city.name ? '#eff6ff' : 'transparent')}
                  >
                    <MapPin size={14} color="#94a3b8" />
                    <span style={{ flex: 1 }}>{city.name}</span>
                    {location.type === 'city' && (location as any).name === city.name && <Check size={14} color="#2563eb" />}
                  </button>
                ))}
              </div>

              {/* All locations */}
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                <button
                  onClick={clearLocation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '9px 14px',
                    border: 'none',
                    outline: 'none',
                    background: location.type === 'none' ? '#f1f5f9' : 'transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#64748b',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <X size={14} color="#94a3b8" />
                  <span>All Locations</span>
                  {location.type === 'none' && <Check size={14} color="#64748b" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Active location indicator ── */}
      {location.type !== 'none' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: '#eff6ff',
          borderRadius: '10px',
          marginBottom: '24px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#1e40af',
        }}>
          <Navigation size={14} />
          <span>
            Showing services near{' '}
            <strong>{location.type === 'gps' ? 'your location' : (location as any).name}</strong>
            {' '}(within 50 km)
          </span>
          <button
            onClick={clearLocation}
            style={{
              marginLeft: 'auto',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Categories Grid ── */}
      {!searchTerm && !loading && location.type === 'none' && (
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

      {/* ── Top Rated Providers / Search Results / Nearby Results ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {location.type !== 'none'
              ? `Nearby Services`
              : searchTerm
                ? 'Search Results'
                : 'Top Rated Providers'}
          </h2>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>
            {searchTerm || location.type !== 'none'
              ? `Found ${providers.length} matches`
              : 'Across all categories'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
             <Loader2 size={32} className="animate-spin text-red-500" />
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-3">
              <MapPin size={32} className="text-slate-300" />
              <p className="text-slate-400 font-medium">
                {location.type !== 'none'
                  ? 'No services found near this location. Try increasing the search area or choose a different location.'
                  : 'No services found matching your criteria.'}
              </p>
              {location.type !== 'none' && (
                <button
                  onClick={clearLocation}
                  className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear location filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {providers.map((service) => {
              const provider = service.provider || {};
              const user = provider.user || {};
              const initials = user.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'P';
              const name = user.full_name || 'Provider';
              const locationStr = provider.city || 'Nepal';
              const distanceKm = service.distance_km;
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
                      {service.title} · {locationStr}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={14} fill="#facc15" color="#facc15" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{Number(provider.rating || 0).toFixed(1)}</span>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>({provider.total_reviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Rs. {service.price}</div>
                  {distanceKm != null && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#2563eb',
                      background: '#eff6ff',
                      padding: '3px 10px',
                      borderRadius: '8px',
                    }}>
                      <Navigation size={11} />
                      {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm} km`}
                    </span>
                  )}
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

      {/* Dropdown animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
