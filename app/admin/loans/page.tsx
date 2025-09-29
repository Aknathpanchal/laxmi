"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Download, Eye, Check, X, Clock,
  AlertTriangle, DollarSign, User, Calendar, FileText,
  ChevronDown, ChevronUp, MoreHorizontal, RefreshCw,
  CheckCircle, XCircle, Upload, Phone, Mail,
  TrendingUp, TrendingDown, CreditCard, Building,
  MapPin, Star, Flag, Shield, Zap
} from "lucide-react";

interface LoanApplication {
  id: string;
  applicationNumber: string;
  customerName: string;
  customerId: string;
  email: string;
  phone: string;
  loanType: string;
  requestedAmount: number;
  approvedAmount?: number;
  tenure: number;
  interestRate: number;
  purpose: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'DOCUMENTS_PENDING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  applicationDate: string;
  lastUpdated: string;
  assignedTo?: string;
  documents: Array<{
    type: string;
    status: 'VERIFIED' | 'PENDING' | 'REJECTED';
    uploadedDate: string;
  }>;
  creditScore: number;
  monthlyIncome: number;
  employment: {
    type: string;
    company: string;
    designation: string;
    experience: number;
  };
  riskAssessment: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    factors: string[];
  };
  verificationDetails: {
    identity: boolean;
    address: boolean;
    income: boolean;
    employment: boolean;
    banking: boolean;
  };
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    type: 'INTERNAL' | 'CUSTOMER_FACING';
  }>;
}

const LOAN_STATUSES = [
  'ALL',
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'DISBURSED',
  'DOCUMENTS_PENDING'
];

const LOAN_TYPES = [
  'ALL',
  'Personal Loan',
  'Salary Advance',
  'Emergency Fund',
  'Festival Advance',
  'Medical Emergency',
  'Travel Loan'
];

