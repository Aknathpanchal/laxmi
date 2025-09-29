'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, Calculator, Percent,
  IndianRupee, Building, Users, CreditCard, Target, Award,
  AlertTriangle, CheckCircle, Clock, FileText, Download,
  RefreshCw, BarChart3, PieChart as PieChartIcon, Activity,
  ArrowUpRight, ArrowDownRight, Package, Database, Globe,
  Settings, Bell, Filter, Search, Eye, ExternalLink,
  Calendar, Phone, Mail, MapPin, Star, Flag, Zap,
  Shield, UserCheck, History, Gift, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// FinanceManagerLayout is already applied by ConditionalLayout based on user role

interface FinancialMetrics {
  overview: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    liquidityRatio: number;
    roa: number; // Return on Assets
    roe: number; // Return on Equity
    nim: number; // Net Interest Margin
    costOfFunds: number;
  };
  performance: {
    totalRevenue: number;
    revenueGrowth: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    operatingExpenseRatio: number;
    ebitda: number;
    provisioning: number;
  };
  portfolio: {
    totalDisbursements: number;
    totalOutstanding: number;
    totalCollections: number;
    grossNPA: number;
    netNPA: number;
    npaRatio: number;
    provisionCoverage: number;
    avgLoanSize: number;
  };
  cashFlow: {
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netCashFlow: number;
    cashReserves: number;
    creditUtilization: number;
  };
  compliance: {
    capitalAdequacyRatio: number;
    tierICapital: number;
    riskWeightedAssets: number;
    exposureNorms: number;
    statutoryReserves: number;
    complianceScore: number;
  };
}

interface BudgetAnalysis {
  department: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  ytdBudget: number;
  ytdActual: number;
}

interface CashFlowProjection {
  month: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeFlow: number;
}

