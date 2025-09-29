'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiShield,
  FiDownload,
  FiEye,
  FiMessageSquare,
  FiChevronRight
} from 'react-icons/fi';

interface Application {
  id: string;
  applicantName: string;
  applicantId: string;
  loanType: string;
  amount: number;
  term: number;
  purpose: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  creditScore: number;
  income: number;
  debtToIncome: number;
  employmentStatus: string;
  documentsVerified: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  assignedDate: string;
  dueDate: string;
  notes?: string;
}

export default function UnderwriterApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    underReview: 0,
    todaysDue: 0,
    highPriority: 0,
    avgProcessingTime: '2.5',
    approvalRate: 78
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/underwriter/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Use mock data
      setApplications(mockApplications);
    } finally {
      setIsLoading(false);
    }
  };

  const mockApplications: Application[] = [
    {
      id: 'APP001',
      applicantName: 'Rajesh Kumar',
      applicantId: 'USR001',
      loanType: 'Personal Loan',
      amount: 500000,
      term: 36,
      purpose: 'Home Renovation',
      status: 'pending',
      priority: 'high',
      creditScore: 720,
      income: 75000,
      debtToIncome: 35,
      employmentStatus: 'Salaried',
      documentsVerified: true,
      riskLevel: 'low',
      assignedDate: '2024-01-18',
      dueDate: '2024-01-20'
    },
    {
      id: 'APP002',
      applicantName: 'Priya Sharma',
      applicantId: 'USR002',
      loanType: 'Business Loan',
      amount: 1500000,
      term: 60,
      purpose: 'Business Expansion',
      status: 'under-review',
      priority: 'medium',
      creditScore: 680,
      income: 150000,
      debtToIncome: 42,
      employmentStatus: 'Self-Employed',
      documentsVerified: true,
      riskLevel: 'medium',
      assignedDate: '2024-01-17',
      dueDate: '2024-01-21'
    },
    {
      id: 'APP003',
      applicantName: 'Amit Patel',
      applicantId: 'USR003',
      loanType: 'Gold Loan',
      amount: 200000,
      term: 12,
      purpose: 'Medical Emergency',
      status: 'pending',
      priority: 'urgent',
      creditScore: 650,
      income: 45000,
      debtToIncome: 28,
      employmentStatus: 'Salaried',
      documentsVerified: false,
      riskLevel: 'low',
      assignedDate: '2024-01-19',
      dueDate: '2024-01-19'
    }
  ];

  const handleDecision = async (applicationId: string, decision: 'approve' | 'reject' | 'hold', notes?: string) => {
    try {
      const response = await fetch('/api/underwriter/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, decision, notes })
      });

      if (response.ok) {
        // Update local state
        setApplications(prev => prev.map(app =>
          app.id === applicationId
            ? { ...app, status: decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'on-hold' }
            : app
        ));
        setSelectedApplication(null);
        alert(`Application ${decision}ed successfully`);
      }
    } catch (error) {
      console.error('Error processing decision:', error);
      alert('Failed to process decision');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredApplications = activeFilter === 'all'
    ? applications
    : applications.filter(app => app.status === activeFilter);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Review</h1>
        <p className="text-gray-600">Review and process loan applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              <p className="text-xs text-red-600 mt-1">{stats.todaysDue} due today</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
              <p className="text-xs text-gray-600 mt-1">In progress</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Processing</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgProcessingTime}h</p>
              <p className="text-xs text-green-600 mt-1">↓ 15% faster</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approval Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvalRate}%</p>
              <p className="text-xs text-gray-600 mt-1">This month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {['all', 'pending', 'under-review', 'approved', 'rejected', 'on-hold'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold">{application.applicantName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(application.priority)}`}>
                      {application.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(application.riskLevel)}`}>
                      {application.riskLevel.toUpperCase()} RISK
                    </span>
                    {!application.documentsVerified && (
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-50 text-orange-600">
                        DOCS PENDING
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Loan Type</p>
                      <p className="font-medium">{application.loanType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-medium">₹{application.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Term</p>
                      <p className="font-medium">{application.term} months</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credit Score</p>
                      <p className="font-medium">{application.creditScore}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Monthly Income</p>
                      <p className="text-sm">₹{application.income.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">DTI Ratio</p>
                      <p className="text-sm">{application.debtToIncome}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employment</p>
                      <p className="text-sm">{application.employmentStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm text-red-600">{application.dueDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    Review
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
                    <FiDownload className="w-4 h-4 mr-2" />
                    Docs
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Application Review</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Application Details */}
              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">Applicant Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID</p>
                      <p className="font-medium">{selectedApplication.applicantId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employment</p>
                      <p className="font-medium">{selectedApplication.employmentStatus}</p>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">Loan Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{selectedApplication.loanType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">₹{selectedApplication.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Term</p>
                      <p className="font-medium">{selectedApplication.term} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purpose</p>
                      <p className="font-medium">{selectedApplication.purpose}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Assessment */}
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">Financial Assessment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Credit Score</p>
                      <p className="font-medium">{selectedApplication.creditScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Income</p>
                      <p className="font-medium">₹{selectedApplication.income.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">DTI Ratio</p>
                      <p className="font-medium">{selectedApplication.debtToIncome}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Risk Level</p>
                      <p className={`font-medium ${
                        selectedApplication.riskLevel === 'low' ? 'text-green-600' :
                        selectedApplication.riskLevel === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {selectedApplication.riskLevel.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decision Notes */}
                <div>
                  <h3 className="font-semibold mb-3">Decision Notes</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows={4}
                    placeholder="Enter your notes and observations..."
                    defaultValue={selectedApplication.notes}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => handleDecision(selectedApplication.id, 'reject')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDecision(selectedApplication.id, 'hold')}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Put on Hold
                  </button>
                  <button
                    onClick={() => handleDecision(selectedApplication.id, 'approve')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}