import { LedgerView } from "@/components/LedgerView";
import { useNavigate } from "react-router-dom";

export default function LedgerPage() {
  const navigate = useNavigate();

  const handleNavigateToExpenses = (department: string) => {
    navigate(`/expenses?department=${department}`);
  };

  return <LedgerView onNavigateToExpenses={handleNavigateToExpenses} />;
}