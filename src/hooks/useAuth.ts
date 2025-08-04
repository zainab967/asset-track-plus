import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "HR" | "Employee";
  department: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo user - in production this would check actual auth state
    const demoUser: User = {
      id: "demo-user",
      name: "Admin User",
      email: "admin@company.com",
      role: "Admin",
      department: "IT"
    };
    
    setUser(demoUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo implementation
    const demoUser: User = {
      id: "demo-user",
      name: "Demo User",
      email,
      role: "Employee",
      department: "General"
    };
    
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserRole = (role: User["role"]) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUserRole,
    isAuthenticated: !!user,
  };
}