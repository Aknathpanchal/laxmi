"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  User,
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  MessageCircle,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  IndianRupee,
  Timer,
  AlertCircle,
  CreditCard,
  Building
} from "lucide-react";
import { motion } from "framer-motion";

interface OverdueLoan {
  id: string;
  loanId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  loanType: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'VEHICLE' | 'EDUCATION';
  principalAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  emiAmount: number;
  daysOverdue: number;
  lastPaymentDate: string;
  nextEmiDate: string;
  creditScore: number;
  collectionStatus: 'NOT_CONTACTED' | 'CONTACTED' | 'PROMISED_TO_PAY' | 'DISPUTE' | 'LEGAL_NOTICE' | 'SETTLED';
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedAgent?: string;
  agentPhone?: string;
  lastContactDate?: string;
  lastContactMethod?: 'PHONE' | 'EMAIL' | 'SMS' | 'VISIT' | 'LEGAL';
  paymentPromiseDate?: string;
  remarks?: string;
  collectionActions: CollectionAction[];
  guarantorDetails?: {
    name: string;
    phone: string;
    email: string;
  };
  employmentDetails: {
    company: string;
    designation: string;
    salary: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CollectionAction {
  id: string;
  date: string;
  agentName: string;
  actionType: 'CALL' | 'EMAIL' | 'SMS' | 'VISIT' | 'LEGAL_NOTICE' | 'PAYMENT';
  outcome: 'CONNECTED' | 'NOT_REACHABLE' | 'PROMISED_TO_PAY' | 'DISPUTE' | 'PARTIAL_PAYMENT' | 'FULL_PAYMENT';
  amount?: number;
  nextAction?: string;
  remarks: string;
}

export default function OverdueLoansPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [overdueLoans, setOverdueLoans] = useState<OverdueLoan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<OverdueLoan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDaysRange, setSelectedDaysRange] = useState('ALL');
  const [selectedAgent, setSelectedAgent] = useState('ALL');
  const [sortBy, setSortBy] = useState('daysOverdue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<OverdueLoan | null>(null);
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
    const mockOverdueLoans: OverdueLoan[] = [
      {
        id: '1',
        loanId: 'LXM001234',
        customerId: 'CUST001',
        customerName: 'Rajesh Kumar',
        customerEmail: 'rajesh.kumar@email.com',
        customerPhone: '+91 98765 43210',
        customerAddress: '123 MG Road, Bangalore, Karnataka 560001',
        loanType: 'PERSONAL',
        principalAmount: 500000,
        outstandingAmount: 420000,
        overdueAmount: 45000,
        emiAmount: 15000,
        daysOverdue: 35,
        lastPaymentDate: '2024-01-10',
        nextEmiDate: '2024-01-15',
        creditScore: 650,
        collectionStatus: 'PROMISED_TO_PAY',
        riskCategory: 'HIGH',
        assignedAgent: 'Vijay Kumar',
        agentPhone: '+91 98765 43220',
        lastContactDate: '2024-01-18',
        lastContactMethod: 'PHONE',
        paymentPromiseDate: '2024-01-25',
        remarks: 'Customer facing temporary financial difficulty, promised to pay by month end',
        collectionActions: [
          {
            id: '1',
            date: '2024-01-18',
            agentName: 'Vijay Kumar',
            actionType: 'CALL',
            outcome: 'PROMISED_TO_PAY',
            nextAction: 'Follow up on 25th Jan',
            remarks: 'Customer explained financial difficulty, committed to pay by 25th'
          }
        ],
        guarantorDetails: {
          name: 'Suresh Kumar',
          phone: '+91 98765 43211',
          email: 'suresh.kumar@email.com'
        },
        employmentDetails: {
          company: 'Tech Solutions Pvt Ltd',
          designation: 'Software Engineer',
          salary: 85000
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-18T10:30:00Z'
      },
      {
        id: '2',
        loanId: 'LXM001235',
        customerId: 'CUST002',
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@email.com',
        customerPhone: '+91 98765 43212',
        customerAddress: '456 SG Highway, Ahmedabad, Gujarat 380015',
        loanType: 'BUSINESS',
        principalAmount: 1200000,
        outstandingAmount: 980000,
        overdueAmount: 85000,
        emiAmount: 28000,
        daysOverdue: 62,
        lastPaymentDate: '2023-12-15',
        nextEmiDate: '2024-01-15',
        creditScore: 580,
        collectionStatus: 'DISPUTE',
        riskCategory: 'CRITICAL',
        assignedAgent: 'Amit Sharma',
        agentPhone: '+91 98765 43221',
        lastContactDate: '2024-01-17',
        lastContactMethod: 'VISIT',
        remarks: 'Customer disputes loan terms, legal team reviewing case',
        collectionActions: [
          {
            id: '2',
            date: '2024-01-17',
            agentName: 'Amit Sharma',
            actionType: 'VISIT',
            outcome: 'DISPUTE',
            nextAction: 'Legal consultation required',
            remarks: 'Customer raised concerns about interest calculation'
          }
        ],
        employmentDetails: {
          company: 'Patel Textiles',
          designation: 'Business Owner',
          salary: 120000
        },
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2024-01-17T15:45:00Z'
      },
      {
        id: '3',
        loanId: 'LXM001236',
        customerId: 'CUST003',
        customerName: 'Amit Sharma',
        customerEmail: 'amit.sharma@email.com',
        customerPhone: '+91 98765 43213',
        customerAddress: '789 CP Delhi, New Delhi 110001',
        loanType: 'VEHICLE',
        principalAmount: 800000,
        outstandingAmount: 650000,
        overdueAmount: 32000,
        emiAmount: 16000,
        daysOverdue: 18,
        lastPaymentDate: '2024-01-05',
        nextEmiDate: '2024-01-15',
        creditScore: 720,
        collectionStatus: 'CONTACTED',
        riskCategory: 'MEDIUM',
        assignedAgent: 'Deepika Rao',
        agentPhone: '+91 98765 43222',
        lastContactDate: '2024-01-16',
        lastContactMethod: 'PHONE',
        remarks: 'Customer acknowledged delay, salary credited soon',
        collectionActions: [
          {
            id: '3',
            date: '2024-01-16',
            agentName: 'Deepika Rao',
            actionType: 'CALL',
            outcome: 'CONNECTED',
            nextAction: 'Follow up in 3 days',
            remarks: 'Customer informed about salary delay, will pay by 22nd'
          }
        ],
        employmentDetails: {
          company: 'Global Tech Corp',
          designation: 'Project Manager',
          salary: 95000
        },
        createdAt: '2023-08-01T00:00:00Z',
        updatedAt: '2024-01-16T11:20:00Z'
      },
      {
        id: '4',
        loanId: 'LXM001237',
        customerId: 'CUST004',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha.reddy@email.com',
        customerPhone: '+91 98765 43214',
        customerAddress: '321 Banjara Hills, Hyderabad, Telangana 500034',
        loanType: 'EDUCATION',
        principalAmount: 300000,
        outstandingAmount: 180000,
        overdueAmount: 12000,
        emiAmount: 6000,
        daysOverdue: 8,
        lastPaymentDate: '2024-01-10',
        nextEmiDate: '2024-01-15',
        creditScore: 690,
        collectionStatus: 'NOT_CONTACTED',
        riskCategory: 'LOW',
        remarks: 'Recent graduate, needs gentle approach',
        collectionActions: [],
        employmentDetails: {
          company: 'Freshers Inc',
          designation: 'Associate',
          salary: 45000
        },
        createdAt: '2022-06-01T00:00:00Z',
        updatedAt: '2024-01-15T09:30:00Z'
      },
      {
        id: '5',
        loanId: 'LXM001238',
        customerId: 'CUST005',
        customerName: 'Vikram Singh',
        customerEmail: 'vikram.singh@email.com',
        customerPhone: '+91 98765 43215',
        customerAddress: '654 Marine Drive, Mumbai, Maharashtra 400020',
        loanType: 'HOME',
        principalAmount: 2500000,
        outstandingAmount: 2200000,
        overdueAmount: 125000,
        emiAmount: 42000,
        daysOverdue: 90,
        lastPaymentDate: '2023-11-15',
        nextEmiDate: '2024-01-15',
        creditScore: 780,
        collectionStatus: 'LEGAL_NOTICE',
        riskCategory: 'CRITICAL',
        assignedAgent: 'Legal Team',
        lastContactDate: '2024-01-10',
        lastContactMethod: 'LEGAL',
        remarks: 'Legal notice served, preparing for asset recovery',
        collectionActions: [
          {
            id: '4',
            date: '2024-01-10',
            agentName: 'Legal Team',
            actionType: 'LEGAL_NOTICE',
            outcome: 'DISPUTE',
            nextAction: 'Asset recovery proceedings',
            remarks: 'Legal notice served for asset recovery'
          }
        ],
        employmentDetails: {
          company: 'Singh Enterprises',
          designation: 'Director',
          salary: 200000
        },
        createdAt: '2021-03-01T00:00:00Z',
        updatedAt: '2024-01-10T14:15:00Z'
      }
    ];

    setOverdueLoans(mockOverdueLoans);
    setFilteredLoans(mockOverdueLoans);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = overdueLoans.filter(loan => {
      const matchesSearch =
        loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customerPhone.includes(searchTerm);

      const matchesRisk = selectedRiskCategory === 'ALL' || loan.riskCategory === selectedRiskCategory;
      const matchesStatus = selectedStatus === 'ALL' || loan.collectionStatus === selectedStatus;

      const matchesDaysRange = selectedDaysRange === 'ALL' ||
        (selectedDaysRange === '0-30' && loan.daysOverdue <= 30) ||
        (selectedDaysRange === '31-60' && loan.daysOverdue > 30 && loan.daysOverdue <= 60) ||
        (selectedDaysRange === '61-90' && loan.daysOverdue > 60 && loan.daysOverdue <= 90) ||
        (selectedDaysRange === '90+' && loan.daysOverdue > 90);

      const matchesAgent = selectedAgent === 'ALL' || loan.assignedAgent === selectedAgent;

      return matchesSearch && matchesRisk && matchesStatus && matchesDaysRange && matchesAgent;
    });

    // Sort loans
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'daysOverdue':
          aValue = a.daysOverdue;
          bValue = b.daysOverdue;
          break;
        case 'overdueAmount':
          aValue = a.overdueAmount;
          bValue = b.overdueAmount;
          break;
        case 'customerName':
          aValue = a.customerName;
          bValue = b.customerName;
          break;
        case 'lastContactDate':
          aValue = a.lastContactDate ? new Date(a.lastContactDate).getTime() : 0;
          bValue = b.lastContactDate ? new Date(b.lastContactDate).getTime() : 0;
          break;
        default:
          aValue = a.daysOverdue;
          bValue = b.daysOverdue;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLoans(filtered);
  }, [overdueLoans, searchTerm, selectedRiskCategory, selectedStatus, selectedDaysRange, selectedAgent, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on loans:`, selectedLoans);
    setSelectedLoans([]);
  };

  const handleViewLoan = (loan: OverdueLoan) => {
    setSelectedLoan(loan);
    setShowActionModal(true);
  };

  const handleContactCustomer = (loan: OverdueLoan, method: 'PHONE' | 'EMAIL' | 'SMS') => {
    console.log(`Contacting ${loan.customerName} via ${method}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400 bg-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20';
      case 'CRITICAL': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_CONTACTED': return 'bg-gray-500';
      case 'CONTACTED': return 'bg-blue-500';
      case 'PROMISED_TO_PAY': return 'bg-yellow-500';
      case 'DISPUTE': return 'bg-orange-500';
      case 'LEGAL_NOTICE': return 'bg-red-500';
      case 'SETTLED': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDaysOverdueColor = (days: number) => {
    if (days <= 30) return 'text-yellow-400';
    if (days <= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'PERSONAL': return <CreditCard className="h-4 w-4" />;
      case 'BUSINESS': return <Building className="h-4 w-4" />;
      case 'HOME': return <MapPin className="h-4 w-4" />;
      case 'VEHICLE': return <Activity className="h-4 w-4" />;
      case 'EDUCATION': return <FileText className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading overdue loans...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const totalOverdue = overdueLoans.length;
  const totalOverdueAmount = overdueLoans.reduce((sum, loan) => sum + loan.overdueAmount, 0);
  const criticalCases = overdueLoans.filter(loan => loan.riskCategory === 'CRITICAL').length;
  const avgDaysOverdue = Math.round(overdueLoans.reduce((sum, loan) => sum + loan.daysOverdue, 0) / totalOverdue || 0);

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
            <h1 className="text-3xl font-bold text-white mb-2">Overdue Loans</h1>
            <p className="text-slate-400">Monitor and manage overdue loan accounts requiring collection actions</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
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
                <p className="text-slate-400 text-sm">Total Overdue</p>
                <p className="text-2xl font-bold text-white">{totalOverdue}</p>
                <p className="text-slate-400 text-sm mt-1">Active cases</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500" />
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
                <p className="text-slate-400 text-sm">Overdue Amount</p>
                <p className="text-2xl font-bold text-white">₹{(totalOverdueAmount / 100000).toFixed(1)}L</p>
                <p className="text-slate-400 text-sm mt-1">Total outstanding</p>
              </div>
              <IndianRupee className="h-12 w-12 text-orange-500" />
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
                <p className="text-slate-400 text-sm">Critical Cases</p>
                <p className="text-2xl font-bold text-white">{criticalCases}</p>
                <p className="text-slate-400 text-sm mt-1">High risk accounts</p>
              </div>
              <AlertCircle className="h-12 w-12 text-red-500" />
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
                <p className="text-slate-400 text-sm">Avg Days Overdue</p>
                <p className="text-2xl font-bold text-white">{avgDaysOverdue}</p>
                <p className="text-slate-400 text-sm mt-1">Collection urgency</p>
              </div>
              <Timer className="h-12 w-12 text-yellow-500" />
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
                  placeholder="Search by name, loan ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedRiskCategory}
                onChange={(e) => setSelectedRiskCategory(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Risk</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="NOT_CONTACTED">Not Contacted</option>
                <option value="CONTACTED">Contacted</option>
                <option value="PROMISED_TO_PAY">Promised to Pay</option>
                <option value="DISPUTE">Dispute</option>
                <option value="LEGAL_NOTICE">Legal Notice</option>
              </select>

              <select
                value={selectedDaysRange}
                onChange={(e) => setSelectedDaysRange(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Days</option>
                <option value="0-30">0-30 days</option>
                <option value="31-60">31-60 days</option>
                <option value="61-90">61-90 days</option>
                <option value="90+">90+ days</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedLoans.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-4">
              <span className="text-slate-300">{selectedLoans.length} selected</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('assign')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Assign Agent
                </button>
                <button
                  onClick={() => handleBulkAction('contact')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Bulk Contact
                </button>
                <button
                  onClick={() => handleBulkAction('legal')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Legal Action
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Overdue Loans Table */}
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
                      checked={selectedLoans.length === filteredLoans.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLoans(filteredLoans.map(loan => loan.id));
                        } else {
                          setSelectedLoans([]);
                        }
                      }}
                      className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Customer & Loan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Overdue Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Collection Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Risk & Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLoans.map((loan, index) => (
                  <motion.tr
                    key={loan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLoans.includes(loan.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLoans([...selectedLoans, loan.id]);
                          } else {
                            setSelectedLoans(selectedLoans.filter(id => id !== loan.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{loan.customerName}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            {getLoanTypeIcon(loan.loanType)}
                            {loan.loanId} • {loan.loanType}
                          </div>
                          <div className="text-xs text-slate-400">{loan.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white space-y-1">
                        <div className="font-medium">₹{loan.overdueAmount.toLocaleString()}</div>
                        <div className={`text-xs ${getDaysOverdueColor(loan.daysOverdue)}`}>
                          {loan.daysOverdue} days overdue
                        </div>
                        <div className="text-xs text-slate-400">
                          EMI: ₹{loan.emiAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">
                          Outstanding: ₹{loan.outstandingAmount.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(loan.collectionStatus)}`}>
                          {loan.collectionStatus.replace('_', ' ')}
                        </span>
                        {loan.assignedAgent && (
                          <div className="text-xs text-slate-400">
                            Agent: {loan.assignedAgent}
                          </div>
                        )}
                        {loan.lastContactDate && (
                          <div className="text-xs text-slate-400">
                            Last: {new Date(loan.lastContactDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(loan.riskCategory)}`}>
                          {loan.riskCategory}
                        </span>
                        <div className="text-xs text-slate-400">
                          Credit Score: {loan.creditScore}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleContactCustomer(loan, 'PHONE')}
                            className="p-1 text-blue-400 hover:text-blue-300"
                            title="Call Customer"
                          >
                            <Phone className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleContactCustomer(loan, 'EMAIL')}
                            className="p-1 text-green-400 hover:text-green-300"
                            title="Email Customer"
                          >
                            <Mail className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleContactCustomer(loan, 'SMS')}
                            className="p-1 text-yellow-400 hover:text-yellow-300"
                            title="SMS Customer"
                          >
                            <MessageCircle className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewLoan(loan)}
                          className="text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
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

          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No overdue loans found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </motion.div>

        {/* Loan Details Modal */}
        {showActionModal && selectedLoan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Loan Details - {selectedLoan.loanId}
                </h3>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Customer Information</h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Name</p>
                      <p className="text-white">{selectedLoan.customerName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Contact</p>
                      <p className="text-white">{selectedLoan.customerPhone}</p>
                      <p className="text-slate-400 text-sm">{selectedLoan.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Address</p>
                      <p className="text-white text-sm">{selectedLoan.customerAddress}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Employment</p>
                      <p className="text-white">{selectedLoan.employmentDetails.company}</p>
                      <p className="text-slate-400 text-sm">
                        {selectedLoan.employmentDetails.designation} • ₹{selectedLoan.employmentDetails.salary.toLocaleString()}/month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Loan Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Loan Information</h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Principal Amount</p>
                        <p className="text-white">₹{selectedLoan.principalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Outstanding</p>
                        <p className="text-white">₹{selectedLoan.outstandingAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Overdue Amount</p>
                        <p className="text-red-400 font-medium">₹{selectedLoan.overdueAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">EMI Amount</p>
                        <p className="text-white">₹{selectedLoan.emiAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Days Overdue</p>
                        <p className={getDaysOverdueColor(selectedLoan.daysOverdue)}>{selectedLoan.daysOverdue} days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Credit Score</p>
                        <p className="text-white">{selectedLoan.creditScore}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collection Actions History */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-white">Collection Actions History</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    {selectedLoan.collectionActions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedLoan.collectionActions.map((action, index) => (
                          <div key={action.id} className="border-l-2 border-blue-500 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">{action.actionType.replace('_', ' ')}</p>
                                <p className="text-slate-400 text-sm">by {action.agentName}</p>
                                <p className="text-slate-300 text-sm mt-1">{action.remarks}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-slate-400 text-sm">{new Date(action.date).toLocaleDateString()}</p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(action.outcome)}`}>
                                  {action.outcome.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-4">No collection actions recorded yet</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}