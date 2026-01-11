import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Transaction, Goal, Liability, SummaryData } from '../types';
import { Card } from './Card';
import { EXCHANGE_RATE } from '../constants';

interface BackupSectionProps {
  transactions: Transaction[];
  goals: Goal[];
  liabilities: Liability[];
  summary: SummaryData;
}

export const BackupSection: React.FC<BackupSectionProps> = ({ transactions, goals, liabilities, summary }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error' | 'image-generating' | 'report-generating'>('idle');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('khata_webhook') || '');
  
  // Date filter state
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const saveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('khata_webhook', url);
  };

  const generateImage = async () => {
    const element = document.getElementById('capture-area');
    const transactionList = document.querySelector('.max-h-\\[700px\\]');
    
    if (!element) return;
    setSyncStatus('image-generating');
    
    const originalMaxHeight = transactionList ? (transactionList as HTMLElement).style.maxHeight : '';
    const originalOverflow = transactionList ? (transactionList as HTMLElement).style.overflow : '';
    
    if (transactionList) {
      (transactionList as HTMLElement).style.maxHeight = 'none';
      (transactionList as HTMLElement).style.overflow = 'visible';
    }

    try {
      const captureTarget = document.querySelector('main') || element;
      const canvas = await html2canvas(captureTarget as HTMLElement, {
        backgroundColor: '#020617',
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: 1200,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `rabbi_hossain_full_report_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
      setSyncStatus('idle');
    } catch (err) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      if (transactionList) {
        (transactionList as HTMLElement).style.maxHeight = originalMaxHeight;
        (transactionList as HTMLElement).style.overflow = originalOverflow;
      }
    }
  };

  const generateFilteredReportImage = async () => {
    setSyncStatus('report-generating');
    
    const filteredTransactions = transactions.filter(t => {
      const d = t.date;
      return d >= startDate && d <= endDate;
    });

    const periodIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount), 0);
    
    const periodExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount), 0);

    // Create a temporary element for rendering the report
    const reportDiv = document.createElement('div');
    reportDiv.style.position = 'absolute';
    reportDiv.style.left = '-9999px';
    reportDiv.style.width = '800px';
    reportDiv.style.padding = '40px';
    reportDiv.style.backgroundColor = '#020617';
    reportDiv.style.color = '#f8fafc';
    reportDiv.style.fontFamily = "'Hind Siliguri', sans-serif";

    reportDiv.innerHTML = `
      <div style="border: 2px solid #334155; border-radius: 20px; overflow: hidden; background: #0f172a;">
        <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: white;">আর্থিক লেনদেন রিপোর্ট</h1>
          <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 14px;">
            সময়সীমা: ${new Date(startDate).toLocaleDateString('bn-BD')} হতে ${new Date(endDate).toLocaleDateString('bn-BD')} পর্যন্ত
          </p>
        </div>
        
        <div style="display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; padding: 25px; border-bottom: 1px solid #1e293b;">
          <div style="background: #1e293b; padding: 15px; border-radius: 12px; text-align: center;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">মোট আয়</div>
            <div style="font-size: 20px; font-weight: bold; color: #10b981; margin-top: 5px;">৳ ${periodIncome.toLocaleString()}</div>
          </div>
          <div style="background: #1e293b; padding: 15px; border-radius: 12px; text-align: center;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">মোট ব্যয়</div>
            <div style="font-size: 20px; font-weight: bold; color: #f43f5e; margin-top: 5px;">৳ ${periodExpense.toLocaleString()}</div>
          </div>
          <div style="background: #1e293b; padding: 15px; border-radius: 12px; text-align: center;">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">নেট ব্যালেন্স</div>
            <div style="font-size: 20px; font-weight: bold; color: #6366f1; margin-top: 5px;">৳ ${(periodIncome - periodExpense).toLocaleString()}</div>
          </div>
        </div>

        <div style="padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #cbd5e1; border-left: 4px solid #6366f1; padding-left: 10px;">লেনদেনের তালিকা</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #1e293b;">
              <tr>
                <th style="padding: 12px; text-align: left; color: #94a3b8; font-size: 12px; border-bottom: 1px solid #334155;">তারিখ</th>
                <th style="padding: 12px; text-align: left; color: #94a3b8; font-size: 12px; border-bottom: 1px solid #334155;">বিবরণ</th>
                <th style="padding: 12px; text-align: right; color: #94a3b8; font-size: 12px; border-bottom: 1px solid #334155;">পরিমাণ (BDT)</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr style="border-bottom: 1px solid #1e293b;">
                  <td style="padding: 12px; font-size: 12px; color: #cbd5e1;">${new Date(t.date).toLocaleDateString('bn-BD')}</td>
                  <td style="padding: 12px; font-size: 12px; color: #cbd5e1;">${t.description}</td>
                  <td style="padding: 12px; font-size: 12px; text-align: right; font-weight: bold; color: ${t.type === 'income' ? '#10b981' : '#f43f5e'}">
                    ${t.type === 'income' ? '+' : '-'} ৳ ${(t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount).toLocaleString()}
                  </td>
                </tr>
              `).join('')}
              ${filteredTransactions.length === 0 ? '<tr><td colspan="3" style="padding: 30px; text-align: center; color: #64748b;">এই সময়ের কোনো তথ্য পাওয়া যায়নি।</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        <div style="padding: 20px; text-align: center; font-size: 10px; color: #475569; border-top: 1px solid #1e293b;">
          রাব্বি হোসেনের হিসাব অ্যাপ থেকে জেনারেট করা হয়েছে | বিনিময় হার: RM 1 = ৳ ${EXCHANGE_RATE}
        </div>
      </div>
    `;

    document.body.appendChild(reportDiv);

    try {
      const canvas = await html2canvas(reportDiv, {
        backgroundColor: '#020617',
        scale: 3,
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `rabbi_hossain_report_${startDate}_to_${endDate}.png`;
      link.click();
      setSyncStatus('idle');
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    } finally {
      document.body.removeChild(reportDiv);
    }
  };

  const generatePDFReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportDate = new Date().toLocaleDateString('bn-BD', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>রাব্বি হোসেনের হিসাব রিপোর্ট</title>
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Hind Siliguri', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #6366f1; margin: 0; }
          .summary-grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
          .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 10px; text-align: center; }
          .summary-card p { margin: 5px 0 0; font-size: 20px; font-weight: bold; }
          .section-title { background: #f8fafc; padding: 10px; border-left: 4px solid #6366f1; font-weight: bold; margin: 30px 0 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th { background: #6366f1; color: white; text-align: left; padding: 10px; }
          td { border-bottom: 1px solid #eee; padding: 10px; }
          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>রাব্বি হোসেনের আর্থিক হিসাব রিপোর্ট</h1>
          <p>তৈরির তারিখ: ${reportDate}</p>
        </div>
        <div class="summary-grid">
          <div class="summary-card"><h4>মোট ব্যালেন্স</h4><p>৳ ${summary.totalBalance.toLocaleString()}</p></div>
          <div class="summary-card"><h4>মোট আয়</h4><p>৳ ${summary.totalIncome.toLocaleString()}</p></div>
          <div class="summary-card"><h4>এই মাসের ব্যয়</h4><p>৳ ${summary.monthlyExpense.toLocaleString()}</p></div>
        </div>
        <div class="section-title">লেনদেনের তালিকা</div>
        <table>
          <thead><tr><th>তারিখ</th><th>বিবরণ</th><th>ক্যাটাগরি</th><th>পরিমাণ (BDT)</th></tr></thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString('bn-BD')}</td>
                <td>${t.description}</td>
                <td>${t.category}</td>
                <td style="color: ${t.type === 'income' ? '#10b981' : '#f43f5e'}">৳ ${(t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer"><p>রাব্বি হোসেনের হিসাব অ্যাপ থেকে তৈরি। বিনিময় হার: RM 1 = ৳ ${EXCHANGE_RATE}</p></div>
        <script>window.onload = () => { window.print(); };</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Fix: Implemented the missing exportToCSV function
  const exportToCSV = () => {
    const headers = ['তারিখ', 'বিবরণ', 'ক্যাটাগরি', 'টাইপ', 'পরিমাণ', 'মুদ্রা', 'পরিমাণ (BDT)'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type === 'income' ? 'আয়' : 'ব্যয়',
      t.amount,
      t.currency,
      t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rabbi_hossain_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const syncToCloud = async () => {
    if (!webhookUrl) return alert('গুগল অ্যাপস স্ক্রিপ্ট URL দিন।');
    setSyncStatus('syncing');
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ timestamp: new Date(), transactions, goals, liabilities })
      });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
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
        <h3 className="text-lg font-semibold text-slate-200">ব্যাকআপ ও রিপোর্ট</h3>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          আপনার সকল রেকর্ড হাই-কোয়ালিটি ছবি বা পিডিএফ আকারে ডাউনলোড করুন।
        </p>

        {/* Full Snapshots */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={generateImage}
            disabled={syncStatus === 'image-generating' || syncStatus === 'report-generating'}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all active:scale-95 text-[10px] sm:text-xs font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            {syncStatus === 'image-generating' ? 'তৈরি হচ্ছে...' : 'ফুল ড্যাশবোর্ড ছবি'}
          </button>

          <button 
            onClick={generatePDFReport}
            className="flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 py-3 rounded-xl border border-rose-500/20 transition-all active:scale-95 text-[10px] sm:text-xs font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            পিডিএফ রিপোর্ট
          </button>
        </div>

        {/* Date Range Report */}
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="text-xs font-bold text-slate-300">নির্দিষ্ট সময়ের ছবি ডাউনলোড</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">শুরু</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2 text-[10px] text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">শেষ</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2 text-[10px] text-white outline-none"
              />
            </div>
          </div>
          <button 
            onClick={generateFilteredReportImage}
            disabled={syncStatus === 'report-generating' || syncStatus === 'image-generating'}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {syncStatus === 'report-generating' ? 'তৈরি হচ্ছে...' : 'সময় অনুযায়ী রিপোর্ট (Image)'}
          </button>
        </div>

        <button 
          onClick={exportToCSV}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400 py-2 rounded-xl border border-slate-700 transition-all text-[10px] font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          ডেটা এক্সপোর্ট (CSV)
        </button>

        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-950 px-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">Cloud Sync</span>
          </div>
        </div>

        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="গুগল অ্যাপস স্ক্রিপ্ট URL"
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
            {syncStatus === 'syncing' ? 'সিঙ্ক হচ্ছে...' : syncStatus === 'success' ? 'সফল!' : syncStatus === 'error' ? 'ব্যর্থ' : 'ক্লাউড সিঙ্ক করুন'}
          </button>
        </div>
      </div>
    </Card>
  );
};