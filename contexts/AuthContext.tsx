"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'COLLECTION_AGENT' | 'UNDERWRITER' | 'SUPPORT_AGENT' | 'FINANCE_MANAGER' | 'RISK_ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
  team?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for different roles
const MOCK_USERS: Record<UserRole, User> = {
  ADMIN: {
    id: 'admin_001',
    name: 'Admin User',
    email: 'admin@laxmione.com',
    role: 'ADMIN',
    permissions: ['*'] // Admin has all permissions
  },
  SUPER_ADMIN: {
    id: 'super_admin_001',
    name: 'Super Admin',
    email: 'superadmin@laxmione.com',
    role: 'SUPER_ADMIN',
    permissions: ['*'] // Super Admin has all permissions
  },
  USER: {
    id: 'user_001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'USER',
    permissions: ['view_profile', 'apply_loan', 'view_loans', 'make_payments']
  },
  UNDERWRITER: {
    id: 'underwriter_001',
    name: 'Priya Sharma',
    email: 'priya.sharma@laxmione.com',
    role: 'UNDERWRITER',
    branch: 'Mumbai Central',
    team: 'Credit Team A',
    permissions: ['view_leads', 'manage_leads', 'process_applications', 'underwriting']
  },
  FINANCE_MANAGER: {
    id: 'finance_manager_001',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@laxmione.com',
    role: 'FINANCE_MANAGER',
    branch: 'Mumbai Central',
    team: 'Finance',
    permissions: ['manage_team', 'approve_loans', 'view_analytics', 'manage_branch']
  },
  COLLECTION_AGENT: {
    id: 'collection_001',
    name: 'Vijay Kumar',
    email: 'vijay.kumar@laxmione.com',
    role: 'COLLECTION_AGENT',
    branch: 'Mumbai Central',
    team: 'Recovery Team A',
    permissions: ['view_overdue', 'manage_recovery', 'contact_customers', 'schedule_visits']
  },
  SUPPORT_AGENT: {
    id: 'support_001',
    name: 'Deepika Rao',
    email: 'deepika.rao@laxmione.com',
    role: 'SUPPORT_AGENT',
    branch: 'Mumbai Central',
    team: 'Customer Support',
    permissions: ['view_tickets', 'resolve_issues', 'customer_communication']
  },
  RISK_ANALYST: {
    id: 'risk_001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@laxmione.com',
    role: 'RISK_ANALYST',
    branch: 'Mumbai Central',
    team: 'Risk & Compliance',
    permissions: ['risk_analysis', 'fraud_detection', 'compliance_monitoring']
  }
};

// Role-based route mapping
export const ROLE_ROUTES: Record<UserRole, string> = {
  ADMIN: '/admin',
  SUPER_ADMIN: '/admin',
  USER: '/user',
  UNDERWRITER: '/underwriter',
  FINANCE_MANAGER: '/finance-manager',
  COLLECTION_AGENT: '/collection-agent',
  SUPPORT_AGENT: '/support-agent',
  RISK_ANALYST: '/risk-analyst'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole') as UserRole;

    if (token && storedRole && MOCK_USERS[storedRole]) {
      setUser(MOCK_USERS[storedRole]);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Mock authentication - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, determine role based on email or provided role
      let userRole: UserRole;

      if (role) {
        userRole = role;
      } else if (email.includes('superadmin')) {
        userRole = 'SUPER_ADMIN';
      } else if (email.includes('admin')) {
        userRole = 'ADMIN';
      } else if (email.includes('underwriter') || email.includes('agent')) {
        userRole = 'UNDERWRITER';
      } else if (email.includes('finance') || email.includes('manager')) {
        userRole = 'FINANCE_MANAGER';
      } else if (email.includes('collection')) {
        userRole = 'COLLECTION_AGENT';
      } else if (email.includes('support')) {
        userRole = 'SUPPORT_AGENT';
      } else if (email.includes('risk')) {
        userRole = 'RISK_ANALYST';
      } else {
        userRole = 'USER';
      }

      const userData = MOCK_USERS[userRole];

      // Store session
      localStorage.setItem('token', 'mock_token_' + Date.now());
      localStorage.setItem('userRole', userRole);

      setUser(userData);

      // Redirect to appropriate dashboard
      router.push(ROLE_ROUTES[userRole]);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true; // Admin has all permissions
    return user.permissions.includes(permission);
  };

  const switchRole = (role: UserRole) => {
    if (MOCK_USERS[role]) {
      const userData = MOCK_USERS[role];
      localStorage.setItem('userRole', role);
      setUser(userData);
      router.push(ROLE_ROUTES[role]);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    hasPermission,
    switchRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user can access a specific route
export function useRouteAccess() {
  const { user } = useAuth();
  const router = useRouter();

  const checkAccess = (requiredRole: UserRole, currentPath: string): boolean => {
    if (!user) {
      router.push('/login');
      return false;
    }

    if (user.role !== requiredRole) {
      router.push(ROLE_ROUTES[user.role]);
      return false;
    }

    return true;
  };

  return { checkAccess };
}