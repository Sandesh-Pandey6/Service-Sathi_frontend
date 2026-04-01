import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
}

export const AdminLayout: React.FC<Props> = ({ children, title, subtitle, breadcrumbs }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless mobileOpen */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onMobileClose={() => setMobileOpen(false)}
          isMobileOpen={mobileOpen}
        />
      </div>

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 min-h-screen ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        } ml-0`}
      >
        <AdminHeader
          title={title}
          breadcrumbs={breadcrumbs}
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
        />

        {/* Page context/subtitle */}
        {subtitle && (
          <div className="px-4 sm:px-6 pt-4">
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        )}

        {/* Page content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
