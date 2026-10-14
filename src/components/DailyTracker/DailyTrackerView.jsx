import React, { useState, useEffect } from 'react';
import { format, subDays, addDays } from 'date-fns';
import {
  Calendar,
  Save,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Utensils,
  Share2,
} from 'lucide-react';
import { MealSelectorCard } from './MealSelectorCard';
import { PaymentLogger } from './PaymentLogger';
import { DayHistoryList } from './DayHistoryList';
import { formatCurrency, calculateDailyRecord } from '../../utils/calculations';
import { MEAL_MODES, MEAL_TYPES, USERS } from '../../utils/constants';

export function DailyTrackerView({
  rates,
  records,
  getRecordForDate,
  onSaveRecord,
  onDeleteRecord,
  showToast,
}) {
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  // Meals state: { morning: { mode: 'shared' }, day: { mode: 'shared' }, night: { mode: 'shared' } }
  const [meals, setMeals] = useState({
    morning: { mode: MEAL_MODES.SHARED },
    day: { mode: MEAL_MODES.SHARED },
    night: { mode: MEAL_MODES.SHARED },
  });

  const [dskPayment, setDskPayment] = useState(0);
  const [hskPayment, setHskPayment] = useState(0);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Load existing record whenever selectedDate changes
  useEffect(() => {
    const existing = getRecordForDate(selectedDate);
    if (existing) {
      if (existing.meals) {
        setMeals({
          morning: existing.meals.morning || { mode: MEAL_MODES.SHARED },
          day: existing.meals.day || { mode: MEAL_MODES.SHARED },
          night: existing.meals.night || { mode: MEAL_MODES.SHARED },
        });
      } else {
        // Adapt legacy dskMeals / hskMeals
        const parseLegacy = (mKey) => {
          const d = existing.dskMeals?.[mKey];
          const h = existing.hskMeals?.[mKey];
          if (d && h) return { mode: MEAL_MODES.SHARED };
          if (d && !h) return { mode: MEAL_MODES.DSK_ONLY };
          if (!d && h) return { mode: MEAL_MODES.HSK_ONLY };
          return { mode: MEAL_MODES.NONE };
        };
        setMeals({
          morning: parseLegacy('morning'),
          day: parseLegacy('day'),
          night: parseLegacy('night'),
        });
      }

      setDskPayment(existing.dskPayment || 0);
      setHskPayment(existing.hskPayment || 0);
      setPaymentNotes(existing.paymentNotes || '');
    } else {
      // Default to 3 shared meals
      setMeals({
        morning: { mode: MEAL_MODES.SHARED },
        day: { mode: MEAL_MODES.SHARED },
        night: { mode: MEAL_MODES.SHARED },
      });
      setDskPayment(0);
      setHskPayment(0);
      setPaymentNotes('');
    }
  }, [selectedDate, getRecordForDate]);

  // Quick Date Navigation
  const changeDateBy = (days) => {
    try {
      const current = new Date(selectedDate);
      const nextDate = days > 0 ? addDays(current, days) : subDays(current, Math.abs(days));
      setSelectedDate(format(nextDate, 'yyyy-MM-dd'));
    } catch {
      // ignore
    }
  };

  const handleSetToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // Quick Preset Handlers
  const applyPreset = (presetType) => {
    switch (presetType) {
      case 'all_shared':
        setMeals({
          morning: { mode: MEAL_MODES.SHARED },
          day: { mode: MEAL_MODES.SHARED },
          night: { mode: MEAL_MODES.SHARED },
        });
        showToast({ type: 'info', message: 'Applied: All 3 meals shared (Rs 475 each)' });
        break;
      case 'all_separate':
        setMeals({
          morning: { mode: MEAL_MODES.SEPARATE },
          day: { mode: MEAL_MODES.SEPARATE },
          night: { mode: MEAL_MODES.SEPARATE },
        });
        showToast({ type: 'info', message: 'Applied: 2 separate meals for all (Rs 950 each)' });
        break;
      case 'no_dinner':
        setMeals({
          morning: { mode: MEAL_MODES.SHARED },
          day: { mode: MEAL_MODES.SHARED },
          night: { mode: MEAL_MODES.NONE },
        });
        showToast({ type: 'info', message: 'Applied: Breakfast & Lunch shared, Dinner skipped (Rs 300 each)' });
        break;
      case 'clear':
        setMeals({
          morning: { mode: MEAL_MODES.NONE },
          day: { mode: MEAL_MODES.NONE },
          night: { mode: MEAL_MODES.NONE },
        });
        showToast({ type: 'info', message: 'Cleared all meal selections for today' });
        break;
      default:
        break;
    }
  };

  // Live Cost Calculations for Today
  const mockRecord = {
    meals,
    dskPayment,
    hskPayment,
  };
  const dailyCalc = calculateDailyRecord(mockRecord, rates);

  // Submit & Save
  const handleSave = (e) => {
    e.preventDefault();

    // Also populate legacy dskMeals / hskMeals for backward compatibility
    const deriveLegacyAte = (mealConfig, userKey) => {
      if (!mealConfig) return false;
      if (mealConfig.mode === MEAL_MODES.SHARED || mealConfig.mode === MEAL_MODES.SEPARATE) return true;
      if (mealConfig.mode === MEAL_MODES.DSK_ONLY && userKey === 'DSK') return true;
      if (mealConfig.mode === MEAL_MODES.HSK_ONLY && userKey === 'HSK') return true;
      if (mealConfig.mode === MEAL_MODES.CUSTOM) {
        return userKey === 'DSK' ? (mealConfig.customDsk > 0) : (mealConfig.customHsk > 0);
      }
      return false;
    };

    const recordToSave = {
      date: selectedDate,
      meals,
      dskMeals: {
        morning: deriveLegacyAte(meals.morning, 'DSK'),
        day: deriveLegacyAte(meals.day, 'DSK'),
        night: deriveLegacyAte(meals.night, 'DSK'),
      },
      hskMeals: {
        morning: deriveLegacyAte(meals.morning, 'HSK'),
        day: deriveLegacyAte(meals.day, 'HSK'),
        night: deriveLegacyAte(meals.night, 'HSK'),
      },
      dskPayment: parseFloat(dskPayment) || 0,
      hskPayment: parseFloat(hskPayment) || 0,
      paymentNotes: paymentNotes.trim(),
    };

    onSaveRecord(recordToSave);
    setIsSavedFeedback(true);
    showToast({
      type: 'success',
      message: `Meals for ${selectedDate} saved! (DSK: ${formatCurrency(dailyCalc.dskCost)} | HSK: ${formatCurrency(dailyCalc.hskCost)})`,
    });

    setTimeout(() => {
      setIsSavedFeedback(false);
    }, 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Date Bar & Stepper */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-4 shadow-lg backdrop-blur-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Daily Meal Tracker</h2>
              <p className="text-xs text-slate-400">Log meals (Shared / Separate) & payments</p>
            </div>
          </div>

          {/* Quick Date Stepper & Today button */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <button
              type="button"
              onClick={() => changeDateBy(-1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSetToday}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => changeDateBy(1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Input Field */}
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Quick Action Presets */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-2.5 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Presets:
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => applyPreset('all_shared')}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium transition"
          >
            All Shared (Rs 475)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('all_separate')}
            className="px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-medium transition"
          >
            All Separate (Rs 950)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('no_dinner')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition"
          >
            No Dinner (Rs 300)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('clear')}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
            title="Clear all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Form with the 3 Meals */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Breakfast Card (Full Rs 250, Shared Rs 125) */}
        <MealSelectorCard
          mealKey="morning"
          label="Breakfast"
          timeLabel="Morning"
          fullRate={rates.morning}
          mealState={meals.morning}
          onChange={(newVal) => setMeals((prev) => ({ ...prev, morning: newVal }))}
        />

        {/* Lunch Card (Full Rs 350, Shared Rs 175) */}
        <MealSelectorCard
          mealKey="day"
          label="Lunch"
          timeLabel="Day"
          fullRate={rates.day}
          mealState={meals.day}
          onChange={(newVal) => setMeals((prev) => ({ ...prev, day: newVal }))}
        />

        {/* Dinner Card (Full Rs 350, Shared Rs 175) */}
        <MealSelectorCard
          mealKey="night"
          label="Dinner"
          timeLabel="Night"
          fullRate={rates.night}
          mealState={meals.night}
          onChange={(newVal) => setMeals((prev) => ({ ...prev, night: newVal }))}
        />

        {/* Payment Logger for manual settlements */}
        <PaymentLogger
          dskPayment={dskPayment}
          hskPayment={hskPayment}
          notes={paymentNotes}
          onDskChange={setDskPayment}
          onHskChange={setHskPayment}
          onNotesChange={setPaymentNotes}
        />

        {/* Sticky-feeling Live Summary & Save Bar */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-xl backdrop-blur-md">
          <div>
            <div className="text-xs text-slate-400">Day Total Incurred:</div>
            <div className="text-xl font-black text-white font-mono">
              {formatCurrency(dailyCalc.totalCost)}
            </div>
            <div className="text-[11px] text-slate-400 flex gap-2 font-medium">
              <span className="text-emerald-400">{USERS.DSK.shortName}: {formatCurrency(dailyCalc.dskCost)}</span>
              <span>•</span>
              <span className="text-sky-400">{USERS.HSK.shortName}: {formatCurrency(dailyCalc.hskCost)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all"
          >
            {isSavedFeedback ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 stroke-[2.3]" />
                <span>Save Entry</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* History of Recent Logged Days */}
      <DayHistoryList
        records={records}
        rates={rates}
        activeDate={selectedDate}
        onSelectDate={setSelectedDate}
        onDeleteDate={onDeleteRecord}
      />
    </div>
  );
}
