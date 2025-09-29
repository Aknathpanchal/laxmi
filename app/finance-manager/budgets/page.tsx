'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiEdit3,
  FiSave,
  FiX,
  FiPlus,
  FiMinus,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  trend: 'up' | 'down' | 'stable';
  lastMonth: number;
  variance: number;
}

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

export default function BudgetsPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newAllocation, setNewAllocation] = useState<{ [key: string]: number }>({});
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  useEffect(() => {
    fetchBudgetData();
    fetchTransactions();
  }, [selectedPeriod]);

  const fetchBudgetData = async () => {
    try {
      const response = await fetch(`/api/finance/budgets?period=${selectedPeriod}`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/finance/transactions?period=${selectedPeriod}`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleSaveAllocation = async (categoryId: string) => {
    try {
      const response = await fetch('/api/finance/budgets/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          newAllocation: newAllocation[categoryId]
        })
      });

      if (response.ok) {
        setEditingCategory(null);
        fetchBudgetData();
      }
    } catch (error) {
      console.error('Failed to update allocation:', error);
    }
  };

  const handleAddBudget = async () => {
    if (!newBudgetName || !newBudgetAmount) return;

    try {
      const response = await fetch('/api/finance/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBudgetName,
          allocated: parseFloat(newBudgetAmount)
        })
      });

      if (response.ok) {
        setShowAddBudget(false);
        setNewBudgetName('');
        setNewBudgetAmount('');
        fetchBudgetData();
      }
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = categories.reduce((sum, cat) => sum + cat.remaining, 0);

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Allocated',
        data: categories.map(cat => cat.allocated),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Spent',
        data: categories.map(cat => cat.spent),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  const pieData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => cat.spent),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Management</h1>
          <p className="text-gray-600">Monitor and control financial allocations</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-4">
            <FiCalendar className="text-gray-400" />
            {['current-month', 'last-month', 'current-quarter', 'current-year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Budget</span>
              <FiDollarSign className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Allocated for period</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Spent</span>
              <FiTrendingDown className="text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">₹{totalSpent.toLocaleString()}</div>
            <div className="text-xs text-red-500 mt-1">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Remaining</span>
              <FiTrendingUp className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">₹{totalRemaining.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-1">
              {((totalRemaining / totalBudget) * 100).toFixed(1)}% available
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Categories</span>
              <FiPieChart className="text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-xs text-gray-500 mt-1">Active budgets</div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Spending</h3>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Distribution</h3>
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
            <button
              onClick={() => setShowAddBudget(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiPlus />
              Add Budget
            </button>
          </div>

          {showAddBudget && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddBudget}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <FiSave />
                </button>
                <button
                  onClick={() => setShowAddBudget(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  <FiX />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {categories.map(category => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {category.percentUsed}% used • ₹{category.remaining.toLocaleString()} remaining
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.trend === 'up' && (
                      <span className="flex items-center text-red-500 text-sm">
                        <FiArrowUp /> {Math.abs(category.variance)}%
                      </span>
                    )}
                    {category.trend === 'down' && (
                      <span className="flex items-center text-green-500 text-sm">
                        <FiArrowDown /> {Math.abs(category.variance)}%
                      </span>
                    )}
                    {editingCategory === category.id ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newAllocation[category.id] || category.allocated}
                          onChange={(e) => setNewAllocation({
                            ...newAllocation,
                            [category.id]: parseFloat(e.target.value)
                          })}
                          className="w-24 px-2 py-1 border border-gray-300 rounded"
                        />
                        <button
                          onClick={() => handleSaveAllocation(category.id)}
                          className="text-green-500 hover:text-green-600"
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="text-gray-500 hover:text-gray-600"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingCategory(category.id)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FiEdit3 />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>₹{category.spent.toLocaleString()} spent</span>
                    <span>₹{category.allocated.toLocaleString()} allocated</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        category.percentUsed > 90 ? 'bg-red-500' :
                        category.percentUsed > 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(category.percentUsed, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Last month: ₹{category.lastMonth.toLocaleString()}
                  </span>
                  {category.percentUsed > 90 && (
                    <span className="flex items-center gap-1 text-red-500">
                      <FiAlertCircle /> Budget alert
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map(transaction => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm">{transaction.description}</td>
                    <td className="py-3 text-sm">{transaction.category}</td>
                    <td className={`py-3 text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-600' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}