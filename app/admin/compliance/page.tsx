"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Target,
  Users,
  DollarSign,
  Flag,
  Settings,
  Eye,
  Edit,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  BookOpen,
  Gavel,
  Building,
  UserCheck,
  Clipboard
} from "lucide-react";
import { motion } from "framer-motion";

interface ComplianceMetrics {
  overallComplianceScore: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
  criticalViolations: number;
  resolvedViolations: number;
  complianceGaps: number;
  lastAuditDate: string;
  nextAuditDate: string;
}

interface ComplianceRequirement {
  id: string;
  requirementCode: string;
  title: string;
  description: string;
  category: 'RBI_GUIDELINES' | 'FAIR_PRACTICES' | 'KYC_AML' | 'DATA_PROTECTION' | 'LENDING_PRACTICES' | 'REPORTING' | 'RECOVERY_PRACTICES';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'UNDER_REVIEW' | 'NOT_APPLICABLE';
  complianceScore: number;
  lastReviewed: string;
  nextReview: string;
  assignedTo: string;
  evidenceRequired: string[];
  implementationStatus: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  regulatoryAuthority: string;
  applicableFrom: string;
  penaltyRisk: string;
}

interface ComplianceViolation {
  id: string;
  violationId: string;
  requirementId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  detectedDate: string;
  dueDate: string;
  assignedTo: string;
  estimatedPenalty: number;
  actualPenalty?: number;
  remedialActions: string[];
  evidence: string[];
  affectedCustomers?: number;
  businessImpact: string;
  rootCause?: string;
  preventiveMeasures: string[];
}

interface AuditReport {
  id: string;
  reportId: string;
  title: string;
  auditType: 'INTERNAL' | 'EXTERNAL' | 'REGULATORY' | 'SELF_ASSESSMENT';
  auditFirm?: string;
  auditDate: string;
  reportDate: string;
  scope: string[];
  overallRating: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'POOR';
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  status: 'DRAFT' | 'FINAL' | 'SUBMITTED' | 'UNDER_REVIEW';
  actionPlan: boolean;
  implementationDeadline?: string;
  compliance_score: number;
  recommendations: string[];
  keyFindings: string[];
}

