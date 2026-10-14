import { format, parseISO } from 'date-fns';
import { MEAL_MODES } from './constants.js';

/**
 * Calculate cost breakdown for an individual meal (morning, day, or night)
 *
 * @param {string} mealKey 'morning' | 'day' | 'night'
 * @param {Object|boolean} mealData Meal config or legacy boolean
 * @param {Object} rates { morning: number, day: number, night: number }
 * @param {Object} legacyContext Optional context containing legacy dskMeals & hskMeals
 * @returns {{ mode: string, dskCost: number, hskCost: number, totalMealCost: number }}
 */
export function calculateSingleMeal(mealKey, mealData, rates, legacyContext = {}) {
  const fullRate = parseFloat(rates[mealKey]) || 0;
  const halfRate = fullRate / 2;

  // If modern meal config object is present
  if (mealData && typeof mealData === 'object' && mealData.mode) {
    switch (mealData.mode) {
      case MEAL_MODES.SHARED:
        return {
          mode: MEAL_MODES.SHARED,
          dskCost: halfRate,
          hskCost: halfRate,
          totalMealCost: fullRate,
        };
      case MEAL_MODES.SEPARATE:
        return {
          mode: MEAL_MODES.SEPARATE,
          dskCost: fullRate,
          hskCost: fullRate,
          totalMealCost: fullRate * 2,
        };
      case MEAL_MODES.DSK_ONLY:
        return {
          mode: MEAL_MODES.DSK_ONLY,
          dskCost: fullRate,
          hskCost: 0,
          totalMealCost: fullRate,
        };
      case MEAL_MODES.HSK_ONLY:
        return {
          mode: MEAL_MODES.HSK_ONLY,
          dskCost: 0,
          hskCost: fullRate,
          totalMealCost: fullRate,
        };
      case MEAL_MODES.CUSTOM:
        const dCost = parseFloat(mealData.customDsk) || 0;
        const hCost = parseFloat(mealData.customHsk) || 0;
        return {
          mode: MEAL_MODES.CUSTOM,
          dskCost: dCost,
          hskCost: hCost,
          totalMealCost: dCost + hCost,
        };
      case MEAL_MODES.NONE:
      default:
        return {
          mode: MEAL_MODES.NONE,
          dskCost: 0,
          hskCost: 0,
          totalMealCost: 0,
        };
    }
  }

  // Fallback for legacy format (dskMeals / hskMeals booleans)
  const dskAte = !!legacyContext.dskMeals?.[mealKey];
  const hskAte = !!legacyContext.hskMeals?.[mealKey];

  if (dskAte && hskAte) {
    // Both ate: check if explicit mode or default to shared
    return {
      mode: MEAL_MODES.SHARED,
      dskCost: halfRate,
      hskCost: halfRate,
      totalMealCost: fullRate,
    };
  } else if (dskAte && !hskAte) {
    return {
      mode: MEAL_MODES.DSK_ONLY,
      dskCost: fullRate,
      hskCost: 0,
      totalMealCost: fullRate,
    };
  } else if (!dskAte && hskAte) {
    return {
      mode: MEAL_MODES.HSK_ONLY,
      dskCost: 0,
      hskCost: fullRate,
      totalMealCost: fullRate,
    };
  }

  return {
    mode: MEAL_MODES.NONE,
    dskCost: 0,
    hskCost: 0,
    totalMealCost: 0,
  };
}

/**
 * Calculate costs & payments for a single daily record
 */
export function calculateDailyRecord(record, rates) {
  // Check for custom day cost override if present
  if (record.customDskCost !== undefined && record.customHskCost !== undefined) {
    const dskCost = parseFloat(record.customDskCost) || 0;
    const hskCost = parseFloat(record.customHskCost) || 0;
    const totalCost = dskCost + hskCost;
    const dskPaid = parseFloat(record.dskPayment) || 0;
    const hskPaid = parseFloat(record.hskPayment) || 0;
    return {
      morning: { mode: 'custom', dskCost: 0, hskCost: 0, totalMealCost: 0 },
      day: { mode: 'custom', dskCost: 0, hskCost: 0, totalMealCost: 0 },
      night: { mode: 'custom', dskCost: 0, hskCost: 0, totalMealCost: 0 },
      dskCost,
      hskCost,
      totalCost,
      dskPaid,
      hskPaid,
      totalPaid: dskPaid + hskPaid,
      dskBalance: dskCost - dskPaid,
      hskBalance: hskCost - hskPaid,
    };
  }

  // Calculate each meal
  const morning = calculateSingleMeal('morning', record.meals?.morning, rates, record);
  const day = calculateSingleMeal('day', record.meals?.day, rates, record);
  const night = calculateSingleMeal('night', record.meals?.night, rates, record);

  let dskCost = morning.dskCost + day.dskCost + night.dskCost;
  let hskCost = morning.hskCost + day.hskCost + night.hskCost;

  // Handle legacy customCost on dskMeals / hskMeals if present
  if (record.dskMeals?.customCost) dskCost = record.dskMeals.customCost;
  if (record.hskMeals?.customCost) hskCost = record.hskMeals.customCost;

  const totalCost = dskCost + hskCost;
  const dskPaid = parseFloat(record.dskPayment) || 0;
  const hskPaid = parseFloat(record.hskPayment) || 0;
  const totalPaid = dskPaid + hskPaid;

  const dskBalance = dskCost - dskPaid;
  const hskBalance = hskCost - hskPaid;

  return {
    morning,
    day,
    night,
    dskCost,
    hskCost,
    totalCost,
    dskPaid,
    hskPaid,
    totalPaid,
    dskBalance,
    hskBalance,
  };
}

