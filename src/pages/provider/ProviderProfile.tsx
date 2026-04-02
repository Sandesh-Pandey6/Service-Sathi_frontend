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
        setUser({
          ...data.user,
          full_name: 'Kamal Prasad Shrestha',
          email: 'kamal@example.com',
          phone: '+977 98XXXXXXXX',
          city: 'Kathmandu'
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-[720px] pb-12">
      
      {/* Profile Photo Card */}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100/60">
        <h2 className="text-[15px] font-extrabold text-slate-900 mb-6">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[#eff0fe] flex items-center justify-center text-indigo-600 font-extrabold text-[28px]">
              KP
            </div>
            <button className="absolute -bottom-2 -right-2 w-[34px] h-[34px] bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white hover:bg-indigo-700 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className="text-[16px] font-extrabold text-slate-900 mb-1">{user?.full_name || 'Kamal Prasad Shrestha'}</h3>
            <p className="text-[13px] font-medium text-slate-500 mb-2">Electrician - Kathmandu</p>
            <div className="flex items-center gap-1.5 text-[13px]">
              <div className="flex text-amber-400 text-sm">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span className="font-bold text-slate-700 ml-1">4.9</span>
              <span className="text-slate-400 font-medium">(47 reviews)</span>
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
              defaultValue={user?.full_name} 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={user?.email} 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">Phone</label>
            <input 
              type="text" 
              defaultValue={user?.phone} 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-2">City</label>
            <input 
              type="text" 
              defaultValue={user?.city || 'Kathmandu'} 
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
            {['Electrician', 'Wiring', 'Circuit Repair', 'Outdoor Lighting'].map((s) => (
               <span key={s} className="px-4 py-1.5 bg-[#eff0fe] text-indigo-600 rounded-full text-[12px] font-bold">
                 {s}
               </span>
            ))}
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-slate-400 hover:text-slate-500 rounded-full text-[12px] font-bold hover:bg-slate-50 transition flex items-center gap-1.5">
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
             {[
               { id: 1, name: 'Electrician', rate: '800' },
               { id: 2, name: 'Wiring', rate: '1200' },
               { id: 3, name: 'Circuit Repair', rate: '1500' },
               { id: 4, name: 'Outdoor Lighting', rate: '2000' }
             ].map((svc) => (
               <div key={svc.id} className="border border-gray-200 rounded-[14px] p-2 flex items-center justify-between gap-4 w-full">
                 <div className="px-5 py-2 bg-[#eff0fe] text-indigo-600 rounded-[10px] text-[13px] font-bold w-[140px] text-center">
                   {svc.name}
                 </div>
                 <div className="flex items-center gap-2 flex-1">
                   <span className="text-slate-400 text-[13px] font-bold w-6 text-right">Rs</span>
                   <span className="text-slate-800 text-[14px] font-extrabold">{svc.rate}</span>
                 </div>
                 <div className="text-slate-400 text-[12px] font-medium pr-4 w-20 text-right">
                   per visit
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-2">Bio</label>
          <textarea 
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[13px] text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none min-h-[100px]"
            defaultValue="Licensed electrician with 8+ years of experience in residential and commercial wiring, circuit repairs, and electrical safety inspections across Kathmandu Valley."
          ></textarea>
        </div>
      </div>

      {/* Certificates Card */}
      <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-gray-100/60">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[15px] font-extrabold text-slate-900 mb-1">Certificates</h2>
            <p className="text-[12px] font-medium text-slate-400">Upload your skill certificates to boost trust and get more bookings</p>
          </div>
          <div className="px-3.5 py-1.5 bg-[#eff0fe] text-indigo-600 rounded-full text-[11px] font-bold tracking-wide mt-1">
            1/2 uploaded
          </div>
        </div>

        <div className="space-y-4">
          {/* Uploaded Certificate */}
          <div className="border border-emerald-400 border-dashed bg-emerald-50/40 rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-emerald-50/60">
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-500 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-0.5">Trade License / Skill Certificate</h4>
                <p className="text-[12px] font-semibold text-emerald-600">
                  trade_license.pdf <span className="text-slate-400 font-medium mx-1">-</span> <span className="text-slate-400 font-medium cursor-pointer hover:text-slate-600 transition">Click to remove</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-4 border-l border-emerald-200/50">
              <span className="text-[12px] font-bold text-emerald-600">Uploaded</span>
              <button className="text-slate-300 hover:text-red-500 transition-colors p-1">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pending Certificate */}
          <div className="border border-gray-200 border-dashed rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-slate-50 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-slate-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-0.5">Electrical Work Permit</h4>
                <p className="text-[12px] font-medium text-slate-400">
                  PDF, JPG or PNG <span className="mx-1">·</span> Max 5 MB <span className="mx-1">-</span> <span className="text-slate-500 group-hover:text-indigo-600 transition-colors">Click to upload</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
              <span className="text-[12px] font-bold text-slate-400">Pending</span>
              <button className="text-slate-200 hover:text-slate-400 transition-colors p-1">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <button className="w-full py-3.5 border border-[#eff0fe] border-dashed rounded-2xl text-[13px] font-bold text-indigo-600 bg-[#fbfbfe] hover:bg-[#eff0fe] transition-colors flex items-center justify-center gap-2 mt-4">
            <span className="text-lg leading-none -mt-1">+</span> Add Certificate
          </button>
        </div>

        <div className="mt-8 flex items-start gap-3 w-full">
           <span className="text-[11px] font-bold text-indigo-600 shrink-0 mt-0.5">i</span>
           <p className="text-[12px] font-medium text-slate-500 leading-relaxed pr-10">
             Verified providers with uploaded certificates are ranked higher in search results and receive a <span className="font-bold text-indigo-600 ml-1">Verified Badge</span>.
           </p>
        </div>
      </div>

      <div className="pt-2">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[14px] px-8 py-3 text-[14px] font-bold transition-all shadow-md shadow-indigo-200">
          Save Changes
        </button>
      </div>

    </div>
  );
}
