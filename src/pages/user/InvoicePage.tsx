import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { bookingsApi } from '@/lib/api';

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const res = await bookingsApi.getById(id);
        const data = res.data.booking || res.data;
        setBooking(data);
      } catch (err) {
        console.error('Failed to fetch booking for invoice', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-red-500" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-slate-500 font-bold">Invoice not found</p>
        <button onClick={() => navigate(-1)} className="text-red-500 font-bold underline">Go Back</button>
      </div>
    );
  }

  const pName = booking.provider?.user?.full_name || 'Service Provider';
  const cName = booking.customer?.user?.full_name || 'Customer';
  const cPhone = booking.customer?.user?.phone || 'N/A';
  const serviceTitle = booking.service?.title || 'Service booked';
  const subtotal = booking.subtotal || booking.total_amount || 0;
  const tax = booking.tax_amount || 0;
  const discount = booking.discount_amount || 0;
  const total = booking.total_amount || (subtotal + tax - discount);
  
  const paymentMethod = booking.payment?.payment_method || 'Online';
  const paymentStatus = booking.payment?.payment_status || 'PAID';
  const transactionId = booking.payment?.transaction_id || 'N/A';
  const invoiceDate = new Date(booking.created_at).toLocaleDateString();
  const invoiceNumber = `INV-${booking.booking_number?.toUpperCase() || booking.id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Non-printable header actions */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Printer size={16} /> Print
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-sm hover:bg-red-700 transition-colors">
            <Download size={16} /> Save PDF
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:border-none print:shadow-none print:m-0">
        
        {/* Header Ribbon */}
        <div className="h-4 bg-red-600 w-full print:bg-red-600 print:[-webkit-print-color-adjust:exact]"></div>

        <div className="p-10 sm:p-14">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 border-b border-slate-100 pb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/customer-admin-logo.png" alt="Service Sathi" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Service<span className="text-red-600">Sathi</span>
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">INVOICE</h1>
              <p className="text-slate-500 font-medium">#{invoiceNumber}</p>
            </div>
            
            <div className="text-left sm:text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold print:bg-emerald-50 print:[-webkit-print-color-adjust:exact] mb-4">
                {paymentStatus}
              </div>
              
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
              <p className="text-slate-900 font-bold mb-4">{invoiceDate}</p>
              
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Due</p>
              <p className="text-2xl font-black text-slate-900">Rs. 0.00</p>
            </div>
          </div>

          {/* Bill To & From */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</p>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{cName}</h3>
              <p className="text-slate-500 text-sm">{booking.address}</p>
              <p className="text-slate-500 text-sm mt-1">{cPhone}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Service Provider</p>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{pName}</h3>
              <p className="text-slate-500 text-sm">{booking.provider?.city || 'Local Area'}</p>
              <p className="text-slate-500 text-sm mt-1">{booking.provider?.user?.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="mb-10">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center print:bg-slate-50 print:[-webkit-print-color-adjust:exact] mb-4">
              <div className="flex-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</div>
              <div className="w-24 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</div>
            </div>
            
            <div className="px-4 py-3 flex items-center border-b border-slate-50">
              <div className="flex-1">
                <p className="font-bold text-slate-900">{serviceTitle}</p>
                <p className="text-sm text-slate-500">Scheduled: {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</p>
              </div>
              <div className="w-32 text-right font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</div>
            </div>
          </div>

          {/* Totals & Payment Info */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-10">
            {/* Payment Details */}
            <div className="w-full sm:w-1/2 p-6 bg-slate-50 rounded-2xl print:bg-slate-50 print:[-webkit-print-color-adjust:exact]">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Payment Information</p>
              
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-slate-500">Method</span>
                <span className="font-bold text-slate-900">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-bold text-slate-900 uppercase font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Payment Date</span>
                <span className="font-bold text-slate-900">{invoiceDate}</span>
              </div>
            </div>

            {/* Totals */}
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="text-slate-900 font-bold">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="text-slate-500 font-medium">Tax</span>
                  <span className="text-slate-900 font-bold">Rs. {tax.toLocaleString()}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between items-center text-sm text-emerald-600 border-t border-slate-100 pt-3">
                  <span className="font-medium">Discount</span>
                  <span className="font-bold">-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t-2 border-slate-900 pt-4 mt-2">
                <span className="text-lg font-extrabold text-slate-900">Total</span>
                <span className="text-xl font-black text-red-600">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-slate-400 text-sm font-medium border-t border-slate-100 pt-8 print:mt-10 lg:mt-24">
            Thank you for choosing Service Sathi. For any queries, please contact support@servicesathi.com
          </div>
        </div>
      </div>
      
      {/* CSS overrides for print */}
      <style>{`
        @media print {
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
