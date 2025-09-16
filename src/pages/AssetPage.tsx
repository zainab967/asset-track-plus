import { AssetManager } from "@/components/AssetManager";

interface AssetPageProps {
  userRole?: "hr" | "admin" | "employee" | "manager";
}

export default function AssetPage({ userRole = "admin" }: AssetPageProps) {
  return (
    <div className="flex-1">
      <div className="flex-1 p-4 md:p-8 pt-6 animate-fade-in">
        <AssetManager userRole={userRole} />
      </div>
    </div>
  );
}