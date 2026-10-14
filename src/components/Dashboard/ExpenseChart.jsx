import React from 'react';
import { PieChart, TrendingUp, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { USERS } from '../../utils/constants';

export function ExpenseChart({ summary, records }) {
  const { totalDskCost, totalHskCost, totalCombinedExpenses, totalPaymentsSettled } = summary;

  const dskPct = totalCombinedExpenses > 0
    ? Math.round((totalDskCost / totalCombinedExpenses) * 100)
    : 50;
  const hskPct = 100 - dskPct;

  const settlementPct = totalCombinedExpenses > 0
    ? Math.min(100, Math.round((totalPaymentsSettled / totalCombinedExpenses) * 100))
    : 100;

  // Count active meal days
  const totalDaysLogged = records.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {/* Food Cost Share Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Expense Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-400">{totalDaysLogged} Days Logged</span>
        </div>

        {/* Dual Colored Progress Bar */}
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner mb-3">
          <div
            style={{ width: `${dskPct}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            title={`${USERS.DSK.shortName}: ${dskPct}%`}
          />
          <div
            style={{ width: `${hskPct}%` }}
            className="h-full bg-gradient-to-r from-sky-400 to-sky-500 transition-all duration-500"
            title={`${USERS.HSK.shortName}: ${hskPct}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
            <span className="text-slate-300 font-medium">{USERS.DSK.shortName}:</span>
            <span className="font-bold text-white">{dskPct}%</span>
            <span className="text-slate-500">({formatCurrency(totalDskCost)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block shadow-sm"></span>
            <span className="text-slate-300 font-medium">{USERS.HSK.shortName}:</span>
            <span className="font-bold text-white">{hskPct}%</span>
            <span className="text-slate-500">({formatCurrency(totalHskCost)})</span>
          </div>
        </div>
      </div>

      {/* Payment Settlement Progress Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Payment Settlement Ratio
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-400">{settlementPct}% Covered</span>
        </div>

        {/* Progress Bar */}
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner mb-3">
          <div
            style={{ width: `${settlementPct}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 transition-all duration-500"
          />
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Settled: <strong className="text-white">{formatCurrency(totalPaymentsSettled)}</strong>
          </span>
          <span>
            Total Incurred: <strong className="text-white">{formatCurrency(totalCombinedExpenses)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
