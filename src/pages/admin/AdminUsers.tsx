import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SimpleStatCard } from '@/components/admin/SimpleStatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Filter, Download, Users } from 'lucide-react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<string>('All Users');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const tabs = ['All Users', 'Active', 'Inactive', 'Banned'];

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getDashboardStats();
      setStats(res.data);
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.listUsers({ page: 1, limit: 50 });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!confirm('Are you sure you want to block this user from logging in?')) return;
    try {
      await adminApi.blockUser(userId);
      toast.success('User blocked');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    if (!confirm('Are you sure you want to unblock this user?')) return;
    try {
      await adminApi.unblockUser(userId);
      toast.success('User unblocked');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to unblock user');
    }
  };

  const filteredUsers = users.filter(u => {
    if (activeTab === 'All Users') return true;
    if (activeTab === 'Active') return u.is_verified && u.email_verified;
    if (activeTab === 'Inactive') return !u.email_verified;
    if (activeTab === 'Banned') return u.is_blocked;
    return true;
  });

  return (
    <AdminLayout title="Users" breadcrumbs={['Admin', 'Users']}>
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-2 gap-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1 sm:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white text-slate-600 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white text-slate-600 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
        <SimpleStatCard title="Total Users" value={stats?.users?.total?.toLocaleString() || '0'} color="blue" />
        <SimpleStatCard title="Customers" value={stats?.users?.customers?.toLocaleString() || '0'} color="emerald" />
        <SimpleStatCard title="Providers" value={stats?.users?.providers?.toLocaleString() || '0'} color="slate" />
        <SimpleStatCard title="Total Services" value={stats?.services?.total?.toLocaleString() || '0'} color="rose" />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">User</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Email</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Role</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Joined</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Verified</th>
                <th className="px-4 sm:px-6 py-5 text-xs font-bold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm font-medium">
                    <Users size={32} className="mx-auto mb-2" />
                    No users found
                  </td>
                </tr>
              )}
              {filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                        {u.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <p className="font-bold text-sm text-slate-800">{u.full_name}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-medium text-slate-500">{u.email}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={u.is_blocked ? 'cancelled' : u.role?.toUpperCase() === 'ADMIN' ? 'confirmed' : u.role?.toUpperCase() === 'PROVIDER' ? (u.provider_profile?.is_verified ? 'verified' : 'pending') : 'completed'} />
                    <span className="text-xs font-medium text-slate-500 ml-1">{u.role}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-500">{new Date(u.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={u.email_verified ? 'completed' : 'pending'} />
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {u.is_blocked ? (
                        <button
                          onClick={() => handleUnblockUser(u.id)}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(u.id)}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                        >
                          Block
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
