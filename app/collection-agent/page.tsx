'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Phone, MessageSquare, IndianRupee, Calendar, Clock,
  TrendingUp, AlertTriangle, CheckCircle, XCircle, User,
  MapPin, Building, Target, Award, Activity, Filter,
  Search, RefreshCw, Download, Eye, ExternalLink,
  Mail, FileText, History, Flag, Zap, BarChart3,
  PieChart, TrendingDown, ArrowUpRight, ArrowDownRight,
  Package, Database, Globe, Settings, Bell, Percent
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// CollectionAgentLayout is already applied by ConditionalLayout based on user role

interface CollectionCase {
  id: string;
  caseNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    age: number;
    occupation: string;
  };
  loan: {
    id: string;
    type: string;
    originalAmount: number;
    outstandingAmount: number;
    emiAmount: number;
    lastPaymentDate: string;
    nextDueDate: string;
    overdueDays: number;
    interestRate: number;
  };
  collection: {
    totalOverdue: number;
    principalOverdue: number;
    interestOverdue: number;
    penaltyCharges: number;
    lastContactDate?: string;
    totalContacts: number;
    promiseToPayDate?: string;
    promiseAmount?: number;
  };
  riskCategory: 'BUCKET_0_30' | 'BUCKET_30_60' | 'BUCKET_60_90' | 'BUCKET_90_PLUS';
  status: 'ASSIGNED' | 'CONTACTED' | 'PROMISED' | 'PARTIALLY_PAID' | 'RESOLVED' | 'LEGAL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedDate: string;
  lastActivity: string;
  notes: string[];
  flags: string[];
}

interface CollectionMetrics {
  caseload: {
    total: number;
    active: number;
    resolved: number;
    escalated: number;
  };
  performance: {
    collectionRate: number;
    avgResolutionTime: number;
    contactSuccessRate: number;
    promiseKeepingRate: number;
  };
  financial: {
    totalOverdue: number;
    collectedAmount: number;
    targetAmount: number;
    achievementRate: number;
  };
  activity: {
    callsMade: number;
    contactsReached: number;
    promisesToPay: number;
    paymentsReceived: number;
  };
}

