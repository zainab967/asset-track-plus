import { useState, useEffect } from "react";
import { API_ENDPOINTS, API_CONFIG } from "@/config/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "IT" | "HR" | "Employee";
  department: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.LOGIN}/status`, {
        method: 'GET',
        ...API_CONFIG
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const userData = await response.json();
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        ...API_CONFIG
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
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