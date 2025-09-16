import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  building: string;
  category: string;
  chargedTo?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  type?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllExpenses(): Promise<Expense[]> {
  const response = await fetch(API_ENDPOINTS.EXPENSES, {
    method: 'GET',
    ...API_CONFIG
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch expenses: ${response.statusText}`);
  }

  return response.json();
}

export async function createExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
  const response = await fetch(API_ENDPOINTS.EXPENSES, {
    method: 'POST',
    ...API_CONFIG,
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to create expense: ${response.statusText}`);
  }

  return response.json();
}

export async function updateExpenseStatus(
  expenseId: string, 
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<Expense> {
  const updateData: any = { status };
  if (status === 'rejected' && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }

  const response = await fetch(`${API_ENDPOINTS.EXPENSE_BY_ID(expenseId)}/status`, {
    method: 'PUT',
    ...API_CONFIG,
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    throw new Error(`Failed to update expense status: ${response.statusText}`);
  }

  return response.json();
}