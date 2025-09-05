import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Clock, AlertCircle } from "lucide-react";
import { RecentActivity } from "./RecentActivity";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useNavigate } from "react-router-dom";

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
      value: `$${totalExpensesThisMonth.toLocaleString()}`,
      icon: DollarSign,
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
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                  ${building.balance.toLocaleString()}
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
      {/* Recent Activity */}
      <RecentActivity userRole={currentUser?.role || "employee"} />
    </div>
  );
}