import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const TIME_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '01:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '05:30 PM', available: false },
  { time: '07:00 PM', available: true },
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, current: false });
  return cells;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function NewBooking() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const cells = getCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleConfirm = () => {
    toast.success(`Booking confirmed for ${MONTHS[viewMonth]} ${selectedDay} at ${selectedTime}!`);
  };

  const selectedDateStr = `${MONTHS[viewMonth].slice(0, 3)} ${selectedDay}, ${viewYear}`;

  return (
    <div className="p-6 min-h-full">
      <h1 className="text-xl font-bold text-slate-900 mb-5">New Booking</h1>

      <div className="flex gap-5 items-start">
        {/* ── Left Column ── */}
        <div className="flex-1 space-y-4">
          {/* Expert Hero Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <span className="inline-block bg-[#e8fbfb] text-[#00b0b0] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Expert Selection
            </span>
            <div className="flex gap-5">
              <div className="flex-1">
                <h2 className="text-4xl font-extrabold text-slate-900 leading-[1.1]">
                  Master{' '}
                  <span className="text-[#00d4d4]">Electrician</span> in
                  <br />Kathmandu
                </h2>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed max-w-md">
                  Licensed professionals for complex residential and commercial wiring, diagnostics, and repairs. Certified safety standards for Nepal's electrical grid.
                </p>
                <div className="flex gap-3 mt-5">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2 rounded-full text-sm border border-gray-100">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-slate-700">4.9/5</span>
                    <span className="text-slate-400 text-xs">(120 Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-2 rounded-full text-sm border border-gray-100">
                    <ShieldCheck size={14} className="text-[#00b0b0]" />
                    <span className="font-semibold text-slate-700 text-xs">Police Verified</span>
                  </div>
                </div>
              </div>
              <div className="w-56 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 h-48">
                {/* Placeholder image */}
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-400/30 flex items-center justify-center mb-2">
                      <span className="text-3xl">🔧</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Service Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Select Date</h3>
                <p className="text-xs text-[#00b0b0] font-medium mt-0.5">
                  Availability for {MONTHS[viewMonth]} {viewYear}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, i) => {
                const isToday = cell.current && cell.day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                const isSelected = cell.current && cell.day === selectedDay;
                return (
                  <button
                    key={i}
                    disabled={!cell.current}
                    onClick={() => cell.current && setSelectedDay(cell.day)}
                    className={`h-11 w-full rounded-xl text-sm font-semibold transition-all
                      ${!cell.current ? 'text-slate-200 cursor-default' : ''}
                      ${isSelected ? 'bg-[#00d4d4] text-white shadow-md shadow-[#00d4d4]/40' : ''}
                      ${!isSelected && cell.current ? 'text-slate-700 hover:bg-[#e8fbfb] hover:text-[#00b0b0]' : ''}
                      ${isToday && !isSelected ? 'ring-2 ring-[#00d4d4] ring-offset-1' : ''}
                    `}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-4 gap-3">
              {TIME_SLOTS.map(({ time, available }) => (
                <button
                  key={time}
                  disabled={!available}
                  onClick={() => available && setSelectedTime(time)}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all
                    ${!available ? 'text-slate-300 border-slate-100 cursor-not-allowed bg-gray-50' : ''}
                    ${selectedTime === time && available ? 'bg-[#00d4d4] text-white border-[#00d4d4] shadow-md shadow-[#00d4d4]/30' : ''}
                    ${selectedTime !== time && available ? 'border-slate-200 text-slate-600 hover:border-[#00d4d4] hover:text-[#00b0b0] bg-white' : ''}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Booking Summary ── */}
        <div className="w-[280px] flex-shrink-0 space-y-3 sticky top-6">
          <div className="bg-[#1e3a4a] rounded-2xl p-5 text-white shadow-xl">
            {/* Provider */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
              {/* Placeholder avatar */}
              <div className="w-12 h-12 rounded-full border-2 border-[#00d4d4] bg-slate-600 flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <p className="font-bold text-base">Arjun Thapa</p>
                <p className="text-[#00d4d4] text-xs font-semibold uppercase tracking-widest">Lead Technician</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-right">Master Electrician</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Date</span>
                <span className="font-bold">{selectedDateStr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Time</span>
                <span className="font-bold">{selectedTime}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Total Amount</span>
                  <div className="text-right">
                    <p className="font-extrabold text-[#00d4d4] text-2xl">रू 1,499</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wide mt-0.5">
                      Includes inspection & basic repairs
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-5 w-full bg-[#00d4d4] hover:bg-[#00baba] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00d4d4]/30"
            >
              Confirm Booking <ArrowRight size={16} />
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2.5 flex items-center justify-center gap-1">
              <Lock size={10} /> Secure Checkout
            </p>
          </div>

          {/* First Time User */}
          <div className="bg-gradient-to-br from-[#e8fbfb] to-[#d0f5f5] rounded-2xl p-4 border border-[#b3f0f0]">
            <p className="font-bold text-slate-800 text-sm mb-1">First Time User?</p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Use code <span className="font-extrabold text-[#00b0b0]">NAMASTE20</span> for 20% off your first visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