const PRIORITY_LEVELS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function AdminLoanManagement() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('applicationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for development
  const mockLoans: LoanApplication[] = [
    {
      id: "APP001",
      applicationNumber: "LXO2024001234",
      customerName: "Rajesh Kumar Singh",
      customerId: "CU789123",
      email: "rajesh.kumar@example.com",
      phone: "+91 9876543210",
      loanType: "Personal Loan",
      requestedAmount: 500000,
      approvedAmount: 450000,
      tenure: 36,
      interestRate: 12.5,
      purpose: "Home renovation",
      status: "UNDER_REVIEW",
      priority: "HIGH",
      applicationDate: "2024-11-28T10:30:00Z",
      lastUpdated: "2024-11-30T14:20:00Z",
      assignedTo: "admin@laxmione.com",
      documents: [
        { type: "Aadhaar", status: "VERIFIED", uploadedDate: "2024-11-28" },
        { type: "PAN", status: "VERIFIED", uploadedDate: "2024-11-28" },
        { type: "Salary Slip", status: "PENDING", uploadedDate: "2024-11-29" },
        { type: "Bank Statement", status: "VERIFIED", uploadedDate: "2024-11-28" }
      ],
      creditScore: 750,
      monthlyIncome: 85000,
      employment: {
        type: "Salaried",
        company: "TCS Limited",
        designation: "Senior Software Engineer",
        experience: 8
      },
      riskAssessment: {
        score: 78,
        level: "LOW",
        factors: ["Stable employment", "Good credit history", "Adequate income"]
      },
      verificationDetails: {
        identity: true,
        address: true,
        income: false,
        employment: true,
        banking: true
      },
      comments: [
        {
          id: "C001",
          author: "admin@laxmione.com",
          message: "Salary slip verification pending. Customer contacted for latest slip.",
          timestamp: "2024-11-30T14:20:00Z",
          type: "INTERNAL"
        }
      ]
    },
    {
      id: "APP002",
      applicationNumber: "LXO2024001235",
      customerName: "Priya Sharma",
      customerId: "CU789124",
      email: "priya.sharma@example.com",
      phone: "+91 9876543211",
      loanType: "Emergency Fund",
      requestedAmount: 100000,
      tenure: 12,
      interestRate: 14.0,
      purpose: "Medical emergency",
      status: "PENDING",
      priority: "URGENT",
      applicationDate: "2024-11-30T09:15:00Z",
      lastUpdated: "2024-11-30T09:15:00Z",
      documents: [
        { type: "Aadhaar", status: "VERIFIED", uploadedDate: "2024-11-30" },
        { type: "PAN", status: "PENDING", uploadedDate: "2024-11-30" },
        { type: "Medical Bills", status: "VERIFIED", uploadedDate: "2024-11-30" }
      ],
      creditScore: 680,
      monthlyIncome: 45000,
      employment: {
        type: "Self-employed",
        company: "Freelance Consultant",
        designation: "Business Consultant",
        experience: 5
      },
      riskAssessment: {
        score: 65,
        level: "MEDIUM",
        factors: ["Self-employed", "Medical emergency", "Average credit score"]
      },
      verificationDetails: {
        identity: true,
        address: false,
        income: false,
        employment: false,
        banking: false
      },
      comments: []
    },
    {
      id: "APP003",
      applicationNumber: "LXO2024001236",
      customerName: "Amit Patel",
      customerId: "CU789125",
      email: "amit.patel@example.com",
      phone: "+91 9876543212",
      loanType: "Salary Advance",
      requestedAmount: 150000,
      approvedAmount: 150000,
      tenure: 24,
      interestRate: 11.5,
      purpose: "Personal expenses",
      status: "APPROVED",
      priority: "MEDIUM",
      applicationDate: "2024-11-25T16:45:00Z",
      lastUpdated: "2024-11-29T11:30:00Z",
      assignedTo: "admin2@laxmione.com",
      documents: [
        { type: "Aadhaar", status: "VERIFIED", uploadedDate: "2024-11-25" },
        { type: "PAN", status: "VERIFIED", uploadedDate: "2024-11-25" },
        { type: "Salary Slip", status: "VERIFIED", uploadedDate: "2024-11-25" },
        { type: "Bank Statement", status: "VERIFIED", uploadedDate: "2024-11-25" }
      ],
      creditScore: 720,
      monthlyIncome: 65000,
      employment: {
        type: "Salaried",
        company: "Infosys Limited",
        designation: "Technical Lead",
        experience: 6
      },
      riskAssessment: {
        score: 85,
        level: "LOW",
        factors: ["Excellent employment record", "Good credit score", "Regular salary"]
      },
      verificationDetails: {
        identity: true,
        address: true,
        income: true,
        employment: true,
        banking: true
      },
      comments: [
        {
          id: "C002",
          author: "admin2@laxmione.com",
          message: "All verifications completed. Loan approved for disbursement.",
          timestamp: "2024-11-29T11:30:00Z",
          type: "INTERNAL"
        }
      ]
    }
  ];

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [loans, searchTerm, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder]);

  const fetchLoans = async () => {
    try {
      setLoading(true);

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoans(mockLoans);
      } else {
        const response = await fetch('/api/admin/loans', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }

        const result = await response.json();
        setLoans(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoans(mockLoans); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...loans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(loan => loan.loanType === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(loan => loan.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof LoanApplication];
      let bValue = b[sortBy as keyof LoanApplication];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredLoans(filtered);
  };

  const handleLoanAction = async (loanId: string, action: 'approve' | 'reject' | 'request_documents') => {
    try {
      // In development, just update the local state
      if (process.env.NODE_ENV === 'development') {
        setLoans(loans.map(loan => {
          if (loan.id === loanId) {
            return {
              ...loan,
              status: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'DOCUMENTS_PENDING',
              lastUpdated: new Date().toISOString()
            };
          }
          return loan;
        }));
      } else {
        const response = await fetch(`/api/admin/loans/${loanId}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action })
        });

        if (!response.ok) {
          throw new Error('Failed to perform action');
        }

        fetchLoans(); // Refresh the data
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (bulkSelection.length === 0) return;

    try {
      // Perform bulk action
      for (const loanId of bulkSelection) {
        await handleLoanAction(loanId, action as any);
      }
      setBulkSelection([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'UNDER_REVIEW': return 'text-blue-600 bg-blue-100';
      case 'DISBURSED': return 'text-purple-600 bg-purple-100';
      case 'DOCUMENTS_PENDING': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--royal-blue)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loan applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loan Management</h1>
              <p className="text-gray-600 mt-1">
                {filteredLoans.length} applications • {filteredLoans.filter(l => l.status === 'PENDING').length} pending review
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchLoans}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--emerald-green)] text-white rounded-lg hover:bg-green-600">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, application number, or customer ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
            >
              {LOAN_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
            >
              {LOAN_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
            >
              {PRIORITY_LEVELS.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {bulkSelection.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {bulkSelection.length} applications selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Bulk Reject
                </button>
                <button
                  onClick={() => setBulkSelection([])}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loan Applications Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelection(filteredLoans.map(l => l.id));
                        } else {
                          setBulkSelection([]);
                        }
                      }}
                      checked={bulkSelection.length === filteredLoans.length}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('applicationNumber')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Application
                      {sortBy === 'applicationNumber' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('requestedAmount')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Amount
                      {sortBy === 'requestedAmount' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(loan.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelection([...bulkSelection, loan.id]);
                          } else {
                            setBulkSelection(bulkSelection.filter(id => id !== loan.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.applicationNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(loan.applicationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[var(--royal-blue)] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {loan.customerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{loan.customerName}</div>
                          <div className="text-sm text-gray-500">{loan.customerId}</div>
                          <div className="text-sm text-gray-500">CS: {loan.creditScore}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{loan.loanType}</div>
                      <div className="text-sm text-gray-500">{loan.tenure} months @ {loan.interestRate}%</div>
                      <div className="text-sm text-gray-500">{loan.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(loan.requestedAmount)}
                      </div>
                      {loan.approvedAmount && (
                        <div className="text-sm text-green-600">
                          Approved: {formatCurrency(loan.approvedAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 ${getPriorityColor(loan.priority)}`}>
                        <Flag className="h-4 w-4" />
                        <span className="text-sm font-medium">{loan.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(loan.riskAssessment.level)}`}>
                        {loan.riskAssessment.level} ({loan.riskAssessment.score}/100)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setShowDetails(true);
                          }}
                          className="text-[var(--royal-blue)] hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {loan.status === 'PENDING' || loan.status === 'UNDER_REVIEW' ? (
                          <>
                            <button
                              onClick={() => handleLoanAction(loan.id, 'approve')}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleLoanAction(loan.id, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : null}

                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loan applications found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Details Modal */}
      <AnimatePresence>
        {showDetails && selectedLoan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLoan.applicationNumber}</h2>
                    <p className="text-gray-600">{selectedLoan.customerName} • {selectedLoan.loanType}</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-gray-900">{selectedLoan.customerName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Customer ID</label>
                          <p className="text-gray-900">{selectedLoan.customerId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{selectedLoan.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{selectedLoan.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Credit Score</label>
                          <p className={`font-semibold ${selectedLoan.creditScore >= 750 ? 'text-green-600' : selectedLoan.creditScore >= 650 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {selectedLoan.creditScore}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                          <p className="text-gray-900">{formatCurrency(selectedLoan.monthlyIncome)}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Employment</label>
                        <p className="text-gray-900">
                          {selectedLoan.employment.designation} at {selectedLoan.employment.company}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedLoan.employment.type} • {selectedLoan.employment.experience} years experience
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Loan Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Loan Type</label>
                          <p className="text-gray-900">{selectedLoan.loanType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Purpose</label>
                          <p className="text-gray-900">{selectedLoan.purpose}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Requested Amount</label>
                          <p className="text-gray-900">{formatCurrency(selectedLoan.requestedAmount)}</p>
                        </div>
                        {selectedLoan.approvedAmount && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Approved Amount</label>
                            <p className="text-green-600 font-semibold">{formatCurrency(selectedLoan.approvedAmount)}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tenure</label>
                          <p className="text-gray-900">{selectedLoan.tenure} months</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Interest Rate</label>
                          <p className="text-gray-900">{selectedLoan.interestRate}% p.a.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Assessment
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskColor(selectedLoan.riskAssessment.level)}`}>
                        {selectedLoan.riskAssessment.level} RISK
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {selectedLoan.riskAssessment.score}/100
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Risk Factors:</h4>
                      <ul className="space-y-1">
                        {selectedLoan.riskAssessment.factors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Verification Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedLoan.verificationDetails).map(([key, verified]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        {verified ? (
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        )}
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className={`text-xs ${verified ? 'text-green-600' : 'text-red-600'}`}>
                          {verified ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({selectedLoan.documents.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedLoan.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.type}</p>
                            <p className="text-sm text-gray-600">
                              Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
                  {selectedLoan.status === 'PENDING' || selectedLoan.status === 'UNDER_REVIEW' ? (
                    <>
                      <button
                        onClick={() => {
                          handleLoanAction(selectedLoan.id, 'request_documents');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Request Documents
                      </button>
                      <button
                        onClick={() => {
                          handleLoanAction(selectedLoan.id, 'reject');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => {
                          handleLoanAction(selectedLoan.id, 'approve');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-[var(--emerald-green)] text-white rounded-lg hover:bg-green-600"
                      >
                        Approve Loan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}