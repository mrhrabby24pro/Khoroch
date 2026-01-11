
import React, { useState } from 'react';
import { Transaction, Goal, Liability } from '../types';
import { Card } from './Card';

interface BackupSectionProps {
  transactions: Transaction[];
  goals: Goal[];
  liabilities: Liability[];
}

export const BackupSection: React.FC<BackupSectionProps> = ({ transactions, goals, liabilities }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('khata_webhook') || '');

  const saveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('khata_webhook', url);
  };

  const exportToCSV = () => {
    // Header for Transactions
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Date,Description,Category,Amount\n";
    
    transactions.forEach(t => {
      csvContent += `${t.type},${t.date},"${t.description}",${t.category},${t.amount}\n`;
    });

    // Add empty lines and Goals
    csvContent += "\n\nFinancial Goals\nTitle,Target,Current,Progress\n";
    goals.forEach(g => {
      const progress = Math.round((g.currentAmount / g.targetAmount) * 100);
      csvContent += `"${g.title}",${g.targetAmount},${g.currentAmount},${progress}%\n`;
    });

    // Add Liabilities
    csvContent += "\n\nLiabilities (Remittance/Debt)\nType,Title,Total,Paid,Remaining\n";
    liabilities.forEach(l => {
      csvContent += `${l.type},"${l.title}",${l.totalAmount},${l.paidAmount},${l.totalAmount - l.paidAmount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rabbi_hossain_hisab_backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const syncToCloud = async () => {
    if (!webhookUrl) {
      alert('দয়া করে আগে গুগল অ্যাপস স্ক্রিপ্ট URL প্রদান করুন।');
      return;
    }

    setSyncStatus('syncing');
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        transactions,
        goals,
        liabilities
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Common for Google Apps Script Webhooks
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <Card className="mt-8 border-l-4 border-l-emerald-500 bg-emerald-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-200">ব্যাকআপ ও গুগল শীট</h3>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          আপনার সকল রেকর্ড গুগল শীটে রাখার জন্য নিচের অপশনগুলো ব্যবহার করুন।
        </p>

        <button 
          onClick={exportToCSV}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all active:scale-95 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          শীটে নেয়ার জন্য ডাউনলোড করুন (CSV)
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-950 px-2 text-[10px] text-slate-600 uppercase tracking-widest">অথবা সরাসরি সিঙ্ক</span>
          </div>
        </div>

        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="গুগল অ্যাপস স্ক্রিপ্ট URL দিন"
            value={webhookUrl}
            onChange={(e) => saveWebhook(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-[10px] text-slate-300 outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            onClick={syncToCloud}
            disabled={syncStatus === 'syncing'}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm shadow-lg
              ${syncStatus === 'syncing' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
                syncStatus === 'success' ? 'bg-emerald-600 text-white' : 
                syncStatus === 'error' ? 'bg-rose-600 text-white' : 
                'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'}
            `}
          >
            {syncStatus === 'syncing' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                পাঠানো হচ্ছে...
              </span>
            ) : syncStatus === 'success' ? (
              'সফলভাবে পাঠানো হয়েছে!'
            ) : syncStatus === 'error' ? (
              'ব্যর্থ হয়েছে, আবার চেষ্টা করুন'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                সরাসরি ক্লাউড সিঙ্ক
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};
