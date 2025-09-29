"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Percent,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  ToggleLeft,
  Copy,
  Download,
  RefreshCw,
  CreditCard,
  Home,
  Car,
  GraduationCap,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

interface LoanProduct {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: 'PERSONAL' | 'BUSINESS' | 'HOME' | 'VEHICLE' | 'EDUCATION' | 'GOLD';
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  interestRateMin: number;
  interestRateMax: number;
  processingFee: number;
  eligibilityCriteria: {
    minAge: number;
    maxAge: number;
    minCreditScore: number;
    minIncome: number;
    employmentType: string[];
  };
  requiredDocuments: string[];
  features: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  approvalTAT: number; // in hours
  createdAt: string;
  updatedAt: string;
  totalApplications: number;
  approvedApplications: number;
  totalDisbursed: number;
  isPopular: boolean;
  promotionText?: string;
}

export default function LoanProductsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<LoanProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
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
    const mockProducts: LoanProduct[] = [
      {
        id: '1',
        productCode: 'PLN001',
        name: 'Instant Personal Loan',
        description: 'Quick personal loan with minimal documentation for salaried individuals',
        category: 'PERSONAL',
        minAmount: 50000,
        maxAmount: 1000000,
        minTenure: 12,
        maxTenure: 60,
        interestRateMin: 10.5,
        interestRateMax: 18.0,
        processingFee: 2.5,
        eligibilityCriteria: {
          minAge: 21,
          maxAge: 60,
          minCreditScore: 650,
          minIncome: 25000,
          employmentType: ['SALARIED', 'SELF_EMPLOYED']
        },
        requiredDocuments: ['Aadhaar', 'PAN', 'Bank Statement', 'Salary Slip'],
        features: ['Instant approval', 'No collateral required', 'Flexible repayment', 'Pre-closure allowed'],
        status: 'ACTIVE',
        approvalTAT: 24,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        totalApplications: 2456,
        approvedApplications: 1987,
        totalDisbursed: 245600000,
        isPopular: true,
        promotionText: 'Most Popular'
      },
      {
        id: '2',
        productCode: 'BLN001',
        name: 'Business Growth Loan',
        description: 'Funding for business expansion and working capital requirements',
        category: 'BUSINESS',
        minAmount: 200000,
        maxAmount: 5000000,
        minTenure: 12,
        maxTenure: 84,
        interestRateMin: 12.0,
        interestRateMax: 20.0,
        processingFee: 3.0,
        eligibilityCriteria: {
          minAge: 25,
          maxAge: 65,
          minCreditScore: 600,
          minIncome: 100000,
          employmentType: ['BUSINESS', 'SELF_EMPLOYED']
        },
        requiredDocuments: ['Aadhaar', 'PAN', 'Business Registration', 'ITR', 'Bank Statement'],
        features: ['Competitive rates', 'Flexible tenure', 'Quick disbursement', 'Business support'],
        status: 'ACTIVE',
        approvalTAT: 72,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-10T14:20:00Z',
        totalApplications: 1234,
        approvedApplications: 987,
        totalDisbursed: 456700000,
        isPopular: false
      },
      {
        id: '3',
        productCode: 'HLN001',
        name: 'Home Loan Premium',
        description: 'Comprehensive home loan solution for property purchase and construction',
        category: 'HOME',
        minAmount: 1000000,
        maxAmount: 10000000,
        minTenure: 60,
        maxTenure: 300,
        interestRateMin: 8.5,
        interestRateMax: 12.0,
        processingFee: 0.5,
        eligibilityCriteria: {
          minAge: 21,
          maxAge: 65,
          minCreditScore: 700,
          minIncome: 50000,
          employmentType: ['SALARIED', 'SELF_EMPLOYED', 'BUSINESS']
        },
        requiredDocuments: ['Aadhaar', 'PAN', 'Income Proof', 'Property Documents', 'Bank Statement'],
        features: ['Low interest rates', 'Long tenure', 'Tax benefits', 'Property insurance'],
        status: 'ACTIVE',
        approvalTAT: 120,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-12T09:15:00Z',
        totalApplications: 789,
        approvedApplications: 654,
        totalDisbursed: 1230000000,
        isPopular: true,
        promotionText: 'Best Rates'
      },
      {
        id: '4',
        productCode: 'VLN001',
        name: 'Auto Loan Express',
        description: 'Quick financing for new and used vehicles with attractive rates',
        category: 'VEHICLE',
        minAmount: 100000,
        maxAmount: 2000000,
        minTenure: 12,
        maxTenure: 84,
        interestRateMin: 9.0,
        interestRateMax: 15.0,
        processingFee: 1.5,
        eligibilityCriteria: {
          minAge: 21,
          maxAge: 60,
          minCreditScore: 650,
          minIncome: 30000,
          employmentType: ['SALARIED', 'SELF_EMPLOYED']
        },
        requiredDocuments: ['Aadhaar', 'PAN', 'Driving License', 'Income Proof', 'Vehicle Documents'],
        features: ['Up to 90% financing', 'Quick approval', 'Competitive rates', 'Easy EMI'],
        status: 'ACTIVE',
        approvalTAT: 48,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-08T16:45:00Z',
        totalApplications: 1567,
        approvedApplications: 1234,
        totalDisbursed: 345600000,
        isPopular: false
      },
      {
        id: '5',
        productCode: 'ELN001',
        name: 'Education Loan Scholar',
        description: 'Financial support for higher education in India and abroad',
        category: 'EDUCATION',
        minAmount: 50000,
        maxAmount: 2000000,
        minTenure: 12,
        maxTenure: 180,
        interestRateMin: 9.5,
        interestRateMax: 14.0,
        processingFee: 1.0,
        eligibilityCriteria: {
          minAge: 18,
          maxAge: 35,
          minCreditScore: 600,
          minIncome: 20000,
          employmentType: ['SALARIED', 'SELF_EMPLOYED', 'STUDENT']
        },
        requiredDocuments: ['Aadhaar', 'PAN', 'Admission Letter', 'Income Proof', 'Academic Records'],
        features: ['Moratorium period', 'Subsidized rates', 'Study abroad support', 'Flexible repayment'],
        status: 'ACTIVE',
        approvalTAT: 96,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-05T11:30:00Z',
        totalApplications: 456,
        approvedApplications: 378,
        totalDisbursed: 89400000,
        isPopular: false
      },
      {
        id: '6',
        productCode: 'GLN001',
        name: 'Gold Loan Secure',
        description: 'Instant loan against gold jewelry with attractive rates',
        category: 'GOLD',
        minAmount: 10000,
        maxAmount: 500000,
        minTenure: 6,
        maxTenure: 36,
        interestRateMin: 8.0,
        interestRateMax: 12.0,
        processingFee: 0.5,
        eligibilityCriteria: {
          minAge: 18,
          maxAge: 75,
          minCreditScore: 0,
          minIncome: 0,
          employmentType: ['ANY']
        },
        requiredDocuments: ['Aadhaar', 'PAN', 'Gold Jewelry'],
        features: ['Instant disbursement', 'No income proof required', 'Secure storage', 'Partial release'],
        status: 'DRAFT',
        approvalTAT: 2,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        totalApplications: 0,
        approvedApplications: 0,
        totalDisbursed: 0,
        isPopular: false
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleEditProduct = (product: LoanProduct) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(p =>
      p.id === productId
        ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'DRAFT' }
        : p
    ));
  };

  const handleDuplicateProduct = (product: LoanProduct) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      productCode: product.productCode + '_COPY',
      name: product.name + ' (Copy)',
      status: 'DRAFT' as 'ACTIVE' | 'INACTIVE' | 'DRAFT',
      totalApplications: 0,
      approvedApplications: 0,
      totalDisbursed: 0,
      isPopular: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PERSONAL': return <CreditCard className="h-5 w-5" />;
      case 'BUSINESS': return <Building className="h-5 w-5" />;
      case 'HOME': return <Home className="h-5 w-5" />;
      case 'VEHICLE': return <Car className="h-5 w-5" />;
      case 'EDUCATION': return <GraduationCap className="h-5 w-5" />;
      case 'GOLD': return <DollarSign className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-red-500';
      case 'DRAFT': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getApprovalRate = (product: LoanProduct) => {
    if (product.totalApplications === 0) return 0;
    return Math.round((product.approvedApplications / product.totalApplications) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading loan products...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
  const draftProducts = products.filter(p => p.status === 'DRAFT').length;
  const totalApplications = products.reduce((sum, p) => sum + p.totalApplications, 0);
  const totalDisbursed = products.reduce((sum, p) => sum + p.totalDisbursed, 0);

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
            <h1 className="text-3xl font-bold text-white mb-2">Loan Products</h1>
            <p className="text-slate-400">Manage loan products and their configurations</p>
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
            <button
              onClick={handleCreateProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
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
                <p className="text-slate-400 text-sm">Active Products</p>
                <p className="text-2xl font-bold text-white">{activeProducts}</p>
                <p className="text-slate-400 text-sm mt-1">Live products</p>
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
                <p className="text-slate-400 text-sm">Draft Products</p>
                <p className="text-2xl font-bold text-white">{draftProducts}</p>
                <p className="text-slate-400 text-sm mt-1">In development</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500" />
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
                <p className="text-slate-400 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-white">{totalApplications.toLocaleString()}</p>
                <p className="text-slate-400 text-sm mt-1">All time</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Total Disbursed</p>
                <p className="text-2xl font-bold text-white">₹{(totalDisbursed / 10000000).toFixed(1)}Cr</p>
                <p className="text-slate-400 text-sm mt-1">Cumulative</p>
              </div>
              <DollarSign className="h-12 w-12 text-purple-500" />
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
                  placeholder="Search products..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-200"
            >
              {/* Product Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      {getCategoryIcon(product.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                      <p className="text-slate-400 text-sm">{product.productCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.isPopular && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.promotionText || 'Popular'}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-4">{product.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs">Amount Range</p>
                    <p className="text-white font-medium">₹{(product.minAmount / 100000).toFixed(1)}L - ₹{(product.maxAmount / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Interest Rate</p>
                    <p className="text-white font-medium">{product.interestRateMin}% - {product.interestRateMax}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Tenure</p>
                    <p className="text-white font-medium">{product.minTenure} - {product.maxTenure} months</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Processing Fee</p>
                    <p className="text-white font-medium">{product.processingFee}%</p>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 border-b border-slate-700">
                <h4 className="text-sm font-medium text-white mb-3">Performance</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-white">{product.totalApplications}</p>
                    <p className="text-slate-400 text-xs">Applications</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-400">{getApprovalRate(product)}%</p>
                    <p className="text-slate-400 text-xs">Approval Rate</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-400">{product.approvalTAT}h</p>
                    <p className="text-slate-400 text-xs">Avg TAT</p>
                  </div>
                </div>

                {product.totalDisbursed > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-slate-400 text-xs">Total Disbursed</p>
                    <p className="text-white font-medium">₹{(product.totalDisbursed / 10000000).toFixed(2)} Cr</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="p-6 border-b border-slate-700">
                <h4 className="text-sm font-medium text-white mb-3">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="text-slate-400 text-xs px-2 py-1">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateProduct(product)}
                      className="text-green-400 hover:text-green-300 p-1"
                      title="Duplicate Product"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(product.id)}
                      className="text-yellow-400 hover:text-yellow-300 p-1"
                      title="Toggle Status"
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or create a new product.</p>
            <button
              onClick={handleCreateProduct}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Product
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}