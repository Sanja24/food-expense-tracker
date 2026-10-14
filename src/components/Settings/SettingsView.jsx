import React, { useState } from 'react';
import { RateConfig } from './RateConfig';
import { DataExportImport } from './DataExportImport';
import { Sparkles, Trash2, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import { Modal } from '../UI/Modal';

export function SettingsView({
  rates,
  onUpdateRates,
  onResetRates,
  records,
  onExport,
  onImport,
  onSeedData,
  onClearData,
  showToast,
}) {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);

  const handleConfirmClear = () => {
    onClearData();
    setShowClearModal(false);
    showToast({
      type: 'info',
      message: 'All daily records cleared from LocalStorage.',
    });
  };

  const handleConfirmSeed = () => {
    onSeedData();
    setShowSeedModal(false);
    showToast({
      type: 'success',
      message: 'Historical Google Sheet data loaded successfully!',
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Rate Configuration Card */}
      <RateConfig
        rates={rates}
        onUpdateRates={onUpdateRates}
        onResetRates={onResetRates}
        showToast={showToast}
      />

      {/* CSV Export & Import */}
      <DataExportImport
        onExport={onExport}
        onImport={onImport}
        recordsCount={records.length}
        showToast={showToast}
      />

      {/* Preset & Reset Management Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 shadow-lg backdrop-blur-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Database & Preset Management</h3>
          <p className="text-xs text-slate-400">
            Pre-load official Google Sheet records or reset your local environment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Seed Data Button */}
          <button
            type="button"
            onClick={() => setShowSeedModal(true)}
            className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-left transition flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Load Google Sheet Data</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Load September & October 2026 data (Rs 17,950 total expenses)
              </div>
            </div>
          </button>

          {/* Clear Data Button */}
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-left transition flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Clear All Local Records</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Wipe all daily food tracking records from this browser
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Google Sheet Reference Link */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span>Linked Google Spreadsheet</span>
        </div>
        <a
          href="https://docs.google.com/spreadsheets/d/1X1uqgoVtgnia4sPfgL8M9wkt8M4wTWVP5lL-_J5SafA/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
        >
          <span>Open Sheet</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Confirm Seed Modal */}
      <Modal
        isOpen={showSeedModal}
        onClose={() => setShowSeedModal(false)}
        title="Load Historical Google Sheet Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            This will populate your LocalStorage with the exact historical food records from the shared Google Sheet:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
            <li>September 2026: Rs 7,600 expenses, Rs 7,000 paid</li>
            <li>October 2026: Rs 10,350 expenses, Rs 11,000 paid</li>
            <li>Combined Food: Rs 17,950 settled against Rs 18,000 total</li>
          </ul>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowSeedModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSeed}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            >
              Load Data Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Clear Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Wipe LocalStorage Records?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>
              This will remove all logged daily records from your browser. Be sure to export a CSV backup first if needed.
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowClearModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClear}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white"
            >
              Yes, Clear Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
