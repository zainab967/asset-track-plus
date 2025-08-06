import { BarChart3, Receipt, Package, MessageSquare, Menu } from "lucide-react";
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

interface AppSidebarProps {
  userRole: string;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      title: "Ledger View",
      url: "/ledger",
      icon: BarChart3,
      description: "Financial overview",
      allowedRoles: ["Admin", "Manager", "HR"]
    },
    {
      title: "Expense Tracker", 
      url: "/expenses",
      icon: Receipt,
      description: "Claims & expenses",
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    },
    {
      title: "Asset Manager",
      url: "/assets", 
      icon: Package,
      description: "Company assets",
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    },
    {
      title: "Complaints & Suggestions",
      url: "/complaints",
      icon: MessageSquare,
      description: "Feedback system",
      allowedRoles: ["Admin", "Manager", "HR", "Employee"]
    }
  ];

  const accessibleItems = navigationItems.filter(item => 
    item.allowedRoles.some(role => userRole.includes(role))
  );

  const isActive = (path: string) => currentPath === path;
  const isExpanded = accessibleItems.some((item) => isActive(item.url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Menu className="h-4 w-4 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Financial Hub</h2>
              <p className="text-xs text-sidebar-foreground/60">{userRole}</p>
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
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {state === "expanded" && (
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
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