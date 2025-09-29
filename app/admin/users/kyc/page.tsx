"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, Filter, Download, Eye, Check, X, Clock,
  AlertTriangle, DollarSign, User, Calendar, FileText,
  ChevronDown, ChevronUp, MoreHorizontal, RefreshCw,
  CheckCircle, XCircle, Upload, Phone, Mail, MapPin,
  Camera, CreditCard, Building, Star, Flag, Shield,
  Zap, Ban, UserCheck, Edit, Award, BadgeCheck,
  Smartphone, Activity, IndianRupee, Image, AlertCircle,
  Paperclip, ExternalLink, MessageSquare, History,
  FileCheck, UserX, Scale, Gavel, BookOpen
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface KYCDocument {
  id: string;
  userId: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  documentType: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'BANK_STATEMENT' | 'SALARY_SLIP' | 'ITR' | 'BUSINESS_REGISTRATION' | 'PHOTO' | 'SIGNATURE';
  documentNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  additionalImageUrl?: string;
  uploadedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'UNDER_REVIEW';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  expiryDate?: string;
  extractedData: {
    name?: string;
    fatherName?: string;
    dateOfBirth?: string;
    address?: string;
    gender?: string;
    documentNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    placeOfBirth?: string;
    nationality?: string;
  };
  verificationChecks: {
    ocrMatch: boolean;
    faceMatch: boolean;
    documentAuthenticity: boolean;
    blacklistCheck: boolean;
    duplicateCheck: boolean;
    addressVerification: boolean;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  comments: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    type: 'VERIFICATION' | 'REJECTION' | 'GENERAL';
  }>;
  riskScore: number;
  complianceFlags: string[];
}

const DOCUMENT_TYPES = [
  'ALL',
  'AADHAAR',
  'PAN',
  'PASSPORT',
  'VOTER_ID',
  'DRIVING_LICENSE',
  'BANK_STATEMENT',
  'SALARY_SLIP',
  'ITR',
  'BUSINESS_REGISTRATION',
  'PHOTO',
  'SIGNATURE'
];

