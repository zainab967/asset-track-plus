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
}

export function AppLayout({ children, currentUser, pendingClaims }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar userRole={currentUser.role} />
        
        <div className="flex-1 flex flex-col">
          <Header 
            currentUser={currentUser}
            pendingClaims={pendingClaims}
          />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}