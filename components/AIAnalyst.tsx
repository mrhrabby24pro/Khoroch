
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Transaction, SummaryData, Goal, Liability } from '../types';
import { Card } from './Card';

interface AIAnalystProps {
  transactions: Transaction[];
  summary: SummaryData;
  goals: Goal[];
  liabilities: Liability[];
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({ transactions, summary, goals, liabilities }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const context = {
        summary,
        liabilities,
        goals,
        recentTransactions: transactions.slice(0, 15).map(t => ({
          desc: t.description,
          amt: t.amount,
          type: t.type,
          cat: t.category,
          date: t.date
        }))
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following financial data for "Rabbi Hossain". 
        Data: ${JSON.stringify(context)}
        
        Requirements:
        1. Provide a concise summary of his current financial health in Bengali.
        2. Identify any concerning spending patterns based on the categories provided.
        3. Give 3 actionable tips in Bengali specifically on "How to increase savings" (সঞ্চয় বাড়ানোর উপায়) and "How to clear debt faster" (ঋণ কমানোর উপায়) based on his balance.
        4. Mention if he is close to any of his goals or if he is overspending this month.
        5. Maintain a supportive and professional tone. Use Markdown for formatting (bolding important figures).`,
      });

      setAnalysis(response.text || "দুঃখিত, কোনো বিশ্লেষণ পাওয়া যায়নি।");
    } catch (err) {
      console.error(err);
      setError("এআই বিশ্লেষণ তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-violet-500 bg-gradient-to-br from-slate-900 to-indigo-950/20 shadow-xl shadow-violet-900/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-violet-500/20 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-200">এআই আর্থিক এনালিস্ট</h3>
      </div>

      <p className="text-sm text-slate-400 mb-6">
        আপনার আয়-ব্যয় বিশ্লেষণ করে সঞ্চয় বাড়ানোর স্মার্ট পরামর্শ পান।
      </p>

      {!analysis && !loading && (
        <button
          onClick={generateAnalysis}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          পরামর্শ জেনারেট করুন
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-violet-400 font-medium animate-pulse">আপনার ডাটা বিশ্লেষণ করা হচ্ছে...</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl prose-custom text-slate-200 shadow-inner overflow-hidden">
            <div className="whitespace-pre-wrap leading-relaxed">
              {analysis}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setAnalysis(null)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              আবার এনালাইসিস করুন
            </button>
            <span className="text-[10px] text-slate-600 italic">Powered by Gemini AI</span>
          </div>
        </div>
      )}
    </Card>
  );
};
