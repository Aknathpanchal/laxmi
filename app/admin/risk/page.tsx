"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Eye,
  RefreshCw,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  MoreHorizontal,
  MapPin,
  CreditCard,
  Building,
  FileText,
  Settings,
  Flag,
  Zap,
  Gauge
} from "lucide-react";
import { motion } from "framer-motion";

interface RiskMetrics {
  totalRiskScore: number;
  highRiskApplications: number;
  fraudDetected: number;
  defaultPrevented: number;
  riskTrends: {
    thisMonth: number;
    lastMonth: number;
    change: number;
  };
  portfolioRisk: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

interface RiskAlert {
  id: string;
  alertType: 'CREDIT_SCORE_DROP' | 'EMPLOYMENT_CHANGE' | 'INCOME_DECREASE' | 'MULTIPLE_APPLICATIONS' | 'SUSPICIOUS_ACTIVITY' | 'PAYMENT_PATTERN_CHANGE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  customerId: string;
  customerName: string;
  loanId?: string;
  description: string;
  detectedAt: string;
  status: 'NEW' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  assignedTo?: string;
  riskScore: number;
  previousRiskScore?: number;
  metadata: {
    [key: string]: any;
  };
}

interface RiskProfile {
  customerId: string;
  customerName: string;
  overallRiskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: {
    creditScore: number;
    creditScoreRisk: number;
    incomeStability: number;
    incomeStabilityRisk: number;
    employmentHistory: number;
    employmentHistoryRisk: number;
    debtToIncome: number;
    debtToIncomeRisk: number;
    paymentHistory: number;
    paymentHistoryRisk: number;
  };
  alerts: number;
  lastAssessed: string;
  loans: {
    active: number;
    overdue: number;
    totalExposure: number;
  };
}

interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  predictions: number;
  correctPredictions: number;
  falsePositives: number;
  falseNegatives: number;
}

