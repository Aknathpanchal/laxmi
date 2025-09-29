"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import AgentLayout from "./AgentLayout";
import ManagerLayout from "./ManagerLayout";
import CollectionLayout from "./CollectionLayout";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

// Define user roles and their corresponding routes
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  AGENT: 'agent',
  MANAGER: 'manager',
  COLLECTION: 'collection'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Define route patterns for each role
const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: ['/admin'],
  [USER_ROLES.USER]: ['/dashboard'],
  [USER_ROLES.AGENT]: ['/agent'],
  [USER_ROLES.MANAGER]: ['/manager'],
  [USER_ROLES.COLLECTION]: ['/collection']
};

// Mock function to get user role (replace with actual auth logic)
const getUserRole = (): UserRole | null => {
  // This would typically come from your authentication system
  // For now, we'll determine role based on current path
  if (typeof window === 'undefined') return null;

  const path = window.location.pathname;

  if (path.startsWith('/admin')) return USER_ROLES.ADMIN;
  if (path.startsWith('/agent')) return USER_ROLES.AGENT;
  if (path.startsWith('/manager')) return USER_ROLES.MANAGER;
  if (path.startsWith('/collection')) return USER_ROLES.COLLECTION;
  if (path.startsWith('/dashboard')) return USER_ROLES.USER;

  return null;
};

// Check if user has access to current route
const hasAccess = (userRole: UserRole, pathname: string): boolean => {
  const allowedRoutes = ROLE_ROUTES[userRole];
  return allowedRoutes.some(route => pathname.startsWith(route));
};

const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user role and check access
    const role = getUserRole();
    setUserRole(role);

    if (role && !hasAccess(role, pathname)) {
      // Redirect to default route for user's role
      const defaultRoute = ROLE_ROUTES[role][0];
      router.push(defaultRoute);
    }

    setIsLoading(false);
  }, [pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-300">Loading...</span>
        </div>
      </div>
    );
  }

  // If no role detected, redirect to login
  if (!userRole) {
    router.push('/login');
    return null;
  }

  // Render appropriate layout based on user role
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return <AdminLayout>{children}</AdminLayout>;

    case USER_ROLES.USER:
      return <UserLayout>{children}</UserLayout>;

    case USER_ROLES.AGENT:
      return <AgentLayout>{children}</AgentLayout>;

    case USER_ROLES.MANAGER:
      return <ManagerLayout>{children}</ManagerLayout>;

    case USER_ROLES.COLLECTION:
      return <CollectionLayout>{children}</CollectionLayout>;

    default:
      router.push('/login');
      return null;
  }
};

export default RoleBasedLayout;