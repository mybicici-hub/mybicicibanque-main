import { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: string;
  label: string;
  date: string;
  amount: number;
  type: "in" | "out";
}

const initialTransactions: Transaction[] = [
  { id: "1", label: "Virement reçu — Konan A.", date: "Aujourd'hui, 10h24", amount: 50000, type: "in" },
  { id: "2", label: "Dividendes BRVM", date: "Hier, 14h10", amount: 215000, type: "in" },
  { id: "3", label: "Paiement Orange CI", date: "Hier, 18h02", amount: 12500, type: "out" },
  { id: "4", label: "Recharge mobile", date: "23 mai", amount: 5000, type: "out" },
  { id: "5", label: "Salaire — Entreprise SARL", date: "1 mai", amount: 450000, type: "in" },
];

const TransactionsContext = createContext<any>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions doit être utilisé dans TransactionsProvider");
  }
  return context;
}