export default function ComplianceReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('requirements');
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [violations, setViolations] = useState<ComplianceViolation[]>([]);
  const [auditReports, setAuditReports] = useState<AuditReport[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
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

  // Mock data
  const [complianceMetrics] = useState<ComplianceMetrics>({
    overallComplianceScore: 87.5,
    totalChecks: 156,
    passedChecks: 132,
    failedChecks: 18,
    pendingChecks: 6,
    criticalViolations: 3,
    resolvedViolations: 24,
    complianceGaps: 12,
    lastAuditDate: '2023-12-15',
    nextAuditDate: '2024-06-15'
  });

  useEffect(() => {
    // Mock compliance requirements
    const mockRequirements: ComplianceRequirement[] = [
      {
        id: '1',
        requirementCode: 'RBI-NBFC-001',
        title: 'Capital Adequacy Ratio Maintenance',
        description: 'Maintain minimum Capital Adequacy Ratio (CAR) of 15% as per RBI guidelines',
        category: 'RBI_GUIDELINES',
        priority: 'CRITICAL',
        status: 'COMPLIANT',
        complianceScore: 95,
        lastReviewed: '2024-01-15',
        nextReview: '2024-04-15',
        assignedTo: 'Risk Manager',
        evidenceRequired: ['Financial Statements', 'CAR Calculation Sheet', 'Board Approval'],
        implementationStatus: 100,
        riskLevel: 'HIGH',
        regulatoryAuthority: 'Reserve Bank of India',
        applicableFrom: '2021-10-01',
        penaltyRisk: 'License suspension, Monetary penalty up to ₹1 Crore'
      },
      {
        id: '2',
        requirementCode: 'KYC-AML-002',
        title: 'Enhanced Due Diligence for High-Risk Customers',
        description: 'Implement enhanced KYC procedures for customers categorized as high-risk',
        category: 'KYC_AML',
        priority: 'HIGH',
        status: 'PARTIALLY_COMPLIANT',
        complianceScore: 78,
        lastReviewed: '2024-01-10',
        nextReview: '2024-03-10',
        assignedTo: 'Compliance Officer',
        evidenceRequired: ['EDD Policy', 'Risk Assessment Framework', 'Training Records'],
        implementationStatus: 85,
        riskLevel: 'MEDIUM',
        regulatoryAuthority: 'Financial Intelligence Unit',
        applicableFrom: '2022-04-01',
        penaltyRisk: 'Monetary penalty, Regulatory action'
      },
      {
        id: '3',
        requirementCode: 'FPC-003',
        title: 'Fair Practices Code Implementation',
        description: 'Ensure transparent disclosure of loan terms and grievance redressal mechanism',
        category: 'FAIR_PRACTICES',
        priority: 'HIGH',
        status: 'COMPLIANT',
        complianceScore: 92,
        lastReviewed: '2024-01-20',
        nextReview: '2024-07-20',
        assignedTo: 'Operations Head',
        evidenceRequired: ['FPC Document', 'Disclosure Templates', 'Customer Acknowledgments'],
        implementationStatus: 98,
        riskLevel: 'MEDIUM',
        regulatoryAuthority: 'RBI',
        applicableFrom: '2020-01-01',
        penaltyRisk: 'Regulatory censure, Customer compensation'
      },
      {
        id: '4',
        requirementCode: 'DPP-004',
        title: 'Data Protection and Privacy Compliance',
        description: 'Implement data protection measures as per Digital Personal Data Protection Act',
        category: 'DATA_PROTECTION',
        priority: 'CRITICAL',
        status: 'UNDER_REVIEW',
        complianceScore: 68,
        lastReviewed: '2024-01-05',
        nextReview: '2024-02-05',
        assignedTo: 'IT Security Team',
        evidenceRequired: ['Privacy Policy', 'Data Processing Inventory', 'Consent Management'],
        implementationStatus: 70,
        riskLevel: 'HIGH',
        regulatoryAuthority: 'Data Protection Board',
        applicableFrom: '2024-01-01',
        penaltyRisk: 'Penalty up to ₹250 Crores or 4% of annual turnover'
      },
      {
        id: '5',
        requirementCode: 'REC-005',
        title: 'Debt Recovery Practices Compliance',
        description: 'Adhere to RBI guidelines on debt collection practices and customer harassment',
        category: 'RECOVERY_PRACTICES',
        priority: 'HIGH',
        status: 'NON_COMPLIANT',
        complianceScore: 45,
        lastReviewed: '2024-01-18',
        nextReview: '2024-02-18',
        assignedTo: 'Collections Head',
        evidenceRequired: ['Recovery Policy', 'Agent Training Records', 'Customer Complaints'],
        implementationStatus: 60,
        riskLevel: 'CRITICAL',
        regulatoryAuthority: 'RBI',
        applicableFrom: '2021-12-01',
        penaltyRisk: 'License action, Monetary penalty, Legal cases'
      }
    ];

    const mockViolations: ComplianceViolation[] = [
      {
        id: '1',
        violationId: 'VIO-2024-001',
        requirementId: '5',
        title: 'Excessive Collection Calls Violation',
        description: 'Multiple customer complaints regarding excessive collection calls beyond permitted hours',
        severity: 'HIGH',
        status: 'IN_PROGRESS',
        detectedDate: '2024-01-18',
        dueDate: '2024-02-28',
        assignedTo: 'Collections Head',
        estimatedPenalty: 500000,
        remedialActions: [
          'Retrain collection agents on RBI guidelines',
          'Implement call frequency monitoring system',
          'Update collection policy'
        ],
        evidence: [
          'Customer complaint records',
          'Call logs analysis',
          'Agent activity reports'
        ],
        affectedCustomers: 23,
        businessImpact: 'Regulatory scrutiny, Customer dissatisfaction, Potential license impact',
        rootCause: 'Inadequate training and monitoring of collection agents',
        preventiveMeasures: [
          'Regular compliance training',
          'Automated call monitoring',
          'Customer feedback system'
        ]
      },
      {
        id: '2',
        violationId: 'VIO-2024-002',
        requirementId: '2',
        title: 'Incomplete KYC Documentation',
        description: 'Several high-risk customer accounts found with incomplete enhanced due diligence documentation',
        severity: 'MEDIUM',
        status: 'OPEN',
        detectedDate: '2024-01-15',
        dueDate: '2024-03-15',
        assignedTo: 'Compliance Officer',
        estimatedPenalty: 250000,
        remedialActions: [
          'Complete pending EDD for identified accounts',
          'Strengthen KYC verification process',
          'Implement systematic EDD tracking'
        ],
        evidence: [
          'Account review reports',
          'Missing document list',
          'Risk assessment records'
        ],
        affectedCustomers: 45,
        businessImpact: 'AML compliance risk, Regulatory penalty risk',
        rootCause: 'Process gaps in EDD implementation',
        preventiveMeasures: [
          'Automated EDD tracking system',
          'Regular account reviews',
          'Enhanced staff training'
        ]
      }
    ];

    const mockAuditReports: AuditReport[] = [
      {
        id: '1',
        reportId: 'AUD-2023-Q4',
        title: 'Quarterly Internal Audit Report - Q4 2023',
        auditType: 'INTERNAL',
        auditDate: '2023-12-15',
        reportDate: '2024-01-05',
        scope: ['Credit Operations', 'Risk Management', 'Compliance', 'IT Security'],
        overallRating: 'GOOD',
        totalFindings: 12,
        criticalFindings: 1,
        highFindings: 3,
        mediumFindings: 5,
        lowFindings: 3,
        status: 'FINAL',
        actionPlan: true,
        implementationDeadline: '2024-03-31',
        compliance_score: 85,
        recommendations: [
          'Strengthen credit appraisal process',
          'Enhance IT security controls',
          'Improve compliance monitoring'
        ],
        keyFindings: [
          'Gap in loan documentation verification',
          'Delayed compliance reporting',
          'IT access control weaknesses'
        ]
      },
      {
        id: '2',
        reportId: 'AUD-2023-EXT',
        title: 'Annual External Audit Report 2023',
        auditType: 'EXTERNAL',
        auditFirm: 'Ernst & Young LLP',
        auditDate: '2023-11-20',
        reportDate: '2023-12-30',
        scope: ['Financial Statements', 'Internal Controls', 'Regulatory Compliance'],
        overallRating: 'SATISFACTORY',
        totalFindings: 8,
        criticalFindings: 0,
        highFindings: 2,
        mediumFindings: 4,
        lowFindings: 2,
        status: 'SUBMITTED',
        actionPlan: true,
        implementationDeadline: '2024-06-30',
        compliance_score: 78,
        recommendations: [
          'Improve internal control documentation',
          'Enhance risk assessment procedures',
          'Strengthen IT governance'
        ],
        keyFindings: [
          'Adequate financial controls',
          'Minor process improvements needed',
          'Compliance framework operational'
        ]
      },
      {
        id: '3',
        reportId: 'AUD-2024-RBI',
        title: 'RBI Inspection Report 2024',
        auditType: 'REGULATORY',
        auditDate: '2024-01-10',
        reportDate: '2024-01-25',
        scope: ['Capital Adequacy', 'Asset Quality', 'Compliance', 'Governance'],
        overallRating: 'NEEDS_IMPROVEMENT',
        totalFindings: 15,
        criticalFindings: 2,
        highFindings: 5,
        mediumFindings: 6,
        lowFindings: 2,
        status: 'UNDER_REVIEW',
        actionPlan: false,
        compliance_score: 65,
        recommendations: [
          'Immediate attention to critical findings',
          'Strengthen risk management framework',
          'Improve asset quality monitoring'
        ],
        keyFindings: [
          'Capital adequacy maintained but declining trend',
          'Asset quality deterioration observed',
          'Compliance gaps in recovery practices'
        ]
      }
    ];

    setRequirements(mockRequirements);
    setViolations(mockViolations);
    setAuditReports(mockAuditReports);
    setFilteredData(mockRequirements);
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    let data: any[] = [];

    switch (activeTab) {
      case 'requirements':
        data = requirements;
        break;
      case 'violations':
        data = violations;
        break;
      case 'audits':
        data = auditReports;
        break;
      default:
        data = requirements;
    }

    let filtered = data.filter(item => {
      const matchesSearch = searchTerm === '' ||
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      let matchesCategory = true;
      let matchesStatus = true;
      let matchesPriority = true;

      if (activeTab === 'requirements') {
        matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
        matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
        matchesPriority = selectedPriority === 'ALL' || item.priority === selectedPriority;
      } else if (activeTab === 'violations') {
        matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
        matchesPriority = selectedPriority === 'ALL' || item.severity === selectedPriority;
      } else if (activeTab === 'audits') {
        matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });

    setFilteredData(filtered);
  }, [activeTab, requirements, violations, auditReports, searchTerm, selectedCategory, selectedStatus, selectedPriority]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'bg-green-500';
      case 'NON_COMPLIANT': return 'bg-red-500';
      case 'PARTIALLY_COMPLIANT': return 'bg-yellow-500';
      case 'UNDER_REVIEW': return 'bg-blue-500';
      case 'OPEN': return 'bg-red-500';
      case 'IN_PROGRESS': return 'bg-yellow-500';
      case 'RESOLVED': return 'bg-green-500';
      case 'ESCALATED': return 'bg-purple-500';
      case 'CLOSED': return 'bg-gray-500';
      case 'DRAFT': return 'bg-gray-500';
      case 'FINAL': return 'bg-green-500';
      case 'SUBMITTED': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'text-green-400 bg-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20';
      case 'CRITICAL': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT': return 'text-green-400';
      case 'GOOD': return 'text-blue-400';
      case 'SATISFACTORY': return 'text-yellow-400';
      case 'NEEDS_IMPROVEMENT': return 'text-orange-400';
      case 'POOR': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading compliance reports...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

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
            <h1 className="text-3xl font-bold text-white mb-2">Compliance Management</h1>
            <p className="text-slate-400">Monitor regulatory compliance, audit reports, and violation tracking</p>
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
              Export Report
            </button>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overall Compliance</p>
                <p className="text-2xl font-bold text-white">{complianceMetrics.overallComplianceScore}%</p>
                <p className="text-green-400 text-sm mt-1">
                  {complianceMetrics.passedChecks}/{complianceMetrics.totalChecks} checks passed
                </p>
              </div>
              <Shield className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Critical Violations</p>
                <p className="text-2xl font-bold text-white">{complianceMetrics.criticalViolations}</p>
                <p className="text-slate-400 text-sm mt-1">{complianceMetrics.resolvedViolations} resolved</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500" />
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
                <p className="text-slate-400 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold text-white">{complianceMetrics.pendingChecks}</p>
                <p className="text-slate-400 text-sm mt-1">Require attention</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-500" />
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
                <p className="text-slate-400 text-sm">Next Audit</p>
                <p className="text-2xl font-bold text-white">
                  {Math.ceil((new Date(complianceMetrics.nextAuditDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-slate-400 text-sm mt-1">days remaining</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 mb-8">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('requirements')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'requirements'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compliance Requirements
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'violations'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Violations & Issues
            </button>
            <button
              onClick={() => setActiveTab('audits')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'audits'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Audit Reports
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                {activeTab === 'requirements' && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="RBI_GUIDELINES">RBI Guidelines</option>
                    <option value="FAIR_PRACTICES">Fair Practices</option>
                    <option value="KYC_AML">KYC/AML</option>
                    <option value="DATA_PROTECTION">Data Protection</option>
                    <option value="LENDING_PRACTICES">Lending Practices</option>
                    <option value="RECOVERY_PRACTICES">Recovery Practices</option>
                  </select>
                )}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  {activeTab === 'requirements' && (
                    <>
                      <option value="COMPLIANT">Compliant</option>
                      <option value="NON_COMPLIANT">Non-Compliant</option>
                      <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                    </>
                  )}
                  {activeTab === 'violations' && (
                    <>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="ESCALATED">Escalated</option>
                      <option value="CLOSED">Closed</option>
                    </>
                  )}
                  {activeTab === 'audits' && (
                    <>
                      <option value="DRAFT">Draft</option>
                      <option value="FINAL">Final</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                    </>
                  )}
                </select>
                {(activeTab === 'requirements' || activeTab === 'violations') && (
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All {activeTab === 'violations' ? 'Severity' : 'Priority'}</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'requirements' && (
              <div className="space-y-4">
                {filteredData.map((requirement: ComplianceRequirement, index) => (
                  <motion.div
                    key={requirement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-medium">{requirement.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                            {requirement.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(requirement.status)}`}>
                            {requirement.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{requirement.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Code</p>
                            <p className="text-white">{requirement.requirementCode}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Compliance Score</p>
                            <p className="text-white font-medium">{requirement.complianceScore}%</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Last Reviewed</p>
                            <p className="text-white">{new Date(requirement.lastReviewed).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Next Review</p>
                            <p className="text-white">{new Date(requirement.nextReview).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-400 text-sm">Implementation Progress</span>
                            <span className="text-white text-sm">{requirement.implementationStatus}%</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${requirement.implementationStatus}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="text-blue-400 hover:text-blue-300 p-1" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 p-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'violations' && (
              <div className="space-y-4">
                {filteredData.map((violation: ComplianceViolation, index) => (
                  <motion.div
                    key={violation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-medium">{violation.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(violation.severity)}`}>
                            {violation.severity}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(violation.status)}`}>
                            {violation.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-3">{violation.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-slate-400">Violation ID</p>
                            <p className="text-white">{violation.violationId}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Detected Date</p>
                            <p className="text-white">{new Date(violation.detectedDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Due Date</p>
                            <p className="text-white">{new Date(violation.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Estimated Penalty</p>
                            <p className="text-white">₹{violation.estimatedPenalty.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Remedial Actions</p>
                          <div className="flex flex-wrap gap-1">
                            {violation.remedialActions.slice(0, 2).map((action, idx) => (
                              <span key={idx} className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                                {action}
                              </span>
                            ))}
                            {violation.remedialActions.length > 2 && (
                              <span className="text-slate-400 text-xs px-2 py-1">
                                +{violation.remedialActions.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="text-blue-400 hover:text-blue-300 p-1" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 p-1" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'audits' && (
              <div className="space-y-4">
                {filteredData.map((audit: AuditReport, index) => (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-medium">{audit.title}</h4>
                          <span className={`text-sm font-medium ${getRatingColor(audit.overallRating)}`}>
                            {audit.overallRating.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(audit.status)}`}>
                            {audit.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-slate-400">Report ID</p>
                            <p className="text-white">{audit.reportId}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Audit Date</p>
                            <p className="text-white">{new Date(audit.auditDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Total Findings</p>
                            <p className="text-white">{audit.totalFindings}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Compliance Score</p>
                            <p className="text-white">{audit.compliance_score}%</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                          <div className="text-center">
                            <p className="text-red-400 font-medium">{audit.criticalFindings}</p>
                            <p className="text-slate-400 text-xs">Critical</p>
                          </div>
                          <div className="text-center">
                            <p className="text-orange-400 font-medium">{audit.highFindings}</p>
                            <p className="text-slate-400 text-xs">High</p>
                          </div>
                          <div className="text-center">
                            <p className="text-yellow-400 font-medium">{audit.mediumFindings}</p>
                            <p className="text-slate-400 text-xs">Medium</p>
                          </div>
                          <div className="text-center">
                            <p className="text-green-400 font-medium">{audit.lowFindings}</p>
                            <p className="text-slate-400 text-xs">Low</p>
                          </div>
                        </div>
                        {audit.keyFindings.length > 0 && (
                          <div>
                            <p className="text-slate-400 text-sm mb-1">Key Findings</p>
                            <div className="text-slate-300 text-sm">
                              {audit.keyFindings.slice(0, 2).map((finding, idx) => (
                                <p key={idx}>• {finding}</p>
                              ))}
                              {audit.keyFindings.length > 2 && (
                                <p className="text-slate-400">+{audit.keyFindings.length - 2} more findings...</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="text-blue-400 hover:text-blue-300 p-1" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 p-1" title="Download">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No data found</h3>
                <p className="text-slate-400">No items match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}