'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  DollarSign, CreditCard, User, Bell, TrendingUp, Calendar, Clock,
  Download, Plus, IndianRupee, Percent, Target, CheckCircle,
  AlertTriangle, FileText, Phone, Mail, ArrowUpRight, Wallet,
  Calculator, Eye, EyeOff, RefreshCw, Gift, History, Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDashboard } from '@/hooks/useDashboardData';
import { useAnalytics, useDashboardAnalytics } from '@/contexts/AnalyticsContext';
import { useNotifications } from '@/contexts/NotificationContext';
// UserLayout is already applied by ConditionalLayout based on user role
import { DashboardLoading, CardSkeleton, TableSkeleton } from '@/components/ui/LoadingStates';
import { DashboardErrorBoundary, ComponentErrorBoundary } from '@/components/error/ErrorBoundary';

function UserDashboardContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, loading, error, refetch } = useUserDashboard({ refreshInterval: 30000 });
  const { trackPageView, trackAction } = useAnalytics();
  const { trackDashboardLoad, trackWidgetInteraction } = useDashboardAnalytics('user');
  const { addNotification } = useNotifications();

  // Track page view and dashboard load
  useEffect(() => {
    const startTime = performance.now();

    if (!loading) {
      const loadTime = performance.now() - startTime;
      trackDashboardLoad(loadTime);
      trackPageView('/user', 'User Dashboard');
    }
  }, [loading]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'USER')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Show loading state
  if (authLoading || loading) {
    return <DashboardLoading role="USER" message="Loading your dashboard..." />;
  }

  // Show error state
  if (error) {
    addNotification({
      type: 'ERROR',
      title: 'Dashboard Error',
      message: error,
      priority: 'HIGH'
    });

    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Dashboard</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <DashboardLoading role="USER" />;
  }

  const { profile, loans, financials, rewards, notifications, quickActions, recentTransactions } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.name}!</h1>
        <p className="text-blue-100">Your financial journey at a glance</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Wallet className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-green-500">+2.5%</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Available Credit</p>
            <p className="text-2xl font-bold text-white">₹{profile.availableCredit.toLocaleString()}</p>
          </motion.div>
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-blue-500">Active</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-white">₹{financials.monthlyEMI.toLocaleString()}</p>
          </motion.div>
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Gift className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-xs text-yellow-500">Gold</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Reward Points</p>
            <p className="text-2xl font-bold text-white">{rewards.totalPoints}</p>
          </motion.div>
        </ComponentErrorBoundary>

        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs text-emerald-500">Excellent</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Credit Score</p>
            <p className="text-2xl font-bold text-white">{profile.creditScore}</p>
          </motion.div>
        </ComponentErrorBoundary>
      </div>

      {/* Quick Actions */}
      <ComponentErrorBoundary>
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action: any) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  trackAction(`quick_action_${action.id}`, 'interaction');
                  trackWidgetInteraction('quick_actions', action.id);
                }}
                className={`p-4 rounded-lg border transition-all ${
                  action.urgent
                    ? 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40'
                    : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                }`}
              >
                <h3 className="font-medium text-white mb-1">{action.title}</h3>
                <p className="text-sm text-slate-400">{action.description}</p>
                {action.amount && (
                  <p className="text-lg font-semibold text-orange-500 mt-2">
                    ₹{action.amount.toLocaleString()}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </ComponentErrorBoundary>

      {/* Active Loans */}
      <ComponentErrorBoundary>
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Active Loans</h2>
            <button
              onClick={() => {
                trackAction('view_all_loans', 'interaction');
                router.push('/user/loans');
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All
            </button>
          </div>
          {loans.active.length > 0 ? (
            <div className="space-y-4">
              {loans.active.map((loan: any) => (
                <div
                  key={loan.id}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                  onClick={() => {
                    trackAction(`view_loan_${loan.id}`, 'interaction');
                    router.push(`/user/loans/${loan.id}`);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{loan.type}</h3>
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      {loan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Loan Amount</p>
                      <p className="font-medium text-white">₹{loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">EMI</p>
                      <p className="font-medium text-white">₹{loan.emi.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Next Due</p>
                      <p className="font-medium text-white">
                        {new Date(loan.nextDueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Progress</p>
                      <div className="mt-1">
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(loan.completedMonths / loan.tenure) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No active loans</p>
              <button
                onClick={() => router.push('/apply')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Apply for a Loan
              </button>
            </div>
          )}
        </div>
      </ComponentErrorBoundary>

      {/* Recent Transactions */}
      <ComponentErrorBoundary>
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-slate-400 border-b border-slate-700">
                    <th className="text-left pb-3">Date</th>
                    <th className="text-left pb-3">Type</th>
                    <th className="text-left pb-3">Description</th>
                    <th className="text-right pb-3">Amount</th>
                    <th className="text-center pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentTransactions.map((txn: any) => (
                    <tr key={txn.id} className="border-b border-slate-700/50">
                      <td className="py-3 text-slate-300">
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-slate-300">{txn.type}</td>
                      <td className="py-3 text-slate-300">
                        {txn.description || txn.loanId}
                      </td>
                      <td className="py-3 text-right text-white font-medium">
                        ₹{txn.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            txn.status === 'SUCCESS'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <TableSkeleton rows={3} />
          )}
        </div>
      </ComponentErrorBoundary>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <DashboardErrorBoundary>
      <>
        <UserDashboardContent />
      </>
    </DashboardErrorBoundary>
  );
}