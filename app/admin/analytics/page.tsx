"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowUpDown,
  Percent,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Building,
  MapPin,
  FileText,
  Settings,
  Zap,
  LineChart
} from "lucide-react";
import { motion } from "framer-motion";

interface BusinessMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalLoansActive: number;
  totalCustomers: number;
  customerGrowth: number;
  portfolioValue: number;
  portfolioGrowth: number;
  netInterestMargin: number;
  returnOnAssets: number;
  costToIncomeRatio: number;
  defaultRate: number;
  recoveryRate: number;
}

interface LoanPerformance {
  loanType: string;
  totalLoans: number;
  disbursedAmount: number;
  outstandingAmount: number;
  interestEarned: number;
  defaultRate: number;
  avgTicketSize: number;
  avgTenure: number;
  approvalRate: number;
  growthRate: number;
}

interface CustomerSegment {
  segment: string;
  customerCount: number;
  percentage: number;
  avgLoanAmount: number;
  profitability: number;
  riskScore: number;
  retentionRate: number;
  cltv: number; // Customer Lifetime Value
}

interface RegionalPerformance {
  region: string;
  state: string;
  totalCustomers: number;
  disbursedAmount: number;
  outstandingAmount: number;
  npa: number;
  branchCount: number;
  marketShare: number;
  growthRate: number;
}

interface TimeSeriesData {
  date: string;
  disbursements: number;
  collections: number;
  newCustomers: number;
  applications: number;
}

