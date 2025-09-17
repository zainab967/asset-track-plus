import { DashboardOverview } from "@/components/dashboard/Overview";

interface DashboardPageProps {
  userRole?: string;
}

export default function DashboardPage({ userRole }: DashboardPageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of financial analytics and recent activity</p>
        </div>
      </div>
      <DashboardOverview />
    </div>
  );
}