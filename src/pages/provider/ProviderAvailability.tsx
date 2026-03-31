import { useState, useEffect } from 'react';
import { providerApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_CODES: Record<string, string> = {
  Monday: 'MON', Tuesday: 'TUE', Wednesday: 'WED', Thursday: 'THU',
  Friday: 'FRI', Saturday: 'SAT', Sunday: 'SUN'
};
const REVERSE_DAY_CODES = Object.fromEntries(Object.entries(DAY_CODES).map(([k, v]) => [v, k]));

const START = ['08:00', '09:00', '10:00'];
const END = ['16:00', '17:00', '18:00'];

export default function ProviderAvailability() {
  const [providerId, setProviderId] = useState<string | null>(null);
  const [availabilityList, setAvailabilityList] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<Record<string, { enabled: boolean; start: string; end: string }>>(() => {
    const init: any = {};
    DAYS.forEach(d => {
      init[d] = { enabled: !['Saturday', 'Sunday'].includes(d), start: '09:00', end: '17:00' };
    });
    return init;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authApi.me();
        const pId = data.user?.provider_profile?.id;
        setProviderId(pId);
        
        if (pId) {
          const res = await providerApi.getAvailability(pId);
          const avails = res.data.availability || res.data || [];
          setAvailabilityList(avails);
          
          // Patch state with existing recurring schedules
          const newSchedule = { ...schedule };
          avails.forEach((a: any) => {
            if (a.is_recurring && a.recurring_day && REVERSE_DAY_CODES[a.recurring_day]) {
              const d = REVERSE_DAY_CODES[a.recurring_day];
              newSchedule[d] = { enabled: true, start: a.start_time, end: a.end_time };
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

  const toggle = (day: string) => {
    setSchedule(p => ({ ...p, [day]: { ...p[day], enabled: !p[day].enabled } }));
  };

  const updateTime = (day: string, type: 'start' | 'end', val: string) => {
    setSchedule(p => ({ ...p, [day]: { ...p[day], [type]: val } }));
  };

  const saveAvailability = async () => {
    if (!providerId) return;
    const loadingToast = toast.loading('Saving availability...');
    
    try {
      // Very naive implementation: delete all recurring schedules and recreate them
      for (const a of availabilityList) {
        if (a.is_recurring) {
          await providerApi.deleteAvailability(a.id);
        }
      }

      for (const day of DAYS) {
        if (schedule[day].enabled) {
          await providerApi.createAvailability(providerId, {
            available_date: new Date().toISOString(), // dummy required by schema
            start_time: schedule[day].start,
            end_time: schedule[day].end,
            is_recurring: true,
            recurring_day: DAY_CODES[day],
            is_available: true
          });
        }
      }
      
      toast.success('Availability saved successfully!', { id: loadingToast });
      
      // Refresh
      const res = await providerApi.getAvailability(providerId);
      setAvailabilityList(res.data.availability || res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save availability', { id: loadingToast });
    }
  };

  if (loading) return <div className="p-6 text-slate-500 font-medium">Loading availability...</div>;

  return (
    <div className="p-6 space-y-5 max-w-xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Availability</h1>
        <p className="text-sm text-slate-400 mt-0.5">Set your working days and hours</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-700 mb-3">Working Days</h2>
        {DAYS.map(day => (
          <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggle(day)}
                className={`w-11 h-6 rounded-full transition-colors ${schedule[day].enabled ? 'bg-amber-400' : 'bg-gray-200'} relative`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${schedule[day].enabled ? 'translate-x-6' : 'translate-x-1'}`}></span>
              </button>
              <span className={`text-sm font-semibold ${schedule[day].enabled ? 'text-slate-800' : 'text-slate-300'}`}>{day}</span>
            </div>
            {schedule[day].enabled && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <select 
                  className="border border-slate-200 rounded-lg px-2 py-1 outline-none text-xs"
                  value={schedule[day].start}
                  onChange={e => updateTime(day, 'start', e.target.value)}
                >
                  {START.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span>to</span>
                <select 
                  className="border border-slate-200 rounded-lg px-2 py-1 outline-none text-xs"
                  value={schedule[day].end}
                  onChange={e => updateTime(day, 'end', e.target.value)}
                >
                  {END.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>
        ))}
        <button onClick={saveAvailability} className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
          Save Availability
        </button>
      </div>
    </div>
  );
}
