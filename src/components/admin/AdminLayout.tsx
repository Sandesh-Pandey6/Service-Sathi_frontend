import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 min-h-screen ${
          collapsed ? 'ml-[72px]' : 'ml-64'
        }`}
      >
        <AdminHeader title={title} breadcrumbs={breadcrumbs} />

        {/* Page context/subtitle if needed (optional since breadcrumbs usually replace subtitle) */}
        {subtitle && (
          <div className="px-6 pt-4">
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        )}

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
