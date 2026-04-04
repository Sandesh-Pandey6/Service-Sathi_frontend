// src/pages/admin/AdminServices.tsx
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PackagePlus, Eye, Trash2, Layers, X } from 'lucide-react';
import { servicesApi, adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminServices() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return toast.error('Category name is required');
    try {
      setIsSubmitting(true);
      await adminApi.createCategory({
        name: newCatName,
        description: newCatDesc,
        icon: newCatIcon || undefined
      });
      toast.success('Category created');
      setShowAddModal(false);
      setNewCatName('');
      setNewCatDesc('');
      setNewCatIcon('');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await servicesApi.deleteCategory(id);
      toast.success('Category deleted');
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleViewCategory = (category: any, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  return (
    <AdminLayout title="Services & Categories" subtitle="Admin > Services">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-bold text-slate-800">Service Categories</h2>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
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
                      <button onClick={(e) => handleViewCategory(c, e)} className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="View Details"><Eye size={18} /></button>
                      <button onClick={(e) => handleDeleteCategory(c.id, e)} className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Delete Category"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Add New Category</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category Name</label>
                <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="e.g. Electrician" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (opt)</label>
                <textarea value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} placeholder="Short outline of services." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm min-h-[80px] resize-none outline-none focus:ring-2 focus:ring-red-100"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon Emoji (opt)</label>
                <input type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder="e.g. ⚡" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleAddCategory} disabled={isSubmitting} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm">{isSubmitting ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                  {selectedCategory.icon || <Layers size={24} className="text-slate-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedCategory.name}</h3>
                  <StatusBadge status={selectedCategory.is_active ? 'active' : 'disabled'} />
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Description</h4>
              <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{selectedCategory.description || 'No description assigned.'}</p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
