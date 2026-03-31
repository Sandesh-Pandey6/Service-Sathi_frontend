import { useSearchParams } from 'react-router-dom';
import ChatApplication from '@/components/chat/ChatApplication';

export default function ProviderMessages() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full min-h-[calc(100vh-100px)]">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Communicate with your customers and share essential files.</p>
        </div>
      </div>
      
      <ChatApplication role="PROVIDER" queryBookingId={bookingId} />
    </div>
  );
}
