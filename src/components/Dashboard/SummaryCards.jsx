import React from 'react';
import { Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { USERS } from '../../utils/constants';

export function SummaryCards({ summary }) {
  const cards = [
    {
      title: `${USERS.DSK.shortName} Food Cost`,
      subtitle: `${USERS.DSK.name}`,
      amount: summary.totalDskCost,
      paidAmount: summary.totalDskPaid,
      balance: summary.dskBalance,
      icon: Users,
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      paidColor: 'text-emerald-300',
    },
    {
      title: `${USERS.HSK.shortName} Food Cost`,
      subtitle: `${USERS.HSK.name}`,
      amount: summary.totalHskCost,
      paidAmount: summary.totalHskPaid,
      balance: summary.hskBalance,
      icon: Users,
      accentColor: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
      paidColor: 'text-sky-300',
    },
    {
      title: 'Total Food Expenses',
      subtitle: 'Combined All Meals',
      amount: summary.totalCombinedExpenses,
      icon: Wallet,
      accentColor: 'text-violet-400',
      bgColor: 'bg-violet-500/10 border-violet-500/20',
      tag: 'Both Users',
    },
    {
      title: 'Total Payments Settled',
      subtitle: 'Paid to Date',
      amount: summary.totalPaymentsSettled,
      icon: DollarSign,
      accentColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      tag: 'Completed',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-3xl border transition-all duration-200 hover:border-slate-700 bg-slate-900/60 backdrop-blur-sm relative overflow-hidden`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.bgColor} border`}
              >
                <Icon className={`w-4 h-4 ${card.accentColor}`} />
              </div>
            </div>

            {/* Main amount */}
            <div className="text-2xl font-bold tracking-tight text-white mb-2">
              {formatCurrency(card.amount)}
            </div>

            {/* Sub details */}
            {card.paidAmount !== undefined ? (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  Paid: <strong className="text-slate-200">{formatCurrency(card.paidAmount)}</strong>
                </span>
                <span
                  className={`font-semibold ${
                    card.balance > 0
                      ? 'text-rose-400'
                      : card.balance < 0
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {card.balance > 0
                    ? `Due: ${formatCurrency(card.balance)}`
                    : card.balance < 0
                    ? `Adv: ${formatCurrency(Math.abs(card.balance))}`
                    : 'Balanced'}
                </span>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{card.subtitle}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-medium border border-slate-700/50">
                  {card.tag}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
