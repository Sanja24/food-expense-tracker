import React from 'react';
import { DollarSign, FileText } from 'lucide-react';
import { USERS } from '../../utils/constants';

export function PaymentLogger({ dskPayment, hskPayment, notes, onDskChange, onHskChange, onNotesChange }) {
  return (
    <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-md backdrop-blur-sm space-y-3.5">
      <div className="flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Payments Logged Today (Optional)
        </h3>
      </div>
      <p className="text-xs text-slate-400 -mt-2">
        Record payments or cash settlements contributed by either person on this date
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* DSK Payment Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-emerald-400 flex items-center justify-between">
            <span>{USERS.DSK.shortName} Paid Amount</span>
            <span className="text-[10px] text-slate-500">LKR (Rs)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
              Rs
            </span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={dskPayment === 0 ? '' : dskPayment}
              onChange={(e) => onDskChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* HSK Payment Field */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-sky-400 flex items-center justify-between">
            <span>{USERS.HSK.shortName} Paid Amount</span>
            <span className="text-[10px] text-slate-500">LKR (Rs)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
              Rs
            </span>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={hskPayment === 0 ? '' : hskPayment}
              onChange={(e) => onHskChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Payment Notes */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Payment Notes / Memo</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Paid weekly mess bill, online transfer, groceries..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
}
