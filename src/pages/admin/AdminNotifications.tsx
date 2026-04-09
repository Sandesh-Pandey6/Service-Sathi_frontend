import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AlertCircle, XCircle, Bell, CheckCircle2, X } from 'lucide-react';
import { notificationsApi, Notification } from '@/api/notifications.api';
import { getSocket } from '@/lib/socket';

const getIconForType = (type: string) => {
  switch (type) {
    case 'BOOKING_CREATED':
    case 'BOOKING_CONFIRMED':
    case 'BOOKING_COMPLETED':
    case 'SUCCESS':
      return <CheckCircle2 size={20} className="text-emerald-500" />;
    case 'WARNING':
    case 'REMINDER':
      return <AlertCircle size={20} className="text-amber-500" />;
    case 'ERROR':
    case 'BOOKING_CANCELLED':
    case 'PAYMENT_FAILED':
      return <XCircle size={20} className="text-red-500" />;
    default:
      return <Bell size={20} className="text-blue-500" />;
  }
};

const getBgForType = (type: string, isRead: boolean) => {
  if (isRead) return 'bg-slate-50 opacity-70';
  switch (type) {
    case 'BOOKING_CREATED':
    case 'BOOKING_CONFIRMED':
    case 'BOOKING_COMPLETED':
    case 'SUCCESS':
      return 'bg-emerald-50/40';
    case 'WARNING':
    case 'REMINDER':
      return 'bg-amber-50/40';
    case 'ERROR':
    case 'BOOKING_CANCELLED':
    case 'PAYMENT_FAILED':
      return 'bg-red-50/40';
    default:
      return 'bg-blue-50/40';
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  return date.toLocaleDateString();
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsApi.getNotifications({ limit: 50 });
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();
    socket.on('new_notification', (newNotification: Notification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off('new_notification');
    };
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return;
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <AdminLayout title="Notifications" subtitle="Admin > Notifications">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b border-slate-50 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">All Notifications</h2>
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
            disabled={notifications.every(n => n.is_read)}
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
            <Bell size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-800">No notifications</p>
            <p className="text-sm">You are all caught up!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`flex items-start gap-4 p-4 rounded-xl border border-slate-50/50 ${getBgForType(n.type, n.is_read)} group transition-colors`}
              >
                <div className="shrink-0 mt-0.5">
                  {getIconForType(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.is_read ? 'text-slate-600' : 'font-medium text-slate-800'}`}>
                    <span className="font-semibold block mb-0.5">{n.title}</span>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5">{formatTime(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <button 
                    onClick={() => handleMarkAsRead(n.id, n.is_read)}
                    title="Mark as read"
                    className="text-slate-400 hover:text-emerald-500 shrink-0 p-1.5 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/80 border border-transparent hover:border-emerald-200"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
