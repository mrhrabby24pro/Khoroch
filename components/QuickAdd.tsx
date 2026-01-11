
import React from 'react';
import { QUICK_PRESETS } from '../constants';
import { Transaction } from '../types';
import { Card } from './Card';

interface QuickAddProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd }) => {
  return (
    <Card title="সহজ এন্ট্রি (এক ক্লিকে যোগ)">
      <div className="grid grid-cols-2 gap-3">
        {QUICK_PRESETS.map((preset, index) => (
          <button
            key={index}
            onClick={() => onAdd({
              amount: preset.amount,
              description: preset.description,
              category: preset.category,
              type: preset.type,
              date: new Date().toISOString().split('T')[0]
            })}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-indigo-500/50 transition-all active:scale-95 group text-center"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{preset.icon}</span>
            <span className="text-xs font-semibold text-slate-200">{preset.description}</span>
            <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${preset.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              ৳{preset.amount}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};
