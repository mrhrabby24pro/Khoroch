
import React from 'react';
import { Goal, Liability, SummaryData } from '../types';
import { Card } from './Card';

interface AttainmentOverviewProps {
  summary: SummaryData;
  goals: Goal[];
  liabilities: Liability[];
}

export const AttainmentOverview: React.FC<AttainmentOverviewProps> = ({ summary, goals, liabilities }) => {
  // Goal Progress Calculation
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const goalProgress = totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0;

  // Debt Clearance Progress Calculation
  const totalDebtTarget = liabilities.reduce((sum, l) => sum + l.totalAmount, 0);
  const totalDebtPaid = liabilities.reduce((sum, l) => sum + l.paidAmount, 0);
  const debtProgress = totalDebtTarget > 0 ? Math.round((totalDebtPaid / totalDebtTarget) * 100) : 0;

  // Remaining Liability Percentage
  const remainingLiabilityProgress = totalDebtTarget > 0 ? 100 - debtProgress : 0;

  // Expense Ratio (Expense as % of Income)
  const expenseRatio = summary.totalIncome > 0 ? Math.min(Math.round((summary.totalExpense / summary.totalIncome) * 100), 100) : 0;

  // Savings Rate
  const savingsRate = summary.totalIncome > 0 ? Math.max(0, Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)) : 0;

  return (
    <Card className="mb-8 border-none bg-gradient-to-r from-slate-900 to-indigo-950 shadow-indigo-500/10">
      <h3 className="text-lg font-bold text-indigo-100 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        একনজরে আপনার আর্থিক অগ্রগতি
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Goals Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">সঞ্চয় লক্ষ্যমাত্রা</span>
            <span className="text-sm font-bold text-indigo-400">{goalProgress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-1000 ease-out"
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500">
            সঞ্চয়: ৳{totalGoalCurrent.toLocaleString()} / ৳{totalGoalTarget.toLocaleString()}
          </p>
        </div>

        {/* Debt Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ঋণ পরিশোধ অগ্রগতি</span>
            <span className="text-sm font-bold text-emerald-400">{debtProgress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-1000 ease-out"
              style={{ width: `${debtProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500">
            পরিশোধিত: ৳{totalDebtPaid.toLocaleString()} / ৳{totalDebtTarget.toLocaleString()}
          </p>
        </div>

        {/* Total Liability Burden */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">মোট দায় (বাকি অংশ)</span>
            <span className="text-sm font-bold text-rose-400">{remainingLiabilityProgress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 to-orange-500 transition-all duration-1000 ease-out"
              style={{ width: `${remainingLiabilityProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500">
            অবশিষ্ট দায়: ৳{(totalDebtTarget - totalDebtPaid).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/50 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase">সঞ্চয় হার</p>
          <p className={`text-lg font-bold ${savingsRate > 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {savingsRate}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase">মোট খরচ হার</p>
          <p className={`text-lg font-bold ${expenseRatio > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
            {expenseRatio}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase">গড় খরচ (মাসিক)</p>
          <p className="text-lg font-bold text-slate-200">
            ৳{summary.monthlyExpense.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase">বাজেট স্ট্যাটাস</p>
          <p className={`text-lg font-bold ${summary.totalBalance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.totalBalance > 0 ? 'উদ্বৃত্ত' : 'ঘাটতি'}
          </p>
        </div>
      </div>
    </Card>
  );
};
