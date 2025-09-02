import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  user: string;
  building: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  type: "one-time" | "recurring";
  category: string;
  chargedTo?: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  addExpense: (expense: Expense) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

const mockExpenses: Expense[] = [
  {
    id: "1",
    name: "Office supplies and equipment",
    amount: 1250,
    user: "John Doe",
    building: "Abdalian Office",
    date: "2024-01-15",
    status: "approved",
    type: "one-time",
    category: "Supplies"
  },
  {
    id: "2", 
    name: "Monthly software licenses",
    amount: 2400,
    user: "Jane Smith",
    building: "Etihad Office",
    date: "2024-01-14",
    status: "pending",
    type: "recurring",
    category: "Software"
  },
  {
    id: "3",
    name: "Team building event",
    amount: 800,
    user: "Mike Johnson",
    building: "Etihad Office",
    date: "2024-01-13",
    status: "approved",
    type: "one-time",
    category: "Events"
  },
  {
    id: "4",
    name: "Marketing campaign budget",
    amount: 5000,
    user: "Sarah Williams",
    building: "Abdalian Office",
    date: "2024-01-12",
    status: "pending",
    type: "one-time",
    category: "Campaigns"
  },
  {
    id: "5",
    name: "Travel expenses - client meeting",
    amount: 650,
    user: "Tom Brown",
    building: "Etihad Office",
    date: "2024-01-11",
    status: "rejected",
    type: "one-time",
    category: "Travel"
  },
  {
    id: "6", 
    name: "chips",
    amount: 50,
    user: "Zainab",
    building: "Etihad Office",
    date: "2024-01-14",
    status: "pending",
    type: "recurring",
    category: "Food"
  }
];

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses, addExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};