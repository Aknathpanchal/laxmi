'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Image, File, Download, Share2, Eye, Trash2,
  CheckCircle, XCircle, Clock, Filter, Search, Calendar,
  ChevronLeft, ChevronRight, MoreVertical, Shield, Upload,
  FolderOpen, Grid, List
} from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  thumbnailUrl?: string;
  tags: string[];
  sharedWith: string[];
}

interface DocumentListProps {
  userId?: string;
  isAdmin?: boolean;
  onDocumentClick?: (document: Document) => void;
  onDownload?: (documentId: string) => void;
  onShare?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
  onVerify?: (documentId: string, status: 'verified' | 'rejected') => void;
}

export function DocumentList({
  userId,
  isAdmin = false,
  onDocumentClick,
  onDownload,
  onShare,
  onDelete,
  onVerify
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchDocuments();
  }, [userId, selectedCategory, selectedStatus, searchQuery, currentPage]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/documents/list?${params}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.documents);
        setTotalPages(data.pagination.totalPages);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-400" />;
      default:
        return <File className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const categories = [
    { id: 'identity', name: 'Identity', icon: '🆔' },
    { id: 'address', name: 'Address', icon: '📍' },
    { id: 'income', name: 'Income', icon: '💰' },
    { id: 'bank_statement', name: 'Bank', icon: '🏦' },
    { id: 'tax', name: 'Tax', icon: '📊' },
    { id: 'other', name: 'Other', icon: '📁' }
  ];

  const DocumentCard = ({ doc }: { doc: Document }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
      onClick={() => onDocumentClick?.(doc)}
    >
      {/* Thumbnail or Icon */}
      <div className="h-32 bg-slate-900 flex items-center justify-center relative">
        {doc.thumbnailUrl ? (
          <img
            src={doc.thumbnailUrl}
            alt={doc.fileName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-6">
            {getFileIcon(doc.fileType)}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full border ${getStatusColor(doc.status)} backdrop-blur-sm flex items-center space-x-1`}>
            {getStatusIcon(doc.status)}
            <span className="text-xs capitalize">{doc.status}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h4 className="font-medium text-white truncate mb-1">{doc.fileName}</h4>
        <p className="text-sm text-slate-400 mb-3">{formatFileSize(doc.fileSize)}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {doc.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-slate-700 text-xs text-slate-300 rounded"
            >
              {tag}
            </span>
          ))}
          {doc.tags.length > 3 && (
            <span className="text-xs text-slate-500">+{doc.tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <span className="text-xs text-slate-500">
            {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
          </span>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {doc.sharedWith.length > 0 && (
              <div className="p-1.5 bg-blue-500/10 rounded">
                <Share2 className="w-3 h-3 text-blue-400" />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDocument(doc.id);
              }}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && doc.status === 'pending' && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerify?.(doc.id, 'verified');
              }}
              className="flex-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded text-sm transition-colors"
            >
              Verify
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerify?.(doc.id, 'rejected');
              }}
              className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Action Menu */}
      <AnimatePresence>
        {selectedDocument === doc.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-16 right-4 bg-slate-700 rounded-lg shadow-xl border border-slate-600 py-1 z-10"
            onMouseLeave={() => setSelectedDocument(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(doc.id);
                setSelectedDocument(null);
              }}
              className="px-4 py-2 hover:bg-slate-600 text-sm text-white flex items-center space-x-2 w-full"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(doc.id);
                setSelectedDocument(null);
              }}
              className="px-4 py-2 hover:bg-slate-600 text-sm text-white flex items-center space-x-2 w-full"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(doc.id);
                setSelectedDocument(null);
              }}
              className="px-4 py-2 hover:bg-slate-600 text-sm text-red-400 flex items-center space-x-2 w-full"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const DocumentRow = ({ doc }: { doc: Document }) => (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-700 rounded">
            {getFileIcon(doc.fileType)}
          </div>
          <div>
            <p className="font-medium text-white">{doc.fileName}</p>
            <p className="text-sm text-slate-400">{doc.category}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-300">{formatFileSize(doc.fileSize)}</span>
      </td>
      <td className="px-4 py-3">
        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(doc.status)}`}>
          {getStatusIcon(doc.status)}
          <span className="text-xs capitalize">{doc.status}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-400">
          {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDownload?.(doc.id)}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => onShare?.(doc.id)}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => onDelete?.(doc.id)}
            className="p-1.5 hover:bg-slate-700 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
          {isAdmin && doc.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify?.(doc.id, 'verified')}
                className="p-1.5 hover:bg-green-500/20 rounded transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
              </button>
              <button
                onClick={() => onVerify?.(doc.id, 'rejected')}
                className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
              >
                <XCircle className="w-4 h-4 text-red-400" />
              </button>
            </>
          )}
        </div>
      </td>
    </motion.tr>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Documents</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your uploaded documents
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload New</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total</span>
            <FolderOpen className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-white">{statistics.total}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-400">Verified</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statistics.verified}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-yellow-400">Pending</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statistics.pending}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-400">Rejected</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{statistics.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus || ''}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg"
          >
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-slate-600' : ''}`}
          >
            <Grid className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-slate-600' : ''}`}
          >
            <List className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {documents.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Document</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Size</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Uploaded</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {documents.map(doc => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-slate-800 rounded-full inline-flex mb-4">
            <FolderOpen className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No documents found</h3>
          <p className="text-sm text-slate-400">Upload your first document to get started</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}