import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Zap, Folder, Star, Calendar } from 'lucide-react';

export default function ProviderServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        const providerId = data.user?.provider_profile?.id;
        if (providerId) {
          const res = await providerApi.getServices(providerId);
          setServices(Array.isArray(res.data) ? res.data : (res.data.services || []));
        }
      } catch (err: any) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500 font-medium">Loading services...</div>;
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Services</h1>
          <p className="text-sm text-slate-400 mt-0.5">{services.length} services listed</p>
        </div>
        <button onClick={() => toast('Add service form coming soon!')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all">+ Add Service</button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-slate-400">You haven't added any services yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl">
                {s.category?.icon || <Zap size={24} className="text-amber-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-800">{s.title || s.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Folder size={12} /> {s.category?.name || 'Uncategorized'}</span>
                  <span className="flex items-center gap-1"><Star size={12} /> {s.rating || '0.0'}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {s.total_bookings || 0} bookings</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-amber-600">₹ {s.price?.toLocaleString() || 0}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.price_type === 'hourly' ? 'per hour' : 'fixed'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
