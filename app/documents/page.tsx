'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FiFileText, FiDownload, FiUpload, FiTrash2, FiEye,
  FiFolder, FiFolderPlus, FiSearch, FiFilter, FiGrid,
  FiList, FiCheck, FiX, FiAlertCircle, FiLock,
  FiUnlock, FiShare2, FiCopy, FiMoreVertical,
  FiCalendar, FiClock, FiFile, FiImage
} from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';
// import { documentService } from '@/lib/api/document.service';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: string;
  status: 'verified' | 'pending' | 'rejected';
  encrypted: boolean;
  shared: boolean;
  thumbnail?: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

export default function DocumentVaultPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories: Category[] = [
    { id: 'all', name: 'All Documents', icon: FiFolder, count: 24, color: 'blue' },
    { id: 'identity', name: 'Identity Proof', icon: FiFileText, count: 5, color: 'green' },
    { id: 'address', name: 'Address Proof', icon: FiFileText, count: 3, color: 'purple' },
    { id: 'income', name: 'Income Documents', icon: FiFileText, count: 8, color: 'orange' },
    { id: 'bank', name: 'Bank Statements', icon: FiFileText, count: 4, color: 'red' },
    { id: 'property', name: 'Property Papers', icon: FiFileText, count: 2, color: 'indigo' },
    { id: 'other', name: 'Other', icon: FiFileText, count: 2, color: 'gray' }
  ];

  // Mock documents data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Aadhaar Card.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      category: 'identity',
      status: 'verified',
      encrypted: true,
      shared: false
    },
    {
      id: '2',
      name: 'PAN Card.pdf',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      category: 'identity',
      status: 'verified',
      encrypted: true,
      shared: false
    },
    {
      id: '3',
      name: 'Salary Slip Jan 2024.pdf',
      type: 'PDF',
      size: '845 KB',
      uploadDate: '2024-02-01',
      category: 'income',
      status: 'verified',
      encrypted: false,
      shared: true
    },
    {
      id: '4',
      name: 'Bank Statement Q4 2023.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-10',
      category: 'bank',
      status: 'pending',
      encrypted: true,
      shared: false
    },
    {
      id: '5',
      name: 'Electricity Bill.jpg',
      type: 'Image',
      size: '1.2 MB',
      uploadDate: '2024-01-20',
      category: 'address',
      status: 'verified',
      encrypted: false,
      shared: false,
      thumbnail: '/api/placeholder/100/100'
    },
    {
      id: '6',
      name: 'Property Agreement.pdf',
      type: 'PDF',
      size: '5.6 MB',
      uploadDate: '2024-01-05',
      category: 'property',
      status: 'rejected',
      encrypted: true,
      shared: false
    }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // const response = await documentService.getDocuments();
      // if (response.success && response.data) {
      //   setDocuments(response.data);
      // } else {
      //   // Use mock data as fallback
      //   setDocuments(mockDocuments);
      // }
    } catch (error) {
      // Use mock data as fallback
      setDocuments(mockDocuments);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Upload logic here
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add new document to list
      const newDoc: Document = {
        id: Date.now().toString(),
        name: files[0].name,
        type: files[0].type.includes('image') ? 'Image' : 'PDF',
        size: `${(files[0].size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'other',
        status: 'pending',
        encrypted: false,
        shared: false
      };

      setDocuments(prev => [newDoc, ...prev]);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'download':
        // Download selected documents
        break;
      case 'delete':
        setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
        setSelectedDocuments([]);
        break;
      case 'share':
        // Share selected documents
        break;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return FiFileText;
      case 'Image':
        return FiImage;
      default:
        return FiFile;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Vault</h1>
              <p className="text-gray-600 mt-2">Securely store and manage your documents</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiUpload />
              Upload Document
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <FiFileText className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">18</p>
              </div>
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">42.5 MB</p>
              </div>
              <FiFolder className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Encrypted</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <FiLock className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2 border rounded-lg hover:bg-gray-50"
                  >
                    {viewMode === 'grid' ? <FiList /> : <FiGrid />}
                  </button>
                  <button className="p-2 border rounded-lg hover:bg-gray-50">
                    <FiFilter />
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedDocuments.length > 0 && (
                <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-blue-600">
                    {selectedDocuments.length} document(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction('download')}
                      className="px-3 py-1 text-sm bg-white text-gray-700 rounded hover:bg-gray-50"
                    >
                      <FiDownload className="inline mr-1" /> Download
                    </button>
                    <button
                      onClick={() => handleBulkAction('share')}
                      className="px-3 py-1 text-sm bg-white text-gray-700 rounded hover:bg-gray-50"
                    >
                      <FiShare2 className="inline mr-1" /> Share
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FiTrash2 className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Documents Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map(doc => {
                    const FileIcon = getFileIcon(doc.type);
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(doc.id)}
                            onChange={() => handleDocumentSelect(doc.id)}
                            className="mt-1"
                          />
                          <div className="flex gap-2">
                            {doc.encrypted && <FiLock className="text-orange-500" />}
                            {doc.shared && <FiShare2 className="text-blue-500" />}
                          </div>
                        </div>

                        <div className="flex flex-col items-center mb-3">
                          {doc.thumbnail ? (
                            <img
                              src={doc.thumbnail}
                              alt={doc.name}
                              className="w-20 h-20 object-cover rounded mb-2"
                            />
                          ) : (
                            <FileIcon className="w-12 h-12 text-gray-400 mb-2" />
                          )}
                          <h4 className="text-sm font-medium text-center truncate w-full">
                            {doc.name}
                          </h4>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span>{doc.size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{doc.uploadDate}</span>
                          </div>
                          <div className="flex justify-center mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between mt-3 pt-3 border-t">
                          <button className="text-blue-600 hover:text-blue-700">
                            <FiEye />
                          </button>
                          <button className="text-blue-600 hover:text-blue-700">
                            <FiDownload />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <FiTrash2 />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.length === filteredDocuments.length}
                            onChange={() => {
                              if (selectedDocuments.length === filteredDocuments.length) {
                                setSelectedDocuments([]);
                              } else {
                                setSelectedDocuments(filteredDocuments.map(d => d.id));
                              }
                            }}
                          />
                        </th>
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Type</th>
                        <th className="text-left py-3 px-2">Size</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map(doc => {
                        const FileIcon = getFileIcon(doc.type);
                        return (
                          <tr key={doc.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(doc.id)}
                                onChange={() => handleDocumentSelect(doc.id)}
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <FileIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{doc.name}</span>
                                <div className="flex gap-1">
                                  {doc.encrypted && <FiLock className="text-orange-500 w-3 h-3" />}
                                  {doc.shared && <FiShare2 className="text-blue-500 w-3 h-3" />}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-600">{doc.type}</td>
                            <td className="py-3 px-2 text-gray-600">{doc.size}</td>
                            <td className="py-3 px-2 text-gray-600">{doc.uploadDate}</td>
                            <td className="py-3 px-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <button className="text-blue-600 hover:text-blue-700">
                                  <FiEye />
                                </button>
                                <button className="text-blue-600 hover:text-blue-700">
                                  <FiDownload />
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Upload Document</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your files here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      multiple
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
                  </p>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}