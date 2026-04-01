// src/pages/admin/AdminSettings.tsx
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AdminLayout title="Settings" subtitle="Admin > Settings">
      <div className="max-w-[700px] flex flex-col gap-5 pb-10">
        
        {/* General Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">General Settings</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Platform Name</label>
              <input type="text" defaultValue="ServiceSathi" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Support Email</label>
              <input type="email" defaultValue="support@servicesathi.np" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Support Phone</label>
              <input type="tel" defaultValue="+977 01-XXXXXXX" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Default Currency</label>
              <input type="text" defaultValue="NPR (Rs)" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Platform Commission (%)</label>
              <input type="number" defaultValue={12} className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>
          </div>
          
          <button onClick={() => toast.success('General Settings Saved')} className="bg-[#e4002b] hover:bg-red-700 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-colors">
            Save General Settings
          </button>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Payment Gateway</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Khalti API Key</label>
              <input type="password" defaultValue="................" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-xl font-mono text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm pb-1" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">eSewa Merchant ID</label>
              <input type="text" defaultValue="EPAYTEST" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Cash on Delivery</label>
              <input type="text" defaultValue="Enabled" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>
          </div>
          
          <button onClick={() => toast.success('Payment Settings Saved')} className="bg-[#e4002b] hover:bg-red-700 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-colors">
            Save Payment Gateway
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Notifications</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">SMS Gateway</label>
              <input type="text" defaultValue="Sparrow SMS" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">SMS API Key</label>
              <input type="password" defaultValue="............" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-xl font-mono text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm pb-1" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Email Provider</label>
              <input type="text" defaultValue="SendGrid" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
            </div>
          </div>
          
          <button onClick={() => toast.success('Notification Settings Saved')} className="bg-[#e4002b] hover:bg-red-700 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-colors">
            Save Notifications
          </button>
        </div>

        {/* Admin Credentials */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-[15px] font-bold text-slate-800 mb-6">Admin Account</h2>
          
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Credentials Updated'); }}>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Username / Email</label>
                <input type="text" defaultValue="admin@servicesathi.np" className="flex-1 w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm" />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Current Password</label>
                <div className="relative flex-1 w-full">
                  <input type={showCurrent ? "text" : "password"} placeholder="••••••••" className="w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm pr-10" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">New Password</label>
                <div className="relative flex-1 w-full">
                  <input type={showNew ? "text" : "password"} placeholder="••••••••" className="w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm pr-10" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm font-semibold text-slate-500 sm:w-48 shrink-0">Confirm Password</label>
                <div className="relative flex-1 w-full">
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••" className="w-full border border-slate-100 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500 transition-shadow shadow-sm pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <button type="submit" className="bg-[#e4002b] hover:bg-red-700 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl transition-colors">
              Save Account Credentials
            </button>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
}
