import { ReactNode } from "react";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  currentUser: {
    name: string;
    role: string;
  };
  pendingClaims: number;
}

export function DashboardLayout({ children, currentUser, pendingClaims }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header 
        currentUser={currentUser}
        pendingClaims={pendingClaims}
      />
      {children}
    </div>
  );
}