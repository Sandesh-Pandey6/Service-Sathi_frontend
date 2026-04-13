import { Clock, Sun, CloudSun, Moon } from 'lucide-react';

interface TimeSlotsProps {
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  availableSlots?: string[]; // E.g., ['08:00 AM', '02:00 PM']
}

function SlotGroup({ label, icon: Icon, slots, selectedSlot, onSlotSelect }: {
  label: string;
  icon: any;
  slots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}) {
  if (slots.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-slate-400" />
        <h4 className="text-[13px] font-bold text-slate-700">{label}</h4>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {slots.map(slot => {
          const selected = selectedSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => onSlotSelect(slot)}
              className={`
                flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all relative overflow-hidden
                ${selected
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

export default function TimeSlots({ selectedSlot, onSlotSelect, availableSlots = [] }: TimeSlotsProps) {
  // If no available slots provided or loaded, we could show empty state
  
  // Categorize slots
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  availableSlots.forEach(slot => {
    const isAm = slot.includes('AM');
    const match = slot.match(/^(\d{2})/);
    let hour = match ? parseInt(match[1], 10) : 0;
    
    if (isAm) {
      if (hour === 12) hour = 0;
      if (hour < 12) morning.push(slot); // morning up to 11:59 AM
    } else {
      if (hour !== 12) hour += 12;
      if (hour >= 12 && hour < 16) afternoon.push(slot); // 12 PM - 3:59 PM
      else if (hour >= 16) evening.push(slot); // 4 PM onwards
    }
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
      <h3 className="text-[16px] font-extrabold text-slate-900 tracking-tight mb-6">Available Slots</h3>
      
      {availableSlots.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-[14px] font-medium">
          Select an available date to see slots, or no slots available on this day.
        </div>
      ) : (
        <div className="space-y-6">
          <SlotGroup label="Morning" icon={Sun} slots={morning} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
          {morning.length > 0 && afternoon.length > 0 && <div className="h-px bg-slate-100" />}
          <SlotGroup label="Afternoon" icon={CloudSun} slots={afternoon} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
          {afternoon.length > 0 && evening.length > 0 && <div className="h-px bg-slate-100" />}
          <SlotGroup label="Evening" icon={Moon} slots={evening} selectedSlot={selectedSlot} onSlotSelect={onSlotSelect} />
        </div>
      )}
    </div>
  );
}
