"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  PieChart,
  DollarSign,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Eye,
  Search,
  ArrowUpDown,
  Phone,
  Mail,
  MapPin,
  Percent,
  Award,
  Timer,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

interface CollectionMetrics {
  totalOverdueAmount: number;
  totalRecoveredAmount: number;
  recoveryRate: number;
  pendingCases: number;
  resolvedCases: number;
  avgResolutionDays: number;
  contactSuccessRate: number;
  disputeRate: number;
  legalNoticesSent: number;
  settlementAgreements: number;
}

interface AgentPerformance {
  agentId: string;
  agentName: string;
  branch: string;
  casesAssigned: number;
  casesResolved: number;
  recoveryAmount: number;
  targetAmount: number;
  achievementRate: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  contactAttempts: number;
  successfulContacts: number;
}

interface TimeSeriesData {
  date: string;
  recoveryAmount: number;
  casesResolved: number;
  newOverdues: number;
}

interface CollectionReport {
  id: string;
  reportName: string;
  reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  generatedDate: string;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  generatedBy: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  fileSize: string;
  downloadUrl?: string;
  metrics: {
    totalRecovery: number;
    casesHandled: number;
    recoveryRate: number;
    avgDaysToResolve: number;
  };
}

export default function CollectionReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('recovery');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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
  const [collectionMetrics] = useState<CollectionMetrics>({
    totalOverdueAmount: 12500000,
    totalRecoveredAmount: 8750000,
    recoveryRate: 87.5,
    pendingCases: 156,
    resolvedCases: 1243,
    avgResolutionDays: 14,
    contactSuccessRate: 76.8,
    disputeRate: 8.2,
    legalNoticesSent: 23,
    settlementAgreements: 89
  });

  const [agentPerformance] = useState<AgentPerformance[]>([
    {
      agentId: 'CA001',
      agentName: 'Vijay Kumar',
      branch: 'Mumbai Central',
      casesAssigned: 45,
      casesResolved: 38,
      recoveryAmount: 2850000,
      targetAmount: 3000000,
      achievementRate: 95.0,
      avgResolutionTime: 12,
      customerSatisfaction: 4.6,
      contactAttempts: 180,
      successfulContacts: 142
    },
    {
      agentId: 'CA002',
      agentName: 'Priya Sharma',
      branch: 'Delhi NCR',
      casesAssigned: 35,
      casesResolved: 28,
      recoveryAmount: 1950000,
      targetAmount: 2500000,
      achievementRate: 78.0,
      avgResolutionTime: 15,
      customerSatisfaction: 4.2,
      contactAttempts: 140,
      successfulContacts: 92
    },
    {
      agentId: 'CA003',
      agentName: 'Amit Patel',
      branch: 'Ahmedabad',
      casesAssigned: 25,
      casesResolved: 18,
      recoveryAmount: 1250000,
      targetAmount: 1800000,
      achievementRate: 69.4,
      avgResolutionTime: 18,
      customerSatisfaction: 4.4,
      contactAttempts: 100,
      successfulContacts: 72
    },
    {
      agentId: 'CA004',
      agentName: 'Deepika Rao',
      branch: 'Bangalore',
      casesAssigned: 35,
      casesResolved: 33,
      recoveryAmount: 4250000,
      targetAmount: 4000000,
      achievementRate: 106.3,
      avgResolutionTime: 8,
      customerSatisfaction: 4.8,
      contactAttempts: 140,
      successfulContacts: 120
    },
    {
      agentId: 'CA006',
      agentName: 'Neha Singh',
      branch: 'Pune',
      casesAssigned: 40,
      casesResolved: 37,
      recoveryAmount: 3150000,
      targetAmount: 3200000,
      achievementRate: 98.4,
      avgResolutionTime: 10,
      customerSatisfaction: 4.9,
      contactAttempts: 160,
      successfulContacts: 141
    }
  ]);

  const [timeSeriesData] = useState<TimeSeriesData[]>([
    { date: '2024-01-01', recoveryAmount: 450000, casesResolved: 12, newOverdues: 8 },
    { date: '2024-01-02', recoveryAmount: 520000, casesResolved: 15, newOverdues: 6 },
    { date: '2024-01-03', recoveryAmount: 380000, casesResolved: 10, newOverdues: 12 },
    { date: '2024-01-04', recoveryAmount: 680000, casesResolved: 18, newOverdues: 5 },
    { date: '2024-01-05', recoveryAmount: 750000, casesResolved: 22, newOverdues: 9 },
    { date: '2024-01-06', recoveryAmount: 420000, casesResolved: 11, newOverdues: 7 },
    { date: '2024-01-07', recoveryAmount: 890000, casesResolved: 25, newOverdues: 4 },
    { date: '2024-01-08', recoveryAmount: 620000, casesResolved: 17, newOverdues: 10 },
    { date: '2024-01-09', recoveryAmount: 540000, casesResolved: 14, newOverdues: 8 },
    { date: '2024-01-10', recoveryAmount: 720000, casesResolved: 20, newOverdues: 6 },
    { date: '2024-01-11', recoveryAmount: 480000, casesResolved: 13, newOverdues: 11 },
    { date: '2024-01-12', recoveryAmount: 650000, casesResolved: 19, newOverdues: 7 },
    { date: '2024-01-13', recoveryAmount: 580000, casesResolved: 16, newOverdues: 9 },
    { date: '2024-01-14', recoveryAmount: 720000, casesResolved: 21, newOverdues: 5 }
  ]);

  const [collectionReports] = useState<CollectionReport[]>([
    {
      id: '1',
      reportName: 'Monthly Collection Summary - January 2024',
      reportType: 'MONTHLY',
      generatedDate: '2024-01-31T10:30:00Z',
      reportPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      generatedBy: 'Admin User',
      status: 'COMPLETED',
      fileSize: '2.4 MB',
      downloadUrl: '/reports/monthly-jan-2024.pdf',
      metrics: {
        totalRecovery: 8750000,
        casesHandled: 1399,
        recoveryRate: 87.5,
        avgDaysToResolve: 14
      }
    },
    {
      id: '2',
      reportName: 'Weekly Performance Report - Week 3',
      reportType: 'WEEKLY',
      generatedDate: '2024-01-21T15:20:00Z',
      reportPeriod: {
        startDate: '2024-01-15',
        endDate: '2024-01-21'
      },
      generatedBy: 'Collections Manager',
      status: 'COMPLETED',
      fileSize: '1.8 MB',
      downloadUrl: '/reports/weekly-w3-2024.pdf',
      metrics: {
        totalRecovery: 2150000,
        casesHandled: 342,
        recoveryRate: 89.2,
        avgDaysToResolve: 12
      }
    },
    {
      id: '3',
      reportName: 'Agent Performance Analysis - Q1 2024',
      reportType: 'QUARTERLY',
      generatedDate: '2024-01-20T09:15:00Z',
      reportPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-03-31'
      },
      generatedBy: 'HR Manager',
      status: 'IN_PROGRESS',
      fileSize: 'Generating...',
      metrics: {
        totalRecovery: 0,
        casesHandled: 0,
        recoveryRate: 0,
        avgDaysToResolve: 0
      }
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
    console.log(`Generating ${reportType} report...`);
  };

  const handleDownloadReport = (report: CollectionReport) => {
    console.log(`Downloading report: ${report.reportName}`);
  };

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return 'text-green-400';
    if (rate >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBranchStats = () => {
    const branchData: Record<string, { recovery: number; cases: number; agents: number }> = {};

    agentPerformance.forEach(agent => {
      if (!branchData[agent.branch]) {
        branchData[agent.branch] = { recovery: 0, cases: 0, agents: 0 };
      }
      branchData[agent.branch].recovery += agent.recoveryAmount;
      branchData[agent.branch].cases += agent.casesResolved;
      branchData[agent.branch].agents += 1;
    });

    return Object.entries(branchData).map(([branch, data]) => ({
      branch,
      ...data,
      avgRecoveryPerAgent: data.recovery / data.agents
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading collection reports...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const branchStats = getBranchStats();
  const topPerformer = agentPerformance.reduce((top, agent) =>
    agent.achievementRate > top.achievementRate ? agent : top
  );

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
            <h1 className="text-3xl font-bold text-white mb-2">Collection Reports & Analytics</h1>
            <p className="text-slate-400">Comprehensive insights into collection performance and trends</p>
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
            <button
              onClick={() => setShowReportsModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Recovery</p>
                <p className="text-2xl font-bold text-white">₹{(collectionMetrics.totalRecoveredAmount / 10000000).toFixed(1)}Cr</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  {collectionMetrics.recoveryRate}% rate
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
                <p className="text-slate-400 text-sm">Cases Resolved</p>
                <p className="text-2xl font-bold text-white">{collectionMetrics.resolvedCases}</p>
                <p className="text-slate-400 text-sm mt-1">{collectionMetrics.pendingCases} pending</p>
              </div>
              <CheckCircle className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-white">{collectionMetrics.avgResolutionDays}</p>
                <p className="text-slate-400 text-sm mt-1">days</p>
              </div>
              <Timer className="h-12 w-12 text-purple-500" />
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
                <p className="text-slate-400 text-sm">Contact Success Rate</p>
                <p className="text-2xl font-bold text-white">{collectionMetrics.contactSuccessRate}%</p>
                <p className="text-slate-400 text-sm mt-1">Communication efficiency</p>
              </div>
              <Phone className="h-12 w-12 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Collection Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Collection Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('recovery')}
                className={`px-4 py-2 rounded-lg text-sm ${selectedMetric === 'recovery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                Recovery Amount
              </button>
              <button
                onClick={() => setSelectedMetric('cases')}
                className={`px-4 py-2 rounded-lg text-sm ${selectedMetric === 'cases'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                Cases Resolved
              </button>
            </div>
          </div>

          {/* Simplified chart representation */}
          <div className="h-64 flex items-end gap-2">
            {timeSeriesData.slice(-14).map((data, index) => {
              const value = selectedMetric === 'recovery' ? data.recoveryAmount : data.casesResolved * 30000;
              const maxValue = selectedMetric === 'recovery' ? 900000 : 750000;
              const height = (value / maxValue) * 240;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-400 transition-colors cursor-pointer"
                    style={{ height: `${height}px` }}
                    title={`${new Date(data.date).toLocaleDateString()}: ${
                      selectedMetric === 'recovery'
                        ? `₹${(data.recoveryAmount / 100000).toFixed(1)}L`
                        : `${data.casesResolved} cases`
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

        {/* Branch Performance & Agent Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Branch Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Branch Performance</h3>
            <div className="space-y-4">
              {branchStats.map((branch, index) => (
                <div key={branch.branch} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{branch.branch}</p>
                    <p className="text-slate-400 text-sm">{branch.agents} agents • {branch.cases} cases</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{(branch.recovery / 100000).toFixed(1)}L</p>
                    <p className="text-slate-400 text-sm">
                      ₹{(branch.avgRecoveryPerAgent / 100000).toFixed(1)}L per agent
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Agents Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Top Agents Performance</h3>
            <div className="space-y-4">
              {agentPerformance.slice(0, 5).map((agent, index) => (
                <div key={agent.agentId} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {agent.agentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{agent.agentName}</p>
                      <p className="text-slate-400 text-sm">{agent.branch}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getAchievementColor(agent.achievementRate)}`}>
                      {agent.achievementRate.toFixed(1)}%
                    </p>
                    <p className="text-slate-400 text-sm">
                      ₹{(agent.recoveryAmount / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h4 className="text-lg font-medium text-white mb-4">Collection Methods</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Phone Calls</span>
                <span className="text-white">65%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Field Visits</span>
                <span className="text-white">25%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email/SMS</span>
                <span className="text-white">10%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h4 className="text-lg font-medium text-white mb-4">Case Status Distribution</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Resolved</span>
                <span className="text-green-400 font-medium">{collectionMetrics.resolvedCases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pending</span>
                <span className="text-yellow-400 font-medium">{collectionMetrics.pendingCases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Legal Notice</span>
                <span className="text-red-400 font-medium">{collectionMetrics.legalNoticesSent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Settlements</span>
                <span className="text-blue-400 font-medium">{collectionMetrics.settlementAgreements}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h4 className="text-lg font-medium text-white mb-4">Top Performer</h4>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-white" />
              </div>
              <p className="text-white font-semibold">{topPerformer.agentName}</p>
              <p className="text-slate-400 text-sm">{topPerformer.branch}</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">{topPerformer.achievementRate.toFixed(1)}%</p>
              <p className="text-slate-400 text-xs">Achievement Rate</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Reports</h3>
            <button
              onClick={() => setShowReportsModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Generate New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Report Name</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Type</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Period</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Generated</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-300 uppercase tracking-wider py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {collectionReports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-slate-700/50">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">{report.reportName}</p>
                        <p className="text-slate-400 text-sm">{report.fileSize}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-slate-300">{report.reportType}</span>
                    </td>
                    <td className="py-4">
                      <div className="text-slate-300 text-sm">
                        <div>{new Date(report.reportPeriod.startDate).toLocaleDateString()}</div>
                        <div>to {new Date(report.reportPeriod.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-slate-300 text-sm">
                        <div>{new Date(report.generatedDate).toLocaleDateString()}</div>
                        <div className="text-slate-400">{report.generatedBy}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadReport(report)}
                          disabled={report.status !== 'COMPLETED'}
                          className="text-blue-400 hover:text-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-green-400 hover:text-green-300" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Generate Report Modal */}
        {showReportsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Generate Collection Report</h3>
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="DAILY">Daily Report</option>
                    <option value="WEEKLY">Weekly Report</option>
                    <option value="MONTHLY">Monthly Report</option>
                    <option value="QUARTERLY">Quarterly Report</option>
                    <option value="CUSTOM">Custom Period</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Branch</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ALL">All Branches</option>
                    <option value="Mumbai Central">Mumbai Central</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setShowReportsModal(false)}
                    className="px-4 py-2 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleGenerateReport('CUSTOM');
                      setShowReportsModal(false);
                    }}
                    disabled={isGeneratingReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}