"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  FileText,
  Filter,
  Search,
  MoreHorizontal,
  Download,
  RefreshCw,
  ArrowUpDown,
  TrendingUp,
  Users,
  IndianRupee,
  Timer
} from "lucide-react";
import { motion } from "framer-motion";

interface LoanApplication {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  loanType: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'VEHICLE' | 'EDUCATION';
  requestedAmount: number;
  tenure: number;
  purpose: string;
  creditScore: number;
  monthlyIncome: number;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS';
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'DOCUMENTS_PENDING' | 'APPROVED' | 'REJECTED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  submittedAt: string;
  assignedTo?: string;
  riskScore: number;
  documents: {
    aadhar: boolean;
    pan: boolean;
    bankStatement: boolean;
    salarySlip: boolean;
    itr: boolean;
  };
  applicationStage: 'ELIGIBILITY' | 'DOCUMENTATION' | 'VERIFICATION' | 'UNDERWRITING' | 'APPROVAL';
  remarks?: string;
}

export default function PendingApprovalsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
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

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockApplications: LoanApplication[] = [
      {
        id: '1',
        applicationId: 'LXM001234',
        applicantName: 'Rajesh Kumar',
        applicantEmail: 'rajesh.kumar@email.com',
        applicantPhone: '+91 98765 43210',
        loanType: 'PERSONAL',
        requestedAmount: 500000,
        tenure: 36,
        purpose: 'Home renovation',
        creditScore: 750,
        monthlyIncome: 85000,
        employmentType: 'SALARIED',
        status: 'UNDER_REVIEW',
        priority: 'HIGH',
        submittedAt: '2024-01-15T10:30:00Z',
        assignedTo: 'Priya Sharma',
        riskScore: 2.3,
        documents: { aadhar: true, pan: true, bankStatement: true, salarySlip: true, itr: false },
        applicationStage: 'UNDERWRITING',
        remarks: 'High credit score, stable income'
      },
      {
        id: '2',
        applicationId: 'LXM001235',
        applicantName: 'Priya Patel',
        applicantEmail: 'priya.patel@email.com',
        applicantPhone: '+91 98765 43211',
        loanType: 'BUSINESS',
        requestedAmount: 1200000,
        tenure: 60,
        purpose: 'Business expansion',
        creditScore: 680,
        monthlyIncome: 120000,
        employmentType: 'BUSINESS',
        status: 'DOCUMENTS_PENDING',
        priority: 'MEDIUM',
        submittedAt: '2024-01-14T14:20:00Z',
        riskScore: 3.1,
        documents: { aadhar: true, pan: true, bankStatement: false, salarySlip: false, itr: true },
        applicationStage: 'DOCUMENTATION',
        remarks: 'Pending bank statements'
      },
      {
        id: '3',
        applicationId: 'LXM001236',
        applicantName: 'Amit Sharma',
        applicantEmail: 'amit.sharma@email.com',
        applicantPhone: '+91 98765 43212',
        loanType: 'VEHICLE',
        requestedAmount: 800000,
        tenure: 48,
        purpose: 'Car purchase',
        creditScore: 720,
        monthlyIncome: 95000,
        employmentType: 'SALARIED',
        status: 'SUBMITTED',
        priority: 'LOW',
        submittedAt: '2024-01-13T09:15:00Z',
        riskScore: 2.8,
        documents: { aadhar: true, pan: true, bankStatement: true, salarySlip: true, itr: true },
        applicationStage: 'ELIGIBILITY',
        remarks: 'Initial review pending'
      },
      {
        id: '4',
        applicationId: 'LXM001237',
        applicantName: 'Sneha Reddy',
        applicantEmail: 'sneha.reddy@email.com',
        applicantPhone: '+91 98765 43213',
        loanType: 'EDUCATION',
        requestedAmount: 300000,
        tenure: 24,
        purpose: 'MBA course fees',
        creditScore: 690,
        monthlyIncome: 65000,
        employmentType: 'SALARIED',
        status: 'UNDER_REVIEW',
        priority: 'HIGH',
        submittedAt: '2024-01-12T16:45:00Z',
        assignedTo: 'Arjun Mehta',
        riskScore: 2.5,
        documents: { aadhar: true, pan: true, bankStatement: true, salarySlip: true, itr: false },
        applicationStage: 'VERIFICATION',
        remarks: 'Education loan priority processing'
      },
      {
        id: '5',
        applicationId: 'LXM001238',
        applicantName: 'Vikram Singh',
        applicantEmail: 'vikram.singh@email.com',
        applicantPhone: '+91 98765 43214',
        loanType: 'HOME',
        requestedAmount: 2500000,
        tenure: 240,
        purpose: 'Property purchase',
        creditScore: 780,
        monthlyIncome: 150000,
        employmentType: 'SALARIED',
        status: 'UNDER_REVIEW',
        priority: 'HIGH',
        submittedAt: '2024-01-11T11:20:00Z',
        assignedTo: 'Priya Sharma',
        riskScore: 1.8,
        documents: { aadhar: true, pan: true, bankStatement: true, salarySlip: true, itr: true },
        applicationStage: 'APPROVAL',
        remarks: 'High value loan, comprehensive verification completed'
      }
    ];

    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = applications.filter(app => {
      const matchesSearch =
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
      const matchesPriority = selectedPriority === 'ALL' || app.priority === selectedPriority;
      const matchesStage = selectedStage === 'ALL' || app.applicationStage === selectedStage;

      return matchesSearch && matchesStatus && matchesPriority && matchesStage;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'submittedAt':
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case 'requestedAmount':
          aValue = a.requestedAmount;
          bValue = b.requestedAmount;
          break;
        case 'creditScore':
          aValue = a.creditScore;
          bValue = b.creditScore;
          break;
        case 'riskScore':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        default:
          aValue = a.applicantName;
          bValue = b.applicantName;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, selectedStatus, selectedPriority, selectedStage, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on applications:`, selectedApplications);
    setSelectedApplications([]);
  };

  const handleViewApplication = (applicationId: string) => {
    console.log('Viewing application:', applicationId);
    // Navigate to detailed application view
  };

  const handleApproveApplication = (applicationId: string) => {
    console.log('Approving application:', applicationId);
    // Approve application logic
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('Rejecting application:', applicationId);
    // Reject application logic
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-500';
      case 'UNDER_REVIEW': return 'bg-yellow-500';
      case 'DOCUMENTS_PENDING': return 'bg-orange-500';
      case 'APPROVED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 2) return 'text-green-400';
    if (score < 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'UNDER_REVIEW').length;
  const documentsRequired = applications.filter(app => app.status === 'DOCUMENTS_PENDING').length;
  const highPriority = applications.filter(app => app.priority === 'HIGH').length;

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
            <h1 className="text-3xl font-bold text-white mb-2">Pending Loan Approvals</h1>
            <p className="text-slate-400">Review and process loan applications requiring approval</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-white">{totalApplications}</p>
                <p className="text-slate-400 text-sm mt-1">This month</p>
              </div>
              <FileText className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Under Review</p>
                <p className="text-2xl font-bold text-white">{pendingReview}</p>
                <p className="text-slate-400 text-sm mt-1">Pending decision</p>
              </div>
              <Timer className="h-12 w-12 text-yellow-500" />
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
                <p className="text-slate-400 text-sm">Documents Pending</p>
                <p className="text-2xl font-bold text-white">{documentsRequired}</p>
                <p className="text-slate-400 text-sm mt-1">Awaiting documents</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-500" />
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
                <p className="text-slate-400 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-white">{highPriority}</p>
                <p className="text-slate-400 text-sm mt-1">Urgent processing</p>
              </div>
              <TrendingUp className="h-12 w-12 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, application ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="DOCUMENTS_PENDING">Documents Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Priority</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Stages</option>
                <option value="ELIGIBILITY">Eligibility</option>
                <option value="DOCUMENTATION">Documentation</option>
                <option value="VERIFICATION">Verification</option>
                <option value="UNDERWRITING">Underwriting</option>
                <option value="APPROVAL">Approval</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedApplications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-4">
              <span className="text-slate-300">{selectedApplications.length} selected</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Bulk Reject
                </button>
                <button
                  onClick={() => handleBulkAction('assign')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Assign
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === filteredApplications.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApplications(filteredApplications.map(app => app.id));
                        } else {
                          setSelectedApplications([]);
                        }
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('applicationId')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Application ID
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('applicantName')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Applicant
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('creditScore')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Credit Score
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('submittedAt')}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      Submitted
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredApplications.map((application, index) => (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedApplications([...selectedApplications, application.id]);
                          } else {
                            setSelectedApplications(selectedApplications.filter(id => id !== application.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">{application.applicationId}</div>
                      <div className="text-xs text-slate-400">{application.applicationStage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{application.applicantName}</div>
                          <div className="text-xs text-slate-400">{application.applicantEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">₹{application.requestedAmount.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">
                        {application.loanType} • {application.tenure} months
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{application.creditScore}</div>
                      <div className={`text-xs ${getRiskScoreColor(application.riskScore)}`}>
                        Risk: {application.riskScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(application.status)}`}>
                        {application.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(application.priority)}`}>
                        {application.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(application.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewApplication(application.id)}
                          className="text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApproveApplication(application.id)}
                          className="text-green-400 hover:text-green-300"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No applications found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}