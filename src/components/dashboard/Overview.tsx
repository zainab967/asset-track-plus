import { RecentActivity } from "@/components/RecentActivity";
import { FinancialAnalyticsDashboard } from "@/components/FinancialAnalyticsDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, Calendar, Package, FileText, Wrench } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { PKRIcon } from "@/components/ui/pkr-icon";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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

  // Upcoming events for calendar
  const upcomingEvents = [
    {
      id: 1,
      title: "Laptop HP-001 Return Due",
      date: "2024-01-15",
      type: "asset-return",
      icon: Package,
      description: "Asset return from John Doe"
    },
    {
      id: 2,
      title: "Monthly Reimbursement Filing Deadline",
      date: "2024-01-20",
      type: "reimbursement",
      icon: FileText,
      description: "Submit all pending reimbursements"
    },
    {
      id: 3,
      title: "Printer HP-PR-005 Maintenance",
      date: "2024-01-18",
      type: "maintenance",
      icon: Wrench,
      description: "Scheduled maintenance for office printer"
    },
    {
      id: 4,
      title: "AC Unit AC-002 Service",
      date: "2024-01-22",
      type: "maintenance",
      icon: Wrench,
      description: "Annual maintenance check"
    },
    {
      id: 5,
      title: "Monitor Dell-003 Return Due",
      date: "2024-01-25",
      type: "asset-return",
      icon: Package,
      description: "Asset return from Sarah Wilson"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "asset-return":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "reimbursement":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "maintenance":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "asset-return":
        return "Asset Return";
      case "reimbursement":
        return "Reimbursement";
      case "maintenance":
        return "Maintenance";
      default:
        return "Event";
    }
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity className="h-[600px]" />
        </div>
        
        {/* Right column - Calendar and Analytics */}
        <div className="space-y-6">
          {/* Upcoming Events Calendar */}
          <Card className="fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Upcoming Events
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Asset returns, deadlines & maintenance
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event) => {
                const IconComponent = event.icon;
                const eventDate = new Date(event.date);
                const today = new Date();
                const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate pr-2">
                          {event.title}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getEventTypeColor(event.type)} flex-shrink-0`}
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {eventDate.toLocaleDateString()}
                        </span>
                        <span className={`text-xs font-medium ${
                          daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {daysUntil <= 0 ? 'Today' : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Financial Analytics - Compact */}
          <div className="h-[300px]">
            <FinancialAnalyticsDashboard className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
