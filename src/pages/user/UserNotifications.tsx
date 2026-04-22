import { useState, useEffect } from 'react';
import { AlertCircle, XCircle, Bell, CheckCircle2 } from 'lucide-react';
import { notificationsApi, Notification } from '@/api/notifications.api';

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

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await notificationsApi.getNotifications({ limit: 50 });
        setNotifications(data.notifications);
        // Auto-mark all as read when user visits page
        if (data.unread_count > 0) {
          await notificationsApi.markAllAsRead().catch(() => {});
          window.dispatchEvent(new Event('notificationsRead'));
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <div className="p-8 max-w-[800px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] text-slate-900 font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          disabled={notifications.every(n => n.is_read)}
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-3px_rgba(225,29,72,0.04)] border border-gray-100/60 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
            <Bell size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-800">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                className={`flex items-start gap-4 p-5 cursor-pointer group transition-colors hover:bg-slate-50/50 ${getBgForType(n.type, n.is_read)}`}
              >
                <div className="shrink-0 mt-0.5">
                  {getIconForType(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.is_read ? 'text-slate-500' : 'font-semibold text-slate-800'}`}>
                    {n.title}
                  </p>
                  <p className={`text-[13px] mt-0.5 ${n.is_read ? 'text-slate-400' : 'text-slate-600'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5">{formatTime(n.created_at)}</p>
                </div>
                {!n.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
