import { LedgerView } from "@/components/LedgerView";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency } from "@/lib/currency";

interface LedgerPageProps {
  currentUser?: { role: string; name: string };
}

export default function LedgerPage({ currentUser }: LedgerPageProps = {}) {
  const navigate = useNavigate();
  const { expenses } = useExpenses();

  const handleNavigateToExpenses = (department: string) => {
    navigate(`/expenses?department=${department}`);
  };

  // Calculate analytics data
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingApprovals = expenses.filter(exp => exp.status === "pending").length;
  const todaySubmissions = expenses.filter(exp => {
    const today = new Date();
    const expDate = new Date(exp.date);
    return expDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="flex-1 p-4 md:p-6 pt-6">
      {/* Ledger View Component */}
      <LedgerView onNavigateToExpenses={handleNavigateToExpenses} currentUser={currentUser} />
    </div>
  );}