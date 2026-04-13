import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronLeft,
  Loader2,
  Crosshair,
  Check,
  X,
  Navigation,
} from 'lucide-react';
import ProviderCard from '@/components/user/ProviderCard';
import { servicesApi } from '@/lib/api';

/* ── Nepal city coordinates ── */
const NEPAL_CITIES = [
  { name: 'Kathmandu', latitude: 27.7172, longitude: 85.324 },
  { name: 'Lalitpur', latitude: 27.6588, longitude: 85.3247 },
  { name: 'Bhaktapur', latitude: 27.672, longitude: 85.4298 },
  { name: 'Pokhara', latitude: 28.2096, longitude: 83.9856 },
  { name: 'Biratnagar', latitude: 26.4525, longitude: 87.2718 },
  { name: 'Birgunj', latitude: 27.0104, longitude: 84.8779 },
  { name: 'Dharan', latitude: 26.8122, longitude: 87.2833 },
  { name: 'Butwal', latitude: 27.7006, longitude: 83.4483 },
  { name: 'Hetauda', latitude: 27.4287, longitude: 85.032 },
  { name: 'Janakpur', latitude: 26.7288, longitude: 85.9263 },
  { name: 'Bharatpur', latitude: 27.6833, longitude: 84.4333 },
  { name: 'Dhangadhi', latitude: 28.6967, longitude: 80.5986 },
];

type LocationState =
  | { type: 'none' }
  | { type: 'city'; name: string; latitude: number; longitude: number }
  | { type: 'gps'; latitude: number; longitude: number };

export default function CategoryProviders() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryName, setCategoryName] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Location state
  const [location, setLocation] = useState<LocationState>({ type: 'none' });
  const [locationOpen, setLocationOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch data on mount and when location changes
  useEffect(() => {
    fetchData();
  }, [categoryId, location]);

  // Debounced search within results
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch category name
      try {
        const catRes = await servicesApi.listCategories();
        const categories = Array.isArray(catRes.data) ? catRes.data : (catRes.data.categories || []);
        const cat = categories.find((c: any) => c.id === categoryId);
        setCategoryName(cat?.name || 'Services');
      } catch { setCategoryName('Services'); }

      const hasCoords = location.type === 'gps' || location.type === 'city';

      let res;
      if (hasCoords) {
        const coords = location as { latitude: number; longitude: number };
        res = await servicesApi.nearby({
          latitude: coords.latitude,
          longitude: coords.longitude,
          radius_km: 50,
          category_id: categoryId,
          limit: 50,
        });
      } else {
        res = await servicesApi.list({ category_id: categoryId });
      }

      const svcList = res.data.services || [];
      setServices(svcList);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Map services to the shape ProviderCard expects
  const providers = services.map((s: any) => ({
    id: s.provider?.id || s.provider_id || s.id,
    initials: s.provider?.user?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??',
    name: s.provider?.user?.full_name || s.title,
    service: s.title,
    experience: `${s.provider?.experience_years || 0}yr`,
    location: s.provider?.city || 'Nepal',
    area: s.provider?.address || '',
    rating: s.rating || 0,
    reviews: s.total_reviews || 0,
    price: s.price || 0,
    available: s.is_available,
    badge: s.provider?.is_verified ? 'Verified' as const : undefined,
    description: s.short_description || s.description || '',
    distance_km: s.distance_km,
  }));

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleCitySelect = (city: typeof NEPAL_CITIES[0]) => {
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
    <div className="p-8 w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/user/services" className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 transition-colors">
          <ChevronLeft size={16} /> All Services
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-[13px] font-bold text-slate-900">{categoryName}</span>
      </div>

      {/* ── Search Bar with location ── */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl mb-3" style={{ overflow: 'visible', position: 'relative' }}>
        <div className="flex items-center flex-1 px-4 py-3 min-w-0">
          <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${categoryName}...`}
            className="flex-1 min-w-0 border-none outline-none bg-transparent text-[14px] text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>
        <div className="w-px h-9 bg-slate-200 flex-shrink-0" />

        {/* Location dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-1.5 px-5 py-3 text-[14px] font-bold transition-colors whitespace-nowrap flex-shrink-0"
            style={{
              border: 'none',
              outline: 'none',
              background: location.type !== 'none' ? '#eff6ff' : 'transparent',
              color: location.type !== 'none' ? '#2563eb' : '#334155',
              cursor: 'pointer',
              borderRadius: '0 12px 12px 0',
              fontFamily: 'inherit',
            }}
          >
            {location.type === 'gps' ? (
              <Crosshair size={15} color="#2563eb" />
            ) : (
              <MapPin size={15} className={location.type !== 'none' ? 'text-blue-600' : 'text-red-500'} />
            )}
            {locationLabel}
            {location.type !== 'none' ? (
              <X
                size={14}
                className="text-slate-400 ml-0.5"
                strokeWidth={3}
                onClick={(e) => { e.stopPropagation(); clearLocation(); }}
              />
            ) : (
              <ChevronDown size={14} className="text-slate-400" strokeWidth={3} />
            )}
          </button>

          {/* Dropdown panel */}
          {locationOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: '270px',
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              zIndex: 100,
              padding: '8px',
              animation: 'fadeIn 0.15s ease-out',
            }}>
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
                  background: location.type === 'gps' ? '#eff6ff' : '#f8fafc',
                  borderRadius: '12px',
                  cursor: gpsLoading ? 'wait' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1e40af',
                  fontFamily: 'inherit',
                  marginBottom: '4px',
                }}
              >
                {gpsLoading ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {gpsLoading ? 'Detecting...' : 'Use My Location'}
                </span>
                {location.type === 'gps' && <Check size={16} color="#2563eb" />}
              </button>
              {gpsError && (
                <p style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, padding: '4px 14px', margin: 0 }}>{gpsError}</p>
              )}
              <div style={{ padding: '8px 14px 6px', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Cities
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {NEPAL_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '8px 14px', border: 'none',
                      background: location.type === 'city' && (location as any).name === city.name ? '#eff6ff' : 'transparent',
                      borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      color: '#334155', fontFamily: 'inherit', textAlign: 'left',
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
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                <button
                  onClick={clearLocation}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    padding: '8px 14px', border: 'none', background: location.type === 'none' ? '#f1f5f9' : 'transparent',
                    borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    color: '#64748b', fontFamily: 'inherit', textAlign: 'left',
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

        <span className="text-[13px] font-medium text-slate-400 px-4 flex-shrink-0">
          {filteredProviders.length} found
        </span>
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
          marginBottom: '16px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#1e40af',
        }}>
          <Navigation size={13} />
          <span>
            Showing {categoryName} near{' '}
            <strong>{location.type === 'gps' ? 'your location' : (location as any).name}</strong>
          </span>
          <button
            onClick={clearLocation}
            style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-red-500" />
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex flex-col items-center gap-3">
              <MapPin size={32} className="text-slate-300" />
              <p className="text-slate-400 font-medium">
                {location.type !== 'none'
                  ? 'No providers found near this location in this category.'
                  : 'No providers found in this category.'}
              </p>
              {location.type !== 'none' && (
                <button onClick={clearLocation} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                  Clear location filter
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} category={categoryId || ''} />
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
