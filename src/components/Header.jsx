import React from 'react';
import { Utensils, Database, Sparkles } from 'lucide-react';
import { USERS } from '../utils/constants';

export function Header({ onSeedClick }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Food Expense Tracker
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-3 h-3" /> LocalStorage
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                {USERS.DSK.shortName}
              </span>
              <span>&</span>
              <span className="flex items-center gap-1 font-medium text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                {USERS.HSK.shortName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 hidden xs:inline">Monthly Breakdown & Settlement</span>
            </div>
          </div>
        </div>

        {onSeedClick && (
          <button
            onClick={onSeedClick}
            title="Load Historical Google Sheet Data"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sheet Data</span>
          </button>
        )}
      </div>
    </header>
  );
}
