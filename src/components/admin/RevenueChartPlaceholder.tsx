import React from 'react';
import { ChevronDown } from 'lucide-react';

export const RevenueChartPlaceholder: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[340px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-800 text-[15px]">Revenue Overview</h3>
          <p className="text-xs text-slate-400 mt-1">Last 7 days</p>
        </div>
        <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
          Last 7 days <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 mt-6 flex flex-col justify-end relative pb-8">
        {/* Placeholder graph context */}
        <div className="flex justify-between w-full absolute bottom-12 px-8 text-[11px] font-bold text-slate-300">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Dashboard numbers below */}
        <div className="flex justify-between items-end border-t border-slate-50 pt-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Revenue</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">Rs4.2L</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg/Day</p>
            <p className="font-bold text-slate-800 text-sm mt-0.5">Rs60K</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Growth</p>
            <p className="font-bold text-emerald-500 text-sm mt-0.5">+15%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
