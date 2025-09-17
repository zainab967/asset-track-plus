import { RecentActivity } from "@/components/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, Calendar, Package, FileText, Wrench, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { PKRIcon } from "@/components/ui/pkr-icon";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  
  // Calculate dynamic building summaries based on actual expense data
  const calculateBuildingSummary = (buildingName: string) => {
    const buildingExpenses = expenses.filter(expense => expense.building === buildingName);
    const currentMonthBuildingExpenses = buildingExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const currentTotal = currentMonthBuildingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      name: buildingName,
      balance: currentTotal
    };
  };

  const departments = [
    calculateBuildingSummary("Etihad Office"),
    calculateBuildingSummary("Abdalian Office"),
  ];
  
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
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* Left column - Building Cards */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full hover:shadow-md hover:shadow-primary/20 transition-shadow fade-in">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-base font-medium">Building Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex flex-col h-[calc(100%-60px)]">
              {departments.map((building, index) => (
                <div 
                  key={building.name}
                  className={`flex-1 p-3 rounded-md border border-border/50 cursor-pointer hover:bg-muted/30 transition-colors ${index === 0 ? 'mb-4' : ''} flex flex-col`}
                  onClick={() => navigate(`/expenses?department=${building.name}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="truncate text-sm font-medium">{building.name}</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(building.balance)}
                    </span>
                  </div>
                  <div className="mt-auto pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expenses?department=${building.name}`);
                      }}
                      className="w-full text-xs"
                    >
                      View Details <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        {/* Middle column - Recent Activity */}
        <div className="col-span-12 lg:col-span-5">
          <RecentActivity className="h-full" />
        </div>
        
        {/* Right column - Calendar */}
        <div className="col-span-12 lg:col-span-3">
          {/* Upcoming Events Calendar */}
          <Card className="fade-in h-full">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-base font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate">Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow overflow-auto">
              {upcomingEvents.slice(0, 5).map((event) => {
                const IconComponent = event.icon;
                const eventDate = new Date(event.date);
                const today = new Date();
                const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={event.id} className="flex items-start space-x-2 p-2 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-foreground truncate pr-1">
                          {event.title}
                        </p>
                      </div>
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
        </div>
      </div>
    </div>
  );
}
