import { useState, useEffect, useRef } from 'react';
import { authApi, providerApi, servicesApi, usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, Camera, Loader2 } from 'lucide-react';

export default function ProviderProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Controlled form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');

  // Services state
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Modal state
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceCategoryId, setNewServiceCategoryId] = useState('');
  const [newServiceRate, setNewServiceRate] = useState('');
  const [isAddingService, setIsAddingService] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        setUser(data.user);
        setFullName(data.user?.full_name || '');
        setEmail(data.user?.email || '');
        setPhone(data.user?.phone || '');
        setCity(data.user?.provider_profile?.city || '');
        setBio(data.user?.provider_profile?.bio || '');

        if (data.user?.provider_profile?.id) {
          const [servicesRes, categoriesRes] = await Promise.all([
            providerApi.getServices(data.user.provider_profile.id),
            servicesApi.listCategories()
          ]);
          setProviderServices(Array.isArray(servicesRes.data) ? servicesRes.data : (servicesRes.data.services || []));
          setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.categories || []));
        }

      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await usersApi.updateProfile({
        full_name: fullName,
        phone: phone || undefined,
        city: city || undefined,
        bio: bio || undefined,
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await usersApi.uploadAvatar(formData);
      // Update user state with new image
      setUser((prev: any) => ({
        ...prev,
        profile_image: data.profile_image,
        provider_profile: {
          ...prev?.provider_profile,
          profile_image: data.profile_image,
        },
      }));
      toast.success('Profile photo updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      // Reset the input so re-selecting the same file triggers onChange
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleAddService = async () => {
    if (!newServiceCategoryId || !newServiceRate) {
      toast.error('Please select a category and specify a rate');
      return;
    }
    const cat = categories.find((c: any) => c.id === newServiceCategoryId);
    if (!cat) return;

    try {
      setIsAddingService(true);
      await servicesApi.create({
        category_id: cat.id,
        title: cat.name,
        description: `Professional ${cat.name} services.`,
        price: Number(newServiceRate),
      });
      toast.success('Service added successfully!');

      // Reload provider services
      const res = await providerApi.getServices(user.provider_profile.id);
      setProviderServices(Array.isArray(res.data) ? res.data : (res.data.services || []));

      setShowAddServiceModal(false);
      setNewServiceRate('');
      setNewServiceCategoryId('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add service');
    } finally {
      setIsAddingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesApi.delete(id);
      toast.success('Service deleted successfully');
      setProviderServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      toast.error('Failed to delete service');
    }
  };

  const handleUpdateServicePrice = async (id: string, newPriceStr: string) => {
    const newPrice = Number(newPriceStr);
    if (isNaN(newPrice) || newPrice <= 0) return;
    
    const svc = providerServices.find(s => s.id === id);
    if (svc && svc.price === newPrice) return; // No change

    try {
      await servicesApi.update(id, { price: newPrice });
      toast.success('Price updated automatically');
      setProviderServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
    } catch (err: any) {
      toast.error('Failed to update price');
      // Force re-render to revert input value
      setProviderServices([...providerServices]); 
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingDoc(true);
      const formData = new FormData();
      formData.append('document', file);

      const newDocKey = 'certificate_' + Date.now();
      formData.append('doc_type', newDocKey);

      const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const res = await fetch(`${BASE_URL}/auth/upload-document`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const currentDocs = { ...(user?.provider_profile?.documents || {}) };
      currentDocs[data.doc_type || newDocKey] = data.url;

      await usersApi.updateProfile({ documents: currentDocs });
      toast.success('Document uploaded successfully');

      // Refresh user data to get updated documents_verified
      const meRes = await authApi.me();
      setUser(meRes.data.user);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload document');
    } finally {
      setIsUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (key: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const currentDocs = { ...(user?.provider_profile?.documents || {}) };
      delete currentDocs[key];

      await usersApi.updateProfile({ documents: currentDocs });
      toast.success('Document deleted');

      // Refresh user data
      const meRes = await authApi.me();
      setUser(meRes.data.user);
    } catch (err: any) {
      toast.error('Failed to delete document');
    }
  };

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading profile...</div>;

  const initials = user?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  const docsVerified = (user?.provider_profile?.documents_verified || {}) as Record<string, any>;

  const getDocStatus = (key: string): { status: string; label: string; color: string; bg: string } => {
    const v = docsVerified[key];
    if (!v || v.status === 'pending') return { status: 'pending', label: 'Pending Verification', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (v.status === 'approved') return { status: 'approved', label: 'Verified', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    return { status: 'rejected', label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-6 max-w-[720px] pb-12">

      {/* Profile Photo Card */}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100/60">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[#eff0fe] flex items-center justify-center text-indigo-600 font-extrabold text-[28px] overflow-hidden">
              {uploadingAvatar ? (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                  <Loader2 size={28} className="animate-spin text-indigo-500" />
                </div>
              ) : (user?.provider_profile?.profile_image || user?.profile_image) ? (
                <img src={user?.provider_profile?.profile_image || user?.profile_image} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-2 -right-2 w-[34px] h-[34px] bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-slate-900 mb-1">{user?.full_name}</h3>
            <p className="text-[13px] font-medium text-slate-500 mb-2">
              {user?.provider_profile?.categories?.[0] || 'Service Provider'} - {user?.provider_profile?.city || 'No City'}
            </p>
            <div className="flex items-center gap-1.5 text-[13px]">
              <div className="flex text-amber-400 gap-0.5">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-current" />)}
              </div>
              <span className="font-bold text-slate-700 ml-1">{user?.provider_profile?.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-slate-400 font-medium">({user?.provider_profile?.total_reviews || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100/60">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-500 outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Professional Details Card */}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100/60">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Professional Details</h2>

        <div className="mb-8">
          <label className="block text-[13px] font-semibold text-slate-700 mb-3">Services Offered</label>
          <div className="flex flex-wrap gap-2.5">
            {providerServices.length > 0 ? providerServices.map((s: any) => (
               <span key={s.id} className="px-4 py-1.5 bg-[#eff0fe] text-indigo-600 rounded-full text-[12px] font-bold">
                 {s.title || s.category?.name}
               </span>
            )) : <span className="text-slate-400 text-sm">No services added yet</span>}
            <button onClick={() => setShowAddServiceModal(true)} type="button" className="px-4 py-1.5 bg-white border border-gray-200 text-slate-400 hover:text-slate-500 rounded-full text-[12px] font-bold hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer">
              <span className="text-sm leading-none -mt-0.5">+</span> Add
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-slate-700 mb-1">Service Rates</label>
            <p className="text-[12px] font-medium text-slate-400">Set your own rate for each service you offer</p>
          </div>
          <div className="space-y-3">
             {providerServices.length > 0 ? providerServices.map((svc: any) => (
               <div key={svc.id} className="border border-gray-200 rounded-[14px] p-2 flex items-center justify-between gap-4 w-full">
                 <div className="px-5 py-2 bg-[#eff0fe] text-indigo-600 rounded-[10px] text-[13px] font-bold w-[140px] text-center truncate">
                   {svc.title || svc.category?.name}
                 </div>
                 <div className="flex items-center gap-2 flex-1">
                   <span className="text-slate-400 text-[13px] font-bold w-6 text-right">Rs</span>
                   <input 
                     type="number" 
                     defaultValue={svc.price} 
                     onBlur={(e) => handleUpdateServicePrice(svc.id, e.target.value)}
                     className="text-slate-800 text-[14px] font-extrabold w-24 bg-transparent outline-none border-b border-transparent hover:border-indigo-200 focus:border-indigo-400 focus:bg-indigo-50/30 px-1 py-0.5 rounded transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                     placeholder="0"
                     min="1"
                   />
                 </div>
                  <div className="text-slate-400 text-[12px] font-medium pr-4 w-20 text-right">
                   {svc.price_type === 'hourly' ? 'per hour' : 'fixed'}
                 </div>
                 <button onClick={() => handleDeleteService(svc.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center shrink-0" title="Delete service">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                 </button>
               </div>
             )) : <p className="text-[13px] text-slate-400 font-medium">No active services. Add one above.</p>}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-2">Bio</label>
          <textarea
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[13px] text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none min-h-[100px]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your services..."
          ></textarea>
        </div>
      </div>

      {/* Certificates Card */}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100/60">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 mb-1">Documents</h2>
            <p className="text-[12px] font-medium text-slate-400">View and manage your verification documents</p>
          </div>
          <div className="px-3.5 py-1.5 bg-[#eff0fe] text-indigo-600 rounded-full text-[11px] font-bold tracking-wide mt-1">
            {Object.keys(user?.provider_profile?.documents || {}).length} uploaded
          </div>
        </div>

        <div className="space-y-4">
          {(Object.entries(user?.provider_profile?.documents || {}) as [string, any][]).map(([key, url]) => {
            if (!url) return null;
            const docStatus = getDocStatus(key);
            const borderColor = docStatus.status === 'approved' ? 'border-emerald-400' : docStatus.status === 'rejected' ? 'border-red-300' : 'border-amber-300';
            const bgColor = docStatus.status === 'approved' ? 'bg-emerald-50/40' : docStatus.status === 'rejected' ? 'bg-red-50/40' : 'bg-amber-50/40';
            const iconColor = docStatus.status === 'approved' ? 'text-emerald-500 bg-emerald-100/60' : docStatus.status === 'rejected' ? 'text-red-500 bg-red-100/60' : 'text-amber-500 bg-amber-100/60';

            return (
            <div key={key} className={`border ${borderColor} border-dashed ${bgColor} rounded-2xl p-4 flex items-center justify-between transition-all`}>
              <div className="flex items-center gap-4">
                <div className={`w-[42px] h-[42px] rounded-full ${iconColor} flex items-center justify-center shrink-0`}>
                  {docStatus.status === 'approved' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : docStatus.status === 'rejected' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900 mb-0.5 capitalize">{key.replace(/_/g, ' ')}</h4>
                  <a href={url as string} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition">
                    View Document
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200/50">
                <span className={`text-[12px] font-bold ${docStatus.color} ${docStatus.bg} px-2.5 py-1 rounded-lg`}>{docStatus.label}</span>
                <button onClick={() => handleDeleteDocument(key)} className="w-8 h-8 rounded-full bg-red-50/50 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            )
          })}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDocumentSelect}
            className="hidden"
            accept="image/jpeg,image/png,application/pdf"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingDoc}
            className="w-full py-3.5 border border-[#eff0fe] border-dashed rounded-2xl text-[13px] font-bold text-indigo-600 bg-[#fbfbfe] hover:bg-[#eff0fe] transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <span className="text-lg leading-none -mt-1">{isUploadingDoc ? '...' : '+'}</span>
            {isUploadingDoc ? 'Uploading...' : 'Add Certificate'}
          </button>
        </div>

        <div className="mt-8 flex items-start gap-3 w-full">
           <span className="text-[11px] font-bold text-indigo-600 shrink-0 mt-0.5">i</span>
           <p className="text-[12px] font-medium text-slate-500 leading-relaxed pr-10">
             Uploaded certificates must be <span className="font-bold text-amber-600">verified by admin</span> before they are visible to customers. Verified documents earn a <span className="font-bold text-indigo-600 ml-1">Verified Badge</span>.
           </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[14px] px-8 py-3 text-[14px] font-bold transition-all shadow-md shadow-indigo-200 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {showAddServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95">
             <h3 className="text-[16px] font-extrabold text-slate-900 mb-4 tracking-tight">Add Verified Service</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Select Service</label>
                 <select
                   value={newServiceCategoryId}
                   onChange={(e) => setNewServiceCategoryId(e.target.value)}
                   className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer appearance-none"
                 >
                   <option value="" disabled>Select a category...</option>
                   {categories.map((c: any) => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Service Rate (Rs)</label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[13px]">Rs</span>
                   <input
                     type="number"
                     value={newServiceRate}
                     onChange={(e) => setNewServiceRate(e.target.value)}
                     placeholder="e.g. 500"
                     className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                   />
                 </div>
               </div>
               <div className="flex gap-2.5 pt-2">
                 <button onClick={() => setShowAddServiceModal(false)} className="flex-1 py-3 bg-gray-100 text-slate-600 font-bold rounded-xl text-[13px] transition-colors hover:bg-gray-200">Cancel</button>
                 <button onClick={handleAddService} disabled={isAddingService} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-[13px] transition-colors hover:bg-indigo-700 shadow-md shadow-indigo-100">
                   {isAddingService ? 'Saving...' : 'Add Service'}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
