// src/pages/admin/AdminServices.tsx
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PackagePlus, Eye, Trash2 } from 'lucide-react';
import { mockServiceCategories } from '@/data/adminMockData';

export default function AdminServices() {
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
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-3 font-medium px-4">Category</th>
                <th className="pb-3 font-medium px-4">Providers</th>
                <th className="pb-3 font-medium px-4">Bookings</th>
                <th className="pb-3 font-medium px-4">Revenue</th>
                <th className="pb-3 font-medium px-4">Status</th>
                <th className="pb-3 font-medium px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockServiceCategories.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">No categories found</td></tr>
              )}
              {mockServiceCategories.map((c, i) => (
                <tr key={`${c.id}-${i}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800">{c.name}</td>
                  <td className="py-4 px-4 text-slate-500">{c.providers}</td>
                  <td className="py-4 px-4 text-slate-500">{c.bookings}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{c.revenue}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Delete Category">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
