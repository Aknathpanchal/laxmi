"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, Filter, Download, Eye, Check, X, Clock,
  AlertTriangle, DollarSign, User, Calendar, FileText,
  ChevronDown, ChevronUp, MoreHorizontal, RefreshCw,
  CheckCircle, XCircle, Upload, Phone, Mail, MapPin,
  TrendingUp, TrendingDown, CreditCard, Building,
  Star, Flag, Shield, Zap, Ban, UserPlus, Edit,
  Award, BadgeCheck, Camera, Smartphone, Activity,
  IndianRupee, Calendar as CalendarIcon, Briefcase,
  Home, Users as UsersIcon, UserCheck, AlertCircle,
  BarChart3, MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserAccount {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'NOT_SUBMITTED';
  createdAt: string;
  lastLogin: string | null;
  totalLoans: number;
  activeLoanAmount: number;
  creditScore: number;
  tier: 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  employment: {
    type: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS' | 'RETIRED' | 'STUDENT';
    company: string;
    designation: string;
    monthlyIncome: number;
    experience: number;
  };
  documents: {
    aadhaar: { verified: boolean; uploadedAt: string | null };
    pan: { verified: boolean; uploadedAt: string | null };
    bankStatement: { verified: boolean; uploadedAt: string | null };
    salarySlip: { verified: boolean; uploadedAt: string | null };
    photo: { verified: boolean; uploadedAt: string | null };
  };
  riskProfile: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    lastAssessed: string;
  };
  loyaltyPoints: number;
  referralCode: string;
  referredBy: string | null;
  totalReferrals: number;
  notes: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    type: 'GENERAL' | 'RISK' | 'COMPLIANCE' | 'SUPPORT';
  }>;
}

