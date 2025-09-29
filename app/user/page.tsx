'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  DollarSign, CreditCard, User, Bell, Settings,
  TrendingUp, Calendar, Clock, Download, Plus,
  IndianRupee, Percent, Target, CheckCircle,
  AlertTriangle, FileText, Phone, Mail, MapPin,
  Building, Award, Star, ArrowUpRight, ArrowDownRight,
  Wallet, Calculator, Eye, EyeOff, RefreshCw,
  Shield, UserCheck, History, Gift, HelpCircle,
  Smartphone, Globe, Heart, Zap, Activity,
  PieChart, BarChart3, TrendingDown, Package,
  CopyIcon, ExternalLink, ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// UserLayout is already applied by ConditionalLayout based on user role

interface UserDashboardData {
  profile: {
    name: string;
    email: string;
    phone: string;
    kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    creditScore: number;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    memberSince: string;
    profileCompletion: number;
    avatar?: string;
  };
  loans: {
    active: Array<{
      id: string;
      type: string;
      amount: number;
      emi: number;
      nextDueDate: string;
      remainingAmount: number;
      status: string;
      interestRate: number;
      tenure: number;
      completedMonths: number;
    }>;
    history: Array<{
      id: string;
      type: string;
      amount: number;
      status: string;
      appliedDate: string;
      disbursedDate?: string;
      closedDate?: string;
    }>;
  };
  financials: {
    totalBorrowed: number;
    totalRepaid: number;
    currentOutstanding: number;
    nextEmiAmount: number;
    nextEmiDate: string;
    creditLimit: number;
    availableCredit: number;
    lastPaymentDate: string;
    lastPaymentAmount: number;
  };
  rewards: {
    totalPoints: number;
    currentTier: string;
    nextTierRequirement: number;
    recentEarnings: Array<{
      points: number;
      reason: string;
      date: string;
    }>;
  };
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'PAYMENT';
    isRead: boolean;
    createdAt: string;
  }>;
  quickActions: Array<{
    title: string;
    description: string;
    icon: string;
    action: string;
    enabled: boolean;
  }>;
}

