import { BarChart3, Receipt, Package, MessageSquare, ChevronDown, CreditCard } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Logo will be created with CSS

interface AppSidebarProps {
  userRole: string;
  onRoleChange?: (role: string) => void;
}

export function AppSidebar({ userRole, onRoleChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: "Ledger View",
      url: "/ledger",
      icon: BarChart3,
      allowedRoles: ["Admin", "Manager", "HR"]
    },
    {
      title: "Expense Tracker", 
      url: "/expenses",
      icon: Receipt,
      allowedRoles: ["Admin", "Manager", "HR"]
    },
    {
      title: "Assets",
      url: "/assets", 
      icon: Package,
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    },
    {
      title: "Reimbursements",
      url: "/reimbursements",
      icon: CreditCard,
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    },
    {
      title: "Complaints & Suggestions",
      url: "/complaints",
      icon: MessageSquare,
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    }
  ];

  const accessibleItems = navigationItems.filter(item => 
    item.allowedRoles.some(role => userRole.includes(role))
  );

  const isActive = (path: string) => currentPath === path;
  const isExpanded = accessibleItems.some((item) => isActive(item.url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-gradient-to-b from-primary/5 to-primary/10">
      <SidebarHeader className="p-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-xs font-bold text-primary">$</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/90 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          {state === "expanded" && (
            <div className="flex-1">
              <h2 className="font-bold text-lg text-primary">AIIMTRACK</h2>
              <Select value={userRole} onValueChange={onRoleChange}>
                <SelectTrigger className="w-full h-6 text-xs bg-transparent border-0 p-0 hover:bg-primary/10 focus:ring-0">
                  <SelectValue className="text-xs text-sidebar-foreground/80" />
                  <ChevronDown className="h-3 w-3 ml-1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink 
                        to={item.url} 
                        className="flex items-center gap-2 px-2 py-1.5 mx-0.5 rounded-md transition-all duration-200 overflow-hidden"
                      >
                        <Icon className={"h-4 w-4 flex-shrink-0 " + (active ? "text-primary" : "text-sidebar-foreground/70")} />
                        {state === "expanded" && (
                          <span className="font-medium transition-transform duration-200 hover:scale-[1.02] truncate max-w-full">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
