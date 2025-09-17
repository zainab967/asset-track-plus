import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Receipt, Package, TrendingUp } from "lucide-react";
import { UserNameDisplay } from "./UserNameDisplay";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  user: string;
  action: string;
  type: "complaint" | "expense" | "asset" | "approval";
  timestamp: string;
  route: string;
}

interface RecentActivityProps {
  className?: string;
  userRole?: string;
}

export function RecentActivity({ className, userRole = "employee" }: RecentActivityProps = {}) {
  const navigate = useNavigate();

  const activities: Activity[] = [
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
    },
    {
      id: "4",
      user: "Fatima Ali",
      action: "approved reimbursement request",
      type: "approval",
      timestamp: "2 hours ago", 
      route: "/reimbursements"
    },
    {
      id: "5",
      user: "Ahmed Malik",
      action: "submitted office supplies expense",
      type: "expense", 
      timestamp: "3 hours ago",
      route: "/expenses"
    }
  ];

  const getActivityIcon = (type: Activity["type"]) => {
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

  const getActivityBadgeVariant = (type: Activity["type"]) => {
    switch (type) {
      case "complaint":
        return "destructive" as const;
      case "expense":
        return "default" as const;
      case "asset":
        return "secondary" as const;
      case "approval":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  const handleActivityClick = (route: string) => {
    navigate(route);
  };

  return (
    <Card className={cn("hover:shadow-md hover:shadow-primary/20 transition-shadow h-full flex flex-col", className)}>
      <CardHeader className="space-y-0.5 pb-2 flex-shrink-0">
        <CardTitle className="text-base font-medium flex items-center gap-1">
          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate">Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-3 flex-grow overflow-auto">
        {activities.slice(0, 3).map((activity) => (
          <Button
            key={activity.id}
            variant="ghost"
            className="w-full h-auto p-2 justify-start hover:bg-muted/50 transition-colors"
            onClick={() => handleActivityClick(activity.route)}
          >
            <div className="flex items-center gap-2 w-full text-left">
              <div className="flex-shrink-0">
                <Badge variant={getActivityBadgeVariant(activity.type)} className="h-5 w-5 p-0 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </Badge>
              </div>
              
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs font-medium text-foreground leading-tight truncate">
                  <span className="font-semibold text-primary">{activity.user}</span>
                  {" "}
                  <span className="truncate">{activity.action}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground flex-shrink-0">
                {activity.timestamp}
              </p>
            </div>
          </Button>
        ))}
        
        <div className="mt-auto pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate("/complaints")}
          >
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}