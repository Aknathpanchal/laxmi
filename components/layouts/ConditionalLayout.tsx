"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SecurityBanner } from "@/components/security-banner";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import UnderwriterLayout from "./UnderwriterLayout";
import FinanceManagerLayout from "./FinanceManagerLayout";
import CollectionAgentLayout from "./CollectionAgentLayout";
import RiskAnalystLayout from "./RiskAnalystLayout";
import SupportAgentLayout from "./SupportAgentLayout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Routes that should NOT use dashboard layouts (i.e., public website pages)
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/products',
  '/partners',
  '/apply',
  '/login',
  '/products/personal-loan',
  '/resources',
  '/contact',
  '/privacy',
  '/terms'
];

// Check if current path should use public layout
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
};

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // If it's a public route, render with website header/footer
  if (isPublicRoute(pathname)) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <SecurityBanner />
      </>
    );
  }

  // If user is not authenticated, just render children
  // Individual dashboard pages will handle authentication checks and redirects
  if (!user) {
    return <>{children}</>;
  }

  // Render appropriate dashboard layout based on user role
  switch (user.role) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return <AdminLayout>{children}</AdminLayout>;

    case 'USER':
      return <UserLayout>{children}</UserLayout>;

    case 'UNDERWRITER':
      return <UnderwriterLayout>{children}</UnderwriterLayout>;

    case 'FINANCE_MANAGER':
      return <FinanceManagerLayout>{children}</FinanceManagerLayout>;

    case 'COLLECTION_AGENT':
      return <CollectionAgentLayout>{children}</CollectionAgentLayout>;

    case 'SUPPORT_AGENT':
      return <SupportAgentLayout>{children}</SupportAgentLayout>;

    case 'RISK_ANALYST':
      return <RiskAnalystLayout>{children}</RiskAnalystLayout>;

    default:
      // Fallback to public layout
      return (
        <>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <SecurityBanner />
        </>
      );
  }
};

export default ConditionalLayout;