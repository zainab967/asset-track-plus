import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Receipt, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  user: string;
  action: string;
  type: "complaint" | "expense" | "asset" | "approval";
  timestamp: string;
  route: string;
}

export function RecentActivity() {
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
    <Card className="hover:shadow-md hover:shadow-primary/20 transition-shadow">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest actions across your organization
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <Button
            key={activity.id}
            variant="ghost"
            className="w-full h-auto p-3 justify-start hover:bg-muted/50 transition-colors"
            onClick={() => handleActivityClick(activity.route)}
          >
            <div className="flex items-start gap-3 w-full text-left">
              <div className="flex-shrink-0 mt-1">
                <Badge variant={getActivityBadgeVariant(activity.type)} className="h-6 w-6 p-0 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </Badge>
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-semibold text-primary">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.timestamp}
                </p>
              </div>
            </div>
          </Button>
        ))}
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full mt-4 hover:shadow-md hover:shadow-primary/20 transition-shadow"
          onClick={() => navigate("/complaints")}
        >
          View All Activities
        </Button>
      </CardContent>
    </Card>
  );
}