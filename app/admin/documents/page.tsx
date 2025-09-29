'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Shield, Users, Clock, CheckCircle, XCircle,
  AlertTriangle, TrendingUp, Search, Filter, Download,
  RefreshCw, BarChart3, PieChart, Activity
} from 'lucide-react';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { format } from 'date-fns';

export default function AdminDocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statistics, setStatistics] = useState({
    total: 156,
    verified: 98,
    pending: 42,
    rejected: 16,
    todayUploads: 12,
    weeklyGrowth: 15
  });

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document.id);
    setIsViewerOpen(true);
  };

  const handleVerify = async (documentId: string, status: 'verified' | 'rejected') => {
    try {
      const response = await fetch('/api/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, status })
      });

      if (response.ok) {
        setRefreshList(prev => prev + 1);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleDownload = async (documentId: string) => {
    window.open(`/api/documents/download/${documentId}`, '_blank');
  };

  const handleExportReport = () => {
    // Export comprehensive report
    console.log('Exporting document report...');
  };

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'uploaded',
      document: 'Aadhaar Card',
      time: '2 minutes ago',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'verified',
      document: 'Income Certificate',
      time: '15 minutes ago',
      status: 'verified'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'rejected',
      document: 'Bank Statement',
      time: '1 hour ago',
      status: 'rejected'
    }
  ];

  const verificationQueue = [
    { id: 1, user: 'Alice Brown', document: 'PAN Card', urgency: 'high', age: '2 hours' },
    { id: 2, user: 'Bob Wilson', document: 'Salary Slip', urgency: 'medium', age: '5 hours' },
    { id: 3, user: 'Carol White', document: 'Address Proof', urgency: 'low', age: '1 day' }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Document Management</h1>
              <p className="text-slate-400">Review and verify user documents</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRefreshList(prev => prev + 1)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-slate-300" />
              </button>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{statistics.total}</p>
            <p className="text-sm text-slate-400">Total Documents</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{statistics.verified}</p>
            <p className="text-sm text-slate-400">Verified</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{statistics.pending}</p>
            <p className="text-sm text-slate-400">Pending Review</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{statistics.rejected}</p>
            <p className="text-sm text-slate-400">Rejected</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{statistics.todayUploads}</p>
            <p className="text-sm text-slate-400">Today's Uploads</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">+{statistics.weeklyGrowth}%</p>
            <p className="text-sm text-slate-400">Weekly Growth</p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Verification Queue & Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Verification Queue */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Verification Queue
                </h2>
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                  {verificationQueue.length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {verificationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm">{item.user}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                        item.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-600 text-slate-400'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{item.document}</p>
                    <p className="text-xs text-slate-500 mt-1">Uploaded {item.age} ago</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm">
                View All Pending
              </button>
            </div>

            {/* Recent Activities */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Recent Activities
              </h2>

              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded ${
                      activity.status === 'verified' ? 'bg-green-500/20' :
                      activity.status === 'rejected' ? 'bg-red-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {activity.status === 'verified' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : activity.status === 'rejected' ? (
                        <XCircle className="w-4 h-4 text-red-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-slate-400">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.document}</span>
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Compliance Status
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">KYC Completion</span>
                    <span className="text-sm font-medium text-white">78%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Document Verification</span>
                    <span className="text-sm font-medium text-white">63%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '63%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">AML Checks</span>
                    <span className="text-sm font-medium text-white">92%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Document List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
              <div className="p-6">
                <DocumentList
                  key={refreshList}
                  isAdmin={true}
                  onDocumentClick={handleDocumentClick}
                  onDownload={handleDownload}
                  onVerify={handleVerify}
                />
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
        isAdmin={true}
        onVerify={(status) => {
          handleVerify(selectedDocument!, status);
          setIsViewerOpen(false);
        }}
      />
    </div>
  );
}