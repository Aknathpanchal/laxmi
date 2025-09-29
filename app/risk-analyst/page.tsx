'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import {
  Shield, AlertTriangle, TrendingUp, TrendingDown, Brain,
  Target, Activity, Users, CreditCard, Percent, Award,
  Eye, Search, Filter, RefreshCw, Download, Settings,
  Bell, FileText, BarChart3, PieChart as PieChartIcon,
  Database, Globe, Calculator, Clock, CheckCircle,
  XCircle, Flag, Zap, ArrowUpRight, ArrowDownRight,
  Package, Building, User, Phone, Mail, MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// RiskAnalystLayout is already applied by ConditionalLayout based on user role

interface RiskMetrics {
  portfolio: {
    totalExposure: number;
    averageRiskScore: number;
    highRiskAccounts: number;
    mediumRiskAccounts: number;
    lowRiskAccounts: number;
    riskWeightedAssets: number;
    concentrationRisk: number;
    diversificationIndex: number;
  };
  predictive: {
    defaultProbability: number;
    earlyWarningSignals: number;
    stressTestResults: number;
    modelAccuracy: number;
    backtestingResults: number;
    calibrationIndex: number;
  };
  operational: {
    fraudAttempts: number;
    fraudPrevented: number;
    fraudLoss: number;
    operationalLoss: number;
    complianceViolations: number;
    auditFindings: number;
  };
  market: {
    interestRateRisk: number;
    liquidityRisk: number;
    concentrationRisk: number;
    sectorExposure: { [key: string]: number };
    geographicExposure: { [key: string]: number };
  };
}

interface RiskAlert {
  id: string;
  type: 'CREDIT_RISK' | 'OPERATIONAL_RISK' | 'MARKET_RISK' | 'COMPLIANCE_RISK';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  entity: string;
  impact: number;
  probability: number;
  recommendation: string;
  assignedTo?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'CLOSED';
  createdAt: string;
  dueDate: string;
}

interface RiskScenario {
  id: string;
  name: string;
  type: 'STRESS_TEST' | 'SCENARIO_ANALYSIS' | 'MONTE_CARLO';
  parameters: {
    gdpGrowth: number;
    unemploymentRate: number;
    interestRateChange: number;
    inflationRate: number;
  };
  results: {
    portfolioLoss: number;
    defaultRate: number;
    capitalRequirement: number;
    timeHorizon: number;
  };
  lastRun: string;
  status: 'COMPLETED' | 'RUNNING' | 'SCHEDULED';
}

