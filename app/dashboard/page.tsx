'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Redirect based on user role
    if (session?.user?.role) {
      const role = session.user.role;
      switch (role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'USER':
          router.push('/user');
          break;
        case 'UNDERWRITER':
          router.push('/underwriter');
          break;
        case 'COLLECTION_AGENT':
          router.push('/collection-agent');
          break;
        case 'FINANCE_MANAGER':
          router.push('/finance-manager');
          break;
        case 'RISK_ANALYST':
          router.push('/risk-analyst');
          break;
        case 'SUPPORT_AGENT':
          router.push('/support-agent');
          break;
        default:
          router.push('/login');
      }
    } else {
      // If no session, redirect to login
      router.push('/login');
    }
  }, [session, status, router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Redirecting to your dashboard...</h2>
        <p className="text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
}