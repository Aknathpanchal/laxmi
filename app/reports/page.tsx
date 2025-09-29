'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiCalendar,
  FiDownload, FiFilter, FiRefreshCw, FiPieChart,
  FiBarChart2, FiActivity, FiCreditCard, FiPercent,
  FiClock, FiCheckCircle, FiAlertCircle, FiXCircle,
  FiFileText, FiPrinter, FiMail, FiShare2
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
import { useAuth } from '@/lib/contexts/AuthContext';
import { loanService } from '@/lib/api/loans.service';

// Register ChartJS components
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

interface ReportMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  type: 'payment' | 'disbursement' | 'fee';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const metrics: ReportMetric[] = [
    {
      title: 'Total Loan Amount',
      value: '₹5,00,000',
      change: 0,
      icon: FiDollarSign,
      color: 'blue'
    },
    {
      title: 'Total Paid',
      value: '₹1,25,000',
      change: 12.5,
      icon: FiCheckCircle,
      color: 'green'
    },
    {
      title: 'Outstanding',
      value: '₹3,75,000',
      change: -8.3,
      icon: FiCreditCard,
      color: 'orange'
    },
    {
      title: 'Interest Rate',
      value: '12.5%',
      change: 0,
      icon: FiPercent,
      color: 'purple'
    }
  ];

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: FiPieChart },
    { id: 'payments', name: 'Payment History', icon: FiCreditCard },
    { id: 'statements', name: 'Account Statement', icon: FiFileText },
    { id: 'interest', name: 'Interest Analysis', icon: FiPercent },
    { id: 'forecast', name: 'Payment Forecast', icon: FiTrendingUp }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'payment',
      amount: 25000,
      status: 'completed',
      description: 'EMI Payment - January 2024'
    },
    {
      id: '2',
      date: '2023-12-15',
      type: 'payment',
      amount: 25000,
      status: 'completed',
      description: 'EMI Payment - December 2023'
    },
    {
      id: '3',
      date: '2023-11-15',
      type: 'payment',
      amount: 25000,
      status: 'completed',
      description: 'EMI Payment - November 2023'
    },
    {
      id: '4',
      date: '2023-10-15',
      type: 'payment',
      amount: 25000,
      status: 'completed',
      description: 'EMI Payment - October 2023'
    },
    {
      id: '5',
      date: '2023-09-15',
      type: 'payment',
      amount: 25000,
      status: 'completed',
      description: 'EMI Payment - September 2023'
    }
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, selectedReport]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Fetch actual data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: string) => {
    // Export logic here
    console.log(`Exporting as ${format}`);
  };

  // Chart data
  const paymentTrendData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'EMI Paid',
        data: [25000, 25000, 25000, 25000, 25000, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Outstanding',
        data: [500000, 475000, 450000, 425000, 400000, 375000],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const paymentDistributionData = {
    labels: ['Principal', 'Interest', 'Charges'],
    datasets: [{
      data: [18000, 6500, 500],
      backgroundColor: [
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(251, 146, 60)'
      ],
      borderWidth: 0
    }]
  };

  const monthlyComparisonData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Payments',
      data: [25000, 25000, 25000, 25000, 25000, 25000],
      backgroundColor: 'rgba(59, 130, 246, 0.7)'
    }]
  };

  const loanProgressData = {
    labels: ['Paid', 'Remaining'],
    datasets: [{
      data: [25, 75],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(229, 231, 235)'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const
      }
    }
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Trend</h3>
          <div className="h-64">
            <Line data={paymentTrendData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Distribution</h3>
          <div className="h-64">
            <Pie data={paymentDistributionData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>
          <div className="h-64">
            <Bar data={monthlyComparisonData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Loan Progress</h3>
          <div className="h-64">
            <Doughnut data={loanProgressData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-gray-900">25%</p>
            <p className="text-sm text-gray-600">Loan Repaid</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Date</th>
                <th className="text-left py-3 px-2">Description</th>
                <th className="text-left py-3 px-2">Type</th>
                <th className="text-right py-3 px-2">Amount</th>
                <th className="text-left py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(transaction => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-600">{transaction.date}</td>
                  <td className="py-3 px-2">{transaction.description}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
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
  );

  const renderPaymentHistory = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Payment History</h3>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
          </select>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <FiFilter />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4">Payment Date</th>
              <th className="text-left py-3 px-4">EMI Amount</th>
              <th className="text-left py-3 px-4">Principal</th>
              <th className="text-left py-3 px-4">Interest</th>
              <th className="text-left py-3 px-4">Late Fee</th>
              <th className="text-left py-3 px-4">Total Paid</th>
              <th className="text-left py-3 px-4">Balance</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(12)].map((_, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">15/{12 - index}/2023</td>
                <td className="py-3 px-4">₹25,000</td>
                <td className="py-3 px-4">₹18,000</td>
                <td className="py-3 px-4">₹6,500</td>
                <td className="py-3 px-4">₹{index === 0 ? '500' : '0'}</td>
                <td className="py-3 px-4 font-medium">₹{index === 0 ? '25,500' : '25,000'}</td>
                <td className="py-3 px-4">₹{(500000 - (index + 1) * 25000).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                    Paid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAccountStatement = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Account Statement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Generate Statement
            </button>
          </div>
        </div>
      </div>

      {/* Statement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Opening Balance</p>
          <p className="text-xl font-bold">₹5,00,000</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Credits</p>
          <p className="text-xl font-bold text-green-600">₹1,25,000</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Debits</p>
          <p className="text-xl font-bold text-red-600">₹0</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Closing Balance</p>
          <p className="text-xl font-bold">₹3,75,000</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => handleExport('pdf')}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <FiFileText /> PDF
        </button>
        <button
          onClick={() => handleExport('excel')}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <FiDownload /> Excel
        </button>
        <button
          onClick={() => handleExport('print')}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <FiPrinter /> Print
        </button>
        <button
          onClick={() => handleExport('email')}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <FiMail /> Email
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'payments':
        return renderPaymentHistory();
      case 'statements':
        return renderAccountStatement();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">Track your loan performance and payment history</p>
            </div>
            <button
              onClick={() => fetchReportData()}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
            >
              <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-8 h-8 text-${metric.color}-600`} />
                  {metric.change !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                      {Math.abs(metric.change)}%
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Report Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {reportTypes.map(report => {
              const Icon = report.icon;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    selectedReport === report.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {report.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12">
            <div className="flex flex-col items-center justify-center">
              <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading report data...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}