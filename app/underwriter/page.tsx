'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FileText, User, CreditCard, Shield, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, Clock, Eye,
  Filter, Search, Download, RefreshCw, BarChart3,
  Target, Award, Users, IndianRupee, Percent,
  Calendar, Phone, Mail, MapPin, Building, Star,
  Brain, Calculator, History, Flag, Zap, Activity,
  PieChart, TrendingDown, ArrowUpRight, ArrowDownRight,
  Package, Database, Globe, Settings, Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// UnderwriterLayout is already applied by ConditionalLayout based on user role

interface LoanApplication {
  id: string;
  applicationNumber: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    age: number;
    occupation: string;
    monthlyIncome: number;
    creditScore: number;
    location: string;
  };
  loanDetails: {
    type: string;
    amount: number;
    tenure: number;
    purpose: string;
    interestRate?: number;
  };
  riskAssessment: {
    score: number;
    category: 'LOW' | 'MEDIUM' | 'HIGH';
    factors: string[];
    recommendation: 'APPROVE' | 'REJECT' | 'CONDITIONAL';
  };
  documents: {
    type: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    uploadedAt: string;
  }[];
  timeline: {
    appliedAt: string;
    assignedAt: string;
    reviewStartedAt?: string;
    lastActivityAt: string;
  };
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ON_HOLD';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  flags: string[];
}

interface UnderwriterMetrics {
  applications: {
    total: number;
    pending: number;
    reviewed: number;
    approved: number;
    rejected: number;
  };
  performance: {
    avgProcessingTime: number;
    approvalRate: number;
    riskAccuracy: number;
    productivityScore: number;
  };
  portfolio: {
    totalAmount: number;
    avgLoanAmount: number;
    riskDistribution: {
      low: number;
      medium: number;
      high: number;
    };
  };
  targets: {
    dailyTarget: number;
    weeklyTarget: number;
    monthlyTarget: number;
    currentProgress: number;
  };
}

