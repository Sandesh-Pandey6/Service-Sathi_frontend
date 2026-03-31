import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProviderProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        setUser(data.user);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading profile...</div>;
  if (!user) return <div className="p-6 text-slate-500 font-medium">Profile not found.</div>;

  const provider = user.provider_profile || {};

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex gap-5 items-start">
          <img 
            src={user.profile_image || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.full_name}&backgroundColor=b6e3f4`} 
            alt="Profile" 
            className="w-24 h-24 rounded-2xl border-2 border-amber-200 bg-amber-50 object-cover" 
          />
          <div className="flex-1">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
              Service Provider
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900">{user.full_name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {provider.experience_years ? `${provider.experience_years} Years Experience` : 'New Provider'} 
              {provider.is_verified ? ' · Identity Verified ✓' : ''}
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">✉ {user.email}</span>
              {user.phone && <span className="flex items-center gap-1">📞 {user.phone}</span>}
            </div>
            {provider.description && (
              <p className="mt-4 text-sm text-slate-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {provider.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">Service Info</h2>
          <button className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors">Edit</button>
        </div>
        {[
          { label: 'Experience', value: provider.experience_years ? `${provider.experience_years} Years` : 'Not specified' },
          { label: 'Join Date', value: new Date(user.created_at).toLocaleDateString() },
          { label: 'Status', value: provider.is_available ? 'Available' : 'Unavailable' },
          { label: 'Business', value: provider.business_name || 'Not specified' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest w-28 flex-shrink-0">{label}</p>
            <p className="text-sm font-semibold text-slate-700 capitalize">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

}
