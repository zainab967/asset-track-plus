import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, AlertCircle, TrendingUp, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { PKRIcon } from "@/components/ui/pkr-icon";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

interface BuildingSummary {
  name: string;
  balance: number;
}

interface LedgerViewProps {
  onNavigateToExpenses: (building: string) => void;
  currentUser?: { role: string; name: string };
}

export function LedgerView({ onNavigateToExpenses, currentUser }: LedgerViewProps) {
  const { expenses } = useExpenses();
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate data for charts only

  // Calculate dynamic building summaries based on actual expense data
  const calculateBuildingSummary = (buildingName: string): BuildingSummary => {
    const buildingExpenses = expenses.filter(expense => expense.building === buildingName);
    const currentMonthExpenses = buildingExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      name: buildingName,
      balance: currentTotal
    };
  };

  const departments: BuildingSummary[] = [
    calculateBuildingSummary("Etihad Office"),
    calculateBuildingSummary("Abdalian Office"),
  ];

  const totalBalance = departments.reduce((sum, dept) => sum + dept.balance, 0);

  // Chart data for trends
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear();
    });
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
  });

  // Category breakdown for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8">
      {/* Building Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {departments.map((building) => (
          <Card 
            key={building.name} 
            className="w-full hover:shadow-md hover:shadow-primary/20 transition-shadow cursor-pointer fade-in hover-scale"
            onClick={() => onNavigateToExpenses(building.name)}
          >
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base font-medium flex items-center justify-between">
                <span className="truncate">{building.name}</span>
                <span className="text-xl font-bold">
                  {formatCurrency(building.balance)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToExpenses(building.name)}
                className="w-full text-xs"
              >
                View Details <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Expense Trends */}
      <Card className="fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Monthly Expense Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last6Months}>
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}