export default function UnderwriterDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [metrics, setMetrics] = useState<UnderwriterMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [filter, setFilter] = useState({
    status: 'ALL',
    priority: 'ALL',
    riskCategory: 'ALL',
    search: ''
  });

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'UNDERWRITER') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Mock data
  const mockApplications: LoanApplication[] = [
    {
      id: '1',
      applicationNumber: 'APP-2024-001',
      applicant: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        age: 32,
        occupation: 'Software Engineer',
        monthlyIncome: 150000,
        creditScore: 780,
        location: 'Bangalore, Karnataka'
      },
      loanDetails: {
        type: 'Personal Loan',
        amount: 800000,
        tenure: 60,
        purpose: 'Home Renovation',
        interestRate: 11.5
      },
      riskAssessment: {
        score: 85,
        category: 'LOW',
        factors: ['High credit score', 'Stable employment', 'Good income-to-debt ratio'],
        recommendation: 'APPROVE'
      },
      documents: [
        { type: 'PAN Card', status: 'VERIFIED', uploadedAt: '2024-01-15T10:00:00Z' },
        { type: 'Aadhar Card', status: 'VERIFIED', uploadedAt: '2024-01-15T10:05:00Z' },
        { type: 'Salary Slip', status: 'VERIFIED', uploadedAt: '2024-01-15T10:10:00Z' },
        { type: 'Bank Statement', status: 'PENDING', uploadedAt: '2024-01-15T10:15:00Z' }
      ],
      timeline: {
        appliedAt: '2024-01-15T09:30:00Z',
        assignedAt: '2024-01-15T11:00:00Z',
        reviewStartedAt: '2024-01-15T11:30:00Z',
        lastActivityAt: '2024-01-15T14:00:00Z'
      },
      status: 'UNDER_REVIEW',
      priority: 'HIGH',
      flags: ['Quick Approval Eligible']
    },
    {
      id: '2',
      applicationNumber: 'APP-2024-002',
      applicant: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 87654 32109',
        age: 28,
        occupation: 'Marketing Manager',
        monthlyIncome: 85000,
        creditScore: 650,
        location: 'Mumbai, Maharashtra'
      },
      loanDetails: {
        type: 'Emergency Loan',
        amount: 200000,
        tenure: 24,
        purpose: 'Medical Emergency'
      },
      riskAssessment: {
        score: 65,
        category: 'MEDIUM',
        factors: ['Average credit score', 'Stable job', 'High debt-to-income ratio'],
        recommendation: 'CONDITIONAL'
      },
      documents: [
        { type: 'PAN Card', status: 'VERIFIED', uploadedAt: '2024-01-14T15:00:00Z' },
        { type: 'Aadhar Card', status: 'VERIFIED', uploadedAt: '2024-01-14T15:05:00Z' },
        { type: 'Medical Bills', status: 'VERIFIED', uploadedAt: '2024-01-14T15:10:00Z' }
      ],
      timeline: {
        appliedAt: '2024-01-14T14:30:00Z',
        assignedAt: '2024-01-14T16:00:00Z',
        lastActivityAt: '2024-01-15T10:00:00Z'
      },
      status: 'PENDING',
      priority: 'MEDIUM',
      flags: ['Emergency Request']
    }
  ];

  const mockMetrics: UnderwriterMetrics = {
    applications: {
      total: 45,
      pending: 12,
      reviewed: 33,
      approved: 28,
      rejected: 5
    },
    performance: {
      avgProcessingTime: 2.5, // hours
      approvalRate: 84.8,
      riskAccuracy: 92.3,
      productivityScore: 88
    },
    portfolio: {
      totalAmount: 15750000,
      avgLoanAmount: 350000,
      riskDistribution: {
        low: 18,
        medium: 12,
        high: 3
      }
    },
    targets: {
      dailyTarget: 8,
      weeklyTarget: 40,
      monthlyTarget: 160,
      currentProgress: 75
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplications(mockApplications);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching data:', error);
      setApplications(mockApplications);
      setMetrics(mockMetrics);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-400 bg-green-900/20';
      case 'REJECTED': return 'text-red-400 bg-red-900/20';
      case 'UNDER_REVIEW': return 'text-blue-400 bg-blue-900/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-900/20';
      case 'ON_HOLD': return 'text-purple-400 bg-purple-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'LOW': return 'text-green-400 bg-green-900/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20';
      case 'HIGH': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
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
  if (!user || user.role !== 'UNDERWRITER') {
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
            <p className="mt-4 text-slate-400">Loading underwriter dashboard...</p>
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
              <Brain className="w-8 h-8 text-blue-400" />
              Underwriter Dashboard
            </h1>
            <p className="text-slate-400">Loan application review and risk assessment</p>
          </div>
          <div className="flex items-center gap-4">
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

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500">Applications</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.applications.pending}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-blue-400">Pending Review</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Approval Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.approvalRate}%</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Above target</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">Processing Time</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.avgProcessingTime}h</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <ArrowDownRight className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Improved</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-slate-500">Risk Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.riskAccuracy}%</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-400">Excellent</span>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Portfolio Summary */}
          <div className="glass rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-400" />
              Portfolio Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Amount</span>
                <span className="text-white font-semibold">{formatCurrency(metrics?.portfolio.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Average Loan</span>
                <span className="text-white font-semibold">{formatCurrency(metrics?.portfolio.avgLoanAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Applications</span>
                <span className="text-white font-semibold">{metrics?.applications.total}</span>
              </div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="glass rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Risk Distribution
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Low Risk', count: metrics?.portfolio.riskDistribution.low, color: 'green' },
                { label: 'Medium Risk', count: metrics?.portfolio.riskDistribution.medium, color: 'yellow' },
                { label: 'High Risk', count: metrics?.portfolio.riskDistribution.high, color: 'red' }
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`} />
                    <span className="text-slate-400">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Progress */}
          <div className="glass rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Daily Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Target</span>
                <span className="text-white">{metrics?.targets.dailyTarget} applications</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Completed</span>
                <span className="text-white">{Math.round((metrics?.targets.currentProgress || 0) / 100 * (metrics?.targets.dailyTarget || 1))}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics?.targets.currentProgress || 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                />
              </div>
              <div className="text-center text-sm text-slate-400">
                {metrics?.targets.currentProgress}% Complete
              </div>
            </div>
          </div>
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Pending Applications ({applications.length})
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {applications.map((application) => (
              <motion.div
                key={application.id}
                whileHover={{ scale: 1.01 }}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:shadow-glow transition-all cursor-pointer"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Flag className={`w-4 h-4 ${getPriorityColor(application.priority)}`} />
                      <span className="font-medium text-white">{application.applicationNumber}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(application.riskAssessment.category)}`}>
                      {application.riskAssessment.category} RISK
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{formatCurrency(application.loanDetails.amount)}</p>
                    <p className="text-slate-400 text-sm">{application.loanDetails.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-slate-400 text-sm">Applicant</p>
                    <p className="text-white font-medium">{application.applicant.name}</p>
                    <p className="text-slate-400 text-xs">{application.applicant.occupation}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Credit Score</p>
                    <p className="text-white font-medium">{application.applicant.creditScore}</p>
                    <p className="text-slate-400 text-xs">Monthly Income: {formatCurrency(application.applicant.monthlyIncome)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Risk Score</p>
                    <p className="text-white font-medium">{application.riskAssessment.score}/100</p>
                    <p className="text-slate-400 text-xs">
                      Recommendation: <span className={
                        application.riskAssessment.recommendation === 'APPROVE' ? 'text-green-400' :
                        application.riskAssessment.recommendation === 'REJECT' ? 'text-red-400' :
                        'text-yellow-400'
                      }>
                        {application.riskAssessment.recommendation}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Applied: {new Date(application.timeline.appliedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Assigned: {new Date(application.timeline.assignedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Review
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Reject
                    </button>
                  </div>
                </div>

                {application.flags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-slate-400">Flags:</span>
                      {application.flags.map((flag, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-900/20 text-yellow-400 rounded text-xs">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}