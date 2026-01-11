
import React, { useState } from 'react';
import { Goal } from '../types';
import { Card } from './Card';

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, onAddGoal, onUpdateAmount, onDeleteGoal }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    onAddGoal({ title, targetAmount: parseFloat(target) });
    setTitle('');
    setTarget('');
    setShowAdd(false);
  };

  return (
    <Card className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-200">আর্থিক লক্ষ্যমাত্রা</h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm transition-all active:scale-95"
        >
          {showAdd ? 'বন্ধ করুন' : '+ নতুন লক্ষ্য'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <input
            type="text"
            placeholder="লক্ষ্যের নাম (যেমন: ল্যাপটপ)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="টার্গেট অ্যামাউন্ট (৳)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm font-bold">যোগ করুন</button>
        </form>
      )}

      <div className="space-y-6">
        {goals.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-4">কোনো লক্ষ্য সেট করা নেই।</p>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            return (
              <div key={goal.id} className="group relative">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-medium text-slate-200">{goal.title}</h4>
                    <p className="text-xs text-slate-500">৳{goal.currentAmount.toLocaleString()} / ৳{goal.targetAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-400">{progress}%</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => onUpdateAmount(goal.id, 100)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded border border-slate-700 transition-colors"
                  >
                    +৳১০০
                  </button>
                  <button 
                    onClick={() => onUpdateAmount(goal.id, 500)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-[10px] py-1 rounded border border-slate-700 transition-colors"
                  >
                    +৳৫০০
                  </button>
                  <button 
                    onClick={() => {
                      const amount = parseFloat(prompt('কত টাকা যোগ করতে চান?', '0') || '0');
                      if (amount) onUpdateAmount(goal.id, amount);
                    }}
                    className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[10px] py-1 rounded border border-indigo-500/30 transition-colors"
                  >
                    অন্যান্য
                  </button>
                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
