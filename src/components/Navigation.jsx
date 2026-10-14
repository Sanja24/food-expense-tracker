import React from 'react';
import { LayoutDashboard, CalendarPlus, SlidersHorizontal } from 'lucide-react';

export function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tracker',
      label: 'Daily Tracker',
      icon: CalendarPlus,
      badge: 'Log',
    },
    {
      id: 'settings',
      label: 'Settings & Export',
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 sm:py-3 transition-all">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-1 truncate max-w-full">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-emerald-400 rounded-full animate-in zoom-in duration-200"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
