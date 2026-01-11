
import React from 'react';
import { SummaryData } from '../types';

interface SummaryCardsProps {
  summary: SummaryData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-lg">
        <p className="text-indigo-100 text-sm font-medium">মোট ব্যালেন্স (৳)</p>
        <h2 className="text-3xl font-bold mt-1">৳ {summary.totalBalance.toLocaleString()}</h2>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-slate-400 text-xs">মোট আয় (৳)</p>
            <h2 className="text-xl font-bold text-emerald-400">৳ {summary.totalIncome.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/10 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <p className="text-slate-400 text-xs">এই মাসের ব্যয় (৳)</p>
            <h2 className="text-xl font-bold text-rose-400">৳ {summary.monthlyExpense.toLocaleString()}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
