import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useExpenses } from "@/contexts/ExpenseContext";
import { FinancialAnalyticsDashboard } from "./FinancialAnalyticsDashboard";

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
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

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

  return (
    <div className="h-full">
      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Building Summaries - Vertical Stack */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4 flex flex-col">
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
                    {formatCurrency(building.balance)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToExpenses(building.name);
                  }}
                  className="w-full text-xs"
                >
                  View Details <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Financial Analytics - Fill remaining space */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
          <Card className="h-full">
            <CardContent className="p-3 h-full">
              <FinancialAnalyticsDashboard compact={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}