import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { chatApi } from '@/lib/api';

const baseNavItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/user/dashboard' },
  { label: 'My Bookings', icon: 'my bookings', path: '/user/bookings' },
  { label: 'Payments', icon: 'payments', path: '/user/payments' },
  { label: 'Services', icon: 'services', path: '/user/services' },
  { label: 'Messages', icon: 'messages', path: '/user/messages' },
  { label: 'My Profile', icon: 'profile', path: '/user/profile' },
  { label: 'Notifications', icon: 'notifications', path: '/user/notifications' },
  { label: 'Settings', icon: 'settings', path: '/user/settings' },
];

export default function UserLayout() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      try {
        const { data } = await chatApi.getConversations();
        const convs = data?.conversations || [];
        const total = convs.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
        if (mounted) setUnreadCount(total);
      } catch {
        // silently ignore — user may not have any conversations
      }
    };
    fetchUnread();
    // Poll every 30s for new messages
    const interval = setInterval(fetchUnread, 30000);

    const handleChatCount = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (mounted) setUnreadCount(customEvent.detail);
    };
    window.addEventListener('chatCountUpdated', handleChatCount);

    return () => { 
      mounted = false; 
      clearInterval(interval); 
      window.removeEventListener('chatCountUpdated', handleChatCount);
    };
  }, []);

  const navItems = baseNavItems.map(item =>
    item.path === '/user/messages' && unreadCount > 0
      ? { ...item, badge: String(unreadCount) }
      : item
  );

  return (
    <DashboardLayout config={{
      navItems,
      userName: user?.full_name || 'Anita Sharma',
      userEmail: user?.email || 'anita@email.com',
      userAvatarSeed: user?.full_name || 'Anita',
      userAvatarUrl: user?.profile_image || undefined,
    }} />
  );
}
