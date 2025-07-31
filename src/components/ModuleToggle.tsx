import { Button } from "@/components/ui/button";
import { BarChart3, Receipt, Package } from "lucide-react";

export type Module = "ledger" | "expense" | "asset";

interface ModuleToggleProps {
  activeModule: Module;
  onModuleChange: (module: Module) => void;
  userRole: string;
}

export function ModuleToggle({ activeModule, onModuleChange, userRole }: ModuleToggleProps) {
  const modules = [
    {
      id: "ledger" as Module,
      name: "Ledger View",
      icon: BarChart3,
      description: "Financial overview",
      allowedRoles: ["Admin", "Manager", "HR", "Finance"]
    },
    {
      id: "expense" as Module,
      name: "Expense Tracker",
      icon: Receipt,
      description: "Claims & expenses",
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    },
    {
      id: "asset" as Module,
      name: "Asset Manager",
      icon: Package,
      description: "Company assets",
      allowedRoles: ["Admin", "Manager"]
    }
  ];

  const accessibleModules = modules.filter(module => 
    module.allowedRoles.some(role => userRole.includes(role))
  );

  return (
    <div className="flex items-center justify-center gap-2 p-6">
      <div className="flex rounded-lg border bg-muted/30 p-1">
        {accessibleModules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <Button
              key={module.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onModuleChange(module.id)}
              className={`flex items-center gap-2 px-6 py-3 transition-all ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-background/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{module.name}</div>
                <div className="text-xs opacity-70">{module.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}