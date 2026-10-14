import React from 'react';
import { SummaryCards } from './SummaryCards';
import { SettlementBanner } from './SettlementBanner';
import { ExpenseChart } from './ExpenseChart';
import { MonthlyTable } from './MonthlyTable';
import { PlusCircle } from 'lucide-react';

export function DashboardView({ summary, monthlySummary, rates, records, onNavigateToTracker }) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner: Who owes whom Net Balance */}
      <SettlementBanner summary={summary} />

      {/* Hero Metric Cards */}
      <SummaryCards summary={summary} />

      {/* Visual Progress / Comparison */}
      <ExpenseChart summary={summary} records={records} />

      {/* Monthly Breakdown Table */}
      <MonthlyTable monthlySummary={monthlySummary} rates={rates} />

      {/* Mobile Floating Action / Bottom Prompt to log meals */}
      <div className="pt-2 text-center">
        <button
          onClick={onNavigateToTracker}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          Log Today's Meals & Payments
        </button>
      </div>
    </div>
  );
}
