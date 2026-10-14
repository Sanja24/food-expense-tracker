import { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_MEAL_RATES, STORAGE_KEYS } from '../utils/constants.js';
import { INITIAL_HISTORICAL_RECORDS } from '../utils/initialData.js';
import {
  calculateOverallSummary,
  calculateMonthlySummary,
} from '../utils/calculations.js';
import { generateCSV, downloadCSV } from '../utils/csvHelper.js';

/**
 * Custom React Hook for Managing LocalStorage Data for Daily Meal Records & Meal Rates
 */
export function useExpenseTracker() {
  // Rates state: defaults to Breakfast 250, Lunch 350, Dinner 350
  const [rates, setRates] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.morning && parsed.day && parsed.night) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading rates from LocalStorage', e);
    }
    return DEFAULT_MEAL_RATES;
  });

  // Records state
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Check for v1 records migration
      const legacyV1 = localStorage.getItem('food_tracker_records_v1');
      if (legacyV1) {
        const parsed = JSON.parse(legacyV1);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading records from LocalStorage', e);
    }
    return INITIAL_HISTORICAL_RECORDS;
  });

  // Persist rates on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
    } catch (e) {
      console.error('Failed to save rates to LocalStorage', e);
    }
  }, [rates]);

  // Persist records on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records to LocalStorage', e);
    }
  }, [records]);

  // Get specific record by date
  const getRecordForDate = useCallback(
    (dateStr) => {
      return (
        records.find((r) => r.date === dateStr) || {
          date: dateStr,
          meals: {
            morning: { mode: 'shared' },
            day: { mode: 'shared' },
            night: { mode: 'shared' },
          },
          dskMeals: { morning: true, day: true, night: true },
          hskMeals: { morning: true, day: true, night: true },
          dskPayment: 0,
          hskPayment: 0,
          paymentNotes: '',
        }
      );
    },
    [records]
  );

  // Save or update record for a date
  const saveDailyRecord = useCallback((recordData) => {
    setRecords((prev) => {
      const index = prev.findIndex((r) => r.date === recordData.date);
      const updatedRecord = {
        ...recordData,
        updatedAt: new Date().toISOString(),
      };

      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...updatedRecord };
        return copy.sort((a, b) => a.date.localeCompare(b.date));
      } else {
        return [...prev, updatedRecord].sort((a, b) => a.date.localeCompare(b.date));
      }
    });
  }, []);

  // Delete a record
  const deleteDailyRecord = useCallback((dateStr) => {
    setRecords((prev) => prev.filter((r) => r.date !== dateStr));
  }, []);

  // Update flat rates
  const updateRates = useCallback((newRates) => {
    setRates({
      morning: Math.max(0, parseFloat(newRates.morning) || 0),
      day: Math.max(0, parseFloat(newRates.day) || 0),
      night: Math.max(0, parseFloat(newRates.night) || 0),
    });
  }, []);

  // Reset rates to default
  const resetRates = useCallback(() => {
    setRates(DEFAULT_MEAL_RATES);
  }, []);

  // Import records with merge or replace option
  const importRecords = useCallback((incomingRecords, mode = 'merge') => {
    setRecords((prev) => {
      if (mode === 'replace') {
        return [...incomingRecords].sort((a, b) => a.date.localeCompare(b.date));
      }
      const recordMap = new Map();
      prev.forEach((r) => recordMap.set(r.date, r));
      incomingRecords.forEach((r) => recordMap.set(r.date, { ...recordMap.get(r.date), ...r }));
      return Array.from(recordMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    });
  }, []);

  // Export records to CSV
  const exportToCSV = useCallback(() => {
    const csvContent = generateCSV(records, rates);
    const dateStamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `food-tracker-expenses-${dateStamp}.csv`);
  }, [records, rates]);

  // Seed sample data
  const seedHistoricalData = useCallback(() => {
    setRecords(INITIAL_HISTORICAL_RECORDS);
    setRates(DEFAULT_MEAL_RATES);
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setRecords([]);
  }, []);

  // Computed summary
  const summary = useMemo(() => {
    return calculateOverallSummary(records, rates);
  }, [records, rates]);

  // Computed monthly breakdown
  const monthlySummary = useMemo(() => {
    return calculateMonthlySummary(records, rates);
  }, [records, rates]);

  return {
    records,
    rates,
    summary,
    monthlySummary,
    getRecordForDate,
    saveDailyRecord,
    deleteDailyRecord,
    updateRates,
    resetRates,
    importRecords,
    exportToCSV,
    seedHistoricalData,
    clearAllData,
  };
}
