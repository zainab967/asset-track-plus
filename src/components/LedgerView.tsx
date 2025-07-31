import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface DepartmentSummary {
  name: string;
  balance: number;
  monthlyChange: number;
  status: "positive" | "negative" | "neutral";
}

interface LedgerViewProps {
  onNavigateToExpenses: (department: string) => void;
}

export function LedgerView({ onNavigateToExpenses }: LedgerViewProps) {
  const departments: DepartmentSummary[] = [
    { name: "Engineering", balance: 45600, monthlyChange: 12.5, status: "positive" },
    { name: "Marketing", balance: 32100, monthlyChange: -8.2, status: "negative" },
    { name: "Sales", balance: 28400, monthlyChange: 5.7, status: "positive" },
    { name: "HR", balance: 19800, monthlyChange: -2.1, status: "negative" },
    { name: "Operations", balance: 15300, monthlyChange: 0.8, status: "neutral" },
    { name: "Finance", balance: 12900, monthlyChange: 15.2, status: "positive" }
  ];

  const totalBalance = departments.reduce((sum, dept) => sum + dept.balance, 0);
  const totalChange = departments.reduce((sum, dept) => sum + (dept.balance * dept.monthlyChange / 100), 0);
  const overallChangePercent = (totalChange / totalBalance) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Company Overview */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Company Financial Overview</span>
            <Badge variant={overallChangePercent >= 0 ? "default" : "destructive"} className="text-sm">
              {overallChangePercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(overallChangePercent).toFixed(1)}% this month
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ${totalBalance.toLocaleString()}
          </div>
          <p className="text-muted-foreground">Total approved expenses across all departments</p>
        </CardContent>
      </Card>

      {/* Department Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.name} className="hover:shadow-md transition-all duration-200 group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{dept.name}</span>
                <Badge 
                  variant={dept.status === "positive" ? "default" : dept.status === "negative" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {dept.monthlyChange >= 0 ? "+" : ""}{dept.monthlyChange}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">
                  ${dept.balance.toLocaleString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onNavigateToExpenses(dept.name)}
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  View Details <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">6</div>
            <p className="text-sm text-muted-foreground">Active Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">142</div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">89%</div>
            <p className="text-sm text-muted-foreground">Approval Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">$12.5K</div>
            <p className="text-sm text-muted-foreground">Avg Monthly</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}