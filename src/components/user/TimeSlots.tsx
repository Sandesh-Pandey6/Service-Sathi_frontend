import { Clock, Sun, CloudSun, Moon } from 'lucide-react';

interface TimeSlotsProps {
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

const MORNING_SLOTS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'];
const AFTERNOON_SLOTS = ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];
const EVENING_SLOTS = ['04:00 PM', '05:00 PM', '06:00 PM'];

// Simulate some slots being unavailable
const UNAVAILABLE = ['10:00 AM', '02:00 PM'];

function SlotGroup({ label, icon: Icon, slots, selectedSlot, onSlotSelect }: {
  label: string;
  icon: any;
  slots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-slate-400" />
        <h4 className="text-[13px] font-bold text-slate-700">{label}</h4>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {slots.map(slot => {
          const unavailable = UNAVAILABLE.includes(slot);
          const selected = selectedSlot === slot;
          return (
            <button
              key={slot}
              disabled={unavailable}
              onClick={() => onSlotSelect(slot)}
              className={`
                flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all relative overflow-hidden
                ${unavailable
                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 line-through'
                  : selected
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-105 z-10 border border-red-600'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 cursor-pointer'
                }
              `}
            >
              <Clock size={13} strokeWidth={selected ? 3 : 2} className={selected ? 'text-red-200' : 'text-slate-400'} />
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TimeSlots({ selectedSlot, onSlotSelect }: TimeSlotsProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
      <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight mb-6">Available Slots</h3>
      
      <div className="space-y-6">
        <SlotGroup label="Morning" icon={Sun} slots={MORNING_SLOTS} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
        <div className="h-px bg-slate-100" />
        <SlotGroup label="Afternoon" icon={CloudSun} slots={AFTERNOON_SLOTS} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
        <div className="h-px bg-slate-100" />
        <SlotGroup label="Evening" icon={Moon} slots={EVENING_SLOTS} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
      </div>
    </div>
  );
}
