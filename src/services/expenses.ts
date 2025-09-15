import { supabase } from "@/integrations/supabase/client";

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  building: string;
  category: string;
  charged_to?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  type?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export async function getAllExpenses() {
  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch expenses: ${error.message}`);
  }

  return expenses;
}

export async function createExpense(data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) {
  const { data: expense, error } = await supabase
    .from('expenses')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create expense: ${error.message}`);
  }

  return expense;
}

export async function updateExpenseStatus(
  expenseId: string, 
  status: 'approved' | 'rejected',
  rejectionReason?: string
) {
  const updateData: any = { status };
  if (status === 'rejected' && rejectionReason) {
    updateData.rejection_reason = rejectionReason;
  }

  const { data: expense, error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', expenseId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update expense status: ${error.message}`);
  }

  return expense;
}