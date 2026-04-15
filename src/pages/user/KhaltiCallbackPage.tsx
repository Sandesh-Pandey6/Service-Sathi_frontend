import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Loader2, ArrowRight, Home } from 'lucide-react';
import { bookingsApi } from '@/lib/api';
import toast from 'react-hot-toast';

type VerifyStatus = 'loading' | 'success' | 'failed' | 'pending' | 'canceled';

export default function KhaltiCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pidx = searchParams.get('pidx') || '';
  const status = searchParams.get('status') || '';
  const transactionId = searchParams.get('transaction_id') || '';

  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verify = async () => {
      const bookingId = sessionStorage.getItem('khalti_booking_id');

      // If user canceled on Khalti page
      if (status === 'User canceled') {
        setVerifyStatus('canceled');
        setMessage('You canceled the payment on Khalti.');
        sessionStorage.removeItem('khalti_booking_id');
        return;
      }

      if (!pidx || !bookingId) {
        setVerifyStatus('failed');
        setMessage('Missing payment information. Please try again.');
        return;
      }

      try {
        const res = await bookingsApi.verifyKhalti(bookingId, { pidx });
        const data = res.data;

        if (data.success) {
          setVerifyStatus('success');
          setMessage('Payment completed successfully!');
          toast.success('Payment confirmed!');
        } else if (data.khalti_status === 'Pending' || data.khalti_status === 'Initiated') {
          setVerifyStatus('pending');
          setMessage('Your payment is still being processed. Please check back in a moment.');
        } else {
          setVerifyStatus('failed');
          setMessage(`Payment ${data.khalti_status?.toLowerCase() || 'failed'}. Please try again.`);
        }
      } catch (err: any) {
        console.error('Khalti verify error:', err);
        setVerifyStatus('failed');
        setMessage(err.response?.data?.error || 'Failed to verify payment. Please contact support.');
      } finally {
        sessionStorage.removeItem('khalti_booking_id');
      }
    };

    verify();
  }, [pidx, status]);

  const statusConfig = {
    loading: {
      icon: <Loader2 size={56} className="animate-spin text-[#5c2d91]" />,
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    success: {
      icon: <CheckCircle2 size={56} className="text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    failed: {
      icon: <XCircle size={56} className="text-red-500" />,
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    pending: {
      icon: <Clock size={56} className="text-amber-500" />,
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    canceled: {
      icon: <XCircle size={56} className="text-slate-400" />,
      bg: 'bg-slate-50',
      border: 'border-slate-200',
    },
  };

  const config = statusConfig[verifyStatus];

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-[420px] w-full">
        <div className={`${config.bg} border ${config.border} rounded-2xl p-8 text-center`}>
          <div className="flex justify-center mb-5">
            {config.icon}
          </div>

          <h1 className="text-[20px] font-extrabold text-slate-900 mb-2">
            {verifyStatus === 'loading' && 'Verifying Payment'}
            {verifyStatus === 'success' && 'Payment Successful!'}
            {verifyStatus === 'failed' && 'Payment Failed'}
            {verifyStatus === 'pending' && 'Payment Pending'}
            {verifyStatus === 'canceled' && 'Payment Canceled'}
          </h1>

          <p className="text-[14px] font-medium text-slate-500 mb-6 leading-relaxed">
            {message}
          </p>

          {transactionId && verifyStatus === 'success' && (
            <div className="bg-white rounded-xl p-4 border border-emerald-200 mb-6">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
              <p className="text-[14px] font-bold text-slate-900 font-mono">{transactionId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {verifyStatus === 'success' && (
              <button
                onClick={() => navigate('/user/bookings')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                View My Bookings <ArrowRight size={16} />
              </button>
            )}

            {(verifyStatus === 'failed' || verifyStatus === 'canceled') && (
              <button
                onClick={() => navigate(-2)}
                className="w-full bg-[#5c2d91] hover:bg-[#4a2275] text-white font-bold text-[14px] py-3.5 rounded-xl transition-all"
              >
                Try Again
              </button>
            )}

            {verifyStatus === 'pending' && (
              <button
                onClick={() => navigate('/user/bookings')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[14px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Check Bookings <ArrowRight size={16} />
              </button>
            )}

            <Link
              to="/user/services"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[14px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home size={16} /> Back to Services
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-400 mt-6">
          Powered by <span className="text-[#5c2d91] font-bold">Khalti</span> • Secure Payment Gateway
        </p>
      </div>
    </div>
  );
}
