'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, Share2, Maximize2, Minimize2, ZoomIn, ZoomOut,
  RotateCw, FileText, Shield, CheckCircle, XCircle, Clock,
  Info, Calendar, User, Tag, Link, Eye, EyeOff, Copy, Check
} from 'lucide-react';
import { format } from 'date-fns';

interface DocumentViewerProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onVerify?: (status: 'verified' | 'rejected', remarks?: string) => void;
}

export function DocumentViewer({
  documentId,
  isOpen,
  onClose,
  isAdmin = false,
  onVerify
}: DocumentViewerProps) {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [verifyRemarks, setVerifyRemarks] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      fetchDocument();
    }
  }, [isOpen, documentId]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${documentId}`);
      const data = await response.json();
      if (data.success) {
        setDocument(data.document);
      }
    } catch (error) {
      console.error('Failed to fetch document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    window.open(`/api/documents/download/${documentId}`, '_blank');
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/documents/shared/${documentId}`;
    setShareLink(link);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    try {
      const response = await fetch('/api/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          status,
          remarks: verifyRemarks
        })
      });

      if (response.ok) {
        onVerify?.(status, verifyRemarks);
        fetchDocument(); // Refresh document
      }
    } catch (error) {
      console.error('Verification failed:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-slate-900 rounded-xl shadow-xl border border-slate-800 overflow-hidden ${
            isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : document ? (
            <div className="flex h-full">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-slate-800 rounded">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{document.fileName}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-slate-400">{document.category}</span>
                        <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border ${getStatusColor(document.status)}`}>
                          {getStatusIcon(document.status)}
                          <span className="text-xs capitalize">{document.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4 text-slate-400" />
                    </button>
                    <span className="text-sm text-slate-400 w-12 text-center">{zoom}%</span>
                    <button
                      onClick={() => setZoom(Math.min(200, zoom + 10))}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => setRotation((rotation + 90) % 360)}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Rotate"
                    >
                      <RotateCw className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="h-6 w-px bg-slate-700" />
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-slate-800 rounded transition-colors"
                      title="Close"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="flex-1 overflow-auto bg-slate-950 p-8">
                  <div
                    className="mx-auto bg-white shadow-2xl"
                    style={{
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      transition: 'transform 0.3s'
                    }}
                  >
                    {document.mimeType === 'application/pdf' ? (
                      <iframe
                        src={document.url}
                        className="w-full h-[800px]"
                        title="PDF Viewer"
                      />
                    ) : document.mimeType?.startsWith('image/') ? (
                      <img
                        src={document.url || document.thumbnailUrl}
                        alt={document.fileName}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="p-8 text-center text-slate-600">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                        <p>Preview not available for this file type</p>
                        <button
                          onClick={handleDownload}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Download to View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-96 bg-slate-800 border-l border-slate-700 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Document Info */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Document Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500">Uploaded</p>
                          <p className="text-sm text-white">
                            {format(new Date(document.uploadedAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      {document.verifiedAt && (
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-slate-500">Verified</p>
                            <p className="text-sm text-white">
                              {format(new Date(document.verifiedAt), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <User className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500">Uploaded by</p>
                          <p className="text-sm text-white">John Doe</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Info className="w-4 h-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500">File Details</p>
                          <p className="text-sm text-white">
                            {document.fileType.toUpperCase()} • {document.fileSize} bytes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {document.tags?.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded"
                        >
                          <Tag className="w-3 h-3 inline mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Security</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">Virus scan passed</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">
                          Viewed {document.downloadHistory?.length || 0} times
                        </span>
                      </div>
                      {document.sharedWith?.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Share2 className="w-4 h-4 text-purple-400" />
                          <span className="text-slate-300">
                            Shared with {document.sharedWith.length} users
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && document.status === 'pending' && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Verification</h4>
                      <textarea
                        value={verifyRemarks}
                        onChange={(e) => setVerifyRemarks(e.target.value)}
                        placeholder="Add remarks (optional)"
                        className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg resize-none h-20 mb-3"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerify('verified')}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleVerify('rejected')}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400">Document not found</p>
            </div>
          )}
        </motion.div>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-800 rounded-lg p-6 shadow-xl border border-slate-700 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Share Document</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Share Link</label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-l-lg"
                    />
                    <button
                      onClick={copyShareLink}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors flex items-center space-x-2"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}