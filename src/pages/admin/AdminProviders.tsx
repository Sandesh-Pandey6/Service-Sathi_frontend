// src/pages/admin/AdminProviders.tsx
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Eye, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

type FilterTab = 'All' | 'Verified' | 'Pending';

export default function AdminProviders() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Documents State
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<any>(null);

  const tabs: FilterTab[] = ['All', 'Verified', 'Pending'];

  useEffect(() => { fetchProviders(); }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.listUsers({ role: 'PROVIDER', limit: 50 });
      setProviders(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      await adminApi.verifyProvider(userId);
      toast.success('Provider verified!');
      fetchProviders();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to verify');
    }
  };

  const handleReject = async () => {
    if (!selectedUserId) return;
    try {
      await adminApi.rejectProvider(selectedUserId, rejectReason);
      toast.success('Provider rejected and account removed');
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedUserId(null);
      fetchProviders();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reject');
    }
  };

  const openDocs = (docs: any) => {
    if (!docs) {
      toast.error('No documents found for this provider');
      return;
    }
    setSelectedDocs(docs);
    setDocsModalOpen(true);
  };

  const filteredProviders = providers.filter(p => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Verified') return p.provider_profile?.is_verified;
    if (activeTab === 'Pending') return !p.provider_profile?.is_verified;
    return true;
  });

  const stats = {
    total: providers.length,
    verified: providers.filter(p => p.provider_profile?.is_verified).length,
    pending: providers.filter(p => !p.provider_profile?.is_verified).length,
  };

  const avatarColors = ['bg-red-500','bg-violet-500','bg-emerald-500','bg-blue-500','bg-amber-500','bg-pink-500'];

  return (
    <AdminLayout title="Providers" breadcrumbs={['Admin', 'Providers']}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-2 gap-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1 sm:pb-0">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}>{tab}</button>
          ))}
        </div>
        {stats.pending > 0 && (
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-md shadow-red-600/20">
            <ShieldCheck size={16} /> Verify Pending ({stats.pending})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <SimpleStatCard title="Total Providers" value={`${stats.total}`} color="blue" />
        <SimpleStatCard title="Verified" value={`${stats.verified}`} color="emerald" />
        <SimpleStatCard title="Pending" value={`${stats.pending}`} color="amber" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>
          ) : (
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Provider</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Email</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Joined</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Status</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProviders.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm font-medium">No providers found</td></tr>
              )}
              {filteredProviders.map((p, idx) => {
                const initials = p.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??';
                const avatarColor = avatarColors[idx % avatarColors.length];
                const isVerified = p.provider_profile?.is_verified;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>{initials}</div>
                        <p className="font-bold text-sm text-slate-800">{p.full_name}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4"><span className="text-sm font-medium text-slate-500">{p.email}</span></td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-slate-500">{new Date(p.created_at).toLocaleDateString()}</span></td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap"><StatusBadge status={isVerified ? 'verified' : 'pending'} /></td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button title="View Documents" onClick={() => openDocs(p.provider_profile?.documents)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={16} /></button>
                        {!isVerified && (
                          <>
                            <button title="Verify" onClick={() => handleVerify(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"><CheckCircle size={16} /></button>
                            <button title="Reject" onClick={() => { setSelectedUserId(p.id); setRejectModalOpen(true); }} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><XCircle size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Reject Application</h3>
              <p className="text-sm text-gray-500 mt-1">Please provide a reason for rejecting this provider.</p>
            </div>
            <div className="p-6">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Documents are blurry or incomplete..."
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[100px] text-sm"
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-sm">Reject Provider</button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {docsModalOpen && selectedDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Provider Documents</h3>
              <button onClick={() => setDocsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><span className="text-2xl leading-none">&times;</span></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 grid gap-6">
              {Object.entries(selectedDocs).map(([key, url]) => {
                if (!url || typeof url !== 'string') return null;
                return (
                  <div key={key} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-slate-800 px-4 py-2 text-white font-semibold text-sm capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    {url.match(/\.(jpeg|jpg|gif|png)$/) != null || url.includes('cloudinary') ? (
                      <img src={url} alt={key} className="w-full h-auto object-contain bg-gray-100 max-h-[400px]" />
                    ) : (
                      <div className="p-6 text-center">
                        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">View Document</a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
