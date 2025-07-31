import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ModuleToggle, Module } from "@/components/ModuleToggle";
import { LedgerView } from "@/components/LedgerView";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { AssetManager } from "@/components/AssetManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>("ledger");
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState({
    name: "Admin User",
    role: "Admin"
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
        return <ExpenseTracker selectedDepartment={selectedDepartment} />;
      case "asset":
        return <AssetManager />;
      default:
        return <LedgerView onNavigateToExpenses={handleNavigateToExpenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AppHeader 
        currentUser={currentUser}
        pendingClaims={4}
      />
      
      {/* Demo Role Selector */}
      <div className="p-4 bg-muted/30 border-b">
        <div className="max-w-xs">
          <Select value={currentUser.role} onValueChange={(role) => setCurrentUser(prev => ({ ...prev, role }))}>
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
    </div>
  );
};

export default Index;
