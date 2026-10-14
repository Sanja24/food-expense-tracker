import React, { useState } from 'react';
import { Sunrise, Sun, Moon, Users, User, XCircle, SlidersHorizontal, Check } from 'lucide-react';
import { formatCurrency, calculateSingleMeal } from '../../utils/calculations';
import { MEAL_MODES, USERS } from '../../utils/constants';

export function MealSelectorCard({ mealKey, label, timeLabel, fullRate, mealState, onChange }) {
  const [showCustom, setShowCustom] = useState(mealState?.mode === MEAL_MODES.CUSTOM);

  const halfRate = fullRate / 2;
  const currentMode = mealState?.mode || MEAL_MODES.SHARED;

  const icons = {
    morning: Sunrise,
    day: Sun,
    night: Moon,
  };
  const Icon = icons[mealKey] || Sun;

  // Options configuration
  const options = [
    {
      id: MEAL_MODES.SHARED,
      title: 'Shared (1 Meal)',
      desc: `${formatCurrency(halfRate)} each`,
      detail: `1 meal split 50/50 (${formatCurrency(fullRate)} total)`,
      icon: Users,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      activeRing: 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500',
    },
    {
      id: MEAL_MODES.SEPARATE,
      title: 'Separate (2 Meals)',
      desc: `${formatCurrency(fullRate)} each`,
      detail: `2 separate full meals (${formatCurrency(fullRate * 2)} total)`,
      icon: Users,
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      activeRing: 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500',
    },
    {
      id: MEAL_MODES.DSK_ONLY,
      title: `${USERS.DSK.shortName} Only`,
      desc: `${formatCurrency(fullRate)} (DSK)`,
      detail: `${USERS.DSK.shortName}: ${formatCurrency(fullRate)} • ${USERS.HSK.shortName}: Rs 0`,
      icon: User,
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      activeRing: 'border-teal-500 bg-teal-500/10 ring-1 ring-teal-500',
    },
    {
      id: MEAL_MODES.HSK_ONLY,
      title: `${USERS.HSK.shortName} Only`,
      desc: `${formatCurrency(fullRate)} (HSK)`,
      detail: `${USERS.HSK.shortName}: ${formatCurrency(fullRate)} • ${USERS.DSK.shortName}: Rs 0`,
      icon: User,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      activeRing: 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500',
    },
    {
      id: MEAL_MODES.NONE,
      title: 'Skipped / None',
      desc: 'Rs 0.00',
      detail: 'Neither ate this meal',
      icon: XCircle,
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
      activeRing: 'border-slate-600 bg-slate-800/80 ring-1 ring-slate-600',
    },
  ];

  const handleSelectMode = (modeId) => {
    if (modeId === MEAL_MODES.CUSTOM) {
      setShowCustom(true);
      onChange({
        mode: MEAL_MODES.CUSTOM,
        customDsk: mealState?.customDsk ?? halfRate,
        customHsk: mealState?.customHsk ?? halfRate,
      });
    } else {
      setShowCustom(false);
      onChange({ mode: modeId });
    }
  };

  const handleCustomCostChange = (user, val) => {
    const num = parseFloat(val) || 0;
    onChange({
      mode: MEAL_MODES.CUSTOM,
      customDsk: user === 'DSK' ? num : mealState?.customDsk || 0,
      customHsk: user === 'HSK' ? num : mealState?.customHsk || 0,
    });
  };

  // Compute current display cost
  const breakdown = calculateSingleMeal(mealKey, mealState, { [mealKey]: fullRate });

  return (
    <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3.5 transition-all">
      {/* Top Header of the Meal Card */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400 shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white leading-tight">{label}</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                ({timeLabel})
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Full: <span className="font-semibold text-slate-200">{formatCurrency(fullRate)}</span>
              <span className="mx-1 text-slate-600">•</span>
              Shared: <span className="font-semibold text-emerald-400">{formatCurrency(halfRate)} each</span>
            </div>
          </div>
        </div>

        {/* Live Meal Cost Pill */}
        <div className="text-right">
          <div className="text-xs font-bold text-white font-mono">
            {formatCurrency(breakdown.totalMealCost)}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1.5 mt-0.5">
            <span className="text-emerald-400">{USERS.DSK.shortName}: {formatCurrency(breakdown.dskCost)}</span>
            <span>/</span>
            <span className="text-sky-400">{USERS.HSK.shortName}: {formatCurrency(breakdown.hskCost)}</span>
          </div>
        </div>
      </div>

      {/* Primary 5 Modes Grid (Mobile-friendly thumb targets) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {options.map((opt) => {
          const isSelected = currentMode === opt.id && !showCustom;
          const OptionIcon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectMode(opt.id)}
              className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 relative ${
                isSelected
                  ? `${opt.activeRing} shadow-md`
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <OptionIcon
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-white' : 'text-slate-500'
                  }`}
                />
                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block"></span>
                )}
              </div>
              <div>
                <div
                  className={`text-[11px] font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {opt.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Amount Toggle & Drawer */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => handleSelectMode(MEAL_MODES.CUSTOM)}
          className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-medium border transition flex items-center justify-between ${
            showCustom
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
              : 'bg-slate-950/40 text-slate-400 border-slate-800/70 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Need custom portions or price override?</span>
          </span>
          <span className="text-[10px] underline">{showCustom ? 'Active' : 'Custom'}</span>
        </button>

        {showCustom && (
          <div className="mt-2.5 p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/30 grid grid-cols-2 gap-3 animate-in fade-in duration-150">
            <div>
              <label className="text-[10px] font-bold text-emerald-400 block mb-1">
                {USERS.DSK.shortName} Portion Cost (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={mealState?.customDsk ?? halfRate}
                onChange={(e) => handleCustomCostChange('DSK', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-sky-400 block mb-1">
                {USERS.HSK.shortName} Portion Cost (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={mealState?.customHsk ?? halfRate}
                onChange={(e) => handleCustomCostChange('HSK', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
