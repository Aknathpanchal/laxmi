'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiAlertTriangle,
  FiTrendingUp,
  FiTrendingDown,
  FiShield,
  FiActivity,
  FiPieChart,
  FiBarChart2,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiRefreshCw,
  FiFilter,
  FiDownload
} from 'react-icons/fi';
import { Line, Bar, Scatter, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RiskProfile {
  id: string;
  loanId: string;
  customerName: string;
  loanAmount: number;
  riskScore: number;
  riskCategory: 'low' | 'medium' | 'high' | 'critical';
  pdScore: number; // Probability of Default
  lgdScore: number; // Loss Given Default
  eadAmount: number; // Exposure at Default
  expectedLoss: number;
  factors: {
    creditHistory: number;
    debtToIncome: number;
    employmentStability: number;
    collateralQuality: number;
    marketConditions: number;
  };
  alerts: string[];
  lastReviewed: string;
  nextReview: string;
}

interface PortfolioMetrics {
  totalExposure: number;
  expectedLoss: number;
  unexpectedLoss: number;
  var95: number; // Value at Risk 95%
  var99: number; // Value at Risk 99%
  averagePD: number;
  averageLGD: number;
  concentrationRisk: number;
}

export default function PortfolioRiskPage() {
  const [profiles, setProfiles] = useState<RiskProfile[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile | null>(null);
  const [riskFilter, setRiskFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchRiskProfiles();
    fetchPortfolioMetrics();
  }, [riskFilter]);

  const fetchRiskProfiles = async () => {
    try {
      const response = await fetch(`/api/risk/profiles?filter=${riskFilter}`);
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Failed to fetch risk profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioMetrics = async () => {
    try {
      const response = await fetch('/api/risk/portfolio-metrics');
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch portfolio metrics:', error);
    }
  };

  const handleRecalculate = async (profileId: string) => {
    try {
      const response = await fetch(`/api/risk/recalculate/${profileId}`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchRiskProfiles();
      }
    } catch (error) {
      console.error('Failed to recalculate risk:', error);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'low': return <FiCheckCircle className="text-green-600" />;
      case 'medium': return <FiAlertCircle className="text-yellow-600" />;
      case 'high': return <FiAlertTriangle className="text-orange-600" />;
      case 'critical': return <FiXCircle className="text-red-600" />;
      default: return null;
    }
  };

  // Risk distribution chart data
  const riskDistribution = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Portfolio Distribution',
        data: [
          profiles.filter(p => p.riskCategory === 'low').length,
          profiles.filter(p => p.riskCategory === 'medium').length,
          profiles.filter(p => p.riskCategory === 'high').length,
          profiles.filter(p => p.riskCategory === 'critical').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }
    ]
  };

  // Risk factors radar chart
  const radarData = selectedProfile ? {
    labels: ['Credit History', 'Debt/Income', 'Employment', 'Collateral', 'Market'],
    datasets: [
      {
        label: 'Risk Factors',
        data: [
          selectedProfile.factors.creditHistory,
          selectedProfile.factors.debtToIncome,
          selectedProfile.factors.employmentStability,
          selectedProfile.factors.collateralQuality,
          selectedProfile.factors.marketConditions
        ],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      }
    ]
  } : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Risk Analysis</h1>
          <p className="text-gray-600">Monitor and assess portfolio risk exposure</p>
        </div>

        {/* Portfolio Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Total Exposure</span>
                <FiShield className="text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{(metrics.totalExposure / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500 mt-1">Portfolio value</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Expected Loss</span>
                <FiTrendingDown className="text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">
                ₹{(metrics.expectedLoss / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-red-500 mt-1">
                {((metrics.expectedLoss / metrics.totalExposure) * 100).toFixed(2)}% of portfolio
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">VaR (95%)</span>
                <FiActivity className="text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                ₹{(metrics.var95 / 1000000).toFixed(2)}M
              </div>
              <div className="text-xs text-orange-500 mt-1">95% confidence</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Avg PD</span>
                <FiPieChart className="text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {(metrics.averagePD * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-purple-500 mt-1">Default probability</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Concentration</span>
                <FiAlertTriangle className="text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {(metrics.concentrationRisk * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-yellow-500 mt-1">Risk level</div>
            </motion.div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FiFilter className="text-gray-400" />
              {['all', 'low', 'medium', 'high', 'critical'].map(level => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    riskFilter === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <FiDownload />
                Export Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Profiles List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Profiles</h3>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.map(profile => (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedProfile?.id === profile.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{profile.customerName}</h4>
                          <p className="text-sm text-gray-500">Loan: {profile.loanId}</p>
                        </div>
                        {getRiskIcon(profile.riskCategory)}
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Risk Score</span>
                          <span className="font-semibold">{profile.riskScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              profile.riskScore > 75 ? 'bg-red-500' :
                              profile.riskScore > 50 ? 'bg-orange-500' :
                              profile.riskScore > 25 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${profile.riskScore}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">PD:</span>
                          <span className="ml-1 font-semibold">
                            {(profile.pdScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">LGD:</span>
                          <span className="ml-1 font-semibold">
                            {(profile.lgdScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Expected Loss:</span>
                          <span className="ml-1 font-semibold text-red-600">
                            ₹{profile.expectedLoss.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(profile.riskCategory)}`}>
                          {profile.riskCategory.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecalculate(profile.id);
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FiRefreshCw size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Risk Score</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Expected Loss</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map(profile => (
                        <tr
                          key={profile.id}
                          className="border-b cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedProfile(profile)}
                        >
                          <td className="py-3">
                            <div>
                              <p className="font-semibold text-gray-900">{profile.customerName}</p>
                              <p className="text-sm text-gray-500">{profile.loanId}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{profile.riskScore}</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    profile.riskScore > 75 ? 'bg-red-500' :
                                    profile.riskScore > 50 ? 'bg-orange-500' :
                                    profile.riskScore > 25 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${profile.riskScore}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(profile.riskCategory)}`}>
                              {profile.riskCategory.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-red-600 font-semibold">
                            ₹{profile.expectedLoss.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRecalculate(profile.id);
                              }}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <FiRefreshCw />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Risk Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
              <Bar data={riskDistribution} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            {/* Selected Profile Details */}
            {selectedProfile && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>

                {radarData && (
                  <div className="mb-4">
                    <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: true }} />
                  </div>
                )}

                {selectedProfile.alerts.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Risk Alerts</h4>
                    <div className="space-y-2">
                      {selectedProfile.alerts.map((alert, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                          <FiAlertCircle className="text-red-500 mt-0.5" size={16} />
                          <span className="text-sm text-red-700">{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Review:</span>
                      <span className="font-semibold">
                        {new Date(selectedProfile.lastReviewed).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Review:</span>
                      <span className="font-semibold">
                        {new Date(selectedProfile.nextReview).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}