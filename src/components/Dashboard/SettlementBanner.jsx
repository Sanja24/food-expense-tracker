import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Scale, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { USERS } from '../../utils/constants';

export function SettlementBanner({ summary }) {
  const { dskBalance, hskBalance, totalCombinedExpenses, totalPaymentsSettled, settlement } = summary;
  const overallDiff = totalCombinedExpenses - totalPaymentsSettled;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800/90 rounded-3xl p-5 border border-slate-700/60 shadow-xl relative overflow-hidden">
      {/* Decorative accent glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Overall Net Balance Calculation */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Net Balance & Settlement
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                overallDiff === 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : overallDiff < 0
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {overallDiff === 0
                ? 'Fully Settled'
                : overallDiff < 0
                ? `Overpaid by ${formatCurrency(Math.abs(overallDiff))}`
                : `Total Outstanding: ${formatCurrency(overallDiff)}`}
            </span>
          </div>

          {/* Big Headline */}
          {settlement.type === 'dsk_owes_hsk' && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-emerald-400">{USERS.DSK.shortName}</span> owes{' '}
                <span className="text-sky-400">{USERS.HSK.shortName}</span>
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 bg-rose-500/10 px-3 py-0.5 rounded-xl border border-rose-500/30">
                {formatCurrency(settlement.amount)}
              </span>
            </div>
          )}

          {settlement.type === 'hsk_owes_dsk' && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-sky-400">{USERS.HSK.shortName}</span> owes{' '}
                <span className="text-emerald-400">{USERS.DSK.shortName}</span>
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 bg-rose-500/10 px-3 py-0.5 rounded-xl border border-rose-500/30">
                {formatCurrency(settlement.amount)}
              </span>
            </div>
          )}

          {settlement.type === 'both_owe_supplier' && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-lg sm:text-xl font-bold text-white">
                Food Supplier Pending Balance:{' '}
                <span className="text-amber-400">{formatCurrency(overallDiff)}</span>
              </span>
            </div>
          )}

          {settlement.type === 'both_advance' && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <span className="text-lg sm:text-xl font-bold text-white">
                Advance Paid to Supplier:{' '}
                <span className="text-sky-400">{formatCurrency(Math.abs(overallDiff))}</span>
              </span>
            </div>
          )}

          {settlement.type === 'settled' && (
            <div className="flex items-center gap-2 pt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-lg sm:text-xl font-bold text-emerald-400">
                All food expenses are perfectly settled!
              </span>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            {settlement.message}
          </p>
        </div>

        {/* Right: Individual Status Pill boxes */}
        <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          {/* DSK Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 min-w-[125px]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-semibold text-emerald-400">{USERS.DSK.shortName} Status</span>
            </div>
            <div
              className={`text-sm font-bold ${
                dskBalance > 0
                  ? 'text-rose-400'
                  : dskBalance < 0
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }`}
            >
              {dskBalance > 0
                ? `Owes ${formatCurrency(dskBalance)}`
                : dskBalance < 0
                ? `+${formatCurrency(Math.abs(dskBalance))}`
                : 'Settled (0.00)'}
            </div>
          </div>

          {/* HSK Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 min-w-[125px]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className="font-semibold text-sky-400">{USERS.HSK.shortName} Status</span>
            </div>
            <div
              className={`text-sm font-bold ${
                hskBalance > 0
                  ? 'text-rose-400'
                  : hskBalance < 0
                  ? 'text-sky-400'
                  : 'text-slate-300'
              }`}
            >
              {hskBalance > 0
                ? `Owes ${formatCurrency(hskBalance)}`
                : hskBalance < 0
                ? `+${formatCurrency(Math.abs(hskBalance))}`
                : 'Settled (0.00)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
