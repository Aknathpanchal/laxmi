'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3,
  Calendar, AlertCircle, CheckCircle, Clock, Plus, Edit2,
  Download, Filter, ArrowUp, ArrowDown, Activity, Target,
  Wallet, CreditCard, FileText, Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface BudgetAllocation {
  id: string;
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  quarter: string;
  lastUpdated: Date;
}

interface Expense {
  id: string;
  department: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  approvedBy: string;
  status: 'approved' | 'pending' | 'rejected';
}

export default function BudgetManagementPage() {
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'allocations' | 'expenses' | 'forecast'>('overview');
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2024');
  const [summary, setSummary] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    totalRemaining: 0,
    utilizationRate: 0,
    departments: 0,
    pendingExpenses: 0
  });

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);

      // Fetch summary
      const summaryRes = await fetch('/api/admin/budget?type=summary');
      const summaryData = await summaryRes.json();
      if (summaryData.success) {
        setSummary(summaryData.data.summary);
      }

      // Fetch allocations
      const allocRes = await fetch('/api/admin/budget?type=allocations');
      const allocData = await allocRes.json();
      if (allocData.success) {
        setAllocations(allocData.data.allocations);
      }

      // Fetch expenses
      const expRes = await fetch('/api/admin/budget?type=expenses');
      const expData = await expRes.json();
      if (expData.success) {
        setExpenses(expData.data.expenses);
      }
    } catch (error) {
      console.error('Failed to fetch budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUtilizationColor = (rate: number) => {
    if (rate < 50) return 'text-green-400';
    if (rate < 75) return 'text-yellow-400';
    if (rate < 90) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-700 text-slate-400';
    }
  };

  const departmentColors: { [key: string]: string } = {
    'Operations': 'bg-blue-500',
    'Technology': 'bg-purple-500',
    'Marketing': 'bg-green-500',
    'Human Resources': 'bg-yellow-500',
    'Legal & Compliance': 'bg-red-500'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Budget Management</h1>
              <p className="text-slate-400">Manage departmental budgets and expenses</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg"
              >
                <option value="Q4 2024">Q4 2024</option>
                <option value="Q3 2024">Q3 2024</option>
                <option value="Q2 2024">Q2 2024</option>
                <option value="Q1 2024">Q1 2024</option>
              </select>
              <button
                onClick={() => setShowAllocationModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Allocation</span>
              </button>
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500">Total Budget</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalAllocated)}</p>
            <p className="text-xs text-slate-400 mt-1">Allocated for {selectedQuarter}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Spent</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalSpent)}</p>
            <div className="flex items-center mt-1">
              <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-xs text-green-400">{summary.utilizationRate}% utilized</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xs text-slate-500">Remaining</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalRemaining)}</p>
            <p className="text-xs text-slate-400 mt-1">Available to spend</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">{summary.pendingExpenses}</p>
            <p className="text-xs text-slate-400 mt-1">Expenses for approval</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
          {['overview', 'allocations', 'expenses', 'forecast'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Budget Distribution */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Budget Distribution</h3>
                <div className="space-y-4">
                  {allocations.map((allocation) => {
                    const utilizationRate = (allocation.spent / allocation.allocated) * 100;
                    return (
                      <div key={allocation.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded ${departmentColors[allocation.department]}`} />
                            <span className="text-sm text-white">{allocation.department}</span>
                          </div>
                          <span className={`text-sm font-medium ${getUtilizationColor(utilizationRate)}`}>
                            {utilizationRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${departmentColors[allocation.department]} transition-all`}
                            style={{ width: `${utilizationRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Spent: {formatCurrency(allocation.spent)}</span>
                          <span>Budget: {formatCurrency(allocation.allocated)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Expenses */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
                <div className="space-y-3">
                  {expenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{expense.description}</p>
                        <p className="text-xs text-slate-400">{expense.department} • {expense.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(expense.amount)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'allocations' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900">
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Department</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Allocated</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Spent</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Remaining</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Utilization</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((allocation) => {
                    const utilizationRate = (allocation.spent / allocation.allocated) * 100;
                    return (
                      <tr key={allocation.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded ${departmentColors[allocation.department]}`} />
                            <span className="text-sm font-medium text-white">{allocation.department}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">{formatCurrency(allocation.allocated)}</td>
                        <td className="px-6 py-4 text-sm text-white">{formatCurrency(allocation.spent)}</td>
                        <td className="px-6 py-4 text-sm text-white">{formatCurrency(allocation.remaining)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${departmentColors[allocation.department]}`}
                                style={{ width: `${utilizationRate}%` }}
                              />
                            </div>
                            <span className={`text-sm ${getUtilizationColor(utilizationRate)}`}>
                              {utilizationRate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                              <Edit2 className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select className="px-3 py-1.5 bg-slate-700 text-white rounded text-sm">
                    <option>All Departments</option>
                    {Array.from(new Set(allocations.map(a => a.department))).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <select className="px-3 py-1.5 bg-slate-700 text-white rounded text-sm">
                    <option>All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                  Add Expense
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900">
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Description</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Department</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{expense.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{expense.department}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{expense.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white">{formatCurrency(expense.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{expense.approvedBy || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Forecast Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Budget Forecast</h3>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <BarChart3 className="w-16 h-16" />
                  <p className="ml-4">Forecast visualization coming soon</p>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Spending Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-white">Q3 to Q4 Growth</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">+12.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-white">Budget Target Achievement</span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">87%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-white">Average Monthly Burn Rate</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-400">{formatCurrency(3500000)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}