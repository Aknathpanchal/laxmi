'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, CreditCard, User, Bell, TrendingUp, Calendar, Clock,
  Download, Plus, IndianRupee, Percent, Target, CheckCircle,
  AlertTriangle, FileText, Phone, Mail, ArrowUpRight, Wallet,
  Calculator, Eye, EyeOff, RefreshCw, Gift, History, Activity,
  Wifi, WifiOff, Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDashboard } from '@/hooks/useDashboardData';
import { useAnalytics, useDashboardAnalytics } from '@/contexts/AnalyticsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useWebSocket, useRealtimeDashboard, useRealtimeMetrics } from '@/contexts/WebSocketContext';
// UserLayout is already applied by ConditionalLayout based on user role
import { DashboardLoading, CardSkeleton, TableSkeleton } from '@/components/ui/LoadingStates';
import { DashboardErrorBoundary, ComponentErrorBoundary } from '@/components/error/ErrorBoundary';

function RealTimeIndicator({ connected, latency }: { connected: boolean; latency: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed top-20 right-6 z-50 flex items-center space-x-2 px-4 py-2 rounded-full ${
        connected ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
      }`}
    >
      {connected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-500">Live</span>
          <span className="text-xs text-green-400">{latency}ms</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-500">Offline</span>
        </>
      )}
    </motion.div>
  );
}

function RealTimeMetrics({ metrics }: { metrics: any }) {
  if (!metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          Real-Time Metrics
        </h3>
        <span className="text-xs text-slate-400">Updates every 5s</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div>
          <p className="text-xs text-slate-400">Active Loans</p>
          <p className="text-lg font-bold text-white">{metrics.metrics?.activeLoans || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Pending Apps</p>
          <p className="text-lg font-bold text-white">{metrics.metrics?.pendingApplications || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Today\'s Collections</p>
          <p className="text-lg font-bold text-white">₹{(metrics.metrics?.todayCollections || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Risk Score</p>
          <p className="text-lg font-bold text-white">{metrics.metrics?.riskScore || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Online Users</p>
          <p className="text-lg font-bold text-white">{metrics.metrics?.onlineUsers || 0}</p>
        </div>
      </div>
    </motion.div>
  );
}

function UserDashboardRealtimeContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data, loading, error, refetch } = useUserDashboard({ refreshInterval: 30000 });
  const { trackPageView, trackAction } = useAnalytics();
  const { trackDashboardLoad, trackWidgetInteraction } = useDashboardAnalytics('user');
  const { addNotification } = useNotifications();
  const { connected, latency, emit } = useWebSocket();
  const { realtimeData, lastUpdate } = useRealtimeDashboard('USER');
  const metrics = useRealtimeMetrics();
  const [showRealTimeData, setShowRealTimeData] = useState(true);

  // Track page view and dashboard load
  useEffect(() => {
    const startTime = performance.now();

    if (!loading) {
      const loadTime = performance.now() - startTime;
      trackDashboardLoad(loadTime);
      trackPageView('/user/realtime', 'User Dashboard - Real-time');
    }
  }, [loading]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'USER')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Track WebSocket connection
  useEffect(() => {
    if (connected) {
      addNotification({
        type: 'SUCCESS',
        title: 'Real-time Connected',
        message: 'Live updates are now enabled',
        priority: 'LOW'
      });

      // Request initial data
      emit('REQUEST_REFRESH', { type: 'dashboard' });
    }
  }, [connected]);

  // Show loading state
  if (authLoading || loading) {
    return <DashboardLoading role="USER" message="Loading real-time dashboard..." />;
  }

  // Show error state
  if (error) {
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
    <div className="p-6 space-y-6 relative">
      {/* Real-time Connection Indicator */}
      <RealTimeIndicator connected={connected} latency={latency} />

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.name}!</h1>
            <p className="text-blue-100">Real-time dashboard with live updates</p>
          </div>
          <button
            onClick={() => setShowRealTimeData(!showRealTimeData)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center space-x-2"
          >
            {showRealTimeData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm">{showRealTimeData ? 'Hide' : 'Show'} Live Data</span>
          </button>
        </div>
        {lastUpdate && (
          <p className="text-xs text-blue-200 mt-2">
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        )}
      </motion.div>

      {/* Real-time Metrics */}
      <AnimatePresence>
        {showRealTimeData && realtimeData && (
          <RealTimeMetrics metrics={realtimeData} />
        )}
      </AnimatePresence>

      {/* Quick Stats with Real-time Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComponentErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 p-6 rounded-xl relative overflow-hidden"
          >
            {connected && (
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            )}
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
            className="bg-slate-800 p-6 rounded-xl relative overflow-hidden"
          >
            {connected && (
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              </div>
            )}
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
            className="bg-slate-800 p-6 rounded-xl relative overflow-hidden"
          >
            {connected && (
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
              </div>
            )}
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
            className="bg-slate-800 p-6 rounded-xl relative overflow-hidden"
          >
            {connected && (
              <div className="absolute top-2 right-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            )}
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

      {/* Real-time Notifications */}
      {realtimeData?.newApplication && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">New Update</p>
              <p className="text-xs text-slate-400">Your application status has been updated</p>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300">View</button>
          </div>
        </motion.div>
      )}

      {/* Active Loans with real-time status */}
      <ComponentErrorBoundary>
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              Active Loans
              {connected && (
                <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">
                  Live
                </span>
              )}
            </h2>
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
                <motion.div
                  key={loan.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer relative"
                  onClick={() => {
                    trackAction(`view_loan_${loan.id}`, 'interaction');
                    router.push(`/user/loans/${loan.id}`);
                  }}
                >
                  {connected && (
                    <div className="absolute top-2 right-2">
                      <span className="flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                    </div>
                  )}
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
                          <motion.div
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(loan.completedMonths / loan.tenure) * 100}%`
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
    </div>
  );
}

export default function UserDashboardRealtime() {
  return (
    <DashboardErrorBoundary>
      <>
        <UserDashboardRealtimeContent />
      </>
    </DashboardErrorBoundary>
  );
}