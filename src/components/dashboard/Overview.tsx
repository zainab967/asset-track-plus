import { RecentActivity } from "@/components/RecentActivity";
import { FinancialAnalyticsDashboard } from "@/components/FinancialAnalyticsDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { PKRIcon } from "@/components/ui/pkr-icon";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useNavigate } from "react-router-dom";

export function DashboardOverview() {
  const { expenses } = useExpenses();
  const navigate = useNavigate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate KPI metrics
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  
  const totalExpensesThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingReimbursements = expenses.filter(expense => expense.status === "pending").length;
  const urgentClaims = expenses.filter(expense => expense.status === "pending" && expense.amount > 1000).length;

  // KPI card data
  const kpiCards = [
    {
      title: "Total Expenses This Month",
      value: formatCurrency(totalExpensesThisMonth),
      icon: PKRIcon,
      onClick: () => navigate("/expenses"),
      trend: "+12% from last month"
    },
    {
      title: "Pending Reimbursements", 
      value: pendingReimbursements.toString(),
      icon: Clock,
      onClick: () => navigate("/reimbursements"),
      trend: `${pendingReimbursements} awaiting approval`
    },
    {
      title: "Urgent Claims",
      value: urgentClaims.toString(), 
      icon: AlertCircle,
      onClick: () => navigate("/complaints"),
      trend: "Require immediate attention"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiCards.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover-scale fade-in bg-gradient-to-br from-background to-muted/30"
              onClick={kpi.onClick}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity className="h-[600px] md:h-[700px]" />
        <FinancialAnalyticsDashboard className="h-[600px] md:h-[700px]" />
      </div>
    </div>
  );
}
