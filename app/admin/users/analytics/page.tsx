"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Activity,
  CreditCard,
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  BarChart3,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

interface UserDemographics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  ageDistribution: { range: string; count: number; percentage: number }[];
  genderDistribution: { gender: string; count: number; percentage: number }[];
  locationDistribution: { state: string; count: number; percentage: number }[];
  tierDistribution: { tier: string; count: number; percentage: number }[];
}

interface KYCAnalytics {
  totalSubmissions: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  verificationRate: number;
  avgProcessingTime: number;
  documentTypeStats: { type: string; submissions: number; successRate: number }[];
  rejectionReasons: { reason: string; count: number; percentage: number }[];
}

interface UserBehavior {
  avgSessionDuration: number;
  avgMonthlyLogins: number;
  featureUsage: { feature: string; usage: number; users: number }[];
  deviceStats: { device: string; count: number; percentage: number }[];
  timeOfDayActivity: { hour: number; activity: number }[];
  retentionRates: { period: string; rate: number }[];
}

interface CreditMetrics {
  avgCreditScore: number;
  creditScoreDistribution: { range: string; count: number; percentage: number }[];
  loanApplications: number;
  loanApprovalRate: number;
  avgLoanAmount: number;
  defaultRate: number;
}

export default function UserAnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
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

  // Mock data - in real app, this would come from API
  const demographics: UserDemographics = {
    totalUsers: 45287,
    activeUsers: 38924,
    newUsersThisMonth: 3456,
    userGrowthRate: 12.5,
    ageDistribution: [
      { range: '18-25', count: 12847, percentage: 28.4 },
      { range: '26-35', count: 18965, percentage: 41.9 },
      { range: '36-45', count: 9876, percentage: 21.8 },
      { range: '46-55', count: 2854, percentage: 6.3 },
      { range: '55+', count: 745, percentage: 1.6 }
    ],
    genderDistribution: [
      { gender: 'Male', count: 26573, percentage: 58.7 },
      { gender: 'Female', count: 17892, percentage: 39.5 },
      { gender: 'Other', count: 822, percentage: 1.8 }
    ],
    locationDistribution: [
      { state: 'Maharashtra', count: 12847, percentage: 28.4 },
      { state: 'Karnataka', count: 8965, percentage: 19.8 },
      { state: 'Gujarat', count: 6754, percentage: 14.9 },
      { state: 'Tamil Nadu', count: 5432, percentage: 12.0 },
      { state: 'Delhi', count: 4289, percentage: 9.5 },
      { state: 'Others', count: 7000, percentage: 15.4 }
    ],
    tierDistribution: [
      { tier: 'BASIC', count: 25647, percentage: 56.6 },
      { tier: 'SILVER', count: 12893, percentage: 28.5 },
      { tier: 'GOLD', count: 5412, percentage: 11.9 },
      { tier: 'PLATINUM', count: 1335, percentage: 3.0 }
    ]
  };

  const kycAnalytics: KYCAnalytics = {
    totalSubmissions: 42156,
    verifiedCount: 38924,
    pendingCount: 2156,
    rejectedCount: 1076,
    verificationRate: 92.3,
    avgProcessingTime: 4.2,
    documentTypeStats: [
      { type: 'Aadhaar', submissions: 42156, successRate: 95.2 },
      { type: 'PAN', submissions: 42156, successRate: 97.8 },
      { type: 'Bank Statement', submissions: 38924, successRate: 89.4 },
      { type: 'Salary Slip', submissions: 35672, successRate: 91.7 },
      { type: 'Photo', submissions: 42156, successRate: 96.1 }
    ],
    rejectionReasons: [
      { reason: 'Document Quality', count: 452, percentage: 42.0 },
      { reason: 'Information Mismatch', count: 323, percentage: 30.0 },
      { reason: 'Expired Document', count: 161, percentage: 15.0 },
      { reason: 'Suspicious Activity', count: 86, percentage: 8.0 },
      { reason: 'Technical Issues', count: 54, percentage: 5.0 }
    ]
  };

  const userBehavior: UserBehavior = {
    avgSessionDuration: 18.5,
    avgMonthlyLogins: 12.3,
    featureUsage: [
      { feature: 'Loan Application', usage: 85.6, users: 38724 },
      { feature: 'Payment Gateway', usage: 92.1, users: 41654 },
      { feature: 'Profile Management', usage: 67.8, users: 30654 },
      { feature: 'Document Upload', usage: 78.9, users: 35712 },
      { feature: 'Customer Support', usage: 23.4, users: 10597 }
    ],
    deviceStats: [
      { device: 'Mobile', count: 32145, percentage: 71.0 },
      { device: 'Desktop', count: 9857, percentage: 21.8 },
      { device: 'Tablet', count: 3285, percentage: 7.2 }
    ],
    timeOfDayActivity: [
      { hour: 0, activity: 15 }, { hour: 1, activity: 8 }, { hour: 2, activity: 5 },
      { hour: 3, activity: 3 }, { hour: 4, activity: 2 }, { hour: 5, activity: 4 },
      { hour: 6, activity: 12 }, { hour: 7, activity: 25 }, { hour: 8, activity: 45 },
      { hour: 9, activity: 78 }, { hour: 10, activity: 95 }, { hour: 11, activity: 88 },
      { hour: 12, activity: 72 }, { hour: 13, activity: 65 }, { hour: 14, activity: 82 },
      { hour: 15, activity: 90 }, { hour: 16, activity: 87 }, { hour: 17, activity: 75 },
      { hour: 18, activity: 68 }, { hour: 19, activity: 58 }, { hour: 20, activity: 45 },
      { hour: 21, activity: 35 }, { hour: 22, activity: 28 }, { hour: 23, activity: 22 }
    ],
    retentionRates: [
      { period: '1 Day', rate: 87.5 },
      { period: '7 Days', rate: 72.3 },
      { period: '30 Days', rate: 58.9 },
      { period: '90 Days', rate: 45.2 },
      { period: '180 Days', rate: 38.7 },
      { period: '1 Year', rate: 32.1 }
    ]
  };

  const creditMetrics: CreditMetrics = {
    avgCreditScore: 685,
    creditScoreDistribution: [
      { range: '300-549', count: 2264, percentage: 5.0 },
      { range: '550-649', count: 9057, percentage: 20.0 },
      { range: '650-749', count: 18143, percentage: 40.1 },
      { range: '750-849', count: 13586, percentage: 30.0 },
      { range: '850-900', count: 2237, percentage: 4.9 }
    ],
    loanApplications: 28456,
    loanApprovalRate: 68.7,
    avgLoanAmount: 125000,
    defaultRate: 3.2
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const exportData = () => {
    // Export analytics data as CSV
    console.log('Exporting analytics data...');
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
            <h1 className="text-3xl font-bold text-white mb-2">User Analytics</h1>
            <p className="text-slate-400">Comprehensive insights into user behavior and demographics</p>
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{demographics.totalUsers.toLocaleString()}</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  {demographics.userGrowthRate}% this month
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{demographics.activeUsers.toLocaleString()}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {((demographics.activeUsers / demographics.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </div>
              <Activity className="h-12 w-12 text-green-500" />
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
                <p className="text-slate-400 text-sm">KYC Verified</p>
                <p className="text-2xl font-bold text-white">{kycAnalytics.verificationRate}%</p>
                <p className="text-slate-400 text-sm mt-1">
                  {kycAnalytics.verifiedCount.toLocaleString()} verified
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-purple-500" />
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
                <p className="text-slate-400 text-sm">Avg Credit Score</p>
                <p className="text-2xl font-bold text-white">{creditMetrics.avgCreditScore}</p>
                <p className="text-slate-400 text-sm mt-1">
                  {creditMetrics.loanApprovalRate}% approval rate
                </p>
              </div>
              <CreditCard className="h-12 w-12 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Demographics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Age Distribution
            </h3>
            <div className="space-y-3">
              {demographics.ageDistribution.map((age, index) => (
                <div key={age.range} className="flex items-center justify-between">
                  <span className="text-slate-300">{age.range}</span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${age.percentage}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm min-w-[60px]">
                      {age.count.toLocaleString()} ({age.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Location Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geographic Distribution
            </h3>
            <div className="space-y-3">
              {demographics.locationDistribution.map((location, index) => (
                <div key={location.state} className="flex items-center justify-between">
                  <span className="text-slate-300">{location.state}</span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(location.percentage / 30) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm min-w-[60px]">
                      {location.count.toLocaleString()} ({location.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* KYC Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            KYC Verification Analytics
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Document Success Rates */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Document Success Rates</h4>
              <div className="space-y-3">
                {kycAnalytics.documentTypeStats.map((doc, index) => (
                  <div key={doc.type} className="flex items-center justify-between">
                    <span className="text-slate-300">{doc.type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${doc.successRate}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm min-w-[50px]">{doc.successRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reasons */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Rejection Reasons</h4>
              <div className="space-y-3">
                {kycAnalytics.rejectionReasons.map((reason, index) => (
                  <div key={reason.reason} className="flex items-center justify-between">
                    <span className="text-slate-300">{reason.reason}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${reason.percentage}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm min-w-[50px]">{reason.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{kycAnalytics.verifiedCount.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{kycAnalytics.pendingCount.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{kycAnalytics.rejectedCount.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Rejected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{kycAnalytics.avgProcessingTime} hrs</p>
              <p className="text-slate-400 text-sm">Avg Processing</p>
            </div>
          </div>
        </motion.div>

        {/* User Behavior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Feature Usage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Feature Usage
            </h3>
            <div className="space-y-4">
              {userBehavior.featureUsage.map((feature, index) => (
                <div key={feature.feature}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300">{feature.feature}</span>
                    <span className="text-slate-400 text-sm">{feature.usage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{feature.users.toLocaleString()} users</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Credit Score Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Credit Score Distribution
            </h3>
            <div className="space-y-3">
              {creditMetrics.creditScoreDistribution.map((score, index) => (
                <div key={score.range} className="flex items-center justify-between">
                  <span className="text-slate-300">{score.range}</span>
                  <div className="flex items-center gap-3 flex-1 mx-4">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm min-w-[60px]">
                      {score.count.toLocaleString()} ({score.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Loan Applications</p>
                <p className="text-xl font-bold text-white">{creditMetrics.loanApplications.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Default Rate</p>
                <p className="text-xl font-bold text-red-400">{creditMetrics.defaultRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            User Retention Rates
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {userBehavior.retentionRates.map((retention, index) => (
              <div key={retention.period} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgb(51 65 85)"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgb(59 130 246)"
                      strokeWidth="2"
                      strokeDasharray={`${retention.rate}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{retention.rate}%</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{retention.period}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}