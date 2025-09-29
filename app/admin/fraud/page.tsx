"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  AlertTriangle,
  Eye,
  Flag,
  Zap,
  Clock,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  CreditCard,
  Building,
  Target,
  Gauge,
  AlertCircle,
  Ban,
  UserX
} from "lucide-react";
import { motion } from "framer-motion";

interface FraudCase {
  id: string;
  caseId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fraudType: 'IDENTITY_THEFT' | 'DOCUMENT_FORGERY' | 'INCOME_INFLATION' | 'SYNTHETIC_IDENTITY' | 'ACCOUNT_TAKEOVER' | 'APPLICATION_FRAUD' | 'PAYMENT_FRAUD';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DETECTED' | 'INVESTIGATING' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'RESOLVED' | 'ESCALATED';
  confidenceScore: number;
  detectedAt: string;
  investigator?: string;
  estimatedLoss: number;
  actualLoss?: number;
  description: string;
  evidences: FraudEvidence[];
  relatedCases?: string[];
  riskIndicators: string[];
  geolocation: {
    country: string;
    state: string;
    city: string;
    ipAddress: string;
    suspiciousLocation: boolean;
  };
  timeline: FraudActivity[];
}

interface FraudEvidence {
  id: string;
  type: 'DOCUMENT' | 'TRANSACTION' | 'BEHAVIOR' | 'DEVICE' | 'LOCATION' | 'COMMUNICATION';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  uploadedAt: string;
  uploadedBy: string;
  fileUrl?: string;
}

interface FraudActivity {
  id: string;
  activity: string;
  timestamp: string;
  performedBy: string;
  details: string;
}

interface FraudMetrics {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  falsePositives: number;
  estimatedLossPrevented: number;
  actualLosses: number;
  detectionAccuracy: number;
  avgInvestigationTime: number;
  trendData: {
    casesThisMonth: number;
    casesLastMonth: number;
    lossesThisMonth: number;
    lossesLastMonth: number;
  };
}

interface SuspiciousPattern {
  id: string;
  patternType: string;
  description: string;
  frequency: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedCustomers: number;
  firstDetected: string;
  lastDetected: string;
  status: 'ACTIVE' | 'MONITORING' | 'RESOLVED';
}