export default function UserDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'payments' | 'profile'>('overview');

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }

      if (user.role !== 'USER') {
        console.log('User not authorized for user dashboard:', user.role);
        router.push('/login');
        return;
      }

      console.log('User authorized for user dashboard:', user.role);
    }
  }, [user, isLoading, router]);

  // Mock data
  const mockData: UserDashboardData = {
    profile: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      kycStatus: 'VERIFIED',
      creditScore: 750,
      tier: 'GOLD',
      memberSince: '2023-03-15',
      profileCompletion: 95,
      avatar: undefined
    },
    loans: {
      active: [
        {
          id: 'LN001',
          type: 'Personal Loan',
          amount: 500000,
          emi: 12500,
          nextDueDate: '2024-02-15',
          remainingAmount: 375000,
          status: 'ACTIVE',
          interestRate: 12.5,
          tenure: 48,
          completedMonths: 10
        },
        {
          id: 'LN002',
          type: 'Emergency Loan',
          amount: 50000,
          emi: 2500,
          nextDueDate: '2024-02-10',
          remainingAmount: 35000,
          status: 'ACTIVE',
          interestRate: 14.0,
          tenure: 24,
          completedMonths: 6
        }
      ],
      history: [
        {
          id: 'LN003',
          type: 'Salary Advance',
          amount: 25000,
          status: 'CLOSED',
          appliedDate: '2023-06-15',
          disbursedDate: '2023-06-16',
          closedDate: '2023-08-15'
        }
      ]
    },
    financials: {
      totalBorrowed: 575000,
      totalRepaid: 165000,
      currentOutstanding: 410000,
      nextEmiAmount: 15000,
      nextEmiDate: '2024-02-10',
      creditLimit: 1000000,
      availableCredit: 590000,
      lastPaymentDate: '2024-01-10',
      lastPaymentAmount: 15000
    },
    rewards: {
      totalPoints: 2450,
      currentTier: 'GOLD',
      nextTierRequirement: 550,
      recentEarnings: [
        { points: 50, reason: 'On-time payment', date: '2024-01-10' },
        { points: 25, reason: 'Profile update', date: '2024-01-05' },
        { points: 100, reason: 'Referral bonus', date: '2023-12-25' }
      ]
    },
    notifications: [
      {
        id: '1',
        title: 'EMI Due Reminder',
        message: 'Your EMI of ₹15,000 is due on Feb 10, 2024',
        type: 'PAYMENT',
        isRead: false,
        createdAt: '2024-02-05T10:00:00Z'
      },
      {
        id: '2',
        title: 'Credit Score Updated',
        message: 'Your credit score has been updated to 750',
        type: 'SUCCESS',
        isRead: false,
        createdAt: '2024-02-01T09:00:00Z'
      }
    ],
    quickActions: [
      {
        title: 'Apply for Loan',
        description: 'Get instant approval',
        icon: 'plus',
        action: '/apply',
        enabled: true
      },
      {
        title: 'Make Payment',
        description: 'Pay your EMI',
        icon: 'wallet',
        action: '/payments',
        enabled: true
      },
      {
        title: 'Download Statement',
        description: 'Get loan statement',
        icon: 'download',
        action: '/statements',
        enabled: true
      }
    ]
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400 bg-green-900/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-900/20';
      case 'REJECTED': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'from-purple-600 to-pink-600';
      case 'GOLD': return 'from-yellow-600 to-orange-600';
      case 'SILVER': return 'from-gray-400 to-gray-600';
      case 'BRONZE': return 'from-orange-700 to-red-700';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render anything (redirect will happen)
  if (!user || user.role !== 'USER') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-slate-400">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header with Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-400" />
                Welcome back, {data?.profile.name?.split(' ')[0]}!
              </h1>
              <p className="text-slate-400 mt-1">Here's your financial overview</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm ${getKycStatusColor(data?.profile.kycStatus || 'PENDING')}`}>
                <UserCheck className="w-4 h-4 inline mr-1" />
                {data?.profile.kycStatus}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getTierColor(data?.profile.tier || 'BRONZE')} text-white`}>
                <Award className="w-4 h-4 inline mr-1" />
                {data?.profile.tier}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Credit Score */}
          <div className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Credit Score</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{data?.profile.creditScore}</p>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Excellent</span>
            </div>
          </div>

          {/* Current Outstanding */}
          <div className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <IndianRupee className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500">Outstanding</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {showBalance ? formatCurrency(data?.financials.currentOutstanding || 0) : '••••••'}
            </p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBalance ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Next EMI */}
          <div className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-slate-500">Next EMI</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {formatCurrency(data?.financials.nextEmiAmount || 0)}
            </p>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-400">
                Due {new Date(data?.financials.nextEmiDate || '').toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Available Credit */}
          <div className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">Available</span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {formatCurrency(data?.financials.availableCredit || 0)}
            </p>
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              <span className="text-purple-400">Ready to use</span>
            </div>
          </div>
        </motion.div>

        {/* Active Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Active Loans ({data?.loans.active.length || 0})
            </h2>
            <button
              onClick={() => router.push('/apply')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Apply New
            </button>
          </div>

          <div className="grid gap-6">
            {data?.loans.active.map((loan) => (
              <motion.div
                key={loan.id}
                whileHover={{ scale: 1.01 }}
                className="glass rounded-xl p-6 border border-slate-700 hover:shadow-glow transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{loan.type}</h3>
                    <p className="text-slate-400 text-sm">Loan ID: {loan.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{formatCurrency(loan.amount)}</p>
                    <p className="text-slate-400 text-sm">Principal Amount</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Monthly EMI</p>
                    <p className="text-white font-semibold">{formatCurrency(loan.emi)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Interest Rate</p>
                    <p className="text-white font-semibold">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Remaining</p>
                    <p className="text-white font-semibold">{formatCurrency(loan.remainingAmount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Progress</p>
                    <p className="text-white font-semibold">{loan.completedMonths}/{loan.tenure} months</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Repayment Progress</span>
                    <span>{Math.round((loan.completedMonths / loan.tenure) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(loan.completedMonths / loan.tenure) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-300">
                      Next Due: {new Date(loan.nextDueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      Pay EMI
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions & Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Plus, label: 'Apply Loan', description: 'Get instant approval', color: 'blue' },
                { icon: Wallet, label: 'Pay EMI', description: 'Make your payment', color: 'green' },
                { icon: Download, label: 'Statements', description: 'Download reports', color: 'purple' },
                { icon: Calculator, label: 'EMI Calculator', description: 'Plan your loan', color: 'orange' },
                { icon: Shield, label: 'Insurance', description: 'Protect your loan', color: 'red' },
                { icon: Gift, label: 'Refer & Earn', description: 'Earn rewards', color: 'pink' }
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:shadow-glow transition-all text-left group"
                >
                  <action.icon className={`w-5 h-5 text-${action.color}-400 mb-2 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-medium text-slate-200 text-sm">{action.label}</h4>
                  <p className="text-xs text-slate-400">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Rewards Program */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 border border-slate-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                Rewards Program
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getTierColor(data?.rewards.currentTier || 'BRONZE')} text-white`}>
                {data?.rewards.currentTier}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Current Points</span>
                <span>{data?.rewards.totalPoints} pts</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Next Tier</span>
                <span>{data?.rewards.nextTierRequirement} pts needed</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(((data?.rewards.totalPoints || 0) / ((data?.rewards.totalPoints || 0) + (data?.rewards.nextTierRequirement || 1))) * 100, 100)}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-300">Recent Earnings</h4>
              {data?.rewards.recentEarnings.slice(0, 3).map((earning, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-sm text-slate-300">{earning.reason}</p>
                    <p className="text-xs text-slate-500">{new Date(earning.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-pink-400 font-semibold">+{earning.points} pts</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Recent Notifications
            </h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {data?.notifications.slice(0, 3).map((notification) => (
              <motion.div
                key={notification.id}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-lg border transition-all ${
                  notification.isRead
                    ? 'bg-slate-800/50 border-slate-700'
                    : 'bg-blue-900/20 border-blue-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-200 mb-1">{notification.title}</h4>
                    <p className="text-sm text-slate-400">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}