
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
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