const KYC_STATUSES = ['ALL', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED'];
const PRIORITY_LEVELS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function AdminKYCVerification() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('uploadedAt');
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
  const mockDocuments: KYCDocument[] = [
    {
      id: "KYC001",
      userId: "USR001",
      customerId: "CU789123",
      customerName: "Rajesh Kumar Singh",
      email: "rajesh.kumar@example.com",
      phone: "+91 9876543210",
      documentType: "AADHAAR",
      documentNumber: "1234-5678-9012",
      frontImageUrl: "/placeholder-aadhaar-front.jpg",
      backImageUrl: "/placeholder-aadhaar-back.jpg",
      uploadedAt: "2024-11-30T10:30:00Z",
      status: "PENDING",
      extractedData: {
        name: "Rajesh Kumar Singh",
        fatherName: "Ram Kumar Singh",
        dateOfBirth: "15/05/1990",
        address: "123 MG Road, Mumbai, Maharashtra - 400001",
        gender: "MALE",
        documentNumber: "1234-5678-9012"
      },
      verificationChecks: {
        ocrMatch: true,
        faceMatch: false,
        documentAuthenticity: true,
        blacklistCheck: true,
        duplicateCheck: true,
        addressVerification: false
      },
      priority: "HIGH",
      assignedTo: "admin@laxmione.com",
      comments: [],
      riskScore: 25,
      complianceFlags: []
    },
    {
      id: "KYC002",
      userId: "USR002",
      customerId: "CU789124",
      customerName: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 9876543211",
      documentType: "PAN",
      documentNumber: "ABCDE1234F",
      frontImageUrl: "/placeholder-pan.jpg",
      uploadedAt: "2024-11-29T15:45:00Z",
      status: "UNDER_REVIEW",
      extractedData: {
        name: "Priya Sharma",
        fatherName: "Suresh Sharma",
        dateOfBirth: "22/08/1985",
        documentNumber: "ABCDE1234F"
      },
      verificationChecks: {
        ocrMatch: true,
        faceMatch: true,
        documentAuthenticity: true,
        blacklistCheck: true,
        duplicateCheck: false,
        addressVerification: true
      },
      priority: "URGENT",
      assignedTo: "admin2@laxmione.com",
      comments: [
        {
          id: "C001",
          author: "admin2@laxmione.com",
          message: "Duplicate PAN number found in system. Investigating further.",
          timestamp: "2024-11-29T16:30:00Z",
          type: "VERIFICATION"
        }
      ],
      riskScore: 65,
      complianceFlags: ["DUPLICATE_DOCUMENT", "MANUAL_REVIEW_REQUIRED"]
    },
    {
      id: "KYC003",
      userId: "USR003",
      customerId: "CU789125",
      customerName: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91 9876543212",
      documentType: "DRIVING_LICENSE",
      documentNumber: "MH14-2019-0012345",
      frontImageUrl: "/placeholder-dl-front.jpg",
      backImageUrl: "/placeholder-dl-back.jpg",
      uploadedAt: "2024-11-28T09:15:00Z",
      status: "REJECTED",
      verifiedBy: "admin@laxmione.com",
      verifiedAt: "2024-11-28T14:20:00Z",
      rejectionReason: "Document image quality is poor and text is not clearly visible",
      extractedData: {
        name: "Amit Patel",
        dateOfBirth: "10/12/1992",
        address: "789 Ring Road, Bangalore, Karnataka - 560001",
        documentNumber: "MH14-2019-0012345",
        issueDate: "15/03/2019",
        expiryDate: "14/03/2039"
      },
      verificationChecks: {
        ocrMatch: false,
        faceMatch: false,
        documentAuthenticity: false,
        blacklistCheck: true,
        duplicateCheck: true,
        addressVerification: true
      },
      priority: "MEDIUM",
      assignedTo: "admin@laxmione.com",
      comments: [
        {
          id: "C002",
          author: "admin@laxmione.com",
          message: "Document rejected due to poor image quality. Customer requested to re-upload.",
          timestamp: "2024-11-28T14:20:00Z",
          type: "REJECTION"
        }
      ],
      riskScore: 85,
      complianceFlags: ["POOR_QUALITY", "OCR_FAILED"]
    }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [documents, searchTerm, statusFilter, documentTypeFilter, priorityFilter, sortBy, sortOrder]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocuments(mockDocuments);
      } else {
        const response = await fetch('/api/admin/kyc/documents', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch KYC documents');
        }

        const result = await response.json();
        setDocuments(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDocuments(mockDocuments);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Document type filter
    if (documentTypeFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.documentType === documentTypeFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.priority === priorityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof KYCDocument];
      let bValue = b[sortBy as keyof KYCDocument];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setFilteredDocuments(filtered);
  };

  const handleDocumentAction = async (docId: string, action: 'verify' | 'reject' | 'request_reupload', comment?: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        setDocuments(documents.map(doc => {
          if (doc.id === docId) {
            const updatedDoc = {
              ...doc,
              status: action === 'verify' ? 'VERIFIED' as const : action === 'reject' ? 'REJECTED' as const : 'PENDING' as const,
              verifiedBy: action !== 'request_reupload' ? user?.email : undefined,
              verifiedAt: action !== 'request_reupload' ? new Date().toISOString() : undefined,
              rejectionReason: action === 'reject' ? comment : undefined
            };

            if (comment) {
              updatedDoc.comments = [...doc.comments, {
                id: `C${Date.now()}`,
                author: user?.email || 'admin',
                message: comment,
                timestamp: new Date().toISOString(),
                type: action === 'verify' ? 'VERIFICATION' as const : action === 'reject' ? 'REJECTION' as const : 'GENERAL' as const
              }];
            }

            return updatedDoc;
          }
          return doc;
        }));
      } else {
        const response = await fetch(`/api/admin/kyc/documents/${docId}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ action, comment })
        });

        if (!response.ok) {
          throw new Error('Failed to perform action');
        }

        fetchDocuments();
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (bulkSelection.length === 0) return;

    try {
      for (const docId of bulkSelection) {
        await handleDocumentAction(docId, action as any);
      }
      setBulkSelection([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'UNDER_REVIEW': return 'text-blue-600 bg-blue-100';
      case 'EXPIRED': return 'text-orange-600 bg-orange-100';
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

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
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
          <p className="mt-4 text-slate-400">Loading KYC documents...</p>
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
                <UserCheck className="w-8 h-8 text-purple-400" />
                KYC Verification
              </h1>
              <p className="text-slate-400 mt-1">
                {filteredDocuments.length} documents • {filteredDocuments.filter(d => d.status === 'PENDING').length} pending • {filteredDocuments.filter(d => d.status === 'UNDER_REVIEW').length} under review
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchDocuments}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                <Download className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, customer ID, or document number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100"
            >
              {KYC_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Document Type Filter */}
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100"
            >
              {DOCUMENT_TYPES.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100"
            >
              {PRIORITY_LEVELS.map(priority => (
                <option key={priority} value={priority}>Priority: {priority}</option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          {bulkSelection.length > 0 && (
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-purple-400">
                {bulkSelection.length} documents selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Bulk Verify
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Bulk Reject
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

        {/* Documents Table */}
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
                          setBulkSelection(filteredDocuments.map(d => d.id));
                        } else {
                          setBulkSelection([]);
                        }
                      }}
                      checked={bulkSelection.length === filteredDocuments.length}
                      className="rounded border-slate-600 bg-slate-800 text-purple-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => setSortBy('uploadedAt')}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                    >
                      Uploaded
                      {sortBy === 'uploadedAt' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredDocuments.map((doc) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkSelection([...bulkSelection, doc.id]);
                          } else {
                            setBulkSelection(bulkSelection.filter(id => id !== doc.id));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-800 text-purple-600"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {doc.customerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">{doc.customerName}</div>
                          <div className="text-sm text-slate-400">{doc.customerId}</div>
                          <div className="text-xs text-slate-500">{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-100">{doc.documentType.replace('_', ' ')}</div>
                      <div className="text-sm text-slate-400">{doc.documentNumber}</div>
                      {doc.complianceFlags.length > 0 && (
                        <div className="mt-1">
                          {doc.complianceFlags.map((flag, index) => (
                            <span key={index} className="inline-block mr-1 px-1 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(doc.uploadedAt).toLocaleTimeString()}
                      </div>
                      {doc.assignedTo && (
                        <div className="text-xs text-slate-500 mt-1">
                          Assigned: {doc.assignedTo.split('@')[0]}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                      {doc.verifiedAt && (
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(doc.verifiedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 ${getPriorityColor(doc.priority)}`}>
                        <Flag className="h-4 w-4" />
                        <span className="text-sm font-medium">{doc.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskScoreColor(doc.riskScore)}`}>
                        {doc.riskScore}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {doc.verificationChecks.ocrMatch ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        {doc.verificationChecks.faceMatch ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        {doc.verificationChecks.documentAuthenticity ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowDetails(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {doc.status === 'PENDING' || doc.status === 'UNDER_REVIEW' ? (
                          <>
                            <button
                              onClick={() => handleDocumentAction(doc.id, 'verify')}
                              className="text-green-400 hover:text-green-300 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDocumentAction(doc.id, 'reject', 'Document rejected for review')}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : null}

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

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No KYC documents found</h3>
              <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Details Modal */}
      <AnimatePresence>
        {showDetails && selectedDocument && (
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
                    <h2 className="text-2xl font-bold text-slate-100">{selectedDocument.customerName}</h2>
                    <p className="text-slate-400">{selectedDocument.documentType.replace('_', ' ')} • {selectedDocument.documentNumber}</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Document Images */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <Image className="h-5 w-5 text-blue-400" />
                      Document Images
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-400 mb-2 block">Front Side</label>
                        <div
                          className="glass-card border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                          onClick={() => setImagePreview({ url: selectedDocument.frontImageUrl, title: 'Front Side' })}
                        >
                          <div className="flex items-center justify-center h-32 bg-slate-800 rounded-lg">
                            <Camera className="h-8 w-8 text-slate-500" />
                            <span className="ml-2 text-slate-500">Click to view image</span>
                          </div>
                        </div>
                      </div>

                      {selectedDocument.backImageUrl && (
                        <div>
                          <label className="text-sm font-medium text-slate-400 mb-2 block">Back Side</label>
                          <div
                            className="glass-card border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                            onClick={() => setImagePreview({ url: selectedDocument.backImageUrl!, title: 'Back Side' })}
                          >
                            <div className="flex items-center justify-center h-32 bg-slate-800 rounded-lg">
                              <Camera className="h-8 w-8 text-slate-500" />
                              <span className="ml-2 text-slate-500">Click to view image</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Data */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      Extracted Data
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(selectedDocument.extractedData).map(([key, value]) => (
                        value && (
                          <div key={key}>
                            <label className="text-sm font-medium text-slate-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <p className="text-slate-100">{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                {/* Verification Checks */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Verification Checks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedDocument.verificationChecks).map(([check, passed]) => (
                      <div key={check} className="flex items-center justify-between p-3 glass-card border border-slate-700 rounded-lg">
                        <span className="text-sm text-slate-300 capitalize">
                          {check.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {passed ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Risk Assessment
                  </h3>
                  <div className="glass-card border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-300">Risk Score</span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRiskScoreColor(selectedDocument.riskScore)}`}>
                        {selectedDocument.riskScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${selectedDocument.riskScore >= 70 ? 'bg-red-500' : selectedDocument.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${selectedDocument.riskScore}%` }}
                      />
                    </div>
                    {selectedDocument.complianceFlags.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-400 mb-2">Compliance Flags:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.complianceFlags.map((flag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                              {flag.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments */}
                {selectedDocument.comments.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-orange-400" />
                      Comments ({selectedDocument.comments.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedDocument.comments.map((comment) => (
                        <div key={comment.id} className="p-4 glass-card border border-slate-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-100">{comment.author}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">{comment.message}</p>
                          <span className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                            comment.type === 'REJECTION' ? 'bg-red-500/20 text-red-400' :
                            comment.type === 'VERIFICATION' ? 'bg-green-500/20 text-green-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {comment.type}
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

                  {selectedDocument.status === 'PENDING' || selectedDocument.status === 'UNDER_REVIEW' ? (
                    <>
                      <button
                        onClick={() => {
                          handleDocumentAction(selectedDocument.id, 'request_reupload', 'Please re-upload with better quality');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Request Re-upload
                      </button>
                      <button
                        onClick={() => {
                          handleDocumentAction(selectedDocument.id, 'reject', 'Document rejected after review');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          handleDocumentAction(selectedDocument.id, 'verify', 'Document verified successfully');
                          setShowDetails(false);
                        }}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Verify Document
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {imagePreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700"
            >
              <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-100">{imagePreview.title}</h3>
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center h-96 bg-slate-800 rounded-lg">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-500">Document image would be displayed here</p>
                    <p className="text-xs text-slate-600 mt-2">{imagePreview.url}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}