export default function FinanceManagerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetAnalysis[]>([]);
  const [cashFlowData, setCashFlowData] = useState<CashFlowProjection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'portfolio' | 'compliance'>('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'FINANCE_MANAGER') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Mock data
  const mockMetrics: FinancialMetrics = {
    overview: {
      totalAssets: 5750000000,
      totalLiabilities: 4200000000,
      netWorth: 1550000000,
      liquidityRatio: 1.85,
      roa: 2.8,
      roe: 18.5,
      nim: 8.2,
      costOfFunds: 6.8
    },
    performance: {
      totalRevenue: 425000000,
      revenueGrowth: 15.8,
      totalExpenses: 295000000,
      netProfit: 130000000,
      profitMargin: 30.6,
      operatingExpenseRatio: 45.2,
      ebitda: 185000000,
      provisioning: 25000000
    },
    portfolio: {
      totalDisbursements: 3250000000,
      totalOutstanding: 2850000000,
      totalCollections: 2890000000,
      grossNPA: 145000000,
      netNPA: 98000000,
      npaRatio: 5.1,
      provisionCoverage: 32.4,
      avgLoanSize: 245000
    },
    cashFlow: {
      operatingCashFlow: 156000000,
      investingCashFlow: -85000000,
      financingCashFlow: -45000000,
      netCashFlow: 26000000,
      cashReserves: 485000000,
      creditUtilization: 68.5
    },
    compliance: {
      capitalAdequacyRatio: 15.8,
      tierICapital: 18.2,
      riskWeightedAssets: 4200000000,
      exposureNorms: 92.5,
      statutoryReserves: 125000000,
      complianceScore: 96.8
    }
  };

  const mockBudgetData: BudgetAnalysis[] = [
    {
      department: 'Operations',
      budgeted: 45000000,
      actual: 42500000,
      variance: -2500000,
      variancePercent: -5.6,
      ytdBudget: 540000000,
      ytdActual: 518000000
    },
    {
      department: 'Technology',
      budgeted: 25000000,
      actual: 28500000,
      variance: 3500000,
      variancePercent: 14.0,
      ytdBudget: 300000000,
      ytdActual: 325000000
    },
    {
      department: 'Marketing',
      budgeted: 15000000,
      actual: 14200000,
      variance: -800000,
      variancePercent: -5.3,
      ytdBudget: 180000000,
      ytdActual: 175000000
    },
    {
      department: 'Collections',
      budgeted: 18000000,
      actual: 16800000,
      variance: -1200000,
      variancePercent: -6.7,
      ytdBudget: 216000000,
      ytdActual: 205000000
    }
  ];

  const mockCashFlowData: CashFlowProjection[] = [
    { month: 'Jan', inflow: 245000000, outflow: 185000000, netFlow: 60000000, cumulativeFlow: 60000000 },
    { month: 'Feb', inflow: 265000000, outflow: 195000000, netFlow: 70000000, cumulativeFlow: 130000000 },
    { month: 'Mar', inflow: 285000000, outflow: 210000000, netFlow: 75000000, cumulativeFlow: 205000000 },
    { month: 'Apr', inflow: 295000000, outflow: 225000000, netFlow: 70000000, cumulativeFlow: 275000000 },
    { month: 'May', inflow: 310000000, outflow: 240000000, netFlow: 70000000, cumulativeFlow: 345000000 },
    { month: 'Jun', inflow: 325000000, outflow: 255000000, netFlow: 70000000, cumulativeFlow: 415000000 }
  ];

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockMetrics);
      setBudgetData(mockBudgetData);
      setCashFlowData(mockCashFlowData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMetrics(mockMetrics);
      setBudgetData(mockBudgetData);
      setCashFlowData(mockCashFlowData);
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-400';
    if (variance < 0) return 'text-green-400';
    return 'text-slate-400';
  };

  const COLORS = ['#0ea5e9', '#34d399', '#fbbf24', '#f472b6', '#ef4444', '#8b5cf6'];

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
  if (!user || user.role !== 'FINANCE_MANAGER') {
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
            <p className="mt-4 text-slate-400">Loading finance dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-400" />
              Finance Dashboard
            </h1>
            <p className="text-slate-400">Financial performance and portfolio management</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Key Financial Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Net Worth</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(metrics?.overview.netWorth || 0)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Strong position</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500">ROE</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.overview.roe || 0)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <span className="text-blue-400">Excellent returns</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Percent className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">NPA Ratio</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.portfolio.npaRatio || 0)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <AlertTriangle className="w-4 h-4 text-purple-500" />
              <span className="text-purple-400">Within limits</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-slate-500">CAR</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.compliance.capitalAdequacyRatio || 0)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Compliant</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-slate-800 p-1 rounded-lg mb-8"
        >
          {[
            { id: 'overview', label: 'Financial Overview', icon: BarChart3 },
            { id: 'performance', label: 'P&L Analysis', icon: TrendingUp },
            { id: 'portfolio', label: 'Portfolio Health', icon: PieChartIcon },
            { id: 'compliance', label: 'Compliance', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cash Flow Analysis */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Cash Flow Projection
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(value) => `₹${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${(value / 1000000).toFixed(1)}M`, '']}
                    />
                    <Area type="monotone" dataKey="inflow" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="outflow" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="netFlow" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Asset & Liability Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-green-400" />
                    Assets Composition
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Assets</span>
                      <span className="text-white font-semibold">{formatCurrency(metrics?.overview.totalAssets || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Loan Portfolio</span>
                      <span className="text-green-400 font-semibold">{formatCurrency(metrics?.portfolio.totalOutstanding || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Cash & Equivalents</span>
                      <span className="text-blue-400 font-semibold">{formatCurrency(metrics?.cashFlow.cashReserves || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Other Assets</span>
                      <span className="text-purple-400 font-semibold">
                        {formatCurrency((metrics?.overview.totalAssets || 0) - (metrics?.portfolio.totalOutstanding || 0) - (metrics?.cashFlow.cashReserves || 0))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-400" />
                    Liabilities Structure
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Liabilities</span>
                      <span className="text-white font-semibold">{formatCurrency(metrics?.overview.totalLiabilities || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Borrowings</span>
                      <span className="text-red-400 font-semibold">{formatCurrency((metrics?.overview.totalLiabilities || 0) * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Deposits</span>
                      <span className="text-orange-400 font-semibold">{formatCurrency((metrics?.overview.totalLiabilities || 0) * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Other Liabilities</span>
                      <span className="text-yellow-400 font-semibold">{formatCurrency((metrics?.overview.totalLiabilities || 0) * 0.1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Revenue & Profitability */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Revenue Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatCurrency(metrics?.performance.totalRevenue || 0)}</p>
                      <p className="text-green-400 text-sm">+{formatPercentage(metrics?.performance.revenueGrowth || 0)} YoY</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Interest Income</span>
                        <span className="text-white">{formatCurrency((metrics?.performance.totalRevenue || 0) * 0.85)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fee Income</span>
                        <span className="text-white">{formatCurrency((metrics?.performance.totalRevenue || 0) * 0.15)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-400" />
                    Cost Analysis
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatCurrency(metrics?.performance.totalExpenses || 0)}</p>
                      <p className="text-blue-400 text-sm">{formatPercentage(metrics?.performance.operatingExpenseRatio || 0)} of revenue</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Interest Expense</span>
                        <span className="text-white">{formatCurrency((metrics?.performance.totalExpenses || 0) * 0.6)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Operating Expense</span>
                        <span className="text-white">{formatCurrency((metrics?.performance.totalExpenses || 0) * 0.4)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    Profitability
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatCurrency(metrics?.performance.netProfit || 0)}</p>
                      <p className="text-purple-400 text-sm">{formatPercentage(metrics?.performance.profitMargin || 0)} margin</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">EBITDA</span>
                        <span className="text-white">{formatCurrency(metrics?.performance.ebitda || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Provisioning</span>
                        <span className="text-white">{formatCurrency(metrics?.performance.provisioning || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget vs Actual Analysis */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  Budget vs Actual Analysis
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400">Department</th>
                        <th className="text-right py-3 px-4 text-slate-400">Budgeted</th>
                        <th className="text-right py-3 px-4 text-slate-400">Actual</th>
                        <th className="text-right py-3 px-4 text-slate-400">Variance</th>
                        <th className="text-right py-3 px-4 text-slate-400">Variance %</th>
                        <th className="text-right py-3 px-4 text-slate-400">YTD Budget</th>
                        <th className="text-right py-3 px-4 text-slate-400">YTD Actual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetData.map((item, index) => (
                        <tr key={index} className="border-b border-slate-700/50">
                          <td className="py-3 px-4 text-white font-medium">{item.department}</td>
                          <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(item.budgeted)}</td>
                          <td className="py-3 px-4 text-right text-white">{formatCurrency(item.actual)}</td>
                          <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(item.variance)}`}>
                            {formatCurrency(Math.abs(item.variance))}
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(item.variance)}`}>
                            {item.variancePercent > 0 ? '+' : ''}{formatPercentage(item.variancePercent)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(item.ytdBudget)}</td>
                          <td className="py-3 px-4 text-right text-white">{formatCurrency(item.ytdActual)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              {/* Portfolio Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-400" />
                    Portfolio Size
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatCurrency(metrics?.portfolio.totalOutstanding || 0)}</p>
                      <p className="text-green-400 text-sm">Outstanding Amount</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Disbursed</span>
                        <span className="text-white">{formatCurrency(metrics?.portfolio.totalDisbursements || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Collections</span>
                        <span className="text-white">{formatCurrency(metrics?.portfolio.totalCollections || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Asset Quality
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.portfolio.npaRatio || 0)}</p>
                      <p className="text-red-400 text-sm">NPA Ratio</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Gross NPA</span>
                        <span className="text-white">{formatCurrency(metrics?.portfolio.grossNPA || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Net NPA</span>
                        <span className="text-white">{formatCurrency(metrics?.portfolio.netNPA || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Provision Coverage
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.portfolio.provisionCoverage || 0)}</p>
                      <p className="text-blue-400 text-sm">Coverage Ratio</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Avg Loan Size</span>
                        <span className="text-white">{formatCurrency(metrics?.portfolio.avgLoanSize || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Risk Weight</span>
                        <span className="text-white">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Distribution Chart */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-400" />
                  Portfolio Distribution by Product
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Personal Loans', value: 45, amount: 1282500000 },
                        { name: 'Business Loans', value: 30, amount: 855000000 },
                        { name: 'Emergency Loans', value: 15, amount: 427500000 },
                        { name: 'Salary Advance', value: 10, amount: 285000000 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% (${formatCurrency(props.payload.amount)})`,
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Regulatory Compliance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Capital Adequacy
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.compliance.capitalAdequacyRatio || 0)}</p>
                      <p className="text-green-400 text-sm">CAR (Min: 15%)</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tier I Capital</span>
                        <span className="text-white">{formatPercentage(metrics?.compliance.tierICapital || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Risk Weighted Assets</span>
                        <span className="text-white">{formatCurrency(metrics?.compliance.riskWeightedAssets || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Exposure Norms
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.compliance.exposureNorms || 0)}</p>
                      <p className="text-blue-400 text-sm">Within Limits</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Single Borrower</span>
                        <span className="text-white">&lt; 20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Group Borrower</span>
                        <span className="text-white">&lt; 25%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    Compliance Score
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.compliance.complianceScore || 0)}</p>
                      <p className="text-purple-400 text-sm">Overall Score</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Statutory Reserves</span>
                        <span className="text-white">{formatCurrency(metrics?.compliance.statutoryReserves || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Last Audit</span>
                        <span className="text-white">Dec 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Regulatory Compliance Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { item: 'RBI Returns Filed', status: 'COMPLIANT', dueDate: '2024-02-15' },
                    { item: 'ALM Returns', status: 'COMPLIANT', dueDate: '2024-01-31' },
                    { item: 'Auditor Report', status: 'PENDING', dueDate: '2024-03-31' },
                    { item: 'Board Meeting Minutes', status: 'COMPLIANT', dueDate: '2024-01-30' },
                    { item: 'Risk Management Policy', status: 'COMPLIANT', dueDate: 'Annual' },
                    { item: 'KYC/AML Compliance', status: 'COMPLIANT', dueDate: 'Ongoing' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.item}</p>
                        <p className="text-slate-400 text-sm">Due: {item.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'COMPLIANT' ? 'text-green-400 bg-green-900/20' :
                        'text-yellow-400 bg-yellow-900/20'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}