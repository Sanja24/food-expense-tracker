import React, { useState, useRef } from 'react';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { parseCSV } from '../../utils/csvHelper';

export function DataExportImport({ onExport, onImport, recordsCount, showToast }) {
  const [importMode, setImportMode] = useState('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const { records: parsedRecords, errors } = parseCSV(text);

        if (errors && errors.length > 0) {
          console.warn('Import warnings:', errors);
        }

        onImport(parsedRecords, importMode);
        showToast({
          type: 'success',
          message: `Successfully imported ${parsedRecords.length} records (${importMode} mode)!`,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error('Import error:', err);
        showToast({
          type: 'error',
          message: err.message || 'Failed to parse CSV file. Please verify column formatting.',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      showToast({
        type: 'error',
        message: 'Failed reading the file from your disk.',
      });
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 shadow-lg backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <FileSpreadsheet className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Data Export & Import</h3>
          <p className="text-xs text-slate-400">
            Export LocalStorage data or import historical CSV records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Section */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Export to CSV</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {recordsCount} records stored
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your entire food tracking history as a spreadsheet-compatible CSV file.
            </p>
          </div>

          <button
            type="button"
            onClick={onExport}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV File</span>
          </button>
        </div>

        {/* Import Section */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Import Historical CSV</span>
              <span className="text-[10px] text-slate-500">Google Sheet / CSV</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a CSV file from Google Sheets or previous backups to restore or merge records.
            </p>

            {/* Mode Selector */}
            <div className="mt-2.5 flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <span>Merge</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-rose-500 focus:ring-rose-500"
                />
                <span>Replace All</span>
              </label>
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold text-xs border border-sky-500/30 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isProcessing ? 'Processing File...' : 'Choose CSV File to Import'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
