
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, SummaryData, Goal, QuickPreset, Liability } from './types';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ChartSection } from './components/ChartSection';
import { QuickAdd } from './components/QuickAdd';
import { GoalsSection } from './components/GoalsSection';
import { LiabilitiesSection } from './components/LiabilitiesSection';
import { BackupSection } from './components/BackupSection';
import { QUICK_PRESETS as DEFAULT_PRESETS } from './constants';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('khata_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load transactions", e);
      return [];
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('khata_goals');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    try {
      const saved = localStorage.getItem('khata_liabilities');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [quickPresets, setQuickPresets] = useState<QuickPreset[]>(() => {
    try {
      const saved = localStorage.getItem('khata_presets');
      if (saved) return JSON.parse(saved);
      return DEFAULT_PRESETS.map(p => ({ ...p, id: crypto.randomUUID() }));
    } catch (e) {
      return DEFAULT_PRESETS.map(p => ({ ...p, id: crypto.randomUUID() }));
    }
  });

  useEffect(() => {
    localStorage.setItem('khata_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('khata_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('khata_liabilities', JSON.stringify(liabilities));
  }, [liabilities]);

  useEffect(() => {
    localStorage.setItem('khata_presets', JSON.stringify(quickPresets));
  }, [quickPresets]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm('আপনি কি এই লেনদেনটি মুছে ফেলতে চান?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const addGoal = (g: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = { ...g, id: crypto.randomUUID(), currentAmount: 0 };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
  };

  const deleteGoal = (id: string) => {
    if (window.confirm('আপনি কি এই লক্ষ্যটি মুছে ফেলতে চান?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const addLiability = (l: Omit<Liability, 'id' | 'paidAmount'>) => {
    const newL: Liability = { ...l, id: crypto.randomUUID(), paidAmount: 0 };
    setLiabilities(prev => [...prev, newL]);
  };

  const updateLiabilityAmount = (id: string, amount: number) => {
    setLiabilities(prev => prev.map(l => l.id === id ? { ...l, paidAmount: l.paidAmount + amount } : l));
  };

  const editLiability = (id: string, title: string, total: number) => {
    setLiabilities(prev => prev.map(l => l.id === id ? { ...l, title, totalAmount: total } : l));
  };

  const deleteLiability = (id: string) => {
    if (window.confirm('আপনি কি এই হিসাবটি মুছে ফেলতে চান?')) {
      setLiabilities(prev => prev.filter(l => l.id !== id));
    }
  };

  const summary = useMemo<SummaryData>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpense = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).reduce((sum, t) => sum + t.amount, 0);
    return { totalBalance: totalIncome - totalExpense, totalIncome, totalExpense, monthlyExpense };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-indigo-500/30">
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-30 py-4 px-6 shadow-md backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              রাব্বি হোসেনের হিসাব
            </h1>
          </div>
          <div className="text-slate-400 text-sm hidden sm:block">
            {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8 animate-in fade-in duration-700">
        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <TransactionForm onAdd={addTransaction} />
            <QuickAdd presets={quickPresets} onAdd={addTransaction} onUpdatePresets={setQuickPresets} />
            <BackupSection 
              transactions={transactions} 
              goals={goals} 
              liabilities={liabilities} 
            />
            <LiabilitiesSection 
              liabilities={liabilities} 
              onAdd={addLiability} 
              onUpdateAmount={updateLiabilityAmount} 
              onEdit={editLiability}
              onDelete={deleteLiability}
            />
            <GoalsSection goals={goals} onAddGoal={addGoal} onUpdateAmount={updateGoalAmount} onDeleteGoal={deleteGoal} />
            <ChartSection transactions={transactions} />
          </div>

          <div className="lg:col-span-7">
            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 lg:hidden">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-indigo-600 p-4 rounded-full shadow-2xl text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
