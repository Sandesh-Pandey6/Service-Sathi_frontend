import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ProviderSidebar } from '../provider/ProviderSidebar';
import { ProviderHeader } from '../provider/ProviderHeader';
import { useAuth } from '@/hooks/useAuth';

export default function ProviderLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Determine title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/provider' || path === '/provider/dashboard') return 'Overview';
    if (path.includes('/provider/bookings')) return 'Bookings';
    if (path.includes('/provider/earnings')) return 'Earnings';
    if (path.includes('/provider/reviews')) return 'Reviews';
    if (path.includes('/provider/messages')) return 'Messages';
    if (path.includes('/provider/profile')) return 'My Profile';
    if (path.includes('/provider/services')) return 'Services';
    if (path.includes('/provider/availability')) return 'Availability';
    if (path.includes('/provider/settings')) return 'Settings';
    return 'Provider Portal';
  };

  return (
    <div className="flex h-screen bg-[#fafbfc] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ProviderSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProviderHeader title={getPageTitle()} userName={user?.full_name || 'Kamal Prasad'} />
        
        {/* Mobile menu button (visible only on small screens) */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <span className="font-bold text-slate-800">{getPageTitle()}</span>
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
