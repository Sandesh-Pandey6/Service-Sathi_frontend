import React from 'react';
import { ChevronDown } from 'lucide-react';

interface RevenuePoint {
  period: string;
  revenue: number;
  count?: number;
}

interface RevenueChartProps {
  data?: RevenuePoint[];
  totalRevenue?: number;
  totalTransactions?: number;
  loading?: boolean;
}

export const RevenueChartPlaceholder: React.FC<RevenueChartProps> = ({
  data = [],
  totalRevenue = 0,
  totalTransactions = 0,
  loading = false,
}) => {
  const chartData = data.length > 0 ? data.slice(-7) : [];
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);
  const averagePerPoint = chartData.length > 0 ? totalRevenue / chartData.length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[340px] flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-800 text-[15px]">Revenue Overview</h3>
          <p className="text-xs text-slate-400 mt-1">Live revenue from paid transactions</p>
        </div>
        <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
          Recent periods <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 mt-8 mb-6 flex flex-col justify-end">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">
            No paid revenue data yet.
          </div>
        ) : (
          <div className="flex-1 flex items-end gap-3 sm:gap-4">
            {chartData.map((item) => {
              const height = Math.max((item.revenue / maxRevenue) * 160, 12);
              const label = item.period.includes('-') ? item.period.slice(5) : item.period;

              return (
                <div key={item.period} className="flex-1 flex flex-col items-center justify-end gap-3">
                  <div className="text-[10px] font-semibold text-slate-400">
                    Rs {item.revenue.toLocaleString()}
                  </div>
                  <div
                    className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-red-500 to-red-300"
                    style={{ height }}
                  />
                  <div className="text-[11px] font-bold text-slate-300">{label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="flex justify-between items-end border-t border-slate-100 pt-5 mt-auto">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Revenue</p>
          <p className="font-bold text-slate-800 text-sm mt-0.5">Rs {totalRevenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg/Day</p>
          <p className="font-bold text-slate-800 text-sm mt-0.5">Rs {Math.round(averagePerPoint).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Transactions</p>
          <p className="font-bold text-emerald-500 text-sm mt-0.5">{totalTransactions.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
