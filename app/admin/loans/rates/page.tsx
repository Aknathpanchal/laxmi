"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  Clock,
  Users,
  CreditCard,
  Building,
  Home,
  Car,
  GraduationCap,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Download,
  History,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Target,
  Award,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface InterestRate {
  id: string;
  rateCode: string;
  productCategory: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'VEHICLE' | 'EDUCATION' | 'GOLD' | 'ALL';
  customerSegment: 'PREMIUM' | 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS' | 'STUDENT' | 'SENIOR_CITIZEN' | 'ALL';
  creditScoreRange: {
    min: number;
    max: number;
  };
  incomeRange: {
    min: number;
    max: number;
  };
  tenureRange: {
    min: number;
    max: number;
  };
  amountRange: {
    min: number;
    max: number;
  };
  baseRate: number;
  marginRate: number;
  effectiveRate: number;
  processingFee: number;
  isPromotional: boolean;
  promotionalRate?: number;
  promotionalPeriod?: {
    startDate: string;
    endDate: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | 'EXPIRED';
  effectiveFrom: string;
  effectiveTo?: string;
  approvedBy: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount: number;
  averageLoanAmount: number;
  totalDisbursed: number;
}

interface RateHistory {
  date: string;
  rate: number;
  change: number;
  reason: string;
}

export default function InterestRatesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [rates, setRates] = useState<InterestRate[]>([]);
  const [filteredRates, setFilteredRates] = useState<InterestRate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSegment, setSelectedSegment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState<InterestRate | null>(null);
  const [rateHistory, setRateHistory] = useState<RateHistory[]>([]);
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
    const mockRates: InterestRate[] = [
      {
        id: '1',
        rateCode: 'PLN_PREMIUM_750',
        productCategory: 'PERSONAL',
        customerSegment: 'PREMIUM',
        creditScoreRange: { min: 750, max: 900 },
        incomeRange: { min: 100000, max: 10000000 },
        tenureRange: { min: 12, max: 60 },
        amountRange: { min: 100000, max: 1000000 },
        baseRate: 8.5,
        marginRate: 2.0,
        effectiveRate: 10.5,
        processingFee: 1.5,
        isPromotional: true,
        promotionalRate: 9.5,
        promotionalPeriod: {
          startDate: '2024-01-01',
          endDate: '2024-03-31'
        },
        status: 'ACTIVE',
        effectiveFrom: '2024-01-01T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        applicationsCount: 456,
        averageLoanAmount: 350000,
        totalDisbursed: 159600000
      },
      {
        id: '2',
        rateCode: 'PLN_SALARIED_650',
        productCategory: 'PERSONAL',
        customerSegment: 'SALARIED',
        creditScoreRange: { min: 650, max: 749 },
        incomeRange: { min: 30000, max: 99999 },
        tenureRange: { min: 12, max: 60 },
        amountRange: { min: 50000, max: 500000 },
        baseRate: 9.0,
        marginRate: 3.5,
        effectiveRate: 12.5,
        processingFee: 2.0,
        isPromotional: false,
        status: 'ACTIVE',
        effectiveFrom: '2024-01-01T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T14:20:00Z',
        applicationsCount: 1234,
        averageLoanAmount: 250000,
        totalDisbursed: 308500000
      },
      {
        id: '3',
        rateCode: 'BLN_BUSINESS_700',
        productCategory: 'BUSINESS',
        customerSegment: 'BUSINESS',
        creditScoreRange: { min: 700, max: 900 },
        incomeRange: { min: 200000, max: 50000000 },
        tenureRange: { min: 12, max: 84 },
        amountRange: { min: 500000, max: 5000000 },
        baseRate: 10.0,
        marginRate: 4.0,
        effectiveRate: 14.0,
        processingFee: 2.5,
        isPromotional: false,
        status: 'ACTIVE',
        effectiveFrom: '2024-01-01T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-12T09:15:00Z',
        applicationsCount: 234,
        averageLoanAmount: 1500000,
        totalDisbursed: 351000000
      },
      {
        id: '4',
        rateCode: 'HLN_PREMIUM_750',
        productCategory: 'HOME',
        customerSegment: 'PREMIUM',
        creditScoreRange: { min: 750, max: 900 },
        incomeRange: { min: 75000, max: 10000000 },
        tenureRange: { min: 60, max: 300 },
        amountRange: { min: 1000000, max: 10000000 },
        baseRate: 7.5,
        marginRate: 1.0,
        effectiveRate: 8.5,
        processingFee: 0.5,
        isPromotional: true,
        promotionalRate: 7.99,
        promotionalPeriod: {
          startDate: '2024-01-15',
          endDate: '2024-06-15'
        },
        status: 'ACTIVE',
        effectiveFrom: '2024-01-15T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        applicationsCount: 89,
        averageLoanAmount: 3500000,
        totalDisbursed: 311500000
      },
      {
        id: '5',
        rateCode: 'VLN_SALARIED_680',
        productCategory: 'VEHICLE',
        customerSegment: 'SALARIED',
        creditScoreRange: { min: 680, max: 900 },
        incomeRange: { min: 40000, max: 5000000 },
        tenureRange: { min: 12, max: 84 },
        amountRange: { min: 200000, max: 2000000 },
        baseRate: 8.0,
        marginRate: 2.5,
        effectiveRate: 10.5,
        processingFee: 1.0,
        isPromotional: false,
        status: 'ACTIVE',
        effectiveFrom: '2024-01-01T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T16:45:00Z',
        applicationsCount: 567,
        averageLoanAmount: 800000,
        totalDisbursed: 453600000
      },
      {
        id: '6',
        rateCode: 'ELN_STUDENT_600',
        productCategory: 'EDUCATION',
        customerSegment: 'STUDENT',
        creditScoreRange: { min: 600, max: 900 },
        incomeRange: { min: 0, max: 1000000 },
        tenureRange: { min: 12, max: 180 },
        amountRange: { min: 50000, max: 2000000 },
        baseRate: 7.0,
        marginRate: 2.5,
        effectiveRate: 9.5,
        processingFee: 0.5,
        isPromotional: true,
        promotionalRate: 8.5,
        promotionalPeriod: {
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        },
        status: 'ACTIVE',
        effectiveFrom: '2024-01-01T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-05T11:30:00Z',
        applicationsCount: 123,
        averageLoanAmount: 450000,
        totalDisbursed: 55350000
      },
      {
        id: '7',
        rateCode: 'GLN_ALL_ANY',
        productCategory: 'GOLD',
        customerSegment: 'ALL',
        creditScoreRange: { min: 0, max: 900 },
        incomeRange: { min: 0, max: 10000000 },
        tenureRange: { min: 6, max: 36 },
        amountRange: { min: 10000, max: 500000 },
        baseRate: 6.0,
        marginRate: 2.0,
        effectiveRate: 8.0,
        processingFee: 0.25,
        isPromotional: false,
        status: 'SCHEDULED',
        effectiveFrom: '2024-02-01T00:00:00Z',
        approvedBy: 'Finance Manager',
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z',
        applicationsCount: 0,
        averageLoanAmount: 0,
        totalDisbursed: 0
      }
    ];

    setRates(mockRates);
    setFilteredRates(mockRates);

    // Mock rate history
    setRateHistory([
      { date: '2024-01-15', rate: 10.5, change: -0.5, reason: 'Market rate adjustment' },
      { date: '2024-01-01', rate: 11.0, change: 0.0, reason: 'Initial rate setting' },
      { date: '2023-12-15', rate: 11.0, change: 0.25, reason: 'RBI repo rate increase' },
      { date: '2023-12-01', rate: 10.75, change: -0.25, reason: 'Competitive adjustment' },
      { date: '2023-11-15', rate: 11.0, change: 0.0, reason: 'Rate review - no change' }
    ]);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = rates.filter(rate => {
      const matchesSearch =
        rate.rateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.customerSegment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || rate.productCategory === selectedCategory;
      const matchesSegment = selectedSegment === 'ALL' || rate.customerSegment === selectedSegment;
      const matchesStatus = selectedStatus === 'ALL' || rate.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesSegment && matchesStatus;
    });

    setFilteredRates(filtered);
  }, [rates, searchTerm, selectedCategory, selectedSegment, selectedStatus]);

  const handleCreateRate = () => {
    setShowCreateModal(true);
  };

  const handleEditRate = (rate: InterestRate) => {
    setSelectedRate(rate);
    setShowEditModal(true);
  };

  const handleDeleteRate = (rateId: string) => {
    if (confirm('Are you sure you want to delete this rate configuration?')) {
      setRates(rates.filter(r => r.id !== rateId));
    }
  };

  const handleViewHistory = (rate: InterestRate) => {
    setSelectedRate(rate);
    setShowHistoryModal(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PERSONAL': return <CreditCard className="h-4 w-4" />;
      case 'BUSINESS': return <Building className="h-4 w-4" />;
      case 'HOME': return <Home className="h-4 w-4" />;
      case 'VEHICLE': return <Car className="h-4 w-4" />;
      case 'EDUCATION': return <GraduationCap className="h-4 w-4" />;
      case 'GOLD': return <DollarSign className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'PREMIUM': return <Award className="h-4 w-4" />;
      case 'SALARIED': return <Users className="h-4 w-4" />;
      case 'SELF_EMPLOYED': return <Target className="h-4 w-4" />;
      case 'BUSINESS': return <Building className="h-4 w-4" />;
      case 'STUDENT': return <GraduationCap className="h-4 w-4" />;
      case 'SENIOR_CITIZEN': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-red-500';
      case 'SCHEDULED': return 'bg-blue-500';
      case 'EXPIRED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRateChangeColor = (change: number) => {
    if (change > 0) return 'text-red-400';
    if (change < 0) return 'text-green-400';
    return 'text-slate-400';
  };

  const getRateChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading interest rates...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const activeRates = rates.filter(r => r.status === 'ACTIVE').length;
  const scheduledRates = rates.filter(r => r.status === 'SCHEDULED').length;
  const promotionalRates = rates.filter(r => r.isPromotional && r.status === 'ACTIVE').length;
  const avgEffectiveRate = rates.filter(r => r.status === 'ACTIVE').reduce((sum, r) => sum + r.effectiveRate, 0) / activeRates || 0;

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
            <h1 className="text-3xl font-bold text-white mb-2">Interest Rates Management</h1>
            <p className="text-slate-400">Configure and manage interest rates for different loan products and customer segments</p>
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
              Export Rates
            </button>
            <button
              onClick={handleCreateRate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Rate Config
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
                <p className="text-slate-400 text-sm">Active Rates</p>
                <p className="text-2xl font-bold text-white">{activeRates}</p>
                <p className="text-slate-400 text-sm mt-1">Live configurations</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
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
                <p className="text-slate-400 text-sm">Avg Effective Rate</p>
                <p className="text-2xl font-bold text-white">{avgEffectiveRate.toFixed(2)}%</p>
                <p className="text-slate-400 text-sm mt-1">Across all products</p>
              </div>
              <Percent className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Promotional Rates</p>
                <p className="text-2xl font-bold text-white">{promotionalRates}</p>
                <p className="text-slate-400 text-sm mt-1">Special offers</p>
              </div>
              <Calendar className="h-12 w-12 text-orange-500" />
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
                <p className="text-slate-400 text-sm">Scheduled Rates</p>
                <p className="text-2xl font-bold text-white">{scheduledRates}</p>
                <p className="text-slate-400 text-sm mt-1">Future effective</p>
              </div>
              <Clock className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
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
                  placeholder="Search rate configurations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Business</option>
                <option value="HOME">Home</option>
                <option value="VEHICLE">Vehicle</option>
                <option value="EDUCATION">Education</option>
                <option value="GOLD">Gold</option>
              </select>

              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Segments</option>
                <option value="PREMIUM">Premium</option>
                <option value="SALARIED">Salaried</option>
                <option value="SELF_EMPLOYED">Self Employed</option>
                <option value="BUSINESS">Business</option>
                <option value="STUDENT">Student</option>
                <option value="SENIOR_CITIZEN">Senior Citizen</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Rates Table */}
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Rate Configuration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Eligibility Criteria
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Rate Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredRates.map((rate, index) => (
                  <motion.tr
                    key={rate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            {getCategoryIcon(rate.productCategory)}
                          </div>
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            {getSegmentIcon(rate.customerSegment)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{rate.rateCode}</div>
                          <div className="text-xs text-slate-400">
                            {rate.productCategory} • {rate.customerSegment}
                          </div>
                          {rate.isPromotional && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                              Promotional
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 space-y-1">
                        <div>Credit Score: {rate.creditScoreRange.min}-{rate.creditScoreRange.max}</div>
                        <div>Income: ₹{(rate.incomeRange.min / 1000).toFixed(0)}K-₹{(rate.incomeRange.max / 100000).toFixed(0)}L</div>
                        <div>Amount: ₹{(rate.amountRange.min / 100000).toFixed(1)}L-₹{(rate.amountRange.max / 100000).toFixed(1)}L</div>
                        <div>Tenure: {rate.tenureRange.min}-{rate.tenureRange.max} months</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 space-y-1">
                        <div className="font-medium text-white">
                          Effective: {rate.isPromotional && rate.promotionalRate ? rate.promotionalRate : rate.effectiveRate}%
                        </div>
                        <div>Base: {rate.baseRate}% + Margin: {rate.marginRate}%</div>
                        <div>Processing Fee: {rate.processingFee}%</div>
                        {rate.isPromotional && rate.promotionalPeriod && (
                          <div className="text-orange-400 text-xs">
                            Promo till {new Date(rate.promotionalPeriod.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300 space-y-1">
                        <div>{rate.applicationsCount} applications</div>
                        <div>Avg: ₹{(rate.averageLoanAmount / 100000).toFixed(1)}L</div>
                        <div>Total: ₹{(rate.totalDisbursed / 10000000).toFixed(1)}Cr</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(rate.status)}`}>
                          {rate.status}
                        </span>
                        <div className="text-xs text-slate-400">
                          From: {new Date(rate.effectiveFrom).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewHistory(rate)}
                          className="text-blue-400 hover:text-blue-300"
                          title="View History"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditRate(rate)}
                          className="text-green-400 hover:text-green-300"
                          title="Edit Rate"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRate(rate.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete Rate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRates.length === 0 && (
            <div className="text-center py-12">
              <Percent className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No rate configurations found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or create a new rate configuration.</p>
              <button
                onClick={handleCreateRate}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create Rate Config
              </button>
            </div>
          )}
        </motion.div>

        {/* Rate History Modal */}
        {showHistoryModal && selectedRate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Rate History - {selectedRate.rateCode}</h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {rateHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-300">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className="text-lg font-medium text-white">
                        {entry.rate}%
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${getRateChangeColor(entry.change)}`}>
                        {getRateChangeIcon(entry.change)}
                        {entry.change !== 0 && `${entry.change > 0 ? '+' : ''}${entry.change}%`}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      {entry.reason}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}