const USER_STATUSES = ['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];
const KYC_STATUSES = ['ALL', 'VERIFIED', 'PENDING', 'REJECTED', 'NOT_SUBMITTED'];
const USER_TIERS = ['ALL', 'BASIC', 'SILVER', 'GOLD', 'PLATINUM'];
const EMPLOYMENT_TYPES = ['ALL', 'SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'RETIRED', 'STUDENT'];

export default function AdminUsersManagement() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kycFilter, setKycFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [employmentFilter, setEmploymentFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Check authentication
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

  // Mock data for development
  const mockUsers: UserAccount[] = [
    {
      id: "USR001",
      customerId: "CU789123",
      name: "Rajesh Kumar Singh",
      email: "rajesh.kumar@example.com",
      phone: "+91 9876543210",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      status: "ACTIVE",
      kycStatus: "VERIFIED",
      createdAt: "2024-01-15T10:30:00Z",
      lastLogin: "2024-11-30T14:20:00Z",
      totalLoans: 3,
      activeLoanAmount: 450000,
      creditScore: 750,
      tier: "GOLD",
      address: {
        street: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      },
      employment: {
        type: "SALARIED",
        company: "TCS Limited",
        designation: "Senior Software Engineer",
        monthlyIncome: 85000,
        experience: 8
      },
      documents: {
        aadhaar: { verified: true, uploadedAt: "2024-01-15T10:30:00Z" },
        pan: { verified: true, uploadedAt: "2024-01-15T10:30:00Z" },
        bankStatement: { verified: true, uploadedAt: "2024-01-15T10:30:00Z" },
        salarySlip: { verified: true, uploadedAt: "2024-01-15T10:30:00Z" },
        photo: { verified: true, uploadedAt: "2024-01-15T10:30:00Z" }
      },
      riskProfile: {
        score: 85,
        level: "LOW",
        lastAssessed: "2024-11-01T00:00:00Z"
      },
      loyaltyPoints: 2450,
      referralCode: "RAJESH2024",
      referredBy: null,
      totalReferrals: 5,
      notes: [
        {
          id: "N001",
          author: "admin@laxmione.com",
          message: "Excellent payment history. High-value customer.",
          timestamp: "2024-11-15T14:20:00Z",
          type: "GENERAL"
        }
      ]
    },
    {
      id: "USR002",
      customerId: "CU789124",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 9876543211",
      dateOfBirth: "1985-08-22",
      gender: "Female",
      status: "ACTIVE",
      kycStatus: "PENDING",
      createdAt: "2024-11-25T09:15:00Z",
      lastLogin: "2024-11-29T16:45:00Z",
      totalLoans: 1,
      activeLoanAmount: 100000,
      creditScore: 680,
      tier: "SILVER",
      address: {
        street: "456 Park Street",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001"
      },
      employment: {
        type: "SELF_EMPLOYED",
        company: "Freelance Consultant",
        designation: "Business Consultant",
        monthlyIncome: 45000,
        experience: 5
      },
      documents: {
        aadhaar: { verified: true, uploadedAt: "2024-11-25T09:15:00Z" },
        pan: { verified: false, uploadedAt: "2024-11-25T09:15:00Z" },
        bankStatement: { verified: false, uploadedAt: null },
        salarySlip: { verified: false, uploadedAt: null },
        photo: { verified: true, uploadedAt: "2024-11-25T09:15:00Z" }
      },
      riskProfile: {
        score: 65,
        level: "MEDIUM",
        lastAssessed: "2024-11-25T00:00:00Z"
      },
      loyaltyPoints: 150,
      referralCode: "PRIYA2024",
      referredBy: "RAJESH2024",
      totalReferrals: 0,
      notes: []
    },
    {
      id: "USR003",
      customerId: "CU789125",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91 9876543212",
      dateOfBirth: "1992-12-10",
      gender: "Male",
      status: "SUSPENDED",
      kycStatus: "VERIFIED",
      createdAt: "2024-06-10T16:45:00Z",
      lastLogin: "2024-11-20T11:30:00Z",
      totalLoans: 2,
      activeLoanAmount: 0,
      creditScore: 720,
      tier: "SILVER",
      address: {
        street: "789 Ring Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001"
      },
      employment: {
        type: "SALARIED",
        company: "Infosys Limited",
        designation: "Technical Lead",
        monthlyIncome: 65000,
        experience: 6
      },
      documents: {
        aadhaar: { verified: true, uploadedAt: "2024-06-10T16:45:00Z" },
        pan: { verified: true, uploadedAt: "2024-06-10T16:45:00Z" },
        bankStatement: { verified: true, uploadedAt: "2024-06-10T16:45:00Z" },
        salarySlip: { verified: true, uploadedAt: "2024-06-10T16:45:00Z" },
        photo: { verified: true, uploadedAt: "2024-06-10T16:45:00Z" }
      },
      riskProfile: {
        score: 45,
        level: "HIGH",
        lastAssessed: "2024-11-15T00:00:00Z"
      },
      loyaltyPoints: 800,
      referralCode: "AMIT2024",
      referredBy: null,
      totalReferrals: 2,
      notes: [
        {
          id: "N002",
          author: "admin2@laxmione.com",
          message: "Account suspended due to repeated late payments. Under review.",
          timestamp: "2024-11-15T10:20:00Z",
          type: "RISK"
        }
      ]
    }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, statusFilter, kycFilter, tierFilter, employmentFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } else {
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const result = await response.json();
        setUsers(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUsers(mockUsers); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // KYC filter
    if (kycFilter !== 'ALL') {
      filtered = filtered.filter(user => user.kycStatus === kycFilter);
    }

    // Tier filter
    if (tierFilter !== 'ALL') {
      filtered = filtered.filter(user => user.tier === tierFilter);
    }

    // Employment filter
    if (employmentFilter !== 'ALL') {
      filtered = filtered.filter(user => user.employment.type === employmentFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof UserAccount];
      let bValue = b[sortBy as keyof UserAccount];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'verify_kyc' | 'reject_kyc') => {
    try {
      if (process.env.NODE_ENV === 'development') {
        setUsers(users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              status: action === 'activate' ? 'ACTIVE' : action === 'suspend' ? 'SUSPENDED' : user.status,
              kycStatus: action === 'verify_kyc' ? 'VERIFIED' : action === 'reject_kyc' ? 'REJECTED' : user.kycStatus
            };
          }
          return user;
        }));
      } else {
        const response = await fetch(`/api/admin/users/${userId}/action`, {
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

        fetchUsers();
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (bulkSelection.length === 0) return;

    try {
      for (const userId of bulkSelection) {
        await handleUserAction(userId, action as any);
      }
      setBulkSelection([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-gray-600 bg-gray-100';
      case 'SUSPENDED': return 'text-red-600 bg-red-100';
      case 'PENDING_VERIFICATION': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'NOT_SUBMITTED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'text-purple-600 bg-purple-100';
      case 'GOLD': return 'text-yellow-600 bg-yellow-100';
      case 'SILVER': return 'text-gray-600 bg-gray-100';
      case 'BASIC': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render anything
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                <UsersIcon className="w-8 h-8 text-blue-400" />
                User Management
              </h1>
              <p className="text-slate-400 mt-1">
                {filteredUsers.length} users • {filteredUsers.filter(u => u.status === 'ACTIVE').length} active • {filteredUsers.filter(u => u.kycStatus === 'PENDING').length} pending KYC
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <UserPlus className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, customer ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
            >
              {USER_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>

            {/* KYC Filter */}
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
            >
              {KYC_STATUSES.map(status => (
                <option key={status} value={status}>KYC: {status.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
            >
              {USER_TIERS.map(tier => (
                <option key={tier} value={tier}>Tier: {tier}</option>
              ))}
            </select>

            {/* Employment Filter */}
            <select
              value={employmentFilter}
              onChange={(e) => setEmploymentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100"
            >
              {EMPLOYMENT_TYPES.map(type => (
                <option key={type} value={type}>Emp: {type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {bulkSelection.length > 0 && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-400">
                {bulkSelection.length} users selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Suspend
                </button>
                <button
                  onClick={() => setBulkSelection([])}
                  className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl overflow-hidden border border-slate-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelection(filteredUsers.map(u => u.id));
                        } else {
                          setBulkSelection([]);
                        }
                      }}
                      checked={bulkSelection.length === filteredUsers.length}
                      className="rounded border-slate-600 bg-slate-800 text-blue-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('name')}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                    >
                      User
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    KYC Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('creditScore')}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                    >
                      Credit Score
                      {sortBy === 'creditScore' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Loans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelection([...bulkSelection, user.id]);
                          } else {
                            setBulkSelection(bulkSelection.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-800 text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">{user.name}</div>
                          <div className="text-sm text-slate-400">{user.customerId}</div>
                          <div className="text-xs text-slate-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{user.email}</div>
                      <div className="text-sm text-slate-400">{user.phone}</div>
                      <div className="text-xs text-slate-500">
                        {user.lastLogin ? `Last: ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never logged in'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getKycStatusColor(user.kycStatus)}`}>
                        {user.kycStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(user.tier)}`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${user.creditScore >= 750 ? 'text-green-400' : user.creditScore >= 650 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {user.creditScore}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.creditScore >= 750 ? 'Excellent' : user.creditScore >= 650 ? 'Good' : 'Poor'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{user.totalLoans} total</div>
                      <div className="text-sm text-slate-400">
                        {user.activeLoanAmount > 0 ? formatCurrency(user.activeLoanAmount) : 'No active loans'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(user.riskProfile.level)}`}>
                        {user.riskProfile.level} ({user.riskProfile.score}/100)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetails(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {user.status === 'SUSPENDED' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}

                        <button className="text-slate-400 hover:text-slate-300 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No users found</h3>
              <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showDetails && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{selectedUser.name}</h2>
                    <p className="text-slate-400">{selectedUser.customerId} • {selectedUser.tier} Member</p>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Personal Information */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      Personal Information
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-400">Full Name</label>
                          <p className="text-slate-100">{selectedUser.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">Customer ID</label>
                          <p className="text-slate-100">{selectedUser.customerId}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">Email</label>
                          <p className="text-slate-100">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">Phone</label>
                          <p className="text-slate-100">{selectedUser.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">Date of Birth</label>
                          <p className="text-slate-100">{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-400">Gender</label>
                          <p className="text-slate-100">{selectedUser.gender}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-400">Address</label>
                        <p className="text-slate-100">
                          {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state} - {selectedUser.address.pincode}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-400">Employment</label>
                        <p className="text-slate-100">
                          {selectedUser.employment.designation} at {selectedUser.employment.company}
                        </p>
                        <p className="text-sm text-slate-400">
                          {selectedUser.employment.type} • {formatCurrency(selectedUser.employment.monthlyIncome)}/month • {selectedUser.employment.experience} years experience
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-emerald-400" />
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="glass-card p-4 border border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Credit Score</span>
                          <span className={`text-lg font-bold ${selectedUser.creditScore >= 750 ? 'text-green-400' : selectedUser.creditScore >= 650 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {selectedUser.creditScore}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${selectedUser.creditScore >= 750 ? 'bg-green-500' : selectedUser.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(selectedUser.creditScore / 850) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="glass-card p-4 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Total Loans</div>
                        <div className="text-xl font-bold text-slate-100">{selectedUser.totalLoans}</div>
                        <div className="text-sm text-slate-500">
                          Active: {formatCurrency(selectedUser.activeLoanAmount)}
                        </div>
                      </div>

                      <div className="glass-card p-4 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Risk Level</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(selectedUser.riskProfile.level)}`}>
                          {selectedUser.riskProfile.level} ({selectedUser.riskProfile.score}/100)
                        </span>
                      </div>

                      <div className="glass-card p-4 border border-slate-700">
                        <div className="text-sm text-slate-400 mb-1">Loyalty Points</div>
                        <div className="text-xl font-bold text-slate-100">{selectedUser.loyaltyPoints}</div>
                        <div className="text-sm text-slate-500">Referrals: {selectedUser.totalReferrals}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Verification Status */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Document Verification Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedUser.documents).map(([docType, doc]) => (
                      <div key={docType} className="text-center p-4 glass-card border border-slate-700 rounded-lg">
                        {doc.verified ? (
                          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        )}
                        <p className="text-sm font-medium text-slate-100 capitalize mb-1">
                          {docType.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className={`text-xs ${doc.verified ? 'text-green-400' : 'text-red-400'}`}>
                          {doc.verified ? 'Verified' : 'Pending'}
                        </p>
                        {doc.uploadedAt && (
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedUser.notes.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-400" />
                      Notes ({selectedUser.notes.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedUser.notes.map((note) => (
                        <div key={note.id} className="p-4 glass-card border border-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-100">{note.author}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(note.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">{note.message}</p>
                          <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                            note.type === 'RISK' ? 'bg-red-500/20 text-red-400' :
                            note.type === 'COMPLIANCE' ? 'bg-yellow-500/20 text-yellow-400' :
                            note.type === 'SUPPORT' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {note.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>

                  {selectedUser.kycStatus === 'PENDING' && (
                    <button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'verify_kyc');
                        setShowDetails(false);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Verify KYC
                    </button>
                  )}

                  {selectedUser.status === 'SUSPENDED' ? (
                    <button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'activate');
                        setShowDetails(false);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Activate User
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'suspend');
                        setShowDetails(false);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Suspend User
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