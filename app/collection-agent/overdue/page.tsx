'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiAlertCircle,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiArrowRight,
  FiFilter
} from 'react-icons/fi';

interface OverdueAccount {
  id: string;
  loanId: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  loanAmount: number;
  outstandingAmount: number;
  emiAmount: number;
  daysOverdue: number;
  lastPaymentDate: string;
  nextActionDate: string;
  priority: 'high' | 'medium' | 'low';
  lastContactDate: string | null;
  lastContactMethod: string | null;
  lastContactResult: string | null;
  attempts: number;
  promiseToPayDate: string | null;
  collectionStage: 'soft' | 'hard' | 'legal';
  notes: string;
}

export default function OverdueAccountsPage() {
  const [accounts, setAccounts] = useState<OverdueAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<OverdueAccount | null>(null);
  const [filter, setFilter] = useState('all');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'sms' | 'whatsapp'>('phone');
  const [contactNote, setContactNote] = useState('');
  const [promiseDate, setPromiseDate] = useState('');

  useEffect(() => {
    fetchOverdueAccounts();
  }, [filter]);

  const fetchOverdueAccounts = async () => {
    try {
      const response = await fetch(`/api/collections/overdue?filter=${filter}`);
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch overdue accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!selectedAccount) return;

    try {
      const response = await fetch('/api/collections/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          method: contactMethod,
          notes: contactNote,
          promiseToPayDate: promiseDate || null
        })
      });

      if (response.ok) {
        alert('Contact recorded successfully');
        setContactNote('');
        setPromiseDate('');
        fetchOverdueAccounts();
      }
    } catch (error) {
      console.error('Failed to record contact:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'legal': return 'text-red-600';
      case 'hard': return 'text-orange-600';
      case 'soft': return 'text-blue-600';
      default: return 'text-gray-600';
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Overdue Accounts</h1>
          <p className="text-gray-600">Manage and track collection activities</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Overdue</span>
              <FiDollarSign className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹12.5L</div>
            <div className="text-xs text-red-500 mt-1">+₹50K this week</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Accounts</span>
              <FiUser className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{accounts.length}</div>
            <div className="text-xs text-gray-500 mt-1">Active cases</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Recovery Rate</span>
              <FiTrendingUp className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-green-600">72%</div>
            <div className="text-xs text-green-500 mt-1">+5% vs last month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Contacted Today</span>
              <FiPhone className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">28</div>
            <div className="text-xs text-gray-500 mt-1">12 promised to pay</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <FiFilter className="text-gray-400" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Accounts
            </button>
            <button
              onClick={() => setFilter('high-priority')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'high-priority' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilter('pending-contact')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'pending-contact' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending Contact
            </button>
            <button
              onClick={() => setFilter('promised')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'promised' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Promised to Pay
            </button>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account List</h3>
            <div className="space-y-4">
              {accounts.map(account => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                    selectedAccount?.id === account.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedAccount(account)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.customerName}</h4>
                      <p className="text-sm text-gray-500">Loan ID: {account.loanId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(account.priority)}`}>
                      {account.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Outstanding:</span>
                      <p className="font-semibold text-gray-900">₹{account.outstandingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Days Overdue:</span>
                      <p className="font-semibold text-red-600">{account.daysOverdue} days</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Stage:</span>
                      <p className={`font-semibold ${getStageColor(account.collectionStage)}`}>
                        {account.collectionStage.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Contact Attempts:</span>
                      <p className="font-semibold text-gray-900">{account.attempts}</p>
                    </div>
                  </div>

                  {account.promiseToPayDate && (
                    <div className="mt-3 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">
                        Promise to Pay: {new Date(account.promiseToPayDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Account Details */}
          {selectedAccount && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">{selectedAccount.customerName}</h4>

                {/* Contact Information */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      <span>{selectedAccount.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      <span>{selectedAccount.email}</span>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Loan Details</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Loan Amount:</span>
                      <p className="font-semibold">₹{selectedAccount.loanAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Outstanding:</span>
                      <p className="font-semibold text-red-600">₹{selectedAccount.outstandingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">EMI Amount:</span>
                      <p className="font-semibold">₹{selectedAccount.emiAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Days Overdue:</span>
                      <p className="font-semibold text-red-600">{selectedAccount.daysOverdue} days</p>
                    </div>
                  </div>
                </div>

                {/* Collection History */}
                {selectedAccount.lastContactDate && (
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">Last Contact</h5>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <p>Date: {new Date(selectedAccount.lastContactDate).toLocaleDateString()}</p>
                      <p>Method: {selectedAccount.lastContactMethod}</p>
                      <p>Result: {selectedAccount.lastContactResult}</p>
                    </div>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="border-t pt-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-3">Record Contact</h5>

                  <div className="flex gap-2 mb-4">
                    {(['phone', 'email', 'sms', 'whatsapp'] as const).map(method => (
                      <button
                        key={method}
                        onClick={() => setContactMethod(method)}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          contactMethod === method
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={contactNote}
                    onChange={(e) => setContactNote(e.target.value)}
                    placeholder="Contact notes..."
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                    rows={3}
                  />

                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">Promise to Pay Date (Optional)</label>
                    <input
                      type="date"
                      value={promiseDate}
                      onChange={(e) => setPromiseDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={handleContact}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Record Contact
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}