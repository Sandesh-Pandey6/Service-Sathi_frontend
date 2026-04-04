// src/pages/admin/AdminServices.tsx
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PackagePlus, Eye, Trash2, Layers } from 'lucide-react';
import { servicesApi } from '@/lib/api';

export default function AdminServices() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await servicesApi.listCategories();
      // API returns array directly or inside .categories
      const data = res.data;
      setCategories(Array.isArray(data) ? data : (data.categories || []));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Services & Categories" subtitle="Admin > Services">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-800">Service Categories</h2>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            <PackagePlus size={18} />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" /></div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Layers size={32} className="mb-2" /><p className="text-sm font-medium">No categories found. Create your first category.</p>
            </div>
          ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-medium px-4">Category</th>
                <th className="pb-3 font-medium px-4">Description</th>
                <th className="pb-3 font-medium px-4">Status</th>
                <th className="pb-3 font-medium px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c: any, i: number) => (
                <tr key={c.id || i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      {c.icon && <span className="text-lg">{c.icon}</span>}
                      {c.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{c.description || '—'}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={c.is_active ? 'active' : 'disabled'} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="View Details"><Eye size={18} /></button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Delete Category"><Trash2 size={18} /></button>
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