export default function FraudDetectionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [fraudCases, setFraudCases] = useState<FraudCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<FraudCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedFraudType, setSelectedFraudType] = useState('ALL');
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
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
  const [fraudMetrics] = useState<FraudMetrics>({
    totalCases: 847,
    activeCases: 23,
    resolvedCases: 789,
    falsePositives: 35,
    estimatedLossPrevented: 12500000,
    actualLosses: 450000,
    detectionAccuracy: 94.2,
    avgInvestigationTime: 4.8,
    trendData: {
      casesThisMonth: 23,
      casesLastMonth: 18,
      lossesThisMonth: 45000,
      lossesLastMonth: 78000
    }
  });

  const [suspiciousPatterns] = useState<SuspiciousPattern[]>([
    {
      id: '1',
      patternType: 'Rapid Application Submission',
      description: 'Multiple loan applications submitted within short time frames from similar profiles',
      frequency: 12,
      riskLevel: 'HIGH',
      affectedCustomers: 8,
      firstDetected: '2024-01-15T00:00:00Z',
      lastDetected: '2024-01-20T00:00:00Z',
      status: 'ACTIVE'
    },
    {
      id: '2',
      patternType: 'Income Inconsistency Pattern',
      description: 'Significant discrepancies between declared income and supporting documents',
      frequency: 7,
      riskLevel: 'MEDIUM',
      affectedCustomers: 5,
      firstDetected: '2024-01-12T00:00:00Z',
      lastDetected: '2024-01-19T00:00:00Z',
      status: 'MONITORING'
    },
    {
      id: '3',
      patternType: 'Device Fingerprint Anomaly',
      description: 'Same device used for multiple applications with different identities',
      frequency: 15,
      riskLevel: 'CRITICAL',
      affectedCustomers: 12,
      firstDetected: '2024-01-10T00:00:00Z',
      lastDetected: '2024-01-20T00:00:00Z',
      status: 'ACTIVE'
    }
  ]);

  useEffect(() => {
    // Mock fraud cases
    const mockFraudCases: FraudCase[] = [
      {
        id: '1',
        caseId: 'FR-2024-001',
        customerId: 'CUST001',
        customerName: 'Rajesh Kumar (Suspected)',
        customerEmail: 'rajesh.fake@email.com',
        customerPhone: '+91 98765 43210',
        fraudType: 'IDENTITY_THEFT',
        severity: 'CRITICAL',
        status: 'INVESTIGATING',
        confidenceScore: 92.5,
        detectedAt: '2024-01-20T10:30:00Z',
        investigator: 'Security Team Lead',
        estimatedLoss: 500000,
        description: 'Suspected identity theft using stolen Aadhaar and PAN documents',
        evidences: [
          {
            id: '1',
            type: 'DOCUMENT',
            description: 'Aadhaar document shows inconsistent photo metadata',
            severity: 'HIGH',
            uploadedAt: '2024-01-20T10:35:00Z',
            uploadedBy: 'Security Analyst'
          },
          {
            id: '2',
            type: 'BEHAVIOR',
            description: 'Application submitted outside normal business hours with suspicious speed',
            severity: 'MEDIUM',
            uploadedAt: '2024-01-20T11:00:00Z',
            uploadedBy: 'Security Analyst'
          }
        ],
        riskIndicators: [
          'Document metadata inconsistency',
          'IP address from high-risk region',
          'Application velocity anomaly',
          'Credit bureau mismatch'
        ],
        geolocation: {
          country: 'India',
          state: 'Rajasthan',
          city: 'Jaipur',
          ipAddress: '203.192.xxx.xxx',
          suspiciousLocation: true
        },
        timeline: [
          {
            id: '1',
            activity: 'Case Created',
            timestamp: '2024-01-20T10:30:00Z',
            performedBy: 'Fraud Detection System',
            details: 'Automated fraud detection triggered high-confidence alert'
          },
          {
            id: '2',
            activity: 'Investigation Started',
            timestamp: '2024-01-20T10:45:00Z',
            performedBy: 'Security Team Lead',
            details: 'Case assigned to investigation team for detailed analysis'
          }
        ]
      },
      {
        id: '2',
        caseId: 'FR-2024-002',
        customerId: 'CUST002',
        customerName: 'Priya Patel',
        customerEmail: 'priya.patel@email.com',
        customerPhone: '+91 98765 43212',
        fraudType: 'INCOME_INFLATION',
        severity: 'HIGH',
        status: 'CONFIRMED',
        confidenceScore: 87.3,
        detectedAt: '2024-01-19T14:20:00Z',
        investigator: 'Senior Investigator',
        estimatedLoss: 300000,
        actualLoss: 300000,
        description: 'Significant income inflation detected in salary slips and bank statements',
        evidences: [
          {
            id: '3',
            type: 'DOCUMENT',
            description: 'Salary slip shows altered figures with different fonts',
            severity: 'HIGH',
            uploadedAt: '2024-01-19T14:25:00Z',
            uploadedBy: 'Document Analyst'
          }
        ],
        riskIndicators: [
          'Income document forgery',
          'Bank statement manipulation',
          'Employment verification failed'
        ],
        geolocation: {
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
          ipAddress: '103.255.xxx.xxx',
          suspiciousLocation: false
        },
        timeline: [
          {
            id: '3',
            activity: 'Case Confirmed',
            timestamp: '2024-01-19T16:30:00Z',
            performedBy: 'Senior Investigator',
            details: 'Evidence confirmed fraudulent income inflation'
          }
        ]
      },
      {
        id: '3',
        caseId: 'FR-2024-003',
        customerId: 'CUST003',
        customerName: 'Amit Sharma',
        customerEmail: 'amit.sharma@email.com',
        customerPhone: '+91 98765 43213',
        fraudType: 'DOCUMENT_FORGERY',
        severity: 'MEDIUM',
        status: 'FALSE_POSITIVE',
        confidenceScore: 65.8,
        detectedAt: '2024-01-18T16:45:00Z',
        investigator: 'Junior Investigator',
        estimatedLoss: 150000,
        description: 'Suspected document forgery in PAN card submission',
        evidences: [
          {
            id: '4',
            type: 'DOCUMENT',
            description: 'PAN card quality analysis flagged as suspicious',
            severity: 'LOW',
            uploadedAt: '2024-01-18T17:00:00Z',
            uploadedBy: 'Auto Verification System'
          }
        ],
        riskIndicators: [
          'Document quality below threshold',
          'OCR confidence low'
        ],
        geolocation: {
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          ipAddress: '117.247.xxx.xxx',
          suspiciousLocation: false
        },
        timeline: [
          {
            id: '4',
            activity: 'Marked as False Positive',
            timestamp: '2024-01-18T18:30:00Z',
            performedBy: 'Junior Investigator',
            details: 'Manual review confirmed document is genuine'
          }
        ]
      },
      {
        id: '4',
        caseId: 'FR-2024-004',
        customerId: 'CUST004',
        customerName: 'Unknown Person',
        customerEmail: 'synthetic.user@tempmail.com',
        customerPhone: '+91 99999 99999',
        fraudType: 'SYNTHETIC_IDENTITY',
        severity: 'CRITICAL',
        status: 'ESCALATED',
        confidenceScore: 96.8,
        detectedAt: '2024-01-17T22:15:00Z',
        investigator: 'Senior Security Analyst',
        estimatedLoss: 750000,
        description: 'Synthetic identity created using combination of real and fake data',
        evidences: [
          {
            id: '5',
            type: 'BEHAVIOR',
            description: 'Digital footprint analysis shows no historical online presence',
            severity: 'HIGH',
            uploadedAt: '2024-01-17T22:30:00Z',
            uploadedBy: 'Digital Forensics Team'
          }
        ],
        riskIndicators: [
          'No credit history',
          'Temporary email provider',
          'No social media presence',
          'New phone number'
        ],
        geolocation: {
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          ipAddress: '157.32.xxx.xxx',
          suspiciousLocation: true
        },
        timeline: [
          {
            id: '5',
            activity: 'Escalated to Law Enforcement',
            timestamp: '2024-01-18T10:00:00Z',
            performedBy: 'Security Team Lead',
            details: 'Case escalated to cybercrime division for further investigation'
          }
        ]
      }
    ];

    setFraudCases(mockFraudCases);
    setFilteredCases(mockFraudCases);
  }, []);

  // Filter fraud cases
  useEffect(() => {
    let filtered = fraudCases.filter(fraudCase => {
      const matchesSearch =
        fraudCase.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fraudCase.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fraudCase.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fraudCase.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = selectedSeverity === 'ALL' || fraudCase.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'ALL' || fraudCase.status === selectedStatus;
      const matchesFraudType = selectedFraudType === 'ALL' || fraudCase.fraudType === selectedFraudType;

      return matchesSearch && matchesSeverity && matchesStatus && matchesFraudType;
    });

    setFilteredCases(filtered);
  }, [fraudCases, searchTerm, selectedSeverity, selectedStatus, selectedFraudType]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleViewCase = (fraudCase: FraudCase) => {
    setSelectedCase(fraudCase);
    setShowCaseDetails(true);
  };

  const handleUpdateCaseStatus = (caseId: string, newStatus: FraudCase['status']) => {
    setFraudCases(fraudCases.map(fraudCase =>
      fraudCase.id === caseId ? { ...fraudCase, status: newStatus } : fraudCase
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-green-400 bg-green-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20';
      case 'CRITICAL': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DETECTED': return 'bg-blue-500';
      case 'INVESTIGATING': return 'bg-yellow-500';
      case 'CONFIRMED': return 'bg-red-500';
      case 'FALSE_POSITIVE': return 'bg-gray-500';
      case 'RESOLVED': return 'bg-green-500';
      case 'ESCALATED': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getFraudTypeIcon = (type: string) => {
    switch (type) {
      case 'IDENTITY_THEFT': return <UserX className="h-4 w-4" />;
      case 'DOCUMENT_FORGERY': return <FileText className="h-4 w-4" />;
      case 'INCOME_INFLATION': return <DollarSign className="h-4 w-4" />;
      case 'SYNTHETIC_IDENTITY': return <Users className="h-4 w-4" />;
      case 'ACCOUNT_TAKEOVER': return <Shield className="h-4 w-4" />;
      case 'APPLICATION_FRAUD': return <CreditCard className="h-4 w-4" />;
      case 'PAYMENT_FRAUD': return <Ban className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPatternRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading fraud detection...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const activeCases = fraudCases.filter(c => c.status === 'INVESTIGATING' || c.status === 'DETECTED').length;
  const criticalCases = fraudCases.filter(c => c.severity === 'CRITICAL').length;

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
            <h1 className="text-3xl font-bold text-white mb-2">Fraud Detection & Prevention</h1>
            <p className="text-slate-400">Advanced fraud monitoring, investigation, and prevention system</p>
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
              Export Cases
            </button>
          </div>
        </div>

        {/* Fraud Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Cases</p>
                <p className="text-2xl font-bold text-white">{activeCases}</p>
                <p className="text-slate-400 text-sm mt-1">{criticalCases} critical</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
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
                <p className="text-slate-400 text-sm">Detection Accuracy</p>
                <p className="text-2xl font-bold text-white">{fraudMetrics.detectionAccuracy}%</p>
                <p className="text-green-400 text-sm mt-1">
                  {fraudMetrics.falsePositives} false positives
                </p>
              </div>
              <Target className="h-12 w-12 text-green-500" />
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
                <p className="text-slate-400 text-sm">Loss Prevented</p>
                <p className="text-2xl font-bold text-white">₹{(fraudMetrics.estimatedLossPrevented / 10000000).toFixed(1)}Cr</p>
                <p className="text-green-400 text-sm mt-1">Estimated savings</p>
              </div>
              <Shield className="h-12 w-12 text-blue-500" />
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
                <p className="text-slate-400 text-sm">Avg Investigation Time</p>
                <p className="text-2xl font-bold text-white">{fraudMetrics.avgInvestigationTime}</p>
                <p className="text-slate-400 text-sm mt-1">days</p>
              </div>
              <Clock className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Suspicious Patterns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Active Suspicious Patterns</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {suspiciousPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-slate-700 rounded-lg border border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-medium">{pattern.patternType}</h4>
                  <span className={`text-sm font-medium ${getPatternRiskColor(pattern.riskLevel)}`}>
                    {pattern.riskLevel}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-4">{pattern.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Frequency</p>
                    <p className="text-white font-medium">{pattern.frequency}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Affected</p>
                    <p className="text-white font-medium">{pattern.affectedCustomers} customers</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Last detected</span>
                    <span className="text-slate-300">
                      {new Date(pattern.lastDetected).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fraud Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Fraud Cases</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Severity</option>
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
                <option value="DETECTED">Detected</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="FALSE_POSITIVE">False Positive</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ESCALATED">Escalated</option>
              </select>
              <select
                value={selectedFraudType}
                onChange={(e) => setSelectedFraudType(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="IDENTITY_THEFT">Identity Theft</option>
                <option value="DOCUMENT_FORGERY">Document Forgery</option>
                <option value="INCOME_INFLATION">Income Inflation</option>
                <option value="SYNTHETIC_IDENTITY">Synthetic Identity</option>
                <option value="ACCOUNT_TAKEOVER">Account Takeover</option>
                <option value="APPLICATION_FRAUD">Application Fraud</option>
                <option value="PAYMENT_FRAUD">Payment Fraud</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredCases.map((fraudCase, index) => (
              <motion.div
                key={fraudCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getSeverityColor(fraudCase.severity)}`}>
                      {getFraudTypeIcon(fraudCase.fraudType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-medium">{fraudCase.caseId}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(fraudCase.severity)}`}>
                          {fraudCase.severity}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(fraudCase.status)}`}>
                          {fraudCase.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-slate-400">
                          Confidence: {fraudCase.confidenceScore}%
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{fraudCase.customerName}</p>
                      <p className="text-slate-300 text-sm mb-3">{fraudCase.description}</p>
                      <div className="flex items-center gap-6 text-xs text-slate-400">
                        <span>Type: {fraudCase.fraudType.replace('_', ' ')}</span>
                        <span>Estimated Loss: ₹{fraudCase.estimatedLoss.toLocaleString()}</span>
                        <span>Detected: {new Date(fraudCase.detectedAt).toLocaleDateString()}</span>
                        {fraudCase.investigator && <span>Investigator: {fraudCase.investigator}</span>}
                      </div>
                      {fraudCase.geolocation.suspiciousLocation && (
                        <div className="mt-2 flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-red-400" />
                          <span className="text-red-400 text-xs">Suspicious location detected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCase(fraudCase)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <select
                      value={fraudCase.status}
                      onChange={(e) => handleUpdateCaseStatus(fraudCase.id, e.target.value as FraudCase['status'])}
                      className="bg-slate-600 border border-slate-500 text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DETECTED">Detected</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="FALSE_POSITIVE">False Positive</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="ESCALATED">Escalated</option>
                    </select>
                    <button className="text-slate-400 hover:text-slate-300 p-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No fraud cases found</h3>
              <p className="text-slate-400">No fraud cases match your current filters.</p>
            </div>
          )}
        </motion.div>

        {/* Case Details Modal */}
        {showCaseDetails && selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Fraud Case Details - {selectedCase.caseId}
                </h3>
                <button
                  onClick={() => setShowCaseDetails(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Case Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Case Information</h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Case ID</p>
                        <p className="text-white">{selectedCase.caseId}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Fraud Type</p>
                        <p className="text-white">{selectedCase.fraudType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Severity</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedCase.severity)}`}>
                          {selectedCase.severity}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Confidence Score</p>
                        <p className="text-white font-medium">{selectedCase.confidenceScore}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Estimated Loss</p>
                        <p className="text-white">₹{selectedCase.estimatedLoss.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Actual Loss</p>
                        <p className="text-white">
                          {selectedCase.actualLoss ? `₹${selectedCase.actualLoss.toLocaleString()}` : 'TBD'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Description</p>
                      <p className="text-white">{selectedCase.description}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-white">Suspect Information</h4>
                  <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Name</p>
                      <p className="text-white">{selectedCase.customerName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Customer ID</p>
                      <p className="text-white">{selectedCase.customerId}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{selectedCase.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-white">{selectedCase.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Location</p>
                      <p className="text-white">
                        {selectedCase.geolocation.city}, {selectedCase.geolocation.state}
                      </p>
                      {selectedCase.geolocation.suspiciousLocation && (
                        <p className="text-red-400 text-sm">⚠️ Suspicious location</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Risk Indicators */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-white">Risk Indicators</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.riskIndicators.map((indicator, idx) => (
                        <span key={idx} className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evidence */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-white">Evidence</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedCase.evidences.map((evidence, idx) => (
                        <div key={evidence.id} className="border-l-2 border-blue-500 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{evidence.type.replace('_', ' ')}</p>
                              <p className="text-slate-300 text-sm">{evidence.description}</p>
                              <p className="text-slate-400 text-xs mt-1">
                                Uploaded by {evidence.uploadedBy} on {new Date(evidence.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(evidence.severity)}`}>
                              {evidence.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-lg font-medium text-white">Investigation Timeline</h4>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="space-y-3">
                      {selectedCase.timeline.map((activity, idx) => (
                        <div key={activity.id} className="border-l-2 border-green-500 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">{activity.activity}</p>
                              <p className="text-slate-300 text-sm">{activity.details}</p>
                              <p className="text-slate-400 text-xs mt-1">
                                {activity.performedBy} • {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
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