export default function RiskAnalystDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [scenarios, setScenarios] = useState<RiskScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'scenarios' | 'models'>('overview');
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'RISK_ANALYST') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Mock data
  const mockMetrics: RiskMetrics = {
    portfolio: {
      totalExposure: 2850000000,
      averageRiskScore: 72.5,
      highRiskAccounts: 456,
      mediumRiskAccounts: 2340,
      lowRiskAccounts: 7444,
      riskWeightedAssets: 4200000000,
      concentrationRisk: 15.8,
      diversificationIndex: 0.85
    },
    predictive: {
      defaultProbability: 4.2,
      earlyWarningSignals: 23,
      stressTestResults: 8.5,
      modelAccuracy: 87.6,
      backtestingResults: 92.3,
      calibrationIndex: 0.94
    },
    operational: {
      fraudAttempts: 156,
      fraudPrevented: 142,
      fraudLoss: 2500000,
      operationalLoss: 8500000,
      complianceViolations: 3,
      auditFindings: 12
    },
    market: {
      interestRateRisk: 12.5,
      liquidityRisk: 8.3,
      concentrationRisk: 15.8,
      sectorExposure: {
        'Information Technology': 25,
        'Financial Services': 20,
        'Healthcare': 15,
        'Manufacturing': 18,
        'Retail': 12,
        'Others': 10
      },
      geographicExposure: {
        'North': 35,
        'West': 28,
        'South': 22,
        'East': 15
      }
    }
  };

  const mockAlerts: RiskAlert[] = [
    {
      id: '1',
      type: 'CREDIT_RISK',
      severity: 'CRITICAL',
      title: 'High Concentration Risk in IT Sector',
      description: 'Portfolio exposure to IT sector exceeds risk appetite limit of 20%',
      entity: 'IT Sector Portfolio',
      impact: 85000000,
      probability: 75,
      recommendation: 'Reduce IT sector exposure by ₹15 Cr or increase risk limits',
      assignedTo: 'Senior Risk Manager',
      status: 'INVESTIGATING',
      createdAt: '2024-01-15T09:30:00Z',
      dueDate: '2024-01-20T17:00:00Z'
    },
    {
      id: '2',
      type: 'OPERATIONAL_RISK',
      severity: 'HIGH',
      title: 'Unusual Fraud Pattern Detected',
      description: 'ML model detected 15 applications with similar behavioral patterns',
      entity: 'Fraud Detection System',
      impact: 12500000,
      probability: 65,
      recommendation: 'Investigate applications and update fraud detection rules',
      assignedTo: 'Fraud Investigation Team',
      status: 'OPEN',
      createdAt: '2024-01-15T11:45:00Z',
      dueDate: '2024-01-17T12:00:00Z'
    },
    {
      id: '3',
      type: 'MARKET_RISK',
      severity: 'MEDIUM',
      title: 'Interest Rate Sensitivity Alert',
      description: 'Portfolio duration risk exceeds threshold due to recent rate changes',
      entity: 'Fixed Rate Portfolio',
      impact: 25000000,
      probability: 45,
      recommendation: 'Review hedging strategy and consider rate risk mitigation',
      status: 'OPEN',
      createdAt: '2024-01-15T14:20:00Z',
      dueDate: '2024-01-22T17:00:00Z'
    }
  ];

  const mockScenarios: RiskScenario[] = [
    {
      id: '1',
      name: 'Economic Recession Scenario',
      type: 'STRESS_TEST',
      parameters: {
        gdpGrowth: -2.5,
        unemploymentRate: 12.0,
        interestRateChange: 2.0,
        inflationRate: 8.5
      },
      results: {
        portfolioLoss: 285000000,
        defaultRate: 12.5,
        capitalRequirement: 15.8,
        timeHorizon: 24
      },
      lastRun: '2024-01-10T10:00:00Z',
      status: 'COMPLETED'
    },
    {
      id: '2',
      name: 'Credit Crunch Analysis',
      type: 'SCENARIO_ANALYSIS',
      parameters: {
        gdpGrowth: -1.0,
        unemploymentRate: 8.5,
        interestRateChange: 3.5,
        inflationRate: 6.0
      },
      results: {
        portfolioLoss: 195000000,
        defaultRate: 8.7,
        capitalRequirement: 13.2,
        timeHorizon: 18
      },
      lastRun: '2024-01-08T15:30:00Z',
      status: 'COMPLETED'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
      setScenarios(mockScenarios);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMetrics(mockMetrics);
      setAlerts(mockAlerts);
      setScenarios(mockScenarios);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'HIGH': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'LOW': return 'text-green-400 bg-green-900/20 border-green-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getRiskTypeIcon = (type: string) => {
    switch (type) {
      case 'CREDIT_RISK': return <CreditCard className="w-4 h-4" />;
      case 'OPERATIONAL_RISK': return <Shield className="w-4 h-4" />;
      case 'MARKET_RISK': return <TrendingUp className="w-4 h-4" />;
      case 'COMPLIANCE_RISK': return <FileText className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
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
  if (!user || user.role !== 'RISK_ANALYST') {
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
            <p className="mt-4 text-slate-400">Loading risk dashboard...</p>
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
              Risk Analytics Dashboard
            </h1>
            <p className="text-slate-400">Advanced risk management and predictive analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Models
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* Risk Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-xs text-slate-500">High Risk</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.portfolio.highRiskAccounts}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-red-400">Needs monitoring</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Model Accuracy</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatPercentage(metrics?.predictive.modelAccuracy || 0)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Excellent</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500">Fraud Prevention</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatPercentage((metrics?.operational.fraudPrevented || 0) / (metrics?.operational.fraudAttempts || 1) * 100)}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <span className="text-blue-400">{metrics?.operational.fraudPrevented} prevented</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">Risk Score</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.portfolio.averageRiskScore}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-purple-400">Portfolio average</span>
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
            { id: 'overview', label: 'Risk Overview', icon: BarChart3 },
            { id: 'alerts', label: 'Risk Alerts', icon: AlertTriangle },
            { id: 'scenarios', label: 'Stress Tests', icon: Calculator },
            { id: 'models', label: 'ML Models', icon: Brain }
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
              {/* Risk Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-400" />
                    Portfolio Risk Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Low Risk', value: metrics?.portfolio.lowRiskAccounts, fill: '#34d399' },
                          { name: 'Medium Risk', value: metrics?.portfolio.mediumRiskAccounts, fill: '#fbbf24' },
                          { name: 'High Risk', value: metrics?.portfolio.highRiskAccounts, fill: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
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
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    Sector Exposure Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={Object.entries(metrics?.market.sectorExposure || {}).map(([sector, value]) => ({ sector, value }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="sector" stroke="#64748b" angle={-45} textAnchor="end" height={60} />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Credit Risk Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Exposure</span>
                      <span className="text-white font-semibold">{formatCurrency(metrics?.portfolio.totalExposure || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Default Probability</span>
                      <span className="text-red-400 font-semibold">{formatPercentage(metrics?.predictive.defaultProbability || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Concentration Risk</span>
                      <span className="text-orange-400 font-semibold">{formatPercentage(metrics?.portfolio.concentrationRisk || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Early Warning Signals</span>
                      <span className="text-yellow-400 font-semibold">{metrics?.predictive.earlyWarningSignals}</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Operational Risk
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Fraud Loss</span>
                      <span className="text-red-400 font-semibold">{formatCurrency(metrics?.operational.fraudLoss || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Operational Loss</span>
                      <span className="text-orange-400 font-semibold">{formatCurrency(metrics?.operational.operationalLoss || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Compliance Violations</span>
                      <span className="text-yellow-400 font-semibold">{metrics?.operational.complianceViolations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Audit Findings</span>
                      <span className="text-blue-400 font-semibold">{metrics?.operational.auditFindings}</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Market Risk
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Interest Rate Risk</span>
                      <span className="text-purple-400 font-semibold">{formatPercentage(metrics?.market.interestRateRisk || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Liquidity Risk</span>
                      <span className="text-blue-400 font-semibold">{formatPercentage(metrics?.market.liquidityRisk || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Concentration Risk</span>
                      <span className="text-green-400 font-semibold">{formatPercentage(metrics?.market.concentrationRisk || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Diversification Index</span>
                      <span className="text-emerald-400 font-semibold">{metrics?.portfolio.diversificationIndex}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Active Risk Alerts ({alerts.length})
                </h3>
                <div className="flex items-center gap-4">
                  <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>All Types</option>
                    <option>Credit Risk</option>
                    <option>Operational Risk</option>
                    <option>Market Risk</option>
                  </select>
                  <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    whileHover={{ scale: 1.01 }}
                    className={`glass rounded-lg p-4 border cursor-pointer hover:shadow-glow transition-all ${getSeverityColor(alert.severity)}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getRiskTypeIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{alert.title}</h4>
                          <p className="text-slate-400 text-sm">{alert.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-3">{alert.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-slate-400 text-xs">Potential Impact</p>
                        <p className="text-white font-semibold">{formatCurrency(alert.impact)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Probability</p>
                        <p className="text-white font-semibold">{alert.probability}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Status</p>
                        <p className="text-white font-semibold">{alert.status.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                      <div className="text-sm text-slate-400">
                        Due: {new Date(alert.dueDate).toLocaleDateString()}
                        {alert.assignedTo && <span> • Assigned to: {alert.assignedTo}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                          Investigate
                        </button>
                        <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors">
                          <Eye className="w-4 h-4 inline mr-1" />
                          Details
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-sm text-slate-400 mb-1">Recommendation:</p>
                      <p className="text-sm text-slate-300 italic">"{alert.recommendation}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-400" />
                  Stress Test Scenarios
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Run New Scenario
                </button>
              </div>

              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.01 }}
                    className="glass rounded-lg p-6 border border-slate-700 hover:shadow-glow transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{scenario.name}</h4>
                        <p className="text-slate-400 text-sm">{scenario.type.replace('_', ' ')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        scenario.status === 'COMPLETED' ? 'text-green-400 bg-green-900/20' :
                        scenario.status === 'RUNNING' ? 'text-blue-400 bg-blue-900/20' :
                        'text-yellow-400 bg-yellow-900/20'
                      }`}>
                        {scenario.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-semibold text-slate-300 mb-3">Scenario Parameters</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">GDP Growth</span>
                            <span className="text-white">{scenario.parameters.gdpGrowth}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Unemployment Rate</span>
                            <span className="text-white">{scenario.parameters.unemploymentRate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Interest Rate Change</span>
                            <span className="text-white">+{scenario.parameters.interestRateChange}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Inflation Rate</span>
                            <span className="text-white">{scenario.parameters.inflationRate}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-slate-300 mb-3">Impact Results</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Portfolio Loss</span>
                            <span className="text-red-400 font-semibold">{formatCurrency(scenario.results.portfolioLoss)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Default Rate</span>
                            <span className="text-orange-400 font-semibold">{scenario.results.defaultRate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Capital Requirement</span>
                            <span className="text-yellow-400 font-semibold">{scenario.results.capitalRequirement}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Time Horizon</span>
                            <span className="text-white">{scenario.results.timeHorizon} months</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-700 mt-4">
                      <div className="text-sm text-slate-400">
                        Last run: {new Date(scenario.lastRun).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                          Re-run
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                ML Model Performance Dashboard
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-4">Credit Scoring Model</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Model Accuracy</span>
                      <span className="text-green-400 font-semibold">{formatPercentage(metrics?.predictive.modelAccuracy || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Backtesting Results</span>
                      <span className="text-blue-400 font-semibold">{formatPercentage(metrics?.predictive.backtestingResults || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Calibration Index</span>
                      <span className="text-purple-400 font-semibold">{metrics?.predictive.calibrationIndex}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics?.predictive.modelAccuracy || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 rounded-full bg-gradient-to-r from-green-600 to-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-4">Fraud Detection Model</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Detection Rate</span>
                      <span className="text-green-400 font-semibold">91.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">False Positive Rate</span>
                      <span className="text-orange-400 font-semibold">2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Model Drift</span>
                      <span className="text-yellow-400 font-semibold">Low</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "91%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Model Monitoring & Alerts</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { model: 'Credit Scoring', status: 'HEALTHY', lastUpdate: '2024-01-15', drift: 'Low' },
                    { model: 'Fraud Detection', status: 'HEALTHY', lastUpdate: '2024-01-14', drift: 'Low' },
                    { model: 'Early Warning', status: 'ATTENTION', lastUpdate: '2024-01-13', drift: 'Medium' },
                    { model: 'Collection Scoring', status: 'HEALTHY', lastUpdate: '2024-01-15', drift: 'Low' },
                    { model: 'Pricing Model', status: 'HEALTHY', lastUpdate: '2024-01-12', drift: 'Low' },
                    { model: 'Churn Prediction', status: 'RETRAINING', lastUpdate: '2024-01-10', drift: 'High' }
                  ].map((model, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-white">{model.model}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          model.status === 'HEALTHY' ? 'text-green-400 bg-green-900/20' :
                          model.status === 'ATTENTION' ? 'text-yellow-400 bg-yellow-900/20' :
                          'text-red-400 bg-red-900/20'
                        }`}>
                          {model.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Update</span>
                          <span className="text-slate-300">{model.lastUpdate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Model Drift</span>
                          <span className={`${
                            model.drift === 'Low' ? 'text-green-400' :
                            model.drift === 'Medium' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>{model.drift}</span>
                        </div>
                      </div>
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