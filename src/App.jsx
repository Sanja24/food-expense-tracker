import React, { useState } from 'react';
import { useExpenseTracker } from './hooks/useExpenseTracker';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/Dashboard/DashboardView';
import { DailyTrackerView } from './components/DailyTracker/DailyTrackerView';
import { SettingsView } from './components/Settings/SettingsView';
import { Toast } from './components/UI/Toast';
import { Modal } from './components/UI/Modal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [showSeedModal, setShowSeedModal] = useState(false);

  const tracker = useExpenseTracker();

  const showToast = ({ type = 'info', message }) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const handleSeedConfirm = () => {
    tracker.seedHistoricalData();
    setShowSeedModal(false);
    showToast({
      type: 'success',
      message: 'Historical records from Google Sheet loaded successfully!',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Header */}
      <Header onSeedClick={() => setShowSeedModal(true)} />

      {/* Main Content Area (padding-bottom accounts for fixed bottom nav) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 pb-28">
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={tracker.summary}
            monthlySummary={tracker.monthlySummary}
            rates={tracker.rates}
            records={tracker.records}
            onNavigateToTracker={() => setActiveTab('tracker')}
          />
        )}

        {activeTab === 'tracker' && (
          <DailyTrackerView
            rates={tracker.rates}
            records={tracker.records}
            getRecordForDate={tracker.getRecordForDate}
            onSaveRecord={tracker.saveDailyRecord}
            onDeleteRecord={tracker.deleteDailyRecord}
            showToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            rates={tracker.rates}
            onUpdateRates={tracker.updateRates}
            onResetRates={tracker.resetRates}
            records={tracker.records}
            onExport={tracker.exportToCSV}
            onImport={tracker.importRecords}
            onSeedData={tracker.seedHistoricalData}
            onClearData={tracker.clearAllData}
            showToast={showToast}
          />
        )}
      </main>

      {/* Bottom Mobile-First Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Seed Data Modal Triggered from Header */}
      <Modal
        isOpen={showSeedModal}
        onClose={() => setShowSeedModal(false)}
        title="Sync Google Sheet Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Would you like to populate your LocalStorage with the historical food expense records for <strong>Dineth Sandeepa (DSK)</strong> and <strong>Heshan Sanjeewa (HSK)</strong> from September & October 2026?
          </p>
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>September 2026:</span>
              <span className="font-mono text-emerald-400">Rs 7,600.00</span>
            </div>
            <div className="flex justify-between">
              <span>October 2026:</span>
              <span className="font-mono text-emerald-400">Rs 10,350.00</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 font-semibold text-white">
              <span>Total Food Expenses:</span>
              <span className="font-mono text-emerald-400">Rs 17,950.00</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowSeedModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSeedConfirm}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
            >
              Load Data Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