/**
 * Calculate global totals and settlement balance
 */
export function calculateOverallSummary(records, rates) {
  let totalDskCost = 0;
  let totalHskCost = 0;
  let totalDskPaid = 0;
  let totalHskPaid = 0;

  records.forEach((rec) => {
    const calc = calculateDailyRecord(rec, rates);
    totalDskCost += calc.dskCost;
    totalHskCost += calc.hskCost;
    totalDskPaid += calc.dskPaid;
    totalHskPaid += calc.hskPaid;
  });

  const totalCombinedExpenses = totalDskCost + totalHskCost;
  const totalPaymentsSettled = totalDskPaid + totalHskPaid;

  const dskBalance = totalDskCost - totalDskPaid;
  const hskBalance = totalHskCost - totalHskPaid;

  // Net settlement between DSK & HSK
  let settlement = {
    type: 'settled',
    amount: 0,
    debtor: null,
    creditor: null,
    message: 'All balances are settled evenly!',
  };

  const dskNetContribution = totalDskPaid - totalDskCost; // >0 is surplus
  const hskNetContribution = totalHskPaid - totalHskCost;

  if (dskNetContribution < 0 && hskNetContribution > 0) {
    const transferAmount = Math.min(Math.abs(dskNetContribution), hskNetContribution);
    settlement = {
      type: 'dsk_owes_hsk',
      amount: transferAmount,
      debtor: 'DSK',
      creditor: 'HSK',
      message: `Dineth (DSK) owes Heshan (HSK) Rs ${transferAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to settle mutual balance`,
    };
  } else if (hskNetContribution < 0 && dskNetContribution > 0) {
    const transferAmount = Math.min(Math.abs(hskNetContribution), dskNetContribution);
    settlement = {
      type: 'hsk_owes_dsk',
      amount: transferAmount,
      debtor: 'HSK',
      creditor: 'DSK',
      message: `Heshan (HSK) owes Dineth (DSK) Rs ${transferAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to settle mutual balance`,
    };
  } else if (dskBalance > 0 && hskBalance > 0) {
    settlement = {
      type: 'both_owe_supplier',
      amount: dskBalance + hskBalance,
      debtor: 'Both',
      creditor: 'Supplier',
      message: `Outstanding Supplier Balance: DSK owes Rs ${dskBalance.toLocaleString()} and HSK owes Rs ${hskBalance.toLocaleString()}`,
    };
  } else if (dskBalance < 0 && hskBalance < 0) {
    settlement = {
      type: 'both_advance',
      amount: Math.abs(dskBalance + hskBalance),
      debtor: 'Supplier',
      creditor: 'Both',
      message: `Advance Balance with Supplier: Rs ${Math.abs(dskBalance + hskBalance).toLocaleString()} total prepaid`,
    };
  }

  return {
    totalDskCost,
    totalHskCost,
    totalCombinedExpenses,
    totalDskPaid,
    totalHskPaid,
    totalPaymentsSettled,
    dskBalance,
    hskBalance,
    settlement,
  };
}

/**
 * Group records by month and calculate aggregated stats
 */
export function calculateMonthlySummary(records, rates) {
  const monthMap = {};

  records.forEach((rec) => {
    if (!rec.date) return;
    const monthKey = rec.date.substring(0, 7);
    if (!monthMap[monthKey]) {
      monthMap[monthKey] = {
        key: monthKey,
        monthName: '',
        records: [],
        dskCost: 0,
        hskCost: 0,
        totalCost: 0,
        dskPaid: 0,
        hskPaid: 0,
        totalPaid: 0,
        balance: 0,
        status: 'No Expense',
      };
      try {
        monthMap[monthKey].monthName = format(parseISO(`${monthKey}-01`), 'MMMM yyyy');
      } catch {
        monthMap[monthKey].monthName = monthKey;
      }
    }

    const calc = calculateDailyRecord(rec, rates);
    const m = monthMap[monthKey];
    m.records.push(rec);
    m.dskCost += calc.dskCost;
    m.hskCost += calc.hskCost;
    m.totalCost += calc.totalCost;
    m.dskPaid += calc.dskPaid;
    m.hskPaid += calc.hskPaid;
    m.totalPaid += calc.totalPaid;
  });

  const monthList = Object.values(monthMap).map((m) => {
    m.balance = m.totalCost - m.totalPaid;

    if (m.totalCost === 0 && m.totalPaid === 0) {
      m.status = 'No Expense';
    } else if (m.balance <= 0) {
      m.status = 'Settled';
    } else if (m.totalPaid > 0) {
      m.status = 'Partial';
    } else {
      m.status = 'Unpaid';
    }
    return m;
  });

  return monthList.sort((a, b) => b.key.localeCompare(a.key));
}

/**
 * Format currency in Sri Lankan Rupee standard
 */
export function formatCurrency(num, showSign = false) {
  const val = Number(num) || 0;
  const isNeg = val < 0;
  const absFormatted = Math.abs(val).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (isNeg) {
    return `-Rs ${absFormatted}`;
  }
  if (showSign && val > 0) {
    return `+Rs ${absFormatted}`;
  }
  return `Rs ${absFormatted}`;
}

export function formatFriendlyDate(dateStr) {
  try {
    const d = parseISO(dateStr);
    return format(d, 'EEE, dd MMM yyyy');
  } catch {
    return dateStr;
  }
}
