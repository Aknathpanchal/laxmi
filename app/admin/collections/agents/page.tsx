"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  Award,
  Calendar,
  MoreHorizontal,
  UserCheck,
  UserX,
  Settings,
  Star,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

interface CollectionAgent {
  id: string;
  agentId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  branch: string;
  region: string;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  specialization: string[];
  experience: number; // in years
  performance: {
    currentMonthRecovery: number;
    targetRecovery: number;
    recoveryRate: number;
    casesAssigned: number;
    casesClosed: number;
    avgResolutionTime: number; // in days
    customerSatisfactionScore: number;
    contactSuccessRate: number;
  };
  skills: {
    negotiation: number;
    communication: number;
    legal: number;
    analytics: number;
  };
  certifications: string[];
  languages: string[];
  currentCaseload: number;
  maxCaseload: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentPerformanceMetrics {
  totalRecovery: number;
  targetAchievement: number;
  casesResolved: number;
  avgResponseTime: number;
  customerRating: number;
}

export default function CollectionAgentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<CollectionAgent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<CollectionAgent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedSpecialization, setSelectedSpecialization] = useState('ALL');
  const [sortBy, setSortBy] = useState('performance.recoveryRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<CollectionAgent | null>(null);
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
    const mockAgents: CollectionAgent[] = [
      {
        id: '1',
        agentId: 'CA001',
        name: 'Vijay Kumar',
        email: 'vijay.kumar@laxmione.com',
        phone: '+91 98765 43220',
        designation: 'Senior Collection Agent',
        department: 'Collections',
        branch: 'Mumbai Central',
        region: 'West',
        joiningDate: '2022-03-15',
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        specialization: ['Personal Loans', 'Vehicle Loans', 'Negotiation'],
        experience: 5,
        performance: {
          currentMonthRecovery: 2850000,
          targetRecovery: 3000000,
          recoveryRate: 92.5,
          casesAssigned: 45,
          casesClosed: 38,
          avgResolutionTime: 12,
          customerSatisfactionScore: 4.6,
          contactSuccessRate: 78.5
        },
        skills: {
          negotiation: 95,
          communication: 88,
          legal: 72,
          analytics: 65
        },
        certifications: ['Certified Collection Professional', 'Advanced Negotiation'],
        languages: ['Hindi', 'English', 'Marathi'],
        currentCaseload: 7,
        maxCaseload: 15,
        lastActive: '2024-01-20T14:30:00Z',
        createdAt: '2022-03-15T00:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        agentId: 'CA002',
        name: 'Priya Sharma',
        email: 'priya.sharma@laxmione.com',
        phone: '+91 98765 43221',
        designation: 'Collection Agent',
        department: 'Collections',
        branch: 'Delhi NCR',
        region: 'North',
        joiningDate: '2023-01-10',
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        specialization: ['Business Loans', 'Legal Procedures'],
        experience: 3,
        performance: {
          currentMonthRecovery: 1950000,
          targetRecovery: 2500000,
          recoveryRate: 78.0,
          casesAssigned: 35,
          casesClosed: 28,
          avgResolutionTime: 15,
          customerSatisfactionScore: 4.2,
          contactSuccessRate: 65.7
        },
        skills: {
          negotiation: 82,
          communication: 90,
          legal: 88,
          analytics: 75
        },
        certifications: ['Legal Collection Procedures', 'Customer Service Excellence'],
        languages: ['Hindi', 'English', 'Punjabi'],
        currentCaseload: 7,
        maxCaseload: 12,
        lastActive: '2024-01-20T16:15:00Z',
        createdAt: '2023-01-10T00:00:00Z',
        updatedAt: '2024-01-20T16:15:00Z'
      },
      {
        id: '3',
        agentId: 'CA003',
        name: 'Amit Patel',
        email: 'amit.patel@laxmione.com',
        phone: '+91 98765 43222',
        designation: 'Junior Collection Agent',
        department: 'Collections',
        branch: 'Ahmedabad',
        region: 'West',
        joiningDate: '2023-08-01',
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        specialization: ['Education Loans', 'First-time Defaulters'],
        experience: 1,
        performance: {
          currentMonthRecovery: 1250000,
          targetRecovery: 1800000,
          recoveryRate: 69.4,
          casesAssigned: 25,
          casesClosed: 18,
          avgResolutionTime: 18,
          customerSatisfactionScore: 4.4,
          contactSuccessRate: 72.0
        },
        skills: {
          negotiation: 68,
          communication: 85,
          legal: 45,
          analytics: 70
        },
        certifications: ['Basic Collection Training'],
        languages: ['Gujarati', 'Hindi', 'English'],
        currentCaseload: 7,
        maxCaseload: 10,
        lastActive: '2024-01-20T13:45:00Z',
        createdAt: '2023-08-01T00:00:00Z',
        updatedAt: '2024-01-20T13:45:00Z'
      },
      {
        id: '4',
        agentId: 'CA004',
        name: 'Deepika Rao',
        email: 'deepika.rao@laxmione.com',
        phone: '+91 98765 43223',
        designation: 'Team Lead - Collections',
        department: 'Collections',
        branch: 'Bangalore',
        region: 'South',
        joiningDate: '2021-06-20',
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        specialization: ['Home Loans', 'High-value Cases', 'Team Management'],
        experience: 8,
        performance: {
          currentMonthRecovery: 4250000,
          targetRecovery: 4000000,
          recoveryRate: 98.2,
          casesAssigned: 35,
          casesClosed: 33,
          avgResolutionTime: 8,
          customerSatisfactionScore: 4.8,
          contactSuccessRate: 85.5
        },
        skills: {
          negotiation: 98,
          communication: 95,
          legal: 90,
          analytics: 92
        },
        certifications: ['Advanced Collection Management', 'Leadership Excellence', 'Legal Compliance'],
        languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
        currentCaseload: 2,
        maxCaseload: 8,
        lastActive: '2024-01-20T17:20:00Z',
        createdAt: '2021-06-20T00:00:00Z',
        updatedAt: '2024-01-20T17:20:00Z'
      },
      {
        id: '5',
        agentId: 'CA005',
        name: 'Ravi Krishnan',
        email: 'ravi.krishnan@laxmione.com',
        phone: '+91 98765 43224',
        designation: 'Collection Agent',
        department: 'Collections',
        branch: 'Chennai',
        region: 'South',
        joiningDate: '2022-11-15',
        status: 'ON_LEAVE',
        employmentType: 'FULL_TIME',
        specialization: ['Regional Languages', 'Rural Collections'],
        experience: 4,
        performance: {
          currentMonthRecovery: 1850000,
          targetRecovery: 2200000,
          recoveryRate: 84.1,
          casesAssigned: 30,
          casesClosed: 25,
          avgResolutionTime: 14,
          customerSatisfactionScore: 4.5,
          contactSuccessRate: 80.0
        },
        skills: {
          negotiation: 85,
          communication: 92,
          legal: 60,
          analytics: 68
        },
        certifications: ['Rural Collection Specialist', 'Multi-language Communication'],
        languages: ['Tamil', 'Telugu', 'Malayalam', 'Hindi', 'English'],
        currentCaseload: 0,
        maxCaseload: 12,
        lastActive: '2024-01-10T09:00:00Z',
        createdAt: '2022-11-15T00:00:00Z',
        updatedAt: '2024-01-10T09:00:00Z'
      },
      {
        id: '6',
        agentId: 'CA006',
        name: 'Neha Singh',
        email: 'neha.singh@laxmione.com',
        phone: '+91 98765 43225',
        designation: 'Senior Collection Agent',
        department: 'Collections',
        branch: 'Pune',
        region: 'West',
        joiningDate: '2021-12-01',
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        specialization: ['Female Customers', 'Empathetic Collections', 'Dispute Resolution'],
        experience: 6,
        performance: {
          currentMonthRecovery: 3150000,
          targetRecovery: 3200000,
          recoveryRate: 96.8,
          casesAssigned: 40,
          casesClosed: 37,
          avgResolutionTime: 10,
          customerSatisfactionScore: 4.9,
          contactSuccessRate: 88.0
        },
        skills: {
          negotiation: 92,
          communication: 98,
          legal: 75,
          analytics: 80
        },
        certifications: ['Customer Psychology', 'Dispute Resolution Expert', 'Women Empowerment'],
        languages: ['Hindi', 'English', 'Marathi'],
        currentCaseload: 3,
        maxCaseload: 12,
        lastActive: '2024-01-20T15:50:00Z',
        createdAt: '2021-12-01T00:00:00Z',
        updatedAt: '2024-01-20T15:50:00Z'
      }
    ];

    setAgents(mockAgents);
    setFilteredAgents(mockAgents);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = agents.filter(agent => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm) ||
        agent.branch.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || agent.status === selectedStatus;
      const matchesBranch = selectedBranch === 'ALL' || agent.branch === selectedBranch;
      const matchesSpecialization = selectedSpecialization === 'ALL' ||
        agent.specialization.some(spec => spec === selectedSpecialization);

      return matchesSearch && matchesStatus && matchesBranch && matchesSpecialization;
    });

    // Sort agents
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'performance.recoveryRate':
          aValue = a.performance.recoveryRate;
          bValue = b.performance.recoveryRate;
          break;
        case 'performance.currentMonthRecovery':
          aValue = a.performance.currentMonthRecovery;
          bValue = b.performance.currentMonthRecovery;
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'currentCaseload':
          aValue = a.currentCaseload;
          bValue = b.currentCaseload;
          break;
        case 'performance.customerSatisfactionScore':
          aValue = a.performance.customerSatisfactionScore;
          bValue = b.performance.customerSatisfactionScore;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAgents(filtered);
  }, [agents, searchTerm, selectedStatus, selectedBranch, selectedSpecialization, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleCreateAgent = () => {
    setShowCreateModal(true);
  };

  const handleEditAgent = (agent: CollectionAgent) => {
    setSelectedAgent(agent);
    setShowEditModal(true);
  };

  const handleViewDetails = (agent: CollectionAgent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleDeleteAgent = (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      setAgents(agents.filter(a => a.id !== agentId));
    }
  };

  const handleStatusChange = (agentId: string, newStatus: CollectionAgent['status']) => {
    setAgents(agents.map(agent =>
      agent.id === agentId ? { ...agent, status: newStatus } : agent
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-gray-500';
      case 'ON_LEAVE': return 'bg-yellow-500';
      case 'SUSPENDED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCaseloadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 80) return 'text-red-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSkillLevel = (score: number) => {
    if (score >= 90) return { label: 'Expert', color: 'text-green-400' };
    if (score >= 75) return { label: 'Advanced', color: 'text-blue-400' };
    if (score >= 60) return { label: 'Intermediate', color: 'text-yellow-400' };
    return { label: 'Beginner', color: 'text-red-400' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading collection agents...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const activeAgents = agents.filter(a => a.status === 'ACTIVE').length;
  const totalCaseload = agents.reduce((sum, a) => sum + a.currentCaseload, 0);
  const avgRecoveryRate = agents.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.performance.recoveryRate, 0) / activeAgents || 0;
  const totalRecovery = agents.reduce((sum, a) => sum + a.performance.currentMonthRecovery, 0);

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
            <h1 className="text-3xl font-bold text-white mb-2">Collection Agents</h1>
            <p className="text-slate-400">Manage collection team performance and assignments</p>
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
              onClick={handleCreateAgent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Agent
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
                <p className="text-slate-400 text-sm">Active Agents</p>
                <p className="text-2xl font-bold text-white">{activeAgents}</p>
                <p className="text-slate-400 text-sm mt-1">On duty</p>
              </div>
              <Users className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Total Recovery</p>
                <p className="text-2xl font-bold text-white">₹{(totalRecovery / 10000000).toFixed(1)}Cr</p>
                <p className="text-slate-400 text-sm mt-1">This month</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
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
                <p className="text-slate-400 text-sm">Avg Recovery Rate</p>
                <p className="text-2xl font-bold text-white">{avgRecoveryRate.toFixed(1)}%</p>
                <p className="text-slate-400 text-sm mt-1">Team performance</p>
              </div>
              <Target className="h-12 w-12 text-purple-500" />
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
                <p className="text-slate-400 text-sm">Active Caseload</p>
                <p className="text-2xl font-bold text-white">{totalCaseload}</p>
                <p className="text-slate-400 text-sm mt-1">Cases assigned</p>
              </div>
              <Activity className="h-12 w-12 text-yellow-500" />
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
                  placeholder="Search agents by name, ID, email, or branch..."
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Branches</option>
                <option value="Mumbai Central">Mumbai Central</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>

              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Specializations</option>
                <option value="Personal Loans">Personal Loans</option>
                <option value="Business Loans">Business Loans</option>
                <option value="Home Loans">Home Loans</option>
                <option value="Vehicle Loans">Vehicle Loans</option>
                <option value="Education Loans">Education Loans</option>
                <option value="Legal Procedures">Legal Procedures</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-200"
            >
              {/* Agent Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                      <p className="text-slate-400 text-sm">{agent.agentId} • {agent.designation}</p>
                      <p className="text-slate-400 text-xs">{agent.branch} • {agent.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(agent.status)}`}>
                      {agent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{agent.email}</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6 border-b border-slate-700">
                <h4 className="text-sm font-medium text-white mb-3">Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Recovery Rate</p>
                    <p className={`font-medium ${getPerformanceColor(agent.performance.recoveryRate)}`}>
                      {agent.performance.recoveryRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">This Month</p>
                    <p className="text-white font-medium">₹{(agent.performance.currentMonthRecovery / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Cases Closed</p>
                    <p className="text-white font-medium">{agent.performance.casesClosed}/{agent.performance.casesAssigned}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Customer Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{agent.performance.customerSatisfactionScore}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400">Current Caseload</p>
                    <p className={`font-medium ${getCaseloadColor(agent.currentCaseload, agent.maxCaseload)}`}>
                      {agent.currentCaseload}/{agent.maxCaseload}
                    </p>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${agent.currentCaseload / agent.maxCaseload > 0.8 ? 'bg-red-500' :
                        agent.currentCaseload / agent.maxCaseload > 0.6 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${(agent.currentCaseload / agent.maxCaseload) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills & Specialization */}
              <div className="p-6 border-b border-slate-700">
                <h4 className="text-sm font-medium text-white mb-3">Skills & Expertise</h4>

                {/* Key Skills */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {Object.entries(agent.skills).slice(0, 2).map(([skill, score]) => {
                    const skillInfo = getSkillLevel(score);
                    return (
                      <div key={skill}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 capitalize">{skill}</span>
                          <span className={`text-xs ${skillInfo.color}`}>{skillInfo.label}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1 mt-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1">
                  {agent.specialization.slice(0, 2).map((spec, idx) => (
                    <span key={idx} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      {spec}
                    </span>
                  ))}
                  {agent.specialization.length > 2 && (
                    <span className="text-slate-400 text-xs px-2 py-1">
                      +{agent.specialization.length - 2} more
                    </span>
                  )}
                </div>

                {/* Experience & Languages */}
                <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>{agent.experience} years exp</span>
                    <span>{agent.languages.slice(0, 2).join(', ')}{agent.languages.length > 2 ? '...' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(agent)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditAgent(agent)}
                      className="text-green-400 hover:text-green-300 p-1"
                      title="Edit Agent"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-300 p-1" title="Settings">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete Agent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={agent.status}
                      onChange={(e) => handleStatusChange(agent.id, e.target.value as CollectionAgent['status'])}
                      className="bg-slate-700 border border-slate-600 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="ON_LEAVE">On Leave</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No agents found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or add a new agent.</p>
            <button
              onClick={handleCreateAgent}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Agent
            </button>
          </motion.div>
        )}

        {/* Agent Details Modal */}
        {showDetailsModal && selectedAgent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Agent Details - {selectedAgent.name}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Personal Information</h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Agent ID</p>
                        <p className="text-white">{selectedAgent.agentId}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Designation</p>
                        <p className="text-white">{selectedAgent.designation}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Department</p>
                        <p className="text-white">{selectedAgent.department}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Employment Type</p>
                        <p className="text-white">{selectedAgent.employmentType}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Experience</p>
                        <p className="text-white">{selectedAgent.experience} years</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Joining Date</p>
                        <p className="text-white">{new Date(selectedAgent.joiningDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Languages</p>
                      <p className="text-white">{selectedAgent.languages.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Certifications</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAgent.certifications.map((cert, idx) => (
                          <span key={idx} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Performance Metrics</h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Current Month Recovery</p>
                        <p className="text-white font-medium">₹{selectedAgent.performance.currentMonthRecovery.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Target Recovery</p>
                        <p className="text-white">₹{selectedAgent.performance.targetRecovery.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Recovery Rate</p>
                        <p className={getPerformanceColor(selectedAgent.performance.recoveryRate)}>
                          {selectedAgent.performance.recoveryRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Contact Success Rate</p>
                        <p className="text-white">{selectedAgent.performance.contactSuccessRate}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Avg Resolution Time</p>
                        <p className="text-white">{selectedAgent.performance.avgResolutionTime} days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Customer Satisfaction</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white">{selectedAgent.performance.customerSatisfactionScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Assessment */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-white">Skills Assessment</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.entries(selectedAgent.skills).map(([skill, score]) => {
                        const skillInfo = getSkillLevel(score);
                        return (
                          <div key={skill} className="text-center">
                            <div className="relative w-16 h-16 mx-auto mb-2">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="rgb(51 65 85)"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="rgb(59 130 246)"
                                  strokeWidth="2"
                                  strokeDasharray={`${score}, 100`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{score}</span>
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm capitalize">{skill}</p>
                            <p className={`text-xs ${skillInfo.color}`}>{skillInfo.label}</p>
                          </div>
                        );
                      })}
                    </div>
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