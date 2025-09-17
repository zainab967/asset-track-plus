import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import DashboardPage from "./pages/DashboardPage";
import LedgerPage from "./pages/LedgerPage";
import ExpensePage from "./pages/ExpensePage";
import AssetPage from "./pages/AssetPage";
import AssetLogsPage from "./pages/AssetLogsPage";
import ReimbursementPage from "./pages/ReimbursementPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import UserProfilePage from "./pages/UserProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState({
    name: "John Doe",
    role: "Employee"
  });

  // Mock pending claims count
  const pendingClaims = 3;

  const handleRoleChange = (newRole: string) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="nucleus-theme">
        <TooltipProvider>
          <ExpenseProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to={currentUser.role === "Employee" ? "/expenses" : "/dashboard"} replace />} />
                <Route path="/dashboard" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <DashboardPage userRole={currentUser.role.toLowerCase()} />
                  </AppLayout>
                } />
                <Route path="/ledger" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <LedgerPage currentUser={currentUser} />
                  </AppLayout>
                } />
                <Route path="/expenses" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <ExpensePage userRole={currentUser.role.toLowerCase() as "employee" | "hr" | "admin" | "manager"} />
                  </AppLayout>
                } />
                <Route path="/assets" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <AssetPage userRole={currentUser.role.toLowerCase() as "employee" | "hr" | "admin" | "manager"} />
                  </AppLayout>
                } />
                <Route path="/assets/logs" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <AssetLogsPage userRole={currentUser.role.toLowerCase() as "employee" | "hr" | "admin" | "manager"} />
                  </AppLayout>
                } />
                <Route path="/reimbursements" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <ReimbursementPage userRole={currentUser.role.toLowerCase() as "employee" | "hr" | "admin" | "manager"} />
                  </AppLayout>
                } />
                <Route path="/complaints" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <ComplaintsPage userRole={currentUser.role.toLowerCase()} />
                  </AppLayout>
                } />
                <Route path="/profile" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <UserProfilePage userRole={currentUser.role.toLowerCase()} />
                  </AppLayout>
                } />
                <Route path="/profile/:userId" element={
                  <AppLayout currentUser={currentUser} pendingClaims={pendingClaims} onRoleChange={handleRoleChange}>
                    <UserProfilePage userRole={currentUser.role.toLowerCase()} />
                  </AppLayout>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ExpenseProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
