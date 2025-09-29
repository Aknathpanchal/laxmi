'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, FileText, Shield, Clock, CheckCircle, XCircle,
  AlertCircle, HelpCircle, Download, Share2, Trash2
} from 'lucide-react';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentViewer } from '@/components/documents/DocumentViewer';

export default function UserDocumentsPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('manage');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'identity'); // Auto-categorize based on file

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setRefreshList(prev => prev + 1); // Refresh document list
        setActiveTab('manage'); // Switch to manage tab
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Upload failed' };
    }
  };

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document.id);
    setIsViewerOpen(true);
  };

  const handleDownload = async (documentId: string) => {
    window.open(`/api/documents/download/${documentId}`, '_blank');
  };

  const handleShare = async (documentId: string) => {
    // Implement share functionality
    console.log('Share document:', documentId);
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRefreshList(prev => prev + 1); // Refresh list
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const requiredDocuments = [
    {
      category: 'Identity',
      documents: ['Aadhaar Card', 'PAN Card', 'Passport'],
      icon: '🆔',
      required: true
    },
    {
      category: 'Address',
      documents: ['Utility Bill', 'Rent Agreement', 'Bank Statement'],
      icon: '📍',
      required: true
    },
    {
      category: 'Income',
      documents: ['Salary Slips', 'Form 16', 'ITR'],
      icon: '💰',
      required: true
    },
    {
      category: 'Bank',
      documents: ['6 months statements', 'Passbook'],
      icon: '🏦',
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Document Management</h1>
          <p className="text-slate-400">Upload and manage your documents securely</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">12</span>
            </div>
            <p className="text-sm text-slate-400">Total Documents</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">8</span>
            </div>
            <p className="text-sm text-slate-400">Verified</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <p className="text-sm text-slate-400">Pending</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <p className="text-sm text-slate-400">Rejected</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Required Documents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-400" />
                Required Documents
              </h2>

              <div className="space-y-4">
                {requiredDocuments.map((category, index) => (
                  <div key={index} className="border-l-2 border-slate-700 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{category.icon}</span>
                        <h3 className="font-medium text-white">{category.category}</h3>
                      </div>
                      {category.required && (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {category.documents.map((doc, idx) => (
                        <li key={idx} className="text-sm text-slate-400 flex items-center">
                          <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mr-2" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-1">Need Help?</h4>
                    <p className="text-xs text-slate-400">
                      Contact our support team for assistance with document requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Security & Privacy
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-green-500/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Bank-grade Encryption</p>
                    <p className="text-xs text-slate-400">256-bit SSL encryption for all documents</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-green-500/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Secure Storage</p>
                    <p className="text-xs text-slate-400">Documents stored in encrypted vaults</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-green-500/20 rounded">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Access Control</p>
                    <p className="text-xs text-slate-400">Only authorized personnel can access</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Upload/Manage */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
              {/* Tabs */}
              <div className="flex border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'manage'
                      ? 'text-white bg-slate-700/50 border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Manage Documents
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'upload'
                      ? 'text-white bg-slate-700/50 border-b-2 border-blue-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload New
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'upload' ? (
                  <DocumentUploader
                    onUpload={handleUpload}
                    onSuccess={() => setActiveTab('manage')}
                  />
                ) : (
                  <DocumentList
                    key={refreshList} // Force refresh when needed
                    userId="current_user_id"
                    onDocumentClick={handleDocumentClick}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        documentId={selectedDocument || ''}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocument(null);
        }}
      />
    </div>
  );
}