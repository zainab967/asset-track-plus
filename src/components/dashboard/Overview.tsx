import { RecentActivity } from "@/components/RecentActivity";
import { FinancialAnalyticsDashboard } from "@/components/FinancialAnalyticsDashboard";

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RecentActivity className="h-[600px] md:h-[700px]" />
      <FinancialAnalyticsDashboard className="h-[600px] md:h-[700px]" />
    </div>
  );
}
