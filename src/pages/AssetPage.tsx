import { AssetManager } from "@/components/AssetManager";

interface AssetPageProps {
  userRole?: "hr" | "admin" | "employee" | "manager";
}

export default function AssetPage({ userRole = "admin" }: AssetPageProps) {
  return <AssetManager userRole={userRole} />;
}