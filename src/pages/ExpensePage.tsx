import { ExpenseTracker } from "@/components/ExpenseTracker";
import { useSearchParams } from "react-router-dom";

interface ExpensePageProps {
  userRole?: "employee" | "hr" | "admin";
}

export default function ExpensePage({ userRole = "admin" }: ExpensePageProps) {
  const [searchParams] = useSearchParams();
  const selectedDepartment = searchParams.get("department") || undefined;

  return (
    <ExpenseTracker 
      selectedDepartment={selectedDepartment}
      userRole={userRole}
    />
  );
}