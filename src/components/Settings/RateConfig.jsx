import React, { useState } from 'react';
import { Sliders, RefreshCw, Check, Users, Utensils } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { DEFAULT_MEAL_RATES } from '../../utils/constants';

export function RateConfig({ rates, onUpdateRates, onResetRates, showToast }) {
  const [morningRate, setMorningRate] = useState(rates.morning);
  const [dayRate, setDayRate] = useState(rates.day);
  const [nightRate, setNightRate] = useState(rates.night);
  const [isSaved, setIsSaved] = useState(false);

  const mVal = parseFloat(morningRate) || 0;
  const dVal = parseFloat(dayRate) || 0;
  const nVal = parseFloat(nightRate) || 0;

  const sharedDailyTotal = (mVal / 2) + (dVal / 2) + (nVal / 2);
  const separateDailyTotal = mVal + dVal + nVal;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateRates({
      morning: mVal,
      day: dVal,
      night: nVal,
    });
    setIsSaved(true);
    showToast({
      type: 'success',
      message: 'Base meal rates updated successfully!',
    });
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    onResetRates();
    setMorningRate(DEFAULT_MEAL_RATES.morning);
    setDayRate(DEFAULT_MEAL_RATES.day);
    setNightRate(DEFAULT_MEAL_RATES.night);
    showToast({
      type: 'info',
      message: 'Rates reset to defaults (Breakfast: 250, Lunch: 350, Dinner: 350)',
    });
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 shadow-lg backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Base Meal Rates & Sharing Model</h3>
            <p className="text-xs text-slate-400">
              When both eat together, the cost is split 50/50. When separate, both pay full rate.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Breakfast Rate */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Breakfast (Morning)</span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                Shared: {formatCurrency(mVal / 2)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                Rs
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={morningRate}
                onChange={(e) => setMorningRate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-[10px] text-slate-400">
              Single full meal: {formatCurrency(mVal)}
            </div>
          </div>

          {/* Lunch Rate */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Lunch (Day)</span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                Shared: {formatCurrency(dVal / 2)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                Rs
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={dayRate}
                onChange={(e) => setDayRate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-[10px] text-slate-400">
              Single full meal: {formatCurrency(dVal)}
            </div>
          </div>

          {/* Dinner Rate */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Dinner (Night)</span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                Shared: {formatCurrency(nVal / 2)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                Rs
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={nightRate}
                onChange={(e) => setNightRate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-[10px] text-slate-400">
              Single full meal: {formatCurrency(nVal)}
            </div>
          </div>
        </div>

        {/* Cost Matrix Comparison Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">If All 3 Meals Shared:</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {formatCurrency(sharedDailyTotal)} <span className="text-xs text-slate-400 font-normal">/ person / day</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">If All 3 Meals Separate:</div>
              <div className="text-sm font-bold text-sky-400 font-mono">
                {formatCurrency(separateDailyTotal)} <span className="text-xs text-slate-400 font-normal">/ person / day</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
        >
          {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : null}
          <span>{isSaved ? 'Rates Saved' : 'Save Base Rates'}</span>
        </button>
      </form>
    </div>
  );
}
