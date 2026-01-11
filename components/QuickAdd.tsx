
import React, { useState } from 'react';
import { QuickPreset, Transaction, Currency } from '../types';
import { Card } from './Card';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants';

interface QuickAddProps {
  presets: QuickPreset[];
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdatePresets: (presets: QuickPreset[]) => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ presets, onAdd, onUpdatePresets }) => {
  const [isManaging, setIsManaging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Local form state for editing/adding
  const [form, setForm] = useState<Omit<QuickPreset, 'id'>>({
    icon: '💰',
    amount: 0,
    currency: 'BDT',
    description: '',
    category: EXPENSE_CATEGORIES[0],
    type: 'expense'
  });

  const handleEdit = (preset: QuickPreset) => {
    setEditingId(preset.id);
    setForm({ ...preset });
  };

  const handleSave = () => {
    if (!form.description || form.amount <= 0) return;
    
    if (editingId) {
      onUpdatePresets(presets.map(p => p.id === editingId ? { ...form, id: editingId } : p));
    } else {
      onUpdatePresets([...presets, { ...form, id: crypto.randomUUID() }]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    onUpdatePresets(presets.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      icon: '💰',
      amount: 0,
      currency: 'BDT',
      description: '',
      category: EXPENSE_CATEGORIES[0],
      type: 'expense'
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">সহজ এন্ট্রি (এক ক্লিকে যোগ)</h3>
        <button 
          onClick={() => {
            setIsManaging(!isManaging);
            resetForm();
          }}
          className={`p-2 rounded-lg transition-colors ${isManaging ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="এডিট মুড"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {isManaging ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <input 
                type="text" 
                value={form.icon} 
                onChange={e => setForm({...form, icon: e.target.value})}
                placeholder="ইমোজি"
                className="bg-slate-800 border border-slate-700 rounded p-2 text-center"
              />
              <input 
                type="text" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="নাম"
                className="col-span-3 bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="number" 
                value={form.amount || ''} 
                onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})}
                placeholder="টাকা"
                className="bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
              />
              <select 
                value={form.currency} 
                onChange={e => setForm({...form, currency: e.target.value as Currency})}
                className="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
              >
                <option value="BDT">৳ BDT</option>
                <option value="MYR">RM MYR</option>
              </select>
              <select 
                value={form.type} 
                onChange={e => {
                  const newType = e.target.value as any;
                  setForm({...form, type: newType, category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]});
                }}
                className="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-white"
              >
                <option value="expense">ব্যয়</option>
                <option value="income">আয়</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-xs font-bold transition-all text-white">
                {editingId ? 'আপডেট করুন' : 'নতুন যোগ করুন'}
              </button>
              {editingId && (
                <button onClick={resetForm} className="bg-slate-700 px-4 py-2 rounded text-xs text-white">বাতিল</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {presets.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-slate-800/30 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{p.description}</p>
                    <p className={`text-[10px] ${p.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.currency === 'MYR' ? 'RM ' : '৳ '}{p.amount}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
          {presets.length === 0 ? (
            <p className="col-span-2 text-center text-slate-500 text-xs py-4">কোনো এন্ট্রি নেই। সেটিংস আইকনে ক্লিক করে যোগ করুন।</p>
          ) : (
            presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onAdd({
                  amount: preset.amount,
                  currency: preset.currency,
                  description: preset.description,
                  category: preset.category,
                  type: preset.type,
                  date: new Date().toISOString().split('T')[0]
                })}
                className="flex flex-col items-center justify-center p-3 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-indigo-500/50 transition-all active:scale-95 group text-center"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{preset.icon}</span>
                <span className="text-xs font-semibold text-slate-200 line-clamp-1">{preset.description}</span>
                <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full ${preset.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {preset.currency === 'MYR' ? 'RM ' : '৳ '}{preset.amount}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </Card>
  );
};
