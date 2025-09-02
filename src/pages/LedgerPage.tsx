import { LedgerView } from "@/components/LedgerView";
import { useNavigate } from "react-router-dom";

interface LedgerPageProps {
  currentUser?: { role: string; name: string };
}

export default function LedgerPage({ currentUser }: LedgerPageProps = {}) {
  const navigate = useNavigate();

  const handleNavigateToExpenses = (department: string) => {
    navigate(`/expenses?department=${department}`);
  };

  return <LedgerView onNavigateToExpenses={handleNavigateToExpenses} currentUser={currentUser} />;
}