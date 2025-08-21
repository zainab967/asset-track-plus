import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/dashboard/Header";

interface AppLayoutProps {
  children: ReactNode;
  currentUser: {
    name: string;
    role: string;
  };
  pendingClaims: number;
  onRoleChange?: (role: string) => void;
}

export function AppLayout({ children, currentUser, pendingClaims, onRoleChange }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar userRole={currentUser.role} onRoleChange={onRoleChange} />
        
        <div className="flex-1 flex flex-col">
          <div className="flex items-center bg-primary text-primary-foreground px-3 py-2">
            <SidebarTrigger className="mr-6 text-primary-foreground hover:bg-primary-foreground/10" />
            <div className="flex-1">
              <Header 
                currentUser={currentUser}
                pendingClaims={pendingClaims}
              />
            </div>
          </div>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}