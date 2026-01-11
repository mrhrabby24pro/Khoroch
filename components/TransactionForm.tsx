
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';
import { Card } from './Card';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      type,
      category,
      date
    });

    setAmount('');
    setDescription('');
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  return (
    <Card title="নতুন এন্ট্রি যোগ করুন">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex p-1 bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === 'income' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            আয়
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === 'expense' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ব্যয়
          </button>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">টাকার পরিমাণ (৳)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">ক্যাটাগরি</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
          >
            {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">বিবরণ</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            placeholder="কী বাবদ খরচ বা আয়?"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">তারিখ</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 outline-none text-white text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 ${
            type === 'income' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          হিসাব সংরক্ষণ করুন
        </button>
      </form>
    </Card>
  );
};
