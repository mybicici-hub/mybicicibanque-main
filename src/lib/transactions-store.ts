export interface Transaction {
  id: string;
  label: string;
  date: string;
  amount: number;
  type: "in" | "out";
}

const STORAGE_KEY = "bicici_transactions";

const defaultTransactions: Transaction[] = [
  { id: "1", label: "Virement reçu — Konan A.", date: "Aujourd'hui, 10h24", amount: 50000, type: "in" },
  { id: "2", label: "Dividendes BRVM", date: "Hier, 14h10", amount: 215000, type: "in" },
  { id: "3", label: "Paiement Orange CI", date: "Hier, 18h02", amount: 12500, type: "out" },
];

export function getTransactions(): Transaction[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultTransactions;
}

export function addTransaction(transaction: Omit<Transaction, "id">): void {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}