interface ProductAnalytics {
  productName: string;
  applications: number;
  approvals: number;
  disbursements: number;
  revenue: number;
  profit: number;
  defaultRate: number;
  customerSatisfaction: number;
  marketDemand: number;
}

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Mock data
  const [businessMetrics] = useState<BusinessMetrics>({
    totalRevenue: 425000000,
    revenueGrowth: 18.5,
    totalLoansActive: 12450,
    totalCustomers: 45287,
    customerGrowth: 24.2,
    portfolioValue: 8750000000,
    portfolioGrowth: 22.8,
    netInterestMargin: 12.8,
    returnOnAssets: 3.2,
    costToIncomeRatio: 45.6,
    defaultRate: 2.8,
    recoveryRate: 87.3
  });

  const [loanPerformance] = useState<LoanPerformance[]>([
    {
      loanType: 'Personal Loans',
      totalLoans: 5647,
      disbursedAmount: 2850000000,
      outstandingAmount: 2340000000,
      interestEarned: 285000000,
      defaultRate: 3.2,
      avgTicketSize: 450000,
      avgTenure: 36,
      approvalRate: 68.5,
      growthRate: 25.3
    },
    {
      loanType: 'Business Loans',
      totalLoans: 2134,
      disbursedAmount: 3200000000,
      outstandingAmount: 2890000000,
      interestEarned: 384000000,
      defaultRate: 2.1,
      avgTicketSize: 1500000,
      avgTenure: 48,
      approvalRate: 72.1,
      growthRate: 18.7
    },
    {
      loanType: 'Home Loans',
      totalLoans: 1847,
      disbursedAmount: 4650000000,
      outstandingAmount: 4320000000,
      interestEarned: 387000000,
      defaultRate: 1.5,
      avgTicketSize: 2520000,
      avgTenure: 180,
      approvalRate: 78.9,
      growthRate: 15.2
    },
    {
      loanType: 'Vehicle Loans',
      totalLoans: 2089,
      disbursedAmount: 1670000000,
      outstandingAmount: 1450000000,
      interestEarned: 167000000,
      defaultRate: 2.8,
      avgTicketSize: 800000,
      avgTenure: 60,
      approvalRate: 85.3,
      growthRate: 22.1
    },
    {
      loanType: 'Education Loans',
      totalLoans: 733,
      disbursedAmount: 440000000,
      outstandingAmount: 390000000,
      interestEarned: 37400000,
      defaultRate: 1.8,
      avgTicketSize: 600000,
      avgTenure: 96,
      approvalRate: 79.4,
      growthRate: 28.9
    }
  ]);

  const [customerSegments] = useState<CustomerSegment[]>([
    {
      segment: 'Premium Customers',
      customerCount: 4528,
      percentage: 10.0,
      avgLoanAmount: 2500000,
      profitability: 450000,
      riskScore: 25,
      retentionRate: 95.2,
      cltv: 2850000
    },
    {
      segment: 'Salaried Professionals',
      customerCount: 18114,
      percentage: 40.0,
      avgLoanAmount: 850000,
      profitability: 125000,
      riskScore: 45,
      retentionRate: 87.6,
      cltv: 1250000
    },
    {
      segment: 'Business Owners',
      customerCount: 9057,
      percentage: 20.0,
      avgLoanAmount: 1850000,
      profitability: 285000,
      riskScore: 35,
      retentionRate: 92.1,
      cltv: 2100000
    },
    {
      segment: 'First-time Borrowers',
      customerCount: 9057,
      percentage: 20.0,
      avgLoanAmount: 450000,
      profitability: 65000,
      riskScore: 65,
      retentionRate: 78.4,
      cltv: 650000
    },
    {
      segment: 'Rural Customers',
      customerCount: 4529,
      percentage: 10.0,
      avgLoanAmount: 350000,
      profitability: 45000,
      riskScore: 55,
      retentionRate: 82.3,
      cltv: 480000
    }
  ]);

  const [regionalPerformance] = useState<RegionalPerformance[]>([
    {
      region: 'West',
      state: 'Maharashtra',
      totalCustomers: 12847,
      disbursedAmount: 3200000000,
      outstandingAmount: 2890000000,
      npa: 2.1,
      branchCount: 15,
      marketShare: 8.5,
      growthRate: 22.3
    },
    {
      region: 'South',
      state: 'Karnataka',
      totalCustomers: 8965,
      disbursedAmount: 2150000000,
      outstandingAmount: 1950000000,
      npa: 1.8,
      branchCount: 12,
      marketShare: 6.2,
      growthRate: 25.7
    },
    {
      region: 'West',
      state: 'Gujarat',
      totalCustomers: 6754,
      disbursedAmount: 1680000000,
      outstandingAmount: 1520000000,
      npa: 2.5,
      branchCount: 9,
      marketShare: 5.1,
      growthRate: 18.9
    },
    {
      region: 'South',
      state: 'Tamil Nadu',
      totalCustomers: 5432,
      disbursedAmount: 1320000000,
      outstandingAmount: 1180000000,
      npa: 2.0,
      branchCount: 8,
      marketShare: 4.8,
      growthRate: 21.2
    },
    {
      region: 'North',
      state: 'Delhi NCR',
      totalCustomers: 4289,
      disbursedAmount: 1580000000,
      outstandingAmount: 1420000000,
      npa: 3.1,
      branchCount: 6,
      marketShare: 7.2,
      growthRate: 19.5
    }
  ]);

  const [timeSeriesData] = useState<TimeSeriesData[]>([
    { date: '2024-01-01', disbursements: 150000000, collections: 125000000, newCustomers: 235, applications: 450 },
    { date: '2024-01-02', disbursements: 165000000, collections: 130000000, newCustomers: 287, applications: 520 },
    { date: '2024-01-03', disbursements: 145000000, collections: 135000000, newCustomers: 198, applications: 380 },
    { date: '2024-01-04', disbursements: 180000000, collections: 140000000, newCustomers: 325, applications: 680 },
    { date: '2024-01-05', disbursements: 195000000, collections: 145000000, newCustomers: 356, applications: 750 },
    { date: '2024-01-06', disbursements: 175000000, collections: 138000000, newCustomers: 289, applications: 620 },
    { date: '2024-01-07', disbursements: 210000000, collections: 155000000, newCustomers: 398, applications: 890 },
    { date: '2024-01-08', disbursements: 185000000, collections: 148000000, newCustomers: 312, applications: 720 },
    { date: '2024-01-09', disbursements: 170000000, collections: 142000000, newCustomers: 267, applications: 540 },
    { date: '2024-01-10', disbursements: 225000000, collections: 165000000, newCustomers: 445, applications: 980 },
    { date: '2024-01-11', disbursements: 160000000, collections: 135000000, newCustomers: 234, applications: 420 },
    { date: '2024-01-12', disbursements: 190000000, collections: 152000000, newCustomers: 378, applications: 720 },
    { date: '2024-01-13', disbursements: 205000000, collections: 158000000, newCustomers: 412, applications: 820 },
    { date: '2024-01-14', disbursements: 240000000, collections: 175000000, newCustomers: 485, applications: 1050 }
  ]);

  const [productAnalytics] = useState<ProductAnalytics[]>([
    {
      productName: 'Instant Personal Loan',
      applications: 2456,
      approvals: 1987,
      disbursements: 1876,
      revenue: 125000000,
      profit: 38500000,
      defaultRate: 3.2,
      customerSatisfaction: 4.6,
      marketDemand: 85
    },
    {
      productName: 'Business Growth Loan',
      applications: 1234,
      approvals: 987,
      disbursements: 945,
      revenue: 185000000,
      profit: 67500000,
      defaultRate: 2.1,
      customerSatisfaction: 4.4,
      marketDemand: 78
    },
    {
      productName: 'Home Loan Premium',
      applications: 789,
      approvals: 654,
      disbursements: 625,
      revenue: 245000000,
      profit: 89200000,
      defaultRate: 1.5,
      customerSatisfaction: 4.8,
      marketDemand: 92
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return 'text-green-400';
    if (risk <= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Business Analytics Dashboard</h1>
            <p className="text-slate-400">Comprehensive insights into business performance and trends</p>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{(businessMetrics.totalRevenue / 10000000).toFixed(0)}Cr</p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(businessMetrics.revenueGrowth)}`}>
                  {getGrowthIcon(businessMetrics.revenueGrowth)}
                  {businessMetrics.revenueGrowth}% YoY
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold text-white">₹{(businessMetrics.portfolioValue / 10000000).toFixed(0)}Cr</p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(businessMetrics.portfolioGrowth)}`}>
                  {getGrowthIcon(businessMetrics.portfolioGrowth)}
                  {businessMetrics.portfolioGrowth}% growth
                </p>
              </div>
              <Building className="h-12 w-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Customers</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.totalCustomers.toLocaleString()}</p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(businessMetrics.customerGrowth)}`}>
                  {getGrowthIcon(businessMetrics.customerGrowth)}
                  {businessMetrics.customerGrowth}% growth
                </p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Loans</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.totalLoansActive.toLocaleString()}</p>
                <p className="text-slate-400 text-sm mt-1">Across all products</p>
              </div>
              <CreditCard className="h-12 w-12 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Financial Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Net Interest Margin</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.netInterestMargin}%</p>
                <p className="text-green-400 text-sm mt-1">Industry: 11.2%</p>
              </div>
              <Percent className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Return on Assets</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.returnOnAssets}%</p>
                <p className="text-green-400 text-sm mt-1">Above target</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Cost to Income</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.costToIncomeRatio}%</p>
                <p className="text-yellow-400 text-sm mt-1">Target: 42%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Recovery Rate</p>
                <p className="text-2xl font-bold text-white">{businessMetrics.recoveryRate}%</p>
                <p className="text-green-400 text-sm mt-1">Excellent</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>
        </div>

        {/* Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Business Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('disbursements')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedMetric === 'disbursements'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Disbursements
              </button>
              <button
                onClick={() => setSelectedMetric('collections')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedMetric === 'collections'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Collections
              </button>
              <button
                onClick={() => setSelectedMetric('customers')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedMetric === 'customers'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                New Customers
              </button>
              <button
                onClick={() => setSelectedMetric('applications')}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedMetric === 'applications'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Applications
              </button>
            </div>
          </div>

          {/* Simplified chart representation */}
          <div className="h-64 flex items-end gap-2">
            {timeSeriesData.slice(-14).map((data, index) => {
              let value: number;
              let maxValue: number;

              switch (selectedMetric) {
                case 'disbursements':
                  value = data.disbursements;
                  maxValue = 250000000;
                  break;
                case 'collections':
                  value = data.collections;
                  maxValue = 180000000;
                  break;
                case 'customers':
                  value = data.newCustomers;
                  maxValue = 500;
                  break;
                case 'applications':
                  value = data.applications;
                  maxValue = 1100;
                  break;
                default:
                  value = data.disbursements;
                  maxValue = 250000000;
              }

              const height = (value / maxValue) * 240;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-400 transition-colors cursor-pointer"
                    style={{ height: `${height}px` }}
                    title={`${new Date(data.date).toLocaleDateString()}: ${
                      selectedMetric === 'disbursements' || selectedMetric === 'collections'
                        ? `₹${(value / 10000000).toFixed(1)}Cr`
                        : value.toLocaleString()
                    }`}
                  />
                  <div className="text-xs text-slate-400 mt-2 transform -rotate-45 origin-left">
                    {new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Loan Performance & Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Loan Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Loan Product Performance</h3>
            <div className="space-y-4">
              {loanPerformance.map((loan, index) => (
                <div key={loan.loanType} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{loan.loanType}</h4>
                    <span className={`text-sm font-medium ${getGrowthColor(loan.growthRate)}`}>
                      {loan.growthRate > 0 ? '+' : ''}{loan.growthRate}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Outstanding</p>
                      <p className="text-white">₹{(loan.outstandingAmount / 10000000).toFixed(1)}Cr</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Default Rate</p>
                      <p className={getRiskColor(loan.defaultRate * 20)}>{loan.defaultRate}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Approval Rate</p>
                      <p className="text-white">{loan.approvalRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Customer Segments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Customer Segmentation</h3>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={segment.segment} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{segment.segment}</h4>
                    <span className="text-slate-400 text-sm">{segment.percentage}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Customers</p>
                      <p className="text-white">{segment.customerCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Avg Loan</p>
                      <p className="text-white">₹{(segment.avgLoanAmount / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-slate-400">CLTV</p>
                      <p className="text-white">₹{(segment.cltv / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-400 text-xs">Risk Score</span>
                      <span className={`text-xs ${getRiskColor(segment.riskScore)}`}>{segment.riskScore}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${segment.riskScore <= 30 ? 'bg-green-500' : segment.riskScore <= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${segment.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Regional Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Regional Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">State</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Customers</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Outstanding</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">NPA</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Market Share</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Growth</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Branches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {regionalPerformance.map((region, index) => (
                  <tr key={region.state} className="hover:bg-slate-700/50">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">{region.state}</p>
                        <p className="text-slate-400 text-sm">{region.region} Region</p>
                      </div>
                    </td>
                    <td className="py-4 text-white">{region.totalCustomers.toLocaleString()}</td>
                    <td className="py-4 text-white">₹{(region.outstandingAmount / 10000000).toFixed(1)}Cr</td>
                    <td className="py-4">
                      <span className={getRiskColor(region.npa * 20)}>{region.npa}%</span>
                    </td>
                    <td className="py-4 text-white">{region.marketShare}%</td>
                    <td className="py-4">
                      <span className={getGrowthColor(region.growthRate)}>
                        {region.growthRate > 0 ? '+' : ''}{region.growthRate}%
                      </span>
                    </td>
                    <td className="py-4 text-white">{region.branchCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Product Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Product Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {productAnalytics.map((product, index) => (
              <div key={product.productName} className="p-4 bg-slate-700 rounded-lg">
                <h4 className="text-white font-medium mb-4">{product.productName}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Applications</span>
                    <span className="text-white">{product.applications.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Conversion Rate</span>
                    <span className="text-white">{Math.round((product.disbursements / product.applications) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Revenue</span>
                    <span className="text-white">₹{(product.revenue / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Profit Margin</span>
                    <span className="text-white">{Math.round((product.profit / product.revenue) * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Customer Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white">{product.customerSatisfaction}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.floor(product.customerSatisfaction) ? 'bg-yellow-400' : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-400 text-sm">Market Demand</span>
                      <span className="text-white text-sm">{product.marketDemand}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${product.marketDemand}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}