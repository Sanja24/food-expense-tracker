import React from 'react';
import { History, Calendar, Trash2 } from 'lucide-react';
import { formatCurrency, calculateDailyRecord } from '../../utils/calculations';
import { USERS, MEAL_MODES } from '../../utils/constants';

export function DayHistoryList({ records, rates, onSelectDate, onDeleteDate, activeDate }) {
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);

  if (sortedRecords.length === 0) return null;

  const getMealTag = (meal) => {
    if (!meal) return <span className="text-slate-600">-</span>;
    switch (meal.mode) {
      case MEAL_MODES.SHARED:
        return <span className="text-emerald-400 font-medium">Shared (½)</span>;
      case MEAL_MODES.SEPARATE:
        return <span className="text-sky-400 font-semibold">Separate (x2)</span>;
      case MEAL_MODES.DSK_ONLY:
        return <span className="text-emerald-300 font-medium">{USERS.DSK.shortName} only</span>;
      case MEAL_MODES.HSK_ONLY:
        return <span className="text-sky-300 font-medium">{USERS.HSK.shortName} only</span>;
      case MEAL_MODES.CUSTOM:
        return <span className="text-amber-400 font-medium">Custom</span>;
      case MEAL_MODES.NONE:
      default:
        return <span className="text-slate-500">None</span>;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 shadow-md backdrop-blur-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Recent Logged Days
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">Tap to edit</span>
      </div>

      <div className="space-y-2">
        {sortedRecords.map((rec) => {
          const calc = calculateDailyRecord(rec, rates);
          const isSelected = rec.date === activeDate;

          return (
            <div
              key={rec.date}
              onClick={() => onSelectDate(rec.date)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {rec.date.substring(8, 10)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{rec.date}</span>
                    {isSelected && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Editing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 flex-wrap">
                    <span>M: {getMealTag(calc.morning)}</span>
                    <span>•</span>
                    <span>L: {getMealTag(calc.day)}</span>
                    <span>•</span>
                    <span>D: {getMealTag(calc.night)}</span>
                    {calc.totalPaid > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">
                          Paid: {formatCurrency(calc.totalPaid)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono">
                    {formatCurrency(calc.totalCost)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    <span className="text-emerald-400">{formatCurrency(calc.dskCost)}</span>
                    {' / '}
                    <span className="text-sky-400">{formatCurrency(calc.hskCost)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  title="Delete this record"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete record for ${rec.date}?`)) {
                      onDeleteDate(rec.date);
                    }
                  }}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
