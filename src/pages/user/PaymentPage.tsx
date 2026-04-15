import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, Loader2 } from 'lucide-react';
import { usersApi, servicesApi, bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

import CheckoutStepper from '@/components/user/payment/CheckoutStepper';
import BookingSummaryCard from '@/components/user/payment/BookingSummaryCard';

type PaymentMethod = 'khalti';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub: string; logoPrefix: string }[] = [
  { id: 'khalti', label: 'Khalti', sub: 'Pay instantly via Khalti wallet', logoPrefix: 'K' },
];

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

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
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
  const platformFee = Math.round(serviceFee * 0.05);
  const total = serviceFee + platformFee;
  const bookingId = `#${Date.now().toString().slice(-4)}`;

  const handleNextStep = () => {
    if (step === 1 && !selectedMethod) return toast.error('Please select a payment method');
    setStep(2);
  };

  const handlePayWithKhalti = async () => {
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
      // 1. Create Booking
      const bookingPayload = {
        service_id: provider.serviceId,
        scheduled_date: bookingDate.toISOString(),
        scheduled_time,
        address: `${provider.area || ''}, ${provider.location || ''}`.trim().replace(/^,|,$/g, ''),
        subtotal: provider.price,
        tax_amount: 0,
        discount_amount: 0,
      };
      const res = await bookingsApi.create(bookingPayload);
      const newBookingId = res.data.booking.id;

      // 2. Initiate Khalti Payment — get payment_url
      const khaltiRes = await bookingsApi.initiateKhalti(newBookingId);
      const paymentUrl = khaltiRes.data.payment_url;

      if (!paymentUrl) {
        throw new Error('Failed to get Khalti payment URL');
      }

      // 3. Redirect to Khalti checkout page
      // Store bookingId in sessionStorage so callback page can use it
      sessionStorage.setItem('khalti_booking_id', newBookingId);
      window.location.href = paymentUrl;
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 md:px-8 pt-8 pb-32" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-[800px] mx-auto mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => {
              if (step > 1) setStep(1);
              else navigate(-1);
            }}
            className="mt-1 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-[18px] font-extrabold text-slate-900">Secure Checkout</h1>
            <p className="text-[13px] font-medium text-slate-500 bg-slate-200/50 inline-block px-2 py-0.5 rounded-md mt-1">
              Booking {bookingId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold text-[12px]">
          <Shield size={14} /> SSL Secured
        </div>
      </div>

      <CheckoutStepper currentStep={step} />

      <div className="max-w-[480px] mx-auto w-full">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BookingSummaryCard provider={provider} bookingDate={bookingDate} slot={slot} serviceDetailMessage={provider.serviceTitle} showPromo={true} />
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">Choose Payment Method</h3>
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-[#5c2d91] bg-purple-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-[15px] flex-shrink-0 bg-[#5c2d91] text-white">
                        {method.logoPrefix}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{method.label}</p>
                        <p className="text-[12px] font-medium text-slate-400 truncate">{method.sub}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#5c2d91]' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#5c2d91]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button onClick={handleNextStep} disabled={!selectedMethod} className="w-full mt-6 bg-[#5c2d91] hover:bg-[#4a2275] disabled:bg-slate-300 text-white font-bold text-[14px] py-3.5 rounded-xl transition-all">
                Continue to Confirm →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <BookingSummaryCard provider={provider} bookingDate={bookingDate} slot={slot} serviceDetailMessage={provider.serviceTitle} showPromo={false} />
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">Confirm & Pay</h3>
              <div className="space-y-4 border-b border-slate-100 pb-5 mb-5">
                <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Payment Method</span><span className="font-bold text-[#5c2d91]">Khalti</span></div>
                <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Service Fee</span><span className="font-bold text-slate-900">Rs. {serviceFee.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Platform Fee (5%)</span><span className="font-bold text-slate-900">Rs. {platformFee.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-[14px] pt-2 border-t border-slate-100"><span className="text-slate-700 font-bold">Total</span><span className="font-extrabold text-slate-900">Rs. {total.toLocaleString()}</span></div>
                <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Provider</span><span className="font-bold text-slate-900">{provider.name}</span></div>
                <div className="flex justify-between items-center text-[13px]"><span className="text-slate-500 font-medium">Date & Time</span><span className="font-bold text-slate-900">{bookingDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}, {slot}</span></div>
              </div>

              <div className="flex items-start gap-2.5 bg-purple-50/50 border border-purple-100 p-4 rounded-xl mb-5">
                <Shield size={16} className="text-[#5c2d91] shrink-0 mt-0.5" />
                <p className="text-[12.5px] font-medium text-purple-800 leading-snug">You will be securely redirected to Khalti to complete your payment. After payment, you'll be brought back automatically.</p>
              </div>

              <div className="flex items-center gap-2.5 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl mb-5">
                <Lock size={16} className="text-emerald-500 shrink-0" />
                <p className="text-[12px] font-medium text-emerald-700">Your payment is protected by Khalti's secure payment gateway. 256-bit SSL encrypted.</p>
              </div>

              <button onClick={handlePayWithKhalti} disabled={isProcessing} className="w-full bg-[#5c2d91] hover:bg-[#4a2275] text-white font-bold text-[15px] py-4 rounded-xl shadow-lg shadow-purple-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isProcessing ? (<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Redirecting to Khalti...</>) : (<><Shield size={18} /> Pay Rs. {total.toLocaleString()} with Khalti</>)}
              </button>
              <p className="text-center text-[11px] font-medium text-slate-400 mt-4">By proceeding, you agree to ServiceSathi's <a href="#" className="underline hover:text-slate-600">Terms of Service</a></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
