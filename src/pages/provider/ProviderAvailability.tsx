import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import { ChevronLeft, Info, Copy, Plus, Sun, Moon, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_CODES: Record<string, string> = {
  Sunday: 'SUN', Monday: 'MON', Tuesday: 'TUE', Wednesday: 'WED',
  Thursday: 'THU', Friday: 'FRI', Saturday: 'SAT'
};
const REVERSE_DAY_CODES = Object.fromEntries(Object.entries(DAY_CODES).map(([k, v]) => [v, k]));

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const hr = Math.floor(i / 2);
  const min = i % 2 === 0 ? '00' : '30';
  const isPM = hr >= 12;
  const h12 =hr % 12 || 12;
  return `${h12}:${min} ${isPM ? 'PM' : 'AM'}`;
});

interface DaySchedule {
  enabled: boolean;
  slots: { id: string; start: string; end: string }[];
}

export default function ProviderAvailability() {
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDay, setActiveDay] = useState<string>('Sunday');

  // We keep a master schedule
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(() => {
    const init: any = {};
    DAYS.forEach(d => {
      init[d] = { 
        enabled: !['Saturday', 'Sunday'].includes(d), 
        slots: [{ id: Math.random().toString(), start: '9:00 AM', end: '5:00 PM' }] 
      };
    });
    return init;
  });

  // Convert 24h backend strings "14:00" to "2:00 PM"
  const to12h = (time24: string) => {
    const [h, m] = time24.split(':');
    let hr = parseInt(h, 10);
    const pm = hr >= 12;
    hr = hr % 12 || 12;
    return `${hr}:${m} ${pm ? 'PM' : 'AM'}`;
  };

  // Convert "2:00 PM" to "14:00"
  const to24h = (time12: string) => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        const pId = data.user?.provider_profile?.id;
        setProviderId(pId);
        
        if (pId) {
          const res = await providerApi.getAvailability(pId);
          const avails = res.data.availabilities || res.data.availability || [];
          
          const newSchedule = { ...schedule };
          // Disable all first to re-hydrate from DB accurately
          DAYS.forEach(d => { newSchedule[d].enabled = false; newSchedule[d].slots = []; });

          avails.forEach((a: any) => {
            if (a.is_recurring && a.recurring_day && REVERSE_DAY_CODES[a.recurring_day]) {
              const day = REVERSE_DAY_CODES[a.recurring_day];
              newSchedule[day].enabled = true;
              newSchedule[day].slots.push({
                id: Math.random().toString(),
                start: to12h(a.start_time),
                end: to12h(a.end_time)
              });
            }
          });

          // Fallback empty slots to 9-5
          DAYS.forEach(d => {
            if (newSchedule[d].slots.length === 0) {
              newSchedule[d].slots = [{ id: Math.random().toString(), start: '9:00 AM', end: '5:00 PM' }];
            }
          });
          
          setSchedule(newSchedule);
        }
      } catch (err) {
        toast.error('Failed to load availability');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, []);

  const toggleDay = (day: string) => {
    setSchedule(p => ({ ...p, [day]: { ...p[day], enabled: !p[day].enabled } }));
  };

  const updateSlot = (day: string, slotId: string, field: 'start' | 'end', val: string) => {
    setSchedule(p => ({
      ...p,
      [day]: {
        ...p[day],
        slots: p[day].slots.map(s => s.id === slotId ? { ...s, [field]: val } : s)
      }
    }));
  };

  const addSlot = (day: string) => {
    setSchedule(p => ({
      ...p,
      [day]: {
        ...p[day],
        slots: [...p[day].slots, { id: Math.random().toString(), start: '9:00 AM', end: '5:00 PM' }]
      }
    }));
  };

  const removeSlot = (day: string, slotId: string) => {
    setSchedule(p => ({
      ...p,
      [day]: {
        ...p[day],
        slots: p[day].slots.filter(s => s.id !== slotId)
      }
    }));
  };

  const copyToAll = () => {
    const currentSlots = schedule[activeDay].slots.map(s => ({ ...s, id: Math.random().toString() }));
    const currentEnabled = schedule[activeDay].enabled;
    
    setSchedule(p => {
      const next = { ...p };
      DAYS.forEach(d => {
        next[d] = { enabled: currentEnabled, slots: JSON.parse(JSON.stringify(currentSlots)) };
      });
      return next;
    });
    toast.success(`Copied ${activeDay}'s schedule to all days!`);
  };

  const saveAvailability = async () => {
    if (!providerId) return;
    setIsSaving(true);
    const loadingToast = toast.loading('Saving schedule...');
    
    try {
      // 1. Fetch current backend recurring records
      const res = await providerApi.getAvailability(providerId);
      const avails = res.data.availabilities || res.data.availability || [];
      
      // 2. Delete existing recurring
      for (const a of avails) {
        if (a.is_recurring) await providerApi.deleteAvailability(a.id);
      }

      // 3. Create new slots
      for (const day of DAYS) {
        if (schedule[day].enabled) {
          for (const slot of schedule[day].slots) {
            await providerApi.createAvailability(providerId, {
              available_date: new Date().toISOString(), // Required but unused for recurring
              start_time: to24h(slot.start),
              end_time: to24h(slot.end),
              is_recurring: true,
              recurring_day: DAY_CODES[day],
              is_available: true
            });
          }
        }
      }
      
      toast.success('Availability saved successfully!', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save schedule', { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  // Stats
  const activeDaysCount = DAYS.filter(d => schedule[d].enabled).length;
  const daysOffCount = 7 - activeDaysCount;

  // Custom Toggle Component to perfectly match the screenshot
  const CustomToggle = ({ checked, onChange, size = 'default' }: { checked: boolean, onChange: () => void, size?: 'default' | 'small' }) => {
    return (
      <button
        onClick={onChange}
        className={`relative inline-flex items-center rounded-full transition-colors ${checked ? 'bg-[#5f48fb]' : 'bg-slate-200'} ${size === 'small' ? 'h-5 w-9' : 'h-6 w-11'}`}
      >
        <span className={`inline-block transform bg-white rounded-full transition-transform ${checked ? (size === 'small' ? 'translate-x-4.5 translate-x-4' : 'translate-x-6') : 'translate-x-1'} ${size === 'small' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
      </button>
    );
  };

  if (loading) return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="w-full">
        {/* Top Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/provider/dashboard')} className="text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">Availability</h1>
              <p className="text-[13px] text-slate-500 mt-1 font-medium">Manage your working hours</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-[13px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Busy</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300" /> Offline</span>
            </div>
            <button 
              onClick={saveAvailability}
              disabled={isSaving}
              className="bg-[#5f48fb] hover:bg-[#4d38e0] shadow-md shadow-indigo-200/50 text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[280px] flex-shrink-0 space-y-6">
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-indigo-50/70 border border-indigo-100/50 rounded-2xl flex-1 p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-extrabold text-indigo-700 leading-none">{activeDaysCount}</span>
              <span className="text-[12px] font-bold text-indigo-400 mt-1">Active Days</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl flex-1 p-4 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-extrabold text-slate-700 leading-none">{daysOffCount}</span>
              <span className="text-[12px] font-bold text-slate-400 mt-1">Days Off</span>
            </div>
          </div>

          {/* Day List */}
          <div className="space-y-2">
            {DAYS.map(day => {
              const isSelected = activeDay === day;
              const isEnabled = schedule[day].enabled;
              const subtext = isEnabled ? 
                (schedule[day].slots.length > 0 ? `${schedule[day].slots[0].start} – ${schedule[day].slots[0].end}` : 'Working') 
                : 'Unavailable';

              return (
                <div 
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`
                    flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border
                    ${isSelected ? 'bg-[#5f48fb] text-white border-[#5f48fb] shadow-md shadow-indigo-200/50' : 'bg-white text-slate-800 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 shadow-sm'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-bold
                      ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-[#5f48fb]'}
                    `}>
                      {day.substring(0, 3)}
                    </div>
                    <div>
                      <h4 className={`text-[14px] font-extrabold leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>{day}</h4>
                      <p className={`text-[12px] mt-0.5 font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{subtext}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleDay(day); }}
                    className={`relative inline-flex items-center rounded-full h-6 w-11 transition-colors ${isEnabled ? (isSelected ? 'bg-white' : 'bg-[#5f48fb]') : 'bg-white/30 border border-white/20'}`}
                  >
                    <span className={`inline-block transform bg-white rounded-full h-4 w-4 transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'} ${isSelected && isEnabled ? 'bg-[#5f48fb]' : ''} ${!isEnabled && !isSelected ? 'bg-slate-300' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Main Content Pane */}
        <div className="flex-1 space-y-6">
          
          {/* Active Day Header */}
          <div className="flex items-end justify-between border-b-2 border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{activeDay}</h2>
              <p className="text-[13px] font-medium text-slate-400 mt-1">
                {schedule[activeDay].slots.length} time slot{schedule[activeDay].slots.length !== 1 && 's'} • 0 breaks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={copyToAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[13px] font-bold transition-colors"
              >
                <Copy size={14} /> Copy to all days
              </button>
              <div 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-bold cursor-pointer transition-colors ${schedule[activeDay].enabled ? 'bg-[#5f48fb] text-white shadow-md shadow-indigo-200/50' : 'bg-slate-200 text-slate-500'}`}
                onClick={() => toggleDay(activeDay)}
              >
                <div className={`w-2 h-2 rounded-full ${schedule[activeDay].enabled ? 'bg-white' : 'bg-slate-400'}`} />
                {schedule[activeDay].enabled ? 'Working' : 'Not Working'}
              </div>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Clock size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">Working Hours</h3>
                  <p className="text-[13px] text-slate-400 font-medium">Set your available time windows</p>
                </div>
              </div>
              <button 
                onClick={() => addSlot(activeDay)}
                className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                disabled={!schedule[activeDay].enabled}
              >
                <Plus size={16} strokeWidth={3} /> Add slot
              </button>
            </div>

            <div className={`space-y-3 ${!schedule[activeDay].enabled && 'opacity-50 pointer-events-none grayscale'}`}>
              {schedule[activeDay].slots.map((slot, index) => (
                <div key={slot.id} className="flex flex-wrap items-center gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#5f48fb] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-[200px] flex items-center gap-3">
                    <div className="relative">
                      <select 
                        value={slot.start} 
                        onChange={(e) => updateSlot(activeDay, slot.id, 'start', e.target.value)}
                        className="appearance-none bg-white border border-slate-200 text-slate-700 text-[14px] font-bold rounded-xl pr-8 pl-4 py-2 outline-none focus:border-[#5f48fb] focus:ring-2 focus:ring-indigo-100 shadow-sm"
                      >
                        {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronLeft size={14} className="absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <span className="text-slate-400 font-medium text-[13px]">to</span>
                    
                    <div className="relative">
                      <select 
                        value={slot.end} 
                        onChange={(e) => updateSlot(activeDay, slot.id, 'end', e.target.value)}
                        className="appearance-none bg-white border border-slate-200 text-slate-700 text-[14px] font-bold rounded-xl pr-8 pl-4 py-2 outline-none focus:border-[#5f48fb] focus:ring-2 focus:ring-indigo-100 shadow-sm"
                      >
                        {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronLeft size={14} className="absolute right-3 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[12px] font-bold mr-2">
                    Shift {index + 1}
                  </div>

                  <button 
                    onClick={() => removeSlot(activeDay, slot.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>
              ))}
              
              {schedule[activeDay].slots.length === 0 && (
                <div className="py-6 text-center text-slate-400 font-medium text-[14px] border-2 border-dashed border-slate-200 rounded-2xl">
                  No slots currently active. Click "Add slot" to configure.
                </div>
              )}
            </div>
          </div>


          {/* Weekly Overview */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <CalendarDays size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-slate-800 leading-tight">Weekly Overview</h3>
                <p className="text-[13px] text-slate-400 font-medium">Your full week at a glance</p>
              </div>
            </div>

            <div className="flex gap-2 w-full overflow-x-auto pb-2">
              {DAYS.map(day => {
                const en = schedule[day].enabled;
                const slot = schedule[day].slots[0];
                return (
                  <div key={day} className={`flex-1 min-w-[70px] rounded-xl p-2.5 flex flex-col items-center justify-center text-center ${en ? 'bg-indigo-50 border border-indigo-100/50' : 'bg-slate-50 opacity-50'}`}>
                    <span className={`text-[13px] font-extrabold ${en ? 'text-[#5f48fb]' : 'text-slate-400'}`}>{day.substring(0, 3)}</span>
                    <span className={`text-[11px] font-bold mt-1 ${en ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {en ? (slot ? `${slot.start.split(':')[0]}—${slot.end.split(':')[0]}` : 'Multi') : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-blue-600">
            <Info size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-[13px] font-medium leading-relaxed">
              Changes take effect immediately after saving. Existing confirmed bookings will not be affected — only new booking requests will follow your updated schedule.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
// Stub for lucide icon
function CalendarDays({ size, strokeWidth, className }: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;
}
