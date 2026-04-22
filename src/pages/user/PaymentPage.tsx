import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Shield, Loader2 } from 'lucide-react';
import { usersApi, servicesApi, bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

import BookingSummaryCard from '@/components/user/payment/BookingSummaryCard';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const providerId = searchParams.get('provider') || '';
  const dateStr = searchParams.get('date') || '';
  const slot = searchParams.get('slot') || '';
  const categoryId = searchParams.get('category') || '';

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bookingDate = dateStr ? new Date(dateStr) : null;

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) { setLoading(false); return; }
      try {
        const [res, svcRes] = await Promise.all([
          usersApi.getProvider(providerId),
          servicesApi.getProviderServices(providerId).catch(() => ({ data: [] }))
        ]);
        
        const p = res.data.provider || res.data;
        const services = Array.isArray(svcRes.data) ? svcRes.data : (svcRes.data.services || []);
        const selectedService = services.find((s: any) => s.category_id === categoryId);

        // Map to the shape BookingSummaryCard expects
        setProvider({
          id: p.id,
          serviceId: selectedService?.id,
          initials: (p.user?.full_name || p.business_name || '??').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
          name: p.user?.full_name || p.business_name || 'Provider',
          service: p.skills_summary || 'Service',
          experience: `${p.experience_years || 0}yr`,
          location: p.city || 'Nepal',
          area: p.address || '',
          rating: p.rating || 0,
          reviews: p.total_reviews || 0,
          price: selectedService?.price || p.total_earnings || 1500, // Use real service price
          serviceTitle: selectedService?.title || 'Home Service', // Use real service title
          available: p.is_available,
          description: p.description || '',
        });
      } catch (err) {
        console.error('Failed to fetch provider:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-red-500" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-8 text-center min-h-screen">
        <p className="text-slate-500 font-medium">Invalid booking. Please start again.</p>
        <Link to="/user/services" className="text-red-600 font-bold mt-2 inline-block">Back to Services</Link>
      </div>
    );
  }

  const serviceFee = provider.price;
  const total = serviceFee;

  const handleConfirmBooking = async () => {
    if (!provider?.serviceId || !bookingDate || !slot) {
      toast.error('Booking information is incomplete.');
      return;
    }
    
    // Convert slot '02:00 PM' to '14:00'
    const [time, modifier] = slot.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    const scheduled_time = `${hours.padStart(2, '0')}:${minutes}`;

    setIsProcessing(true);
    try {
      // 1. Create Booking Only (Payment happens later)
      const bookingPayload = {
        service_id: provider.serviceId,
        scheduled_date: bookingDate.toISOString(),
        scheduled_time,
        address: `${provider.area || ''}, ${provider.location || ''}`.trim().replace(/^,|,$/g, ''),
        subtotal: provider.price,
        tax_amount: 0,
        discount_amount: 0,
      };
      await bookingsApi.create(bookingPayload);
      
      toast.success('Booking requested successfully! Waiting for provider to accept.');
      navigate('/user/bookings');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create booking');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 md:px-8 pt-8 pb-32" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-[480px] mx-auto mb-6 flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-[18px] font-extrabold text-slate-900">Confirm Booking</h1>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Review and submit your service request</p>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <BookingSummaryCard provider={provider} bookingDate={bookingDate} slot={slot} serviceDetailMessage={provider.serviceTitle} showPromo={false} />
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">Booking Summary</h3>
            <div className="space-y-4 border-b border-slate-100 pb-5 mb-5">
              <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Service Fee</span><span className="font-bold text-slate-900">Rs. {serviceFee.toLocaleString()}</span></div>
              <div className="flex justify-between items-center text-[14px] pt-2 border-t border-slate-100"><span className="text-slate-700 font-bold">Total</span><span className="font-extrabold text-slate-900">Rs. {total.toLocaleString()}</span></div>
              <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Provider</span><span className="font-bold text-slate-900">{provider.name}</span></div>
              <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Date & Time</span><span className="font-bold text-slate-900">{bookingDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {slot}</span></div>
            </div>

            <div className="flex items-start gap-2.5 bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-5">
              <Shield size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[12.5px] font-medium text-blue-800 leading-snug">No payment is required right now. The provider must accept your request first. Once accepted, you can securely pay via Khalti to confirm your slot.</p>
            </div>

            <button onClick={handleConfirmBooking} disabled={isProcessing} className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-[15px] py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isProcessing ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>) : (<><Shield size={18} /> Request Booking (Rs. {total.toLocaleString()})</>)}
            </button>
            <p className="text-center text-[11px] font-medium text-slate-400 mt-4">By proceeding, you agree to ServiceSathi's <a href="#" className="underline hover:text-slate-600">Terms of Service</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
