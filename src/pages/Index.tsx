import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ModuleToggle, Module } from "@/components/ModuleToggle";
import { LedgerView } from "@/components/LedgerView";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { AssetManager } from "@/components/AssetManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>("ledger");
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState({
    name: "Current User",
    role: "Employee"
  });

  const handleNavigateToExpenses = (department: string) => {
    setSelectedDepartment(department);
    setActiveModule("expense");
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "ledger":
        return <LedgerView onNavigateToExpenses={handleNavigateToExpenses} />;
      case "expense":
        const expenseUserRole = currentUser.role.toLowerCase() as "employee" | "hr" | "admin";
        return <ExpenseTracker selectedDepartment={selectedDepartment} userRole={expenseUserRole} />;
      case "asset":
        const mappedRole = currentUser.role.toLowerCase() as "employee" | "hr" | "admin";
        let userName = currentUser.name;
        if (currentUser.role === "Employee") {
          userName = "Current User";
        }
        console.log('Index.tsx - Asset module render:', { role: currentUser.role, mappedRole, userName });
        return <AssetManager userRole={mappedRole} currentUser={userName} />;
      default:
        return <LedgerView onNavigateToExpenses={handleNavigateToExpenses} />;
    }
  };

  return (
    <DashboardLayout 
      currentUser={currentUser}
      pendingClaims={4}
    >
      {/* Demo Role Selector */}
      <div className="p-4 bg-muted/30 border-b">
        <div className="max-w-xs">
          <Select value={currentUser.role} onValueChange={(role) => {
            let name = "Admin User";
            if (role === "Employee") {
              name = "Current User";
            } else if (role === "HR") {
              name = "HR User";
            } else if (role === "Manager") {
              name = "Manager User";
            }
            setCurrentUser({ role, name });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select role for demo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ModuleToggle 
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        userRole={currentUser.role}
      />
      
      <main className="pb-8">
        {renderActiveModule()}
      </main>
    </DashboardLayout>
  );
};

export default Index;
