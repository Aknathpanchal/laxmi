'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiArrowLeft, FiDownload, FiCalendar, FiPercent,
  FiCreditCard, FiClock, FiCheckCircle, FiAlertCircle,
  FiTrendingUp, FiDollarSign, FiFileText, FiUser,
  FiHome, FiBriefcase, FiPhone, FiMail, FiMapPin,
  FiPrinter, FiShare2, FiEdit, FiRefreshCw
} from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import { useAuth } from '@/lib/contexts/AuthContext';
import { loansService } from '@/lib/api/loans.service';

interface LoanDetails {
  id: string;
  loanNumber: string;
  applicantName: string;
  loanAmount: number;
  disbursedAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'defaulted' | 'pending';
  nextEmiDate: string;
  totalEmisPaid: number;
  totalEmis: number;
  lateCharges: number;
  prepaymentCharges: number;
}

interface EMISchedule {
  emiNo: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  balance: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'verified' | 'pending';
}

export default function LoanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [emiSchedule, setEmiSchedule] = useState<EMISchedule[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock loan details
  const mockLoanDetails: LoanDetails = {
    id: params.id as string,
    loanNumber: 'LN2024001234',
    applicantName: user?.fullName || 'John Doe',
    loanAmount: 500000,
    disbursedAmount: 500000,
    outstandingAmount: 375000,
    interestRate: 12.5,
    tenure: 24,
    emiAmount: 25000,
    startDate: '2023-09-15',
    endDate: '2025-09-15',
    status: 'active',
    nextEmiDate: '2024-02-15',
    totalEmisPaid: 5,
    totalEmis: 24,
    lateCharges: 500,
    prepaymentCharges: 0
  };

  // Mock EMI schedule
  const generateEmiSchedule = (): EMISchedule[] => {
    const schedule: EMISchedule[] = [];
    let balance = mockLoanDetails.loanAmount;
    const monthlyRate = mockLoanDetails.interestRate / 12 / 100;

    for (let i = 1; i <= mockLoanDetails.tenure; i++) {
      const interest = balance * monthlyRate;
      const principal = mockLoanDetails.emiAmount - interest;
      balance -= principal;

      const dueDate = new Date(mockLoanDetails.startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        emiNo: i,
        dueDate: dueDate.toISOString().split('T')[0],
        emiAmount: mockLoanDetails.emiAmount,
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.round(balance),
        status: i <= mockLoanDetails.totalEmisPaid ? 'paid' :
                i === mockLoanDetails.totalEmisPaid + 1 ? 'pending' : 'pending',
        paidDate: i <= mockLoanDetails.totalEmisPaid ? dueDate.toISOString().split('T')[0] : undefined
      });
    }
    return schedule;
  };

  // Mock documents
  const mockDocuments: Document[] = [
    { id: '1', name: 'Loan Agreement.pdf', type: 'Agreement', uploadDate: '2023-09-10', status: 'verified' },
    { id: '2', name: 'Sanction Letter.pdf', type: 'Sanction', uploadDate: '2023-09-08', status: 'verified' },
    { id: '3', name: 'KYC Documents.pdf', type: 'KYC', uploadDate: '2023-09-05', status: 'verified' },
    { id: '4', name: 'Income Proof.pdf', type: 'Income', uploadDate: '2023-09-05', status: 'verified' }
  ];

  useEffect(() => {
    fetchLoanDetails();
  }, [params.id]);

  const fetchLoanDetails = async () => {
    setIsLoading(true);
    try {
      const response = await loansService.getLoanDetails(params.id as string);
      if (response.success && response.data) {
        setLoanDetails(response.data);
      } else {
        // Use mock data as fallback
        setLoanDetails(mockLoanDetails);
        setEmiSchedule(generateEmiSchedule());
        setDocuments(mockDocuments);
      }
    } catch (error) {
      // Use mock data as fallback
      setLoanDetails(mockLoanDetails);
      setEmiSchedule(generateEmiSchedule());
      setDocuments(mockDocuments);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      case 'defaulted':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEmiStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Chart data
  const repaymentProgressData = {
    labels: ['Paid', 'Remaining'],
    datasets: [{
      data: [
        loanDetails ? (loanDetails.totalEmisPaid / loanDetails.totalEmis) * 100 : 0,
        loanDetails ? ((loanDetails.totalEmis - loanDetails.totalEmisPaid) / loanDetails.totalEmis) * 100 : 100
      ],
      backgroundColor: ['rgb(34, 197, 94)', 'rgb(229, 231, 235)'],
      borderWidth: 0
    }]
  };

  const paymentTrendData = {
    labels: emiSchedule.slice(0, 12).map(emi => {
      const date = new Date(emi.dueDate);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Principal',
        data: emiSchedule.slice(0, 12).map(emi => emi.principal),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'Interest',
        data: emiSchedule.slice(0, 12).map(emi => emi.interest),
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        fill: true
      }
    ]
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!loanDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Loan not found</h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Loan Details</h1>
                <p className="text-gray-600 mt-1">Loan No: {loanDetails.loanNumber}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loanDetails.status)}`}>
                  {loanDetails.status.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <FiDownload />
                </button>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <FiPrinter />
                </button>
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Loan Amount</p>
            <p className="text-xl font-bold">₹{loanDetails.loanAmount.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiCreditCard className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">EMI Amount</p>
            <p className="text-xl font-bold">₹{loanDetails.emiAmount.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiTrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Outstanding</p>
            <p className="text-xl font-bold">₹{loanDetails.outstandingAmount.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <FiCalendar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Next EMI Date</p>
            <p className="text-xl font-bold">{new Date(loanDetails.nextEmiDate).toLocaleDateString()}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {['overview', 'emi-schedule', 'documents', 'details'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Repayment Progress</h3>
                  <div className="h-64">
                    <Doughnut data={repaymentProgressData} options={chartOptions} />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-2xl font-bold">{loanDetails.totalEmisPaid}/{loanDetails.totalEmis}</p>
                    <p className="text-sm text-gray-600">EMIs Paid</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Principal vs Interest</h3>
                  <div className="h-64">
                    <Line data={paymentTrendData} options={chartOptions} />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Loan Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-medium">{loanDetails.interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Tenure</span>
                    <span className="font-medium">{loanDetails.tenure} months</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{new Date(loanDetails.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium">{new Date(loanDetails.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-medium">₹{((loanDetails.emiAmount * loanDetails.tenure) - loanDetails.loanAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Total Amount Payable</span>
                    <span className="font-medium">₹{(loanDetails.emiAmount * loanDetails.tenure).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {activeTab === 'emi-schedule' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-4">EMI Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4">EMI No.</th>
                      <th className="text-left py-3 px-4">Due Date</th>
                      <th className="text-right py-3 px-4">EMI Amount</th>
                      <th className="text-right py-3 px-4">Principal</th>
                      <th className="text-right py-3 px-4">Interest</th>
                      <th className="text-right py-3 px-4">Balance</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emiSchedule.map(emi => (
                      <tr key={emi.emiNo} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{emi.emiNo}</td>
                        <td className="py-3 px-4">{new Date(emi.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">₹{emi.emiAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">₹{emi.principal.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">₹{emi.interest.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">₹{emi.balance.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getEmiStatusColor(emi.status)}`}>
                            {emi.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {emi.paidDate ? new Date(emi.paidDate).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Loan Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FiFileText className="w-8 h-8 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-600">Type: {doc.type}</p>
                          <p className="text-sm text-gray-600">Uploaded: {doc.uploadDate}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        doc.status === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                        View
                      </button>
                      <button className="flex-1 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{loanDetails.applicantName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMail className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Mobile</p>
                        <p className="font-medium">{user?.mobile}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiBriefcase className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Employment Type</p>
                        <p className="font-medium">Salaried</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiHome className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Property Status</p>
                        <p className="font-medium">Owned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-medium">{user?.city || 'Mumbai'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}