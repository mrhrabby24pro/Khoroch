
import React, { useState } from 'react';
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
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('khata_webhook') || '');

  const saveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('khata_webhook', url);
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Date,Description,Category,Amount,Currency,Amount(BDT)\n";
    
    transactions.forEach(t => {
      const bdtAmount = t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount;
      csvContent += `${t.type},${t.date},"${t.description}",${t.category},${t.amount},${t.currency},${bdtAmount}\n`;
    });

    csvContent += "\n\nFinancial Goals\nTitle,Target,Current,Progress\n";
    goals.forEach(g => {
      const progress = Math.round((g.currentAmount / g.targetAmount) * 100);
      csvContent += `"${g.title}",${g.targetAmount},${g.currentAmount},${progress}%\n`;
    });

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
          .header p { margin: 5px 0; color: #666; font-size: 14px; }
          .summary-grid { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
          .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 10px; text-align: center; }
          .summary-card h4 { margin: 0; color: #666; font-size: 12px; text-transform: uppercase; }
          .summary-card p { margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #333; }
          .section-title { background: #f8fafc; padding: 10px; border-left: 4px solid #6366f1; font-weight: bold; margin: 30px 0 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th { background: #6366f1; color: white; text-align: left; padding: 10px; }
          td { border-bottom: 1px solid #eee; padding: 10px; }
          .type-income { color: #10b981; font-weight: bold; }
          .type-expense { color: #f43f5e; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>রাব্বি হোসেনের আর্থিক হিসাব রিপোর্ট</h1>
          <p>তৈরির তারিখ: ${reportDate}</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card" style="border-top: 4px solid #6366f1">
            <h4>মোট ব্যালেন্স</h4>
            <p>৳ ${summary.totalBalance.toLocaleString()}</p>
          </div>
          <div class="summary-card" style="border-top: 4px solid #10b981">
            <h4>মোট আয়</h4>
            <p>৳ ${summary.totalIncome.toLocaleString()}</p>
          </div>
          <div class="summary-card" style="border-top: 4px solid #f43f5e">
            <h4>এই মাসের ব্যয়</h4>
            <p>৳ ${summary.monthlyExpense.toLocaleString()}</p>
          </div>
        </div>

        <div class="section-title">লেনদেনের বিস্তারিত তালিকা</div>
        <table>
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>বিবরণ</th>
              <th>ক্যাটাগরি</th>
              <th>আয়/ব্যয়</th>
              <th>মূল পরিমাণ</th>
              <th>টাকায় (BDT)</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(t => {
              const bdt = t.currency === 'MYR' ? t.amount * EXCHANGE_RATE : t.amount;
              return `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString('bn-BD')}</td>
                  <td>${t.description}</td>
                  <td>${t.category}</td>
                  <td class="${t.type === 'income' ? 'type-income' : 'type-expense'}">${t.type === 'income' ? 'আয়' : 'ব্যয়'}</td>
                  <td>${t.currency === 'MYR' ? 'RM ' : '৳ '}${t.amount.toLocaleString()}</td>
                  <td>৳ ${bdt.toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 40px;">
          <div>
            <div class="section-title">সঞ্চয় লক্ষ্যমাত্রা</div>
            <table>
              <thead>
                <tr>
                  <th>লক্ষ্য</th>
                  <th>টার্গেট</th>
                  <th>বর্তমান</th>
                  <th>অগ্রগতি</th>
                </tr>
              </thead>
              <tbody>
                ${goals.map(g => `
                  <tr>
                    <td>${g.title}</td>
                    <td>৳ ${g.targetAmount.toLocaleString()}</td>
                    <td>৳ ${g.currentAmount.toLocaleString()}</td>
                    <td>${Math.round((g.currentAmount / g.targetAmount) * 100)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div>
            <div class="section-title">ঋণ ও দেশে পাঠানো</div>
            <table>
              <thead>
                <tr>
                  <th>বিবরণ</th>
                  <th>মোট</th>
                  <th>পরিশোধিত</th>
                  <th>অবশিষ্ট</th>
                </tr>
              </thead>
              <tbody>
                ${liabilities.map(l => `
                  <tr>
                    <td>${l.title}</td>
                    <td>৳ ${l.totalAmount.toLocaleString()}</td>
                    <td>৳ ${l.paidAmount.toLocaleString()}</td>
                    <td>৳ ${(l.totalAmount - l.paidAmount).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="footer">
          <p>রাব্বি হোসেনের হিসাব অ্যাপ থেকে স্বয়ংক্রিয়ভাবে তৈরি।</p>
          <p>মুদ্রা বিনিময় হার: RM 1 = ৳ ${EXCHANGE_RATE}</p>
        </div>

        <script>
          window.onload = () => {
            window.print();
            // Optional: window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
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
        mode: 'no-cors',
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
        <h3 className="text-lg font-semibold text-slate-200">ব্যাকআপ ও রিপোর্ট</h3>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          আপনার সকল রেকর্ড গুগল শীটে বা পিডিএফ আকারে ডাউনলোড করার জন্য নিচের অপশনগুলো ব্যবহার করুন।
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl border border-slate-700 transition-all active:scale-95 text-[10px] sm:text-xs font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ডাউনলোড (CSV)
          </button>

          <button 
            onClick={generatePDFReport}
            className="flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 py-3 rounded-xl border border-rose-500/20 transition-all active:scale-95 text-[10px] sm:text-xs font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            পিডিএফ রিপোর্ট
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-950 px-2 text-[10px] text-slate-600 uppercase tracking-widest">গুগল শীট ক্লাউড সিঙ্ক</span>
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
            {syncStatus === 'syncing' ? 'পাঠানো হচ্ছে...' : syncStatus === 'success' ? 'সফল হয়েছে!' : syncStatus === 'error' ? 'ব্যর্থ হয়েছে' : 'সরাসরি ক্লাউড সিঙ্ক'}
          </button>
        </div>
      </div>
    </Card>
  );
};
