import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Shield, Lock } from 'lucide-react';
import { getProviderById } from '@/data/providers';
import toast from 'react-hot-toast';

import CheckoutStepper from '@/components/user/payment/CheckoutStepper';
import BookingSummaryCard from '@/components/user/payment/BookingSummaryCard';

type PaymentMethod = 'khalti' | 'esewa' | 'bank' | 'cash';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub: string; logoPrefix: string }[] = [
  { id: 'khalti', label: 'Khalti', sub: 'Pay instantly via Khalti wallet', logoPrefix: 'K' },
  { id: 'esewa', label: 'eSewa', sub: 'Pay instantly via eSewa wallet', logoPrefix: 'eS' },
  { id: 'cash', label: 'Cash on Service', sub: 'Pay the provider directly after the job', logoPrefix: '$',
    
   },
];

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const providerId = parseInt(searchParams.get('provider') || '0');
  const dateStr = searchParams.get('date') || '';
  const slot = searchParams.get('slot') || '';

  const provider = getProviderById(providerId);
  const bookingDate = dateStr ? new Date(dateStr) : null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
  const bookingId = '#5023'; // Mock booking ID

  const handleNextStep = () => {
    if (step === 1 && !selectedMethod) return toast.error('Please select a payment method');
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    toast.success('Booking confirmed!');
    navigate('/user/bookings');
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 md:px-8 pt-8 pb-32" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Top Navigation / Header ── */}
      <div className="max-w-[800px] mx-auto mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => {
              if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
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
          <Shield size={14} />
          SSL Secured
        </div>
      </div>

      {/* ── Stepper ── */}
      <CheckoutStepper currentStep={step} />

      {/* ── Main Content Area ── */}
      <div className="max-w-[480px] mx-auto w-full">

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BookingSummaryCard
              provider={provider}
              bookingDate={bookingDate}
              slot={slot}
              showPromo={true}
            />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">
                Choose Payment Method
              </h3>

              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-extrabold text-[15px] flex-shrink-0 ${
                          method.id === 'khalti' ? 'bg-[#5c2d91] text-white' :
                          method.id === 'esewa' ? 'bg-[#60bb46] text-white' :
                          method.id === 'bank' ? 'bg-[#1868ee] text-white' :
                          'bg-amber-500 text-white'
                        }`}
                      >
                        {method.logoPrefix}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                          {method.label}
                        </p>
                        <p className="text-[12px] font-medium text-slate-400 truncate">
                          {method.sub}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextStep}
                disabled={!selectedMethod}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold text-[14px] py-3.5 rounded-xl transition-all"
              >
                Continue to Payment Details →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <BookingSummaryCard
              provider={provider}
              bookingDate={bookingDate}
              slot={slot}
              showPromo={false}
            />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#5c2d91] text-white flex items-center justify-center font-extrabold text-[14px]">
                  K
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900 leading-none">Khalti</h3>
                  <p className="text-[12px] font-medium text-slate-400 mt-1">Pay instantly via Khalti wallet</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">
                    Registered Mobile Number
                  </label>
                  <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                    <span className="flex items-center justify-center px-4 bg-slate-50 border-r border-slate-200 text-[14px] font-medium text-slate-600">
                      +977
                    </span>
                    <input
                      type="text"
                      className="flex-1 w-full p-3 font-medium text-slate-800 text-[14px] outline-none"
                      defaultValue="9861903553"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-slate-600 mb-1.5 block">
                    Khalti MPIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    className="w-full bg-white rounded-xl border border-slate-200 p-3 font-medium text-slate-800 text-[20px] tracking-widest outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                    defaultValue="1234"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-blue-50/50 border border-blue-100 p-4 rounded-xl mt-5">
                <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[12.5px] font-medium text-blue-700 leading-snug">
                  An OTP will be sent to your registered mobile number to confirm this payment.
                </p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold text-[14px] py-3.5 rounded-xl transition-all"
              >
                Continue to Confirm →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <BookingSummaryCard
              provider={provider}
              bookingDate={bookingDate}
              slot={slot}
              showPromo={false}
            />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">
                Confirm Payment
              </h3>

              <div className="space-y-4 border-b border-slate-100 pb-5 mb-5">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Payment Method</span>
                  <span className="font-bold text-slate-900">
                    {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || 'Khalti'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Mobile</span>
                  <span className="font-bold text-slate-900">+977 9861903553</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="font-bold text-slate-900">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Booking</span>
                  <span className="font-bold text-slate-900">{bookingId}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Provider</span>
                  <span className="font-bold text-slate-900">{provider.name}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-500 font-medium">Date & Time</span>
                  <span className="font-bold text-slate-900">
                    {bookingDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })},{' '}
                    {slot}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl mb-5">
                <Lock size={16} className="text-emerald-500 shrink-0" />
                <p className="text-[12px] font-medium text-emerald-700">
                  Your payment is protected by ServiceSathi's secure payment gateway. 256-bit SSL encrypted.
                </p>
              </div>

              <button
                onClick={handlePaymentConfirm}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[15px] py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Pay Rs. {total.toLocaleString()}
                  </>
                )}
              </button>

              <p className="text-center text-[11px] font-medium text-slate-400 mt-4">
                By proceeding, you agree to ServiceSathi's{' '}
                <a href="#" className="underline hover:text-slate-600">Terms of Service</a>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
