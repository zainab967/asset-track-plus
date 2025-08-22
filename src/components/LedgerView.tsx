import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { FinancialAnalyticsDashboard } from "./FinancialAnalyticsDashboard";
import { useExpenses } from "@/contexts/ExpenseContext";

interface BuildingSummary {
  name: string;
  balance: number;
  monthlyChange: number;
  status: "positive" | "negative" | "neutral";
}

interface LedgerViewProps {
  onNavigateToExpenses: (building: string) => void;
}

export function LedgerView({ onNavigateToExpenses }: LedgerViewProps) {
  const { expenses } = useExpenses();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate dynamic building summaries based on actual expense data
  const calculateBuildingSummary = (buildingName: string): BuildingSummary => {
    const buildingExpenses = expenses.filter(expense => expense.building === buildingName);
    const currentMonthExpenses = buildingExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const previousMonthExpenses = buildingExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
    });

    const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const previousTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
    const status: "positive" | "negative" | "neutral" = monthlyChange > 0 ? "negative" : monthlyChange < 0 ? "positive" : "neutral";

    return {
      name: buildingName,
      balance: currentTotal,
      monthlyChange,
      status
    };
  };

  const departments: BuildingSummary[] = [
    calculateBuildingSummary("Etihad Office"),
    calculateBuildingSummary("Abdalian Office"),
  ];

  const totalBalance = departments.reduce((sum, dept) => sum + dept.balance, 0);
  const totalChange = departments.reduce((sum, dept) => sum + (dept.balance * dept.monthlyChange / 100), 0);
  const overallChangePercent = totalBalance > 0 ? (totalChange / totalBalance) * 100 : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Company Overview */}
      <Card className="border-l-4 border-l-primary hover:shadow-md hover:shadow-primary/20 transition-shadow">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold flex items-center justify-between">
            <span>Company Financial Overview</span>
            <Badge variant={overallChangePercent >= 0 ? "default" : "destructive"} className="text-sm">
              {overallChangePercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(overallChangePercent).toFixed(1)}% this month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-primary">
            ${totalBalance.toLocaleString()}
          </div>
          <p className="text-base text-muted-foreground">Total approved expenses across all departments</p>
        </CardContent>
      </Card>

      {/* Building Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((building) => (
          <Card key={building.name} className="w-full hover:shadow-md hover:shadow-primary/20 transition-shadow cursor-pointer">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>{building.name}</span>
                <Badge
                  variant={building.status === "positive" ? "default" : building.status === "negative" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {building.monthlyChange >= 0 ? "+" : ""}{building.monthlyChange}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="text-2xl font-bold">
                  ${building.balance.toLocaleString()}
                </div>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => onNavigateToExpenses(building.name)}
                   className="w-full hover:shadow-md hover:shadow-primary/20 transition-shadow"
                 >
                  View Details <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Financial Analytics Dashboard */}
      <FinancialAnalyticsDashboard />
    </div>
  );
}