export default function RiskDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<RiskAlert[]>([]);
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
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
  const [riskMetrics] = useState<RiskMetrics>({
    totalRiskScore: 68.5,
    highRiskApplications: 23,
    fraudDetected: 8,
    defaultPrevented: 15,
    riskTrends: {
      thisMonth: 68.5,
      lastMonth: 72.1,
      change: -3.6
    },
    portfolioRisk: {
      low: 1250,
      medium: 890,
      high: 234,
      critical: 56
    }
  });

  const [modelPerformance] = useState<ModelPerformance[]>([
    {
      modelName: 'Credit Risk Assessment',
      accuracy: 92.5,
      precision: 89.2,
      recall: 94.1,
      f1Score: 91.6,
      lastTrained: '2024-01-15T10:30:00Z',
      predictions: 2456,
      correctPredictions: 2272,
      falsePositives: 124,
      falseNegatives: 60
    },
    {
      modelName: 'Fraud Detection',
      accuracy: 96.8,
      precision: 94.5,
      recall: 92.3,
      f1Score: 93.4,
      lastTrained: '2024-01-18T14:20:00Z',
      predictions: 1234,
      correctPredictions: 1195,
      falsePositives: 28,
      falseNegatives: 11
    },
    {
      modelName: 'Default Prediction',
      accuracy: 88.9,
      precision: 85.7,
      recall: 90.1,
      f1Score: 87.9,
      lastTrained: '2024-01-12T09:15:00Z',
      predictions: 3567,
      correctPredictions: 3173,
      falsePositives: 198,
      falseNegatives: 196
    }
  ]);

  useEffect(() => {
    // Mock risk alerts
    const mockAlerts: RiskAlert[] = [
      {
        id: '1',
        alertType: 'CREDIT_SCORE_DROP',
        severity: 'HIGH',
        customerId: 'CUST001',
        customerName: 'Rajesh Kumar',
        loanId: 'LXM001234',
        description: 'Credit score dropped by 80 points from 720 to 640 in the last 30 days',
        detectedAt: '2024-01-20T10:30:00Z',
        status: 'NEW',
        assignedTo: 'Risk Analyst Team',
        riskScore: 78.5,
        previousRiskScore: 45.2,
        metadata: {
          currentCreditScore: 640,
          previousCreditScore: 720,
          dropAmount: 80,
          timeframe: '30 days'
        }
      },
      {
        id: '2',
        alertType: 'MULTIPLE_APPLICATIONS',
        severity: 'CRITICAL',
        customerId: 'CUST002',
        customerName: 'Priya Patel',
        description: 'Applied for loans with 4 different NBFCs in the last 15 days',
        detectedAt: '2024-01-19T14:45:00Z',
        status: 'INVESTIGATING',
        assignedTo: 'Fraud Detection Team',
        riskScore: 92.3,
        metadata: {
          applicationsCount: 4,
          timeframe: '15 days',
          institutions: ['LaxmiOne', 'XYZ Finance', 'ABC Credit', 'Quick Loans']
        }
      },
      {
        id: '3',
        alertType: 'EMPLOYMENT_CHANGE',
        severity: 'MEDIUM',
        customerId: 'CUST003',
        customerName: 'Amit Sharma',
        loanId: 'LXM001236',
        description: 'Employment status changed from salaried to unemployed',
        detectedAt: '2024-01-18T16:20:00Z',
        status: 'NEW',
        riskScore: 65.8,
        previousRiskScore: 35.4,
        metadata: {
          previousEmployment: 'Tech Solutions Pvt Ltd',
          currentStatus: 'Unemployed',
          lastSalaryDate: '2024-01-15'
        }
      },
      {
        id: '4',
        alertType: 'SUSPICIOUS_ACTIVITY',
        severity: 'HIGH',
        customerId: 'CUST004',
        customerName: 'Sneha Reddy',
        description: 'Multiple login attempts from different geographical locations within 24 hours',
        detectedAt: '2024-01-17T22:15:00Z',
        status: 'RESOLVED',
        assignedTo: 'Security Team',
        riskScore: 71.2,
        metadata: {
          locations: ['Mumbai', 'Delhi', 'Bangalore'],
          timeframe: '24 hours',
          ipAddresses: 3,
          resolution: 'Customer verified - traveling for work'
        }
      },
      {
        id: '5',
        alertType: 'PAYMENT_PATTERN_CHANGE',
        severity: 'MEDIUM',
        customerId: 'CUST005',
        customerName: 'Vikram Singh',
        loanId: 'LXM001238',
        description: 'Payment pattern changed from regular to irregular with increasing delays',
        detectedAt: '2024-01-16T11:30:00Z',
        status: 'NEW',
        riskScore: 58.9,
        previousRiskScore: 28.1,
        metadata: {
          avgDelayDays: 12,
          missedPayments: 2,
          previousPattern: 'Regular on-time payments',
          currentPattern: 'Irregular with delays'
        }
      }
    ];

    setAlerts(mockAlerts);

    // Mock risk profiles
    const mockProfiles: RiskProfile[] = [
      {
        customerId: 'CUST001',
        customerName: 'Rajesh Kumar',
        overallRiskScore: 78.5,
        riskCategory: 'HIGH',
        factors: {
          creditScore: 640,
          creditScoreRisk: 85,
          incomeStability: 75,
          incomeStabilityRisk: 60,
          employmentHistory: 60,
          employmentHistoryRisk: 70,
          debtToIncome: 45,
          debtToIncomeRisk: 80,
          paymentHistory: 70,
          paymentHistoryRisk: 75
        },
        alerts: 3,
        lastAssessed: '2024-01-20T10:30:00Z',
        loans: {
          active: 2,
          overdue: 1,
          totalExposure: 850000
        }
      },
      {
        customerId: 'CUST002',
        customerName: 'Priya Patel',
        overallRiskScore: 92.3,
        riskCategory: 'CRITICAL',
        factors: {
          creditScore: 580,
          creditScoreRisk: 95,
          incomeStability: 40,
          incomeStabilityRisk: 90,
          employmentHistory: 50,
          employmentHistoryRisk: 85,
          debtToIncome: 65,
          debtToIncomeRisk: 95,
          paymentHistory: 45,
          paymentHistoryRisk: 90
        },
        alerts: 5,
        lastAssessed: '2024-01-19T14:45:00Z',
        loans: {
          active: 3,
          overdue: 2,
          totalExposure: 1200000
        }
      }
    ];

    setRiskProfiles(mockProfiles);
  }, []);

  // Filter alerts
  useEffect(() => {
    let filtered = alerts.filter(alert => {
      const matchesSearch =
        alert.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.customerId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;

      return matchesSearch && matchesSeverity;
    });

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, selectedSeverity]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleViewAlert = (alert: RiskAlert) => {
    setSelectedAlert(alert);
    setShowAlertDetails(true);
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: RiskAlert['status']) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-green-400 bg-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20';
      case 'CRITICAL': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500';
      case 'INVESTIGATING': return 'bg-yellow-500';
      case 'RESOLVED': return 'bg-green-500';
      case 'FALSE_POSITIVE': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskCategoryColor = (category: string) => {
    switch (category) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'CREDIT_SCORE_DROP': return <TrendingDown className="h-4 w-4" />;
      case 'EMPLOYMENT_CHANGE': return <Users className="h-4 w-4" />;
      case 'INCOME_DECREASE': return <DollarSign className="h-4 w-4" />;
      case 'MULTIPLE_APPLICATIONS': return <FileText className="h-4 w-4" />;
      case 'SUSPICIOUS_ACTIVITY': return <Flag className="h-4 w-4" />;
      case 'PAYMENT_PATTERN_CHANGE': return <Activity className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading risk dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const newAlerts = alerts.filter(a => a.status === 'NEW').length;
  const highRiskAlerts = alerts.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;
  const avgRiskScore = riskProfiles.reduce((sum, p) => sum + p.overallRiskScore, 0) / riskProfiles.length || 0;

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
            <h1 className="text-3xl font-bold text-white mb-2">Risk Management Dashboard</h1>
            <p className="text-slate-400">Monitor and manage portfolio risk, fraud detection, and compliance</p>
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

        {/* Risk Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Portfolio Risk Score</p>
                <p className="text-2xl font-bold text-white">{riskMetrics.totalRiskScore}</p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${riskMetrics.riskTrends.change < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {riskMetrics.riskTrends.change < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  {Math.abs(riskMetrics.riskTrends.change)}% from last month
                </p>
              </div>
              <Gauge className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">New Risk Alerts</p>
                <p className="text-2xl font-bold text-white">{newAlerts}</p>
                <p className="text-slate-400 text-sm mt-1">{highRiskAlerts} high/critical</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
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
                <p className="text-slate-400 text-sm">Fraud Cases Detected</p>
                <p className="text-2xl font-bold text-white">{riskMetrics.fraudDetected}</p>
                <p className="text-slate-400 text-sm mt-1">This month</p>
              </div>
              <Shield className="h-12 w-12 text-red-500" />
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
                <p className="text-slate-400 text-sm">Defaults Prevented</p>
                <p className="text-2xl font-bold text-white">{riskMetrics.defaultPrevented}</p>
                <p className="text-slate-400 text-sm mt-1">Early intervention</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Portfolio Risk Distribution & Model Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Portfolio Risk Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">Low Risk</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{riskMetrics.portfolioRisk.low}</span>
                  <span className="text-slate-400 text-sm ml-2">
                    ({((riskMetrics.portfolioRisk.low / (riskMetrics.portfolioRisk.low + riskMetrics.portfolioRisk.medium + riskMetrics.portfolioRisk.high + riskMetrics.portfolioRisk.critical)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(riskMetrics.portfolioRisk.low / 2430) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-slate-300">Medium Risk</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{riskMetrics.portfolioRisk.medium}</span>
                  <span className="text-slate-400 text-sm ml-2">
                    ({((riskMetrics.portfolioRisk.medium / (riskMetrics.portfolioRisk.low + riskMetrics.portfolioRisk.medium + riskMetrics.portfolioRisk.high + riskMetrics.portfolioRisk.critical)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(riskMetrics.portfolioRisk.medium / 2430) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-300">High Risk</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{riskMetrics.portfolioRisk.high}</span>
                  <span className="text-slate-400 text-sm ml-2">
                    ({((riskMetrics.portfolioRisk.high / (riskMetrics.portfolioRisk.low + riskMetrics.portfolioRisk.medium + riskMetrics.portfolioRisk.high + riskMetrics.portfolioRisk.critical)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(riskMetrics.portfolioRisk.high / 2430) * 100}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Critical Risk</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{riskMetrics.portfolioRisk.critical}</span>
                  <span className="text-slate-400 text-sm ml-2">
                    ({((riskMetrics.portfolioRisk.critical / (riskMetrics.portfolioRisk.low + riskMetrics.portfolioRisk.medium + riskMetrics.portfolioRisk.high + riskMetrics.portfolioRisk.critical)) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(riskMetrics.portfolioRisk.critical / 2430) * 100}%` }} />
              </div>
            </div>
          </motion.div>

          {/* Model Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">AI Model Performance</h3>
            <div className="space-y-4">
              {modelPerformance.map((model, index) => (
                <div key={model.modelName} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{model.modelName}</h4>
                    <span className="text-green-400 font-semibold">{model.accuracy}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Precision</p>
                      <p className="text-white">{model.precision}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Recall</p>
                      <p className="text-white">{model.recall}%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">F1 Score</p>
                      <p className="text-white">{model.f1Score}%</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Predictions: {model.predictions.toLocaleString()}</span>
                      <span>Last trained: {new Date(model.lastTrained).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Risk Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Risk Alerts</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Severity</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.alertType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-medium">{alert.customerName}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Risk Score: {alert.riskScore}</span>
                        <span>Customer ID: {alert.customerId}</span>
                        <span>Detected: {new Date(alert.detectedAt).toLocaleDateString()}</span>
                        {alert.assignedTo && <span>Assigned to: {alert.assignedTo}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewAlert(alert)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <select
                      value={alert.status}
                      onChange={(e) => handleUpdateAlertStatus(alert.id, e.target.value as RiskAlert['status'])}
                      className="bg-slate-600 border border-slate-500 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NEW">New</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="FALSE_POSITIVE">False Positive</option>
                    </select>
                    <button className="text-slate-400 hover:text-slate-300 p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No risk alerts found</h3>
              <p className="text-slate-400">All systems operating within normal risk parameters.</p>
            </div>
          )}
        </motion.div>

        {/* High Risk Profiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6">High Risk Customer Profiles</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riskProfiles.map((profile, index) => (
              <div key={profile.customerId} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">{profile.customerName}</h4>
                    <p className="text-slate-400 text-sm">{profile.customerId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{profile.overallRiskScore}</p>
                    <p className={`text-sm ${getRiskCategoryColor(profile.riskCategory)}`}>
                      {profile.riskCategory} RISK
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-xs">Active Loans</p>
                    <p className="text-white">{profile.loans.active}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Overdue Loans</p>
                    <p className="text-white">{profile.loans.overdue}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Total Exposure</p>
                    <p className="text-white">₹{(profile.loans.totalExposure / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Active Alerts</p>
                    <p className="text-white">{profile.alerts}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Credit Score Risk</span>
                    <span className="text-white text-sm">{profile.factors.creditScoreRisk}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${profile.factors.creditScoreRisk > 80 ? 'bg-red-500' : profile.factors.creditScoreRisk > 60 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                      style={{ width: `${profile.factors.creditScoreRisk}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Payment History Risk</span>
                    <span className="text-white text-sm">{profile.factors.paymentHistoryRisk}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${profile.factors.paymentHistoryRisk > 80 ? 'bg-red-500' : profile.factors.paymentHistoryRisk > 60 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                      style={{ width: `${profile.factors.paymentHistoryRisk}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Debt-to-Income Risk</span>
                    <span className="text-white text-sm">{profile.factors.debtToIncomeRisk}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${profile.factors.debtToIncomeRisk > 80 ? 'bg-red-500' : profile.factors.debtToIncomeRisk > 60 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                      style={{ width: `${profile.factors.debtToIncomeRisk}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-600 text-xs text-slate-400">
                  Last assessed: {new Date(profile.lastAssessed).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alert Details Modal */}
        {showAlertDetails && selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Risk Alert Details</h3>
                <button
                  onClick={() => setShowAlertDetails(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getSeverityColor(selectedAlert.severity)}`}>
                    {getAlertIcon(selectedAlert.alertType)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white mb-2">{selectedAlert.customerName}</h4>
                    <p className="text-slate-300 mb-4">{selectedAlert.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Alert Type</p>
                        <p className="text-white">{selectedAlert.alertType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Severity</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedAlert.severity)}`}>
                          {selectedAlert.severity}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Current Risk Score</p>
                        <p className="text-white font-medium">{selectedAlert.riskScore}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Previous Risk Score</p>
                        <p className="text-white">{selectedAlert.previousRiskScore || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">Alert Metadata</h5>
                  <div className="space-y-2">
                    {Object.entries(selectedAlert.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white">
                          {Array.isArray(value) ? value.join(', ') : value?.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Detected At</p>
                    <p className="text-white">{new Date(selectedAlert.detectedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}