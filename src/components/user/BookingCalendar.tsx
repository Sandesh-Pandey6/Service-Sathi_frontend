import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  allowAllDates?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function BookingCalendar({ selectedDate, onDateSelect, availableDates, allowAllDates = false }: BookingCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
  };

  const isPast = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    return date < today;
  };

  const isAvailable = (day: number) => {
    if (allowAllDates) return true;
    if (!availableDates || availableDates.length === 0) return false; // Strictly block if no availability exists
    const dateQuery = new Date(viewYear, viewMonth, day);
    dateQuery.setHours(0, 0, 0, 0);
    return availableDates.some(avail => {
      const ad = new Date(avail);
      ad.setHours(0, 0, 0, 0);
      return ad.getTime() === dateQuery.getTime();
    });
  };

  const isToday = (day: number) => {
    return day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  };

  // Cannot go before current month
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[12px] font-bold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          const available = isAvailable(day);
          const disabled = past || (!available && availableDates !== undefined);
          const selected = isSelected(day);
          const todayMark = isToday(day);

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => onDateSelect(new Date(viewYear, viewMonth, day))}
              className={`
                w-full aspect-square rounded-xl flex items-center justify-center text-[14px] font-bold transition-all relative overflow-hidden
                ${disabled ? 'text-slate-300 cursor-not-allowed bg-slate-50/50' : 'cursor-pointer'}
                ${!disabled && !selected ? 'hover:bg-red-50 hover:text-red-700 text-slate-700' : ''}
                ${selected ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-105 z-10' : ''}
              `}
            >
              {day}
              {todayMark && !selected && (
                <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
