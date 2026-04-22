import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProviderHeaderProps {
  title: string;
  userName?: string;
}

export const ProviderHeader: React.FC<ProviderHeaderProps> = ({ title, userName = 'Kamal Prasad' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      try {
        const { notificationsApi } = await import('@/api/notifications.api');
        const data = await notificationsApi.getNotifications({ limit: 1, unread_only: true });
        if (mounted) setUnreadNotifs(data?.unread_count || 0);
      } catch { /* ignore */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);

    const handleNotificationsRead = () => fetchUnread();
    window.addEventListener('notificationsRead', handleNotificationsRead);

    return () => { 
      mounted = false; 
      clearInterval(interval); 
      window.removeEventListener('notificationsRead', handleNotificationsRead);
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const avatarUrl = (user as any)?.provider_profile?.profile_image || user?.profile_image;

  return (
    <header className="h-[88px] bg-[#fafbfc] border-b border-gray-100 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-[13px] font-medium text-slate-400 mt-1">
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => navigate('/provider/notifications')} className="relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
          <Bell size={20} className="text-slate-500" />
          {unreadNotifs > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
        {avatarUrl ? (
          <img src={avatarUrl} alt={userName} className="w-9 h-9 rounded-full object-cover cursor-pointer shadow-sm" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer shadow-sm">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
};
