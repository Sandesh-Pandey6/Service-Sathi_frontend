import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, ChevronLeft } from 'lucide-react';
import ProviderCard from '@/components/user/ProviderCard';
import { CATEGORY_MAP, PROVIDERS } from '@/data/providers';

export default function CategoryProviders() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryName = CATEGORY_MAP[categoryId || ''] || 'Unknown';
  const providers = PROVIDERS[categoryId || ''] || [];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 w-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to="/user/services"
          className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-red-600 transition-colors"
        >
          <ChevronLeft size={16} />
          All Services
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-[13px] font-bold text-slate-900">{categoryName}</span>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
        <div className="flex items-center flex-1 px-4 py-3 min-w-0">
          <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${categoryName}s...`}
            className="flex-1 min-w-0 border-none outline-none bg-transparent text-[14px] text-slate-700 font-medium placeholder:text-slate-400"
          />
        </div>

        <div className="w-px h-9 bg-slate-200 flex-shrink-0" />

        <button className="flex items-center gap-1.5 px-5 py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap flex-shrink-0">
          <MapPin size={15} className="text-red-500" />
          All Locations
          <ChevronDown size={14} className="text-slate-400" strokeWidth={3} />
        </button>

        <span className="text-[13px] font-medium text-slate-400 px-4 flex-shrink-0">
          {filteredProviders.length} found
        </span>
      </div>

      {/* Provider List */}
      <div className="flex flex-col gap-4">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No providers found in this category.</p>
          </div>
        ) : (
          filteredProviders.map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              category={categoryId || ''}
            />
          ))
        )}
      </div>
    </div>
  );
}