export default function CollectionAgentDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<CollectionCase[]>([]);
  const [metrics, setMetrics] = useState<CollectionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CollectionCase | null>(null);
  const [filter, setFilter] = useState({
    status: 'ALL',
    priority: 'ALL',
    bucket: 'ALL',
    search: ''
  });

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'COLLECTION_AGENT') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Mock data
  const mockCases: CollectionCase[] = [
    {
      id: '1',
      caseNumber: 'COL-2024-001',
      customer: {
        name: 'Amit Sharma',
        phone: '+91 98765 43210',
        email: 'amit.sharma@email.com',
        address: 'Sector 15, Noida, UP',
        age: 35,
        occupation: 'Business Owner'
      },
      loan: {
        id: 'LN-001',
        type: 'Personal Loan',
        originalAmount: 500000,
        outstandingAmount: 350000,
        emiAmount: 15000,
        lastPaymentDate: '2023-11-15',
        nextDueDate: '2023-12-15',
        overdueDays: 45,
        interestRate: 12.5
      },
      collection: {
        totalOverdue: 45000,
        principalOverdue: 35000,
        interestOverdue: 8000,
        penaltyCharges: 2000,
        lastContactDate: '2024-01-10',
        totalContacts: 8,
        promiseToPayDate: '2024-01-20',
        promiseAmount: 25000
      },
      riskCategory: 'BUCKET_30_60',
      status: 'PROMISED',
      priority: 'HIGH',
      assignedDate: '2024-01-05',
      lastActivity: '2024-01-10T14:30:00Z',
      notes: [
        'Customer agreed to pay ₹25,000 by Jan 20',
        'Experiencing temporary financial difficulty',
        'Previously good payment history'
      ],
      flags: ['High Value', 'Promise to Pay']
    },
    {
      id: '2',
      caseNumber: 'COL-2024-002',
      customer: {
        name: 'Priya Patel',
        phone: '+91 87654 32109',
        email: 'priya.patel@email.com',
        address: 'Andheri West, Mumbai, MH',
        age: 28,
        occupation: 'Software Engineer'
      },
      loan: {
        id: 'LN-002',
        type: 'Emergency Loan',
        originalAmount: 100000,
        outstandingAmount: 75000,
        emiAmount: 5000,
        lastPaymentDate: '2023-12-05',
        nextDueDate: '2024-01-05',
        overdueDays: 15,
        interestRate: 14.0
      },
      collection: {
        totalOverdue: 10000,
        principalOverdue: 8000,
        interestOverdue: 1500,
        penaltyCharges: 500,
        lastContactDate: '2024-01-12',
        totalContacts: 3
      },
      riskCategory: 'BUCKET_0_30',
      status: 'CONTACTED',
      priority: 'MEDIUM',
      assignedDate: '2024-01-08',
      lastActivity: '2024-01-12T10:15:00Z',
      notes: [
        'Customer acknowledges debt',
        'Requested payment plan',
        'Salary delayed this month'
      ],
      flags: ['First Time Overdue']
    }
  ];

  const mockMetrics: CollectionMetrics = {
    caseload: {
      total: 45,
      active: 38,
      resolved: 5,
      escalated: 2
    },
    performance: {
      collectionRate: 78.5,
      avgResolutionTime: 12.5, // days
      contactSuccessRate: 65.2,
      promiseKeepingRate: 72.8
    },
    financial: {
      totalOverdue: 2250000,
      collectedAmount: 875000,
      targetAmount: 1500000,
      achievementRate: 58.3
    },
    activity: {
      callsMade: 156,
      contactsReached: 102,
      promisesToPay: 23,
      paymentsReceived: 12
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCases(mockCases);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching data:', error);
      setCases(mockCases);
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
      case 'RESOLVED': return 'text-green-400 bg-green-900/20';
      case 'PROMISED': return 'text-blue-400 bg-blue-900/20';
      case 'CONTACTED': return 'text-yellow-400 bg-yellow-900/20';
      case 'ASSIGNED': return 'text-purple-400 bg-purple-900/20';
      case 'PARTIALLY_PAID': return 'text-emerald-400 bg-emerald-900/20';
      case 'LEGAL': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getBucketColor = (bucket: string) => {
    switch (bucket) {
      case 'BUCKET_0_30': return 'text-green-400 bg-green-900/20';
      case 'BUCKET_30_60': return 'text-yellow-400 bg-yellow-900/20';
      case 'BUCKET_60_90': return 'text-orange-400 bg-orange-900/20';
      case 'BUCKET_90_PLUS': return 'text-red-400 bg-red-900/20';
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
  if (!user || user.role !== 'COLLECTION_AGENT') {
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
            <p className="mt-4 text-slate-400">Loading collection dashboard...</p>
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
              <Phone className="w-8 h-8 text-blue-400" />
              Collection Dashboard
            </h1>
            <p className="text-slate-400">Manage overdue accounts and recovery operations</p>
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
              <span className="text-xs text-slate-500">Active Cases</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.caseload.active}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-blue-400">Assigned to you</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Collection Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.collectionRate}%</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Above target</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <IndianRupee className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">Total Overdue</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(metrics?.financial.totalOverdue || 0)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <AlertTriangle className="w-4 h-4 text-purple-500" />
              <span className="text-purple-400">Needs attention</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-slate-500">Achievement</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.financial.achievementRate}%</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <Percent className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-400">Monthly target</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Collection Summary */}
          <div className="glass rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-400" />
              Collection Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Collected Amount</span>
                <span className="text-green-400 font-semibold">{formatCurrency(metrics?.financial.collectedAmount || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Amount</span>
                <span className="text-white font-semibold">{formatCurrency(metrics?.financial.targetAmount || 0)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics?.financial.achievementRate || 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600"
                />
              </div>
              <div className="text-center text-sm text-slate-400">
                {metrics?.financial.achievementRate}% of monthly target
              </div>
            </div>
          </div>

          {/* Activity Metrics */}
          <div className="glass rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Today's Activity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400">Calls Made</span>
                </div>
                <span className="text-white font-semibold">{metrics?.activity.callsMade}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400">Contacts Reached</span>
                </div>
                <span className="text-white font-semibold">{metrics?.activity.contactsReached}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-400">Promises to Pay</span>
                </div>
                <span className="text-white font-semibold">{metrics?.activity.promisesToPay}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-400">Payments Received</span>
                </div>
                <span className="text-white font-semibold">{metrics?.activity.paymentsReceived}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="glass rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Performance Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Contact Success Rate</span>
                <span className="text-purple-400 font-semibold">{metrics?.performance.contactSuccessRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Promise Keeping Rate</span>
                <span className="text-blue-400 font-semibold">{metrics?.performance.promiseKeepingRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Avg Resolution Time</span>
                <span className="text-green-400 font-semibold">{metrics?.performance.avgResolutionTime} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cases Resolved</span>
                <span className="text-emerald-400 font-semibold">{metrics?.caseload.resolved}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Collection Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 border border-slate-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Active Collection Cases ({cases.length})
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cases..."
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
                <option value="ASSIGNED">Assigned</option>
                <option value="CONTACTED">Contacted</option>
                <option value="PROMISED">Promised</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {cases.map((case_) => (
              <motion.div
                key={case_.id}
                whileHover={{ scale: 1.01 }}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:shadow-glow transition-all cursor-pointer"
                onClick={() => setSelectedCase(case_)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Flag className={`w-4 h-4 ${getPriorityColor(case_.priority)}`} />
                      <span className="font-medium text-white">{case_.caseNumber}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(case_.status)}`}>
                      {case_.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getBucketColor(case_.riskCategory)}`}>
                      {case_.riskCategory.replace('BUCKET_', '').replace('_', '-')} DAYS
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-400">{formatCurrency(case_.collection.totalOverdue)}</p>
                    <p className="text-slate-400 text-sm">{case_.loan.overdueDays} days overdue</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-slate-400 text-sm">Customer</p>
                    <p className="text-white font-medium">{case_.customer.name}</p>
                    <p className="text-slate-400 text-xs">{case_.customer.occupation}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Loan Details</p>
                    <p className="text-white font-medium">{case_.loan.type}</p>
                    <p className="text-slate-400 text-xs">EMI: {formatCurrency(case_.loan.emiAmount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Contact Info</p>
                    <p className="text-white font-medium">{case_.customer.phone}</p>
                    <p className="text-slate-400 text-xs">
                      Last contacted: {case_.collection.lastContactDate ?
                        new Date(case_.collection.lastContactDate).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Assigned: {new Date(case_.assignedDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Contacts: {case_.collection.totalContacts}</span>
                    {case_.collection.promiseToPayDate && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400">
                          Promise: {formatCurrency(case_.collection.promiseAmount || 0)} by {new Date(case_.collection.promiseToPayDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Call
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      SMS
                    </button>
                    <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Details
                    </button>
                  </div>
                </div>

                {case_.flags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-slate-400">Flags:</span>
                      {case_.flags.map((flag, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-900/20 text-yellow-400 rounded text-xs">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {case_.notes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Latest Note:</p>
                    <p className="text-sm text-slate-300 italic">"{case_.notes[0]}"</p>
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