
export type TransactionType = 'income' | 'expense';
export type LiabilityType = 'remittance' | 'debt';
export type Currency = 'BDT' | 'MYR';

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  description: string;
  type: TransactionType;
  category: string;
  date: string;
}

export interface SummaryData {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyExpense: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

export interface QuickPreset {
  id: string;
  icon: string;
  amount: number;
  currency: Currency;
  description: string;
  category: string;
  type: TransactionType;
}

export interface Liability {
  id: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  type: LiabilityType;
}
