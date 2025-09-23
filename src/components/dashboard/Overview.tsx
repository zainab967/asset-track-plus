import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle, Calendar, Package, FileText, Wrench, ArrowRight, MessageSquare, Receipt, TrendingUp } from "lucide-react";
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
  
  // Recent activity data
  const activities = [
    {
      id: "1",
      user: "Ali Hassan",
      action: "lodged a complaint about office air conditioning",
      type: "complaint",
      timestamp: "2 minutes ago",
      route: "/complaints"
    },
    {
      id: "2", 
      user: "Sara Ahmed",
      action: "submitted expense claim for travel",
      type: "expense",
      timestamp: "15 minutes ago",
      route: "/expenses"
    },
    {
      id: "3",
      user: "Omar Khan", 
      action: "requested new laptop asset",
      type: "asset",
      timestamp: "1 hour ago",
      route: "/assets"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return <MessageSquare className="h-4 w-4" />;
      case "expense":
        return <Receipt className="h-4 w-4" />;
      case "asset":
        return <Package className="h-4 w-4" />;
      case "approval":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case "complaint":
        return "destructive";
      case "expense":
        return "default";
      case "asset":
        return "secondary";
      case "approval":
        return "outline";
      default:
        return "outline";
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Building Expenses Card */}
        <div className="col-span-1">
          <Card className="hover:shadow-sm hover:shadow-primary/10 transition-shadow h-[260px] flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <Package className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate">Building Expenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col">
              <div className="flex-1 overflow-auto">
                {departments.map((building, index) => (
                  <div 
                    key={building.name}
                    className={`flex items-center justify-between py-2 ${index !== departments.length - 1 ? 'border-b border-border/30' : ''}`}
                    onClick={() => navigate(`/expenses?department=${building.name}`)}
                  >
                    <span className="truncate text-xs font-medium">{building.name}</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(building.balance)}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/expenses')}
                className="w-full text-xs mt-3"
              >
                View All Buildings <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div className="col-span-1">
          <Card className="hover:shadow-sm hover:shadow-primary/10 transition-shadow h-[260px] flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate">Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col">
              <div className="flex-1 overflow-auto">
                {activities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center gap-2 py-2 cursor-pointer ${activity.id !== '3' ? 'border-b border-border/30' : ''}`}
                    onClick={() => navigate(activity.route)}
                  >
                    <div className="flex-shrink-0">
                      <Badge variant={getActivityBadgeVariant(activity.type)} className="h-5 w-5 p-0 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">
                        <span className="font-medium">{activity.user}</span>
                        {" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/complaints')}
                className="w-full text-xs mt-3"
              >
                View All Activity <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Calendar */}
        <div className="col-span-1">
          <Card className="hover:shadow-sm hover:shadow-primary/10 transition-shadow h-[260px] flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate">Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col">
              <div className="flex-1 overflow-auto">
                {upcomingEvents.slice(0, 3).map((event, index) => {
                  const IconComponent = event.icon;
                  const eventDate = new Date(event.date);
                  const today = new Date();
                  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={event.id} 
                      className={`flex items-center gap-2 py-2 ${index !== 2 ? 'border-b border-border/30' : ''}`}
                    >
                      <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {event.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {eventDate.toLocaleDateString()}
                          </span>
                          <span className={`text-xs ${
                            daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {daysUntil <= 0 ? 'Today' : `${daysUntil} days`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/assets')}
                className="w-full text-xs mt-3"
              >
                View All Events <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
