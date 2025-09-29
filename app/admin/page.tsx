"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  RadialBarChart, RadialBar, Legend, ScatterChart, Scatter
} from "recharts";
import {
  DollarSign, Users, CreditCard, TrendingUp, TrendingDown,
  AlertTriangle, Clock, CheckCircle, XCircle, Database,
  Download, Filter, RefreshCw, Bell, Settings, Zap,
  Activity, Shield, Eye, FileText, Target, Award,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, PlusCircle,
  Calendar, Search, Plus, BarChart3, PieChart as PieChartIcon,
  Brain, Cpu, Server, HardDrive, Wifi, Lock, UserCheck,
  IndianRupee, Building, MapPin, Package, Phone, Mail,
  MessageSquare, Star, ChevronRight, Sparkles, Globe,
  Banknote, Calculator, Percent, UserX, UserPlus, ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
// AdminLayout is already applied by ConditionalLayout based on user role

interface DashboardData {
  overview: {
    loans: {
      total: number;
      active: number;
      pendingApprovals: number;
      disbursedToday: number;
      portfolioValue: number;
      approvalRate: number;
      defaultRate: number;
      avgLoanAmount: number;
      avgInterestRate: number;
    };
    users: {
      total: number;
      new: number;
      active: number;
      kycPending: number;
      kycCompleted: number;
      growthRate: number;
      churnRate: number;
      avgCreditScore: number;
    };
    financial: {
      totalDisbursed: number;
      totalCollected: number;
      totalOutstanding: number;
      npaAmount: number;
      collectionEfficiency: number;
      revenue: number;
      profit: number;
      expenses: number;
      targetAchievement: number;
    };
    collections: {
      overdueLoans: number;
      overdueAmount: number;
      collectionCases: number;
      recoveryRate: number;
      bucket0_30: number;
      bucket30_60: number;
      bucket60_90: number;
      bucket90Plus: number;
    };
    operational: {
      totalStaff: number;
      activeStaff: number;
      branches: number;
      regions: number;
      channels: number;
      partners: number;
      productivity: {
        avgProcessingTime: number;
        approvalRate: number;
        disbursalRate: number;
        collectionRate: number;
      };
    };
    risk: {
      highRiskLoans: number;
      mediumRiskLoans: number;
      lowRiskLoans: number;
      fraudDetected: number;
      fraudPrevented: number;
      riskScore: number;
    };
  };
  trends: {
    loans: {
      labels: string[];
      applications: number[];
      approvals: number[];
      disbursements: number[];
      rejections: number[];
    };
    financial: {
      labels: string[];
      disbursements: number[];
      collections: number[];
      revenue: number[];
      npa: number[];
    };
    users: {
      labels: string[];
      registrations: number[];
      activations: number[];
      churns: number[];
    };
    interval: string;
  };
  alerts: Array<{
    id: string;
    type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
    title: string;
    message: string;
    action: string;
    priority: number;
    createdAt: string;
  }>;
  recentActivities: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
    userId: string;
    entityType: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  systemHealth: {
    overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    api: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    database: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    cache: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    queues: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    services: {
      sms: boolean;
      email: boolean;
      payment: boolean;
      kyc: boolean;
      creditBureau: boolean;
    };
    performance: {
      responseTime: number;
      uptime: number;
      errorRate: number;
    };
    lastChecked: string;
  };
  topPerformers: {
    branches: Array<{ name: string; disbursements: number; collections: number; }>;
    agents: Array<{ name: string; loans: number; amount: number; }>;
    products: Array<{ name: string; count: number; amount: number; }>;
  };
}

const COLORS = ['#0ea5e9', '#34d399', '#fbbf24', '#f472b6', '#ef4444', '#8b5cf6'];
const GRADIENTS = [
  { start: '#3b82f6', end: '#1d4ed8' },
  { start: '#10b981', end: '#047857' },
  { start: '#f59e0b', end: '#d97706' },
  { start: '#ef4444', end: '#b91c1c' },
  { start: '#8b5cf6', end: '#6d28d9' },
];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        console.log('User not authorized for admin dashboard:', user.role);
        router.push('/login');
        return;
      }

      console.log('User authorized for admin dashboard:', user.role);
    }
  }, [user, isLoading, router]);

  // Enhanced mock data
  const mockData: DashboardData = {
    overview: {
      loans: {
        total: 12850,
        active: 10240,
        pendingApprovals: 156,
        disbursedToday: 23,
        portfolioValue: 2850000000,
        approvalRate: 78,
        defaultRate: 2.3,
        avgLoanAmount: 125000,
        avgInterestRate: 12.5
      },
      users: {
        total: 45230,
        new: 1250,
        active: 38940,
        kycPending: 890,
        kycCompleted: 44340,
        growthRate: 12,
        churnRate: 3.2,
        avgCreditScore: 720
      },
      financial: {
        totalDisbursed: 3250000000,
        totalCollected: 2890000000,
        totalOutstanding: 2850000000,
        npaAmount: 145000000,
        collectionEfficiency: 92,
        revenue: 425000000,
        profit: 125000000,
        expenses: 300000000,
        targetAchievement: 87
      },
      collections: {
        overdueLoans: 245,
        overdueAmount: 125000000,
        collectionCases: 89,
        recoveryRate: 78,
        bucket0_30: 45000000,
        bucket30_60: 35000000,
        bucket60_90: 25000000,
        bucket90Plus: 20000000
      },
      operational: {
        totalStaff: 245,
        activeStaff: 238,
        branches: 12,
        regions: 4,
        channels: 6,
        partners: 23,
        productivity: {
          avgProcessingTime: 2.5,
          approvalRate: 78,
          disbursalRate: 92,
          collectionRate: 88
        }
      },
      risk: {
        highRiskLoans: 456,
        mediumRiskLoans: 2340,
        lowRiskLoans: 7444,
        fraudDetected: 12,
        fraudPrevented: 45,
        riskScore: 72
      }
    },
    trends: {
      loans: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        applications: [250, 380, 420, 350, 490, 280, 320],
        approvals: [190, 320, 360, 280, 410, 220, 260],
        disbursements: [170, 290, 340, 260, 380, 200, 240],
        rejections: [60, 60, 60, 70, 80, 60, 60]
      },
      financial: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        disbursements: [25000000, 45000000, 65000000, 55000000, 75000000, 35000000, 45000000],
        collections: [22000000, 40000000, 58000000, 50000000, 68000000, 32000000, 42000000],
        revenue: [2500000, 4500000, 6500000, 5500000, 7500000, 3500000, 4500000],
        npa: [1200000, 1300000, 1250000, 1400000, 1350000, 1450000, 1500000]
      },
      users: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        registrations: [145, 234, 189, 267, 312, 145, 198],
        activations: [120, 190, 150, 220, 280, 125, 165],
        churns: [15, 20, 18, 22, 25, 12, 15]
      },
      interval: 'daily'
    },
    alerts: [
      {
        id: '1',
        type: 'CRITICAL',
        title: 'High NPA Alert',
        message: '145 loans have crossed 90-day overdue mark',
        action: 'Review collection strategy',
        priority: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'WARNING',
        title: 'Pending Approvals',
        message: '156 loan applications pending approval for >24 hours',
        action: 'Review approval queue',
        priority: 2,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        type: 'INFO',
        title: 'System Update',
        message: 'Credit scoring model updated successfully',
        action: 'Review new parameters',
        priority: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        type: 'SUCCESS',
        title: 'Target Achieved',
        message: 'Monthly disbursement target achieved 102%',
        action: 'Congratulate team',
        priority: 4,
        createdAt: new Date().toISOString()
      }
    ],
    recentActivities: [
      {
        id: '1',
        action: 'Loan Approved',
        description: 'Personal loan of ₹5,00,000 approved for customer ID: CU789123',
        timestamp: new Date().toISOString(),
        userId: 'admin1',
        entityType: 'loan',
        impact: 'HIGH'
      },
      {
        id: '2',
        action: 'User Verified',
        description: 'KYC completed for customer ID: CU789124',
        timestamp: new Date(Date.now() - 30000).toISOString(),
        userId: 'admin2',
        entityType: 'user',
        impact: 'MEDIUM'
      },
      {
        id: '3',
        action: 'Collection Success',
        description: 'Recovered ₹2,50,000 from overdue account LA456789',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        userId: 'agent1',
        entityType: 'collection',
        impact: 'HIGH'
      },
      {
        id: '4',
        action: 'Fraud Detected',
        description: 'Suspicious application blocked - duplicate PAN detected',
        timestamp: new Date(Date.now() - 90000).toISOString(),
        userId: 'system',
        entityType: 'fraud',
        impact: 'HIGH'
      }
    ],
    systemHealth: {
      overall: 'HEALTHY',
      api: 'HEALTHY',
      database: 'HEALTHY',
      cache: 'HEALTHY',
      queues: 'DEGRADED',
      services: {
        sms: true,
        email: true,
        payment: true,
        kyc: false,
        creditBureau: true
      },
      performance: {
        responseTime: 124,
        uptime: 99.99,
        errorRate: 0.02
      },
      lastChecked: new Date().toISOString()
    },
    topPerformers: {
      branches: [
        { name: 'Mumbai Central', disbursements: 45000000, collections: 42000000 },
        { name: 'Delhi NCR', disbursements: 42000000, collections: 40000000 },
        { name: 'Bangalore Tech', disbursements: 38000000, collections: 36000000 },
      ],
      agents: [
        { name: 'Rajesh Kumar', loans: 145, amount: 18250000 },
        { name: 'Priya Sharma', loans: 132, amount: 16500000 },
        { name: 'Amit Singh', loans: 128, amount: 16000000 },
      ],
      products: [
        { name: 'Personal Loan', count: 4567, amount: 570875000 },
        { name: 'Salary Advance', count: 3456, amount: 172800000 },
        { name: 'Emergency Loan', count: 2345, amount: 117250000 },
      ]
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(false);
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'DEGRADED': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'CRITICAL': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'INFO': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return null;
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
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-400" />
              Admin Command Center
            </h1>
            <p className="text-slate-400 mt-1">Real-time analytics and control panel</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1d">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:shadow-glow transition-all border border-slate-700"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
            >
              <Download className="h-4 w-4" />
              Export Report
            </motion.button>
          </div>
        </div>
        {/* System Health Bar */}
        {data?.systemHealth && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="glass rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  System Health Monitor
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  Last updated: {new Date(data.systemHealth.lastChecked).toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {[
                  { label: 'Overall', status: data.systemHealth.overall, icon: Activity },
                  { label: 'API', status: data.systemHealth.api, icon: Globe },
                  { label: 'Database', status: data.systemHealth.database, icon: Database },
                  { label: 'Cache', status: data.systemHealth.cache, icon: HardDrive },
                  { label: 'Queues', status: data.systemHealth.queues, icon: Server }
                ].map((item) => (
                  <div key={item.label} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      {getHealthIcon(item.status)}
                    </div>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-200">{item.status}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{data.systemHealth.performance.uptime}%</p>
                  <p className="text-xs text-slate-500">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{data.systemHealth.performance.responseTime}ms</p>
                  <p className="text-xs text-slate-500">Avg Response</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{data.systemHealth.performance.errorRate}%</p>
                  <p className="text-xs text-slate-500">Error Rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Alerts */}
        {data?.alerts && data.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Active Alerts ({data.alerts.length})
            </h3>
            <div className="grid gap-3">
              {data.alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-lg p-4 border border-slate-700 hover:shadow-glow transition-all"
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-100">{alert.title}</h4>
                        <span className="text-xs text-slate-500">
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">{alert.message}</p>
                      <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        {alert.action}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Key Metrics Overview */}
        {data?.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Portfolio Value */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 gradient-primary rounded-xl">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-slate-500">Portfolio</span>
              </div>
              <p className="text-3xl font-bold gradient-text mb-2">
                {formatCurrency(data.overview.financial.totalOutstanding)}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Disbursed</span>
                  <span className="text-emerald-400">{formatCurrency(data.overview.financial.totalDisbursed)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Collected</span>
                  <span className="text-blue-400">{formatCurrency(data.overview.financial.totalCollected)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm pt-2 border-t border-slate-700">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-400">{data.overview.financial.collectionEfficiency}% efficiency</span>
                </div>
              </div>
            </motion.div>

            {/* Active Loans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs text-slate-500">Loans</span>
              </div>
              <p className="text-3xl font-bold text-slate-100 mb-2">
                {formatNumber(data.overview.loans.total)}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Active</span>
                  <span className="text-emerald-400">{formatNumber(data.overview.loans.active)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pending</span>
                  <span className="text-yellow-400">{data.overview.loans.pendingApprovals}</span>
                </div>
                <div className="flex items-center gap-1 text-sm pt-2 border-t border-slate-700">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-400">{data.overview.loans.approvalRate}% approval rate</span>
                </div>
              </div>
            </motion.div>

            {/* Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500">Users</span>
              </div>
              <p className="text-3xl font-bold text-slate-100 mb-2">
                {formatNumber(data.overview.users.total)}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Active</span>
                  <span className="text-emerald-400">{formatNumber(data.overview.users.active)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">New Today</span>
                  <span className="text-blue-400">+{data.overview.users.new}</span>
                </div>
                <div className="flex items-center gap-1 text-sm pt-2 border-t border-slate-700">
                  <UserPlus className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-400">+{data.overview.users.growthRate}% growth</span>
                </div>
              </div>
            </motion.div>

            {/* Risk Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 border border-slate-700 hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-xs text-slate-500">Risk</span>
              </div>
              <p className="text-3xl font-bold text-slate-100 mb-2">
                {data.overview.risk.riskScore}
                <span className="text-lg text-slate-400">/100</span>
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">High Risk</span>
                  <span className="text-red-400">{data.overview.risk.highRiskLoans}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fraud Blocked</span>
                  <span className="text-emerald-400">{data.overview.risk.fraudPrevented}</span>
                </div>
                <div className="flex items-center gap-1 text-sm pt-2 border-t border-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-400">{data.overview.loans.defaultRate}% default rate</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Loan Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Loan Processing Pipeline
              </h3>
              <div className="flex gap-3">
                {['Applications', 'Approvals', 'Disbursements'].map((label, i) => (
                  <div key={label} className="flex items-center gap-1 text-xs">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data?.trends.loans.labels.map((label, index) => ({
                name: label,
                applications: data?.trends.loans.applications[index],
                approvals: data?.trends.loans.approvals[index],
                disbursements: data?.trends.loans.disbursements[index]
              }))}>
                <defs>
                  {GRADIENTS.map((gradient, index) => (
                    <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={gradient.start} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={gradient.end} stopOpacity={0.2}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#0ea5e9" fill="url(#gradient0)" strokeWidth={2} />
                <Area type="monotone" dataKey="approvals" stroke="#34d399" fill="url(#gradient1)" strokeWidth={2} />
                <Area type="monotone" dataKey="disbursements" stroke="#fbbf24" fill="url(#gradient2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Financial Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Financial Performance
              </h3>
              <div className="flex gap-3">
                {['Disbursements', 'Collections', 'Revenue'].map((label, i) => (
                  <div key={label} className="flex items-center gap-1 text-xs">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[i + 1] }} />
                    <span className="text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.trends.financial.labels.map((label, index) => ({
                name: label,
                disbursements: data?.trends.financial.disbursements[index] / 1000000,
                collections: data?.trends.financial.collections[index] / 1000000,
                revenue: data?.trends.financial.revenue[index] / 1000000
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                  formatter={(value: number) => [`₹${value.toFixed(1)}M`, '']}
                />
                <Line type="monotone" dataKey="disbursements" stroke="#34d399" strokeWidth={3} dot={{ fill: '#34d399' }} />
                <Line type="monotone" dataKey="collections" stroke="#fbbf24" strokeWidth={3} dot={{ fill: '#fbbf24' }} />
                <Line type="monotone" dataKey="revenue" stroke="#f472b6" strokeWidth={3} dot={{ fill: '#f472b6' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Collection Buckets & Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Collection Buckets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-yellow-400" />
              Collection Buckets
            </h3>
            <div className="space-y-3">
              {[
                { label: '0-30 Days', value: data?.overview.collections.bucket0_30, color: 'emerald' },
                { label: '30-60 Days', value: data?.overview.collections.bucket30_60, color: 'yellow' },
                { label: '60-90 Days', value: data?.overview.collections.bucket60_90, color: 'orange' },
                { label: '90+ Days', value: data?.overview.collections.bucket90Plus, color: 'red' }
              ].map((bucket) => (
                <div key={bucket.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{bucket.label}</span>
                    <span className="text-slate-200">{formatCurrency(bucket.value || 0)}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((bucket.value || 0) / (data?.overview.collections.overdueAmount || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-2 rounded-full bg-${bucket.color}-500`}
                      style={{
                        background: `linear-gradient(90deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                        '--tw-gradient-from': bucket.color === 'emerald' ? '#34d399' : bucket.color === 'yellow' ? '#fbbf24' : bucket.color === 'orange' ? '#fb923c' : '#ef4444',
                        '--tw-gradient-to': bucket.color === 'emerald' ? '#10b981' : bucket.color === 'yellow' ? '#f59e0b' : bucket.color === 'orange' ? '#ea580c' : '#dc2626'
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Risk Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Low Risk', value: data?.overview.risk.lowRiskLoans },
                    { name: 'Medium Risk', value: data?.overview.risk.mediumRiskLoans },
                    { name: 'High Risk', value: data?.overview.risk.highRiskLoans }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#34d399" />
                  <Cell fill="#fbbf24" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-4">
              {[
                { label: 'Low', value: data?.overview.risk.lowRiskLoans, color: 'emerald' },
                { label: 'Medium', value: data?.overview.risk.mediumRiskLoans, color: 'yellow' },
                { label: 'High', value: data?.overview.risk.highRiskLoans, color: 'red' }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className={`w-3 h-3 bg-${item.color}-500 rounded-full mx-auto mb-1`} />
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Operational Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              Operational Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Processing Time</span>
                <span className="text-slate-200 font-semibold">{data?.overview.operational.productivity.avgProcessingTime} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Approval Rate</span>
                <span className="text-emerald-400 font-semibold">{data?.overview.operational.productivity.approvalRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Disbursal Rate</span>
                <span className="text-blue-400 font-semibold">{data?.overview.operational.productivity.disbursalRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Collection Rate</span>
                <span className="text-yellow-400 font-semibold">{data?.overview.operational.productivity.collectionRate}%</span>
              </div>
              <div className="pt-3 border-t border-slate-700 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{data?.overview.operational.branches}</p>
                  <p className="text-xs text-slate-500">Branches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{data?.overview.operational.activeStaff}</p>
                  <p className="text-xs text-slate-500">Active Staff</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activities & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Recent Activities
              </h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {data?.recentActivities?.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.impact === 'HIGH' ? 'bg-red-500' :
                    activity.impact === 'MEDIUM' ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-slate-200">{activity.action}</p>
                    <p className="text-sm text-slate-400">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.userId}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 border border-slate-700"
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Top Performers
            </h3>

            {/* Top Branches */}
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-3">Top Branches</p>
              {data?.topPerformers.branches.map((branch, index) => (
                <div key={branch.name} className="flex items-center justify-between mb-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">#{index + 1}</span>
                    <Building className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-200">{branch.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">{formatCurrency(branch.disbursements)}</span>
                </div>
              ))}
            </div>

            {/* Top Agents */}
            <div>
              <p className="text-sm text-slate-400 mb-3">Top Agents</p>
              {data?.topPerformers.agents.map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between mb-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">#{index + 1}</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-200">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{agent.loans} loans</span>
                    <span className="text-sm font-semibold text-blue-400">{formatCurrency(agent.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Comprehensive Admin Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-8"
        >
          {/* Financial Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(data?.overview.financial.revenue || 0)}</p>
              <div className="flex items-center gap-1 text-sm mt-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-400">+{data?.overview.financial.targetAchievement}% target achieved</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Calculator className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500">Profit</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(data?.overview.financial.profit || 0)}</p>
              <div className="flex items-center gap-1 text-sm mt-2">
                <Percent className="w-4 h-4 text-blue-500" />
                <span className="text-blue-400">{((data?.overview.financial.profit || 0) / (data?.overview.financial.revenue || 1) * 100).toFixed(1)}% margin</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-xs text-slate-500">NPA</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(data?.overview.financial.npaAmount || 0)}</p>
              <div className="flex items-center gap-1 text-sm mt-2">
                <TrendingDown className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-400">{((data?.overview.financial.npaAmount || 0) / (data?.overview.financial.totalOutstanding || 1) * 100).toFixed(1)}% of portfolio</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs text-slate-500">Collection Efficiency</span>
              </div>
              <p className="text-3xl font-bold text-white">{data?.overview.financial.collectionEfficiency}%</p>
              <div className="flex items-center gap-1 text-sm mt-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-400">Excellent performance</span>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions Grid */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Administrative Control Center
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Eye,
                  label: 'Loan Applications',
                  description: 'Review pending applications',
                  color: 'blue',
                  count: data?.overview.loans.pendingApprovals,
                  route: '/admin/loans/pending'
                },
                {
                  icon: Users,
                  label: 'User Management',
                  description: 'Manage users and KYC',
                  color: 'emerald',
                  count: data?.overview.users.kycPending,
                  route: '/admin/users'
                },
                {
                  icon: AlertTriangle,
                  label: 'Collections',
                  description: 'Handle overdue accounts',
                  color: 'yellow',
                  count: data?.overview.collections.overdueLoans,
                  route: '/admin/collections/overdue'
                },
                {
                  icon: Shield,
                  label: 'Risk Management',
                  description: 'Monitor risk factors',
                  color: 'red',
                  count: data?.overview.risk.fraudDetected,
                  route: '/admin/risk'
                },
                {
                  icon: BarChart3,
                  label: 'Analytics Hub',
                  description: 'Business insights',
                  color: 'purple',
                  route: '/admin/analytics'
                },
                {
                  icon: MessageSquare,
                  label: 'Support Center',
                  description: 'Customer support',
                  color: 'pink',
                  route: '/admin/support'
                },
                {
                  icon: ShieldCheck,
                  label: 'Compliance',
                  description: 'Regulatory compliance',
                  color: 'indigo',
                  route: '/admin/compliance'
                },
                {
                  icon: Settings,
                  label: 'System Settings',
                  description: 'Configure platform',
                  color: 'gray',
                  route: '/admin/settings'
                }
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(action.route)}
                  className="glass p-6 rounded-xl border border-slate-700 hover:shadow-glow transition-all text-left group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-${action.color}-500/20 rounded-xl group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                      </div>
                      {action.count && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/20"
                        >
                          {action.count}
                        </motion.span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-100 mb-1 group-hover:text-white transition-colors">{action.label}</h4>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{action.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to access →</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Enhanced KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                AI & Automation Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Fraud Detection Rate</span>
                  <span className="text-emerald-400 font-semibold">99.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Auto Approval Rate</span>
                  <span className="text-blue-400 font-semibold">{data?.overview.loans.approvalRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Processing Efficiency</span>
                  <span className="text-purple-400 font-semibold">+{data?.overview.operational.productivity.disbursalRate}%</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Regional Performance
              </h4>
              <div className="space-y-3">
                {data?.topPerformers.branches.slice(0, 3).map((branch, index) => (
                  <div key={branch.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">{branch.name}</span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(branch.disbursements)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Product Performance
              </h4>
              <div className="space-y-3">
                {data?.topPerformers.products.slice(0, 3).map((product, index) => (
                  <div key={product.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400 text-sm">{product.name}</span>
                    </div>
                    <span className="text-purple-400 font-semibold text-sm">{product.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
  );
}