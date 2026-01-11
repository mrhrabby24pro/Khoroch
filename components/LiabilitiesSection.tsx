
import React, { useState } from 'react';
import { Liability, LiabilityType } from '../types';
import { Card } from './Card';

interface LiabilitiesSectionProps {
  liabilities: Liability[];
  onAdd: (l: Omit<Liability, 'id' | 'paidAmount'>) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onEdit: (id: string, title: string, total: number) => void;
  onDelete: (id: string) => void;
}

export const LiabilitiesSection: React.FC<LiabilitiesSectionProps> = ({ 
  liabilities, onAdd, onUpdateAmount, onEdit, onDelete 
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState<LiabilityType>('remittance');
  const [title, setTitle] = useState('');
  const [total, setTotal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !total) return;
    onAdd({ title, totalAmount: parseFloat(total), type });
    setTitle('');
    setTotal('');
    setShowAdd(false);
  };

  const handleEditPrompt = (l: Liability) => {
    const newTitle = prompt('নতুন নাম লিখুন:', l.title);
    const newTotal = prompt('নতুন টার্গেট এমাউন্ট লিখুন:', l.totalAmount.toString());
    if (newTitle && newTotal) {
      onEdit(l.id, newTitle, parseFloat(newTotal));
    }
  };

  return (
    <Card className="mt-8 border-l-4 border-l-amber-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">টাকা পাঠানো ও ঋণ</h3>
          <p className="text-[10px] text-slate-500">পরিবার ও ঋণের হিসাব এখানে রাখুন</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
        >
          {showAdd ? 'বন্ধ করুন' : '+ নতুন হিসাব'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 animate-in fade-in duration-300">
          <div className="flex gap-2 p-1 bg-slate-900 rounded-lg mb-2">
            <button 
              type="button" 
              onClick={() => setType('remittance')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded ${type === 'remittance' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >দেশে পাঠানো</button>
            <button 
              type="button" 
              onClick={() => setType('debt')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded ${type === 'debt' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
            >ঋণ পরিশোধ</button>
          </div>
          <input
            type="text"
            placeholder="বিবরণ (যেমন: বড় ভাই/ব্যাংক লোন)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="মোট পরিমাণ (৳)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm font-bold">সংরক্ষণ করুন</button>
        </form>
      )}

      <div className="space-y-6">
        {liabilities.length === 0 ? (
          <p className="text-center text-slate-500 text-xs py-4">এখনও কোনো হিসাব যোগ করা হয়নি।</p>
        ) : (
          liabilities.map((l) => {
            const progress = Math.min(Math.round((l.paidAmount / l.totalAmount) * 100), 100);
            return (
              <div key={l.id} className="group p-3 bg-slate-800/20 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${l.type === 'remittance' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {l.type === 'remittance' ? 'দেশে পাঠানো' : 'ঋণ পরিশোধ'}
                    </span>
                    <h4 className="font-medium text-slate-200 mt-1">{l.title}</h4>
                    <p className="text-[10px] text-slate-500">বাকি: ৳{(l.totalAmount - l.paidAmount).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditPrompt(l)} className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => onDelete(l.id)} className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full transition-all duration-700 ${l.type === 'remittance' ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400">
                    ৳{l.paidAmount.toLocaleString()} / ৳{l.totalAmount.toLocaleString()}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => onUpdateAmount(l.id, 500)}
                      className="bg-slate-800 hover:bg-slate-700 text-[9px] px-2 py-1 rounded border border-slate-700"
                    >+৳৫০০</button>
                    <button 
                      onClick={() => {
                        const amt = prompt('কত টাকা যোগ করতে চান?');
                        if (amt) onUpdateAmount(l.id, parseFloat(amt));
                      }}
                      className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-[9px] px-2 py-1 rounded border border-indigo-500/30"
                    >কাস্টম</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
