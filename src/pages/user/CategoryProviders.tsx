import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, ChevronLeft, Loader2 } from 'lucide-react';
import ProviderCard from '@/components/user/ProviderCard';
import { servicesApi } from '@/lib/api';

export default function CategoryProviders() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryName, setCategoryName] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

        // Fetch services for this category
        const res = await servicesApi.list({ category_id: categoryId });
        const svcList = res.data.services || [];
        setServices(svcList);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  // Map services to the shape ProviderCard expects
  const providers = services.map((s: any) => ({
    id: s.id,
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
  }));

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/user/services" className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 transition-colors">
          <ChevronLeft size={16} /> All Services
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-[13px] font-bold text-slate-900">{categoryName}</span>
      </div>

      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
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
        <button className="flex items-center gap-1.5 px-5 py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap flex-shrink-0">
          <MapPin size={15} className="text-red-500" /> All Locations
          <ChevronDown size={14} className="text-slate-400" strokeWidth={3} />
        </button>
        <span className="text-[13px] font-medium text-slate-400 px-4 flex-shrink-0">
          {filteredProviders.length} found
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-red-500" />
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No providers found in this category.</p>
          </div>
        ) : (
          filteredProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} category={categoryId || ''} />
          ))
        )}
      </div>
    </div>
  );
}
