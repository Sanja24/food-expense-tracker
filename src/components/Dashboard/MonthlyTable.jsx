import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { formatCurrency, calculateDailyRecord } from '../../utils/calculations.js';
import { StatusBadge } from '../UI/Badge.jsx';
import { USERS, MEAL_MODES } from '../../utils/constants.js';

export function MonthlyTable({ monthlySummary, rates }) {
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');

  const availableYears = Array.from(
    new Set(monthlySummary.map((m) => m.key.split('-')[0]))
  ).sort().reverse();

  const filteredMonths = monthlySummary.filter((m) => {
    if (selectedYear === 'all') return true;
    return m.key.startsWith(selectedYear);
  });

  const toggleExpand = (monthKey) => {
    setExpandedMonth(expandedMonth === monthKey ? null : monthKey);
  };

  const renderMealBadge = (mealCalc) => {
    switch (mealCalc.mode) {
      case MEAL_MODES.SHARED:
        return <span className="text-emerald-400 font-semibold">Shared (½)</span>;
      case MEAL_MODES.SEPARATE:
        return <span className="text-sky-400 font-bold">Sep (x2)</span>;
      case MEAL_MODES.DSK_ONLY:
        return <span className="text-emerald-300 font-medium">{USERS.DSK.shortName}</span>;
      case MEAL_MODES.HSK_ONLY:
        return <span className="text-sky-300 font-medium">{USERS.HSK.shortName}</span>;
      case MEAL_MODES.CUSTOM:
        return <span className="text-amber-400 font-medium">Custom</span>;
      case MEAL_MODES.NONE:
      default:
        return <span className="text-slate-500">-</span>;
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Monthly Breakdown & Settlement Overview
          </h2>
          <p className="text-xs text-slate-400">
            Historical monthly food expenses, contributions, and settlements
          </p>
        </div>

        {availableYears.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">Filter Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
              <th className="py-3 px-3 rounded-l-xl">Month</th>
              <th className="py-3 px-3 text-emerald-400">{USERS.DSK.shortName} Food</th>
              <th className="py-3 px-3 text-sky-400">{USERS.HSK.shortName} Food</th>
              <th className="py-3 px-3 text-white">Total Expenses</th>
              <th className="py-3 px-3 text-emerald-300">{USERS.DSK.shortName} Paid</th>
              <th className="py-3 px-3 text-sky-300">{USERS.HSK.shortName} Paid</th>
              <th className="py-3 px-3 text-white">Total Paid</th>
              <th className="py-3 px-3">Balance</th>
              <th className="py-3 px-3 text-center rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredMonths.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-500">
                  No monthly records logged yet. Use the Daily Tracker to add meals!
                </td>
              </tr>
            ) : (
              filteredMonths.map((m) => {
                const isExpanded = expandedMonth === m.key;
                return (
                  <React.Fragment key={m.key}>
                    <tr
                      onClick={() => toggleExpand(m.key)}
                      className={`cursor-pointer transition-colors hover:bg-slate-800/40 ${
                        isExpanded ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-white flex items-center gap-1.5">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{m.monthName}</span>
                        <span className="text-[10px] text-slate-500">({m.records.length}d)</span>
                      </td>
                      <td className="py-3 px-3 font-medium text-emerald-400">
                        {formatCurrency(m.dskCost)}
                      </td>
                      <td className="py-3 px-3 font-medium text-sky-400">
                        {formatCurrency(m.hskCost)}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {formatCurrency(m.totalCost)}
                      </td>
                      <td className="py-3 px-3 font-medium text-emerald-300">
                        {formatCurrency(m.dskPaid)}
                      </td>
                      <td className="py-3 px-3 font-medium text-sky-300">
                        {formatCurrency(m.hskPaid)}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {formatCurrency(m.totalPaid)}
                      </td>
                      <td
                        className={`py-3 px-3 font-semibold ${
                          m.balance > 0
                            ? 'text-rose-400'
                            : m.balance < 0
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatCurrency(m.balance)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={m.status} />
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan="9" className="p-0 bg-slate-950/60">
                          <div className="p-4 border-y border-slate-800">
                            <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              Daily Entries for {m.monthName}
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-[11px] whitespace-nowrap">
                                <thead>
                                  <tr className="text-slate-500 border-b border-slate-800">
                                    <th className="py-1.5 px-2">Date</th>
                                    <th className="py-1.5 px-2">Breakfast</th>
                                    <th className="py-1.5 px-2">Lunch</th>
                                    <th className="py-1.5 px-2">Dinner</th>
                                    <th className="py-1.5 px-2 text-emerald-400">DSK Cost</th>
                                    <th className="py-1.5 px-2 text-sky-400">HSK Cost</th>
                                    <th className="py-1.5 px-2 font-bold text-white">Day Total</th>
                                    <th className="py-1.5 px-2">DSK Paid</th>
                                    <th className="py-1.5 px-2">HSK Paid</th>
                                    <th className="py-1.5 px-2">Notes</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-900">
                                  {m.records.map((r) => {
                                    const c = calculateDailyRecord(r, rates);
                                    return (
                                      <tr key={r.date} className="hover:bg-slate-900/50">
                                        <td className="py-1.5 px-2 text-slate-300 font-mono">
                                          {r.date}
                                        </td>
                                        <td className="py-1.5 px-2">
                                          {renderMealBadge(c.morning)}
                                        </td>
                                        <td className="py-1.5 px-2">
                                          {renderMealBadge(c.day)}
                                        </td>
                                        <td className="py-1.5 px-2">
                                          {renderMealBadge(c.night)}
                                        </td>
                                        <td className="py-1.5 px-2 text-emerald-400 font-mono">
                                          {formatCurrency(c.dskCost)}
                                        </td>
                                        <td className="py-1.5 px-2 text-sky-400 font-mono">
                                          {formatCurrency(c.hskCost)}
                                        </td>
                                        <td className="py-1.5 px-2 font-bold text-white font-mono">
                                          {formatCurrency(c.totalCost)}
                                        </td>
                                        <td className="py-1.5 px-2 text-emerald-300">
                                          {c.dskPaid > 0 ? formatCurrency(c.dskPaid) : '-'}
                                        </td>
                                        <td className="py-1.5 px-2 text-sky-300">
                                          {c.hskPaid > 0 ? formatCurrency(c.hskPaid) : '-'}
                                        </td>
                                        <td className="py-1.5 px-2 text-slate-400 italic max-w-xs truncate">
                                          {r.paymentNotes || '-'}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
