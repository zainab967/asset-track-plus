import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

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
  const departments: BuildingSummary[] = [
    { name: "Etihad Office", balance: 45600, monthlyChange: 12.5, status: "positive" },
    { name: "Abdalian Office", balance: 32100, monthlyChange: -8.2, status: "negative" },
  ];

  const totalBalance = departments.reduce((sum, dept) => sum + dept.balance, 0);
  const totalChange = departments.reduce((sum, dept) => sum + (dept.balance * dept.monthlyChange / 100), 0);
  const overallChangePercent = (totalChange / totalBalance) * 100;

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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md hover:shadow-primary/20 transition-shadow">
          <CardContent className="p-6 text-center space-y-1">
            <div className="text-2xl font-bold text-primary">6</div>
            <p className="text-sm text-muted-foreground">Active Buildings</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md hover:shadow-primary/20 transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">142</div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md hover:shadow-primary/20 transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">89%</div>
            <p className="text-sm text-muted-foreground">Approval Rate</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md hover:shadow-primary/20 transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">$12.5K</div>
            <p className="text-sm text-muted-foreground">Avg Monthly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}