import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Clock, AlertCircle, TrendingUp, PieChart } from "lucide-react";
import { RecentActivity } from "./RecentActivity";
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

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes up 2/3 of the space */}
        <div className="lg:col-span-2">
          <RecentActivity userRole={currentUser?.role || "employee"} className="h-[600px]" />
        </div>

        {/* KPI Cards and Charts - Takes up 1/3 of the space */}
        <div className="flex flex-col h-[600px] space-y-4">
          {/* KPI Cards stacked vertically */}
          <div className="flex-1 space-y-4">
            {kpiCards.map((kpi, index) => {
              const IconComponent = kpi.icon;
              return (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover-scale fade-in bg-gradient-to-br from-background to-muted/30 flex-1"
                  onClick={kpi.onClick}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-foreground">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpi.trend}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Category Breakdown */}
          <Card className="fade-in flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-primary" />
                Category Split
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ResponsiveContainer width="100%" height={120}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                {pieData.slice(0, 4).map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}