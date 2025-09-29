'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Image, File, X, Check, AlertCircle,
  Loader2, Shield, FileCheck, Cloud, HardDrive
} from 'lucide-react';

interface DocumentUploaderProps {
  category?: string;
  maxSize?: number;
  allowedTypes?: string[];
  onUpload: (file: File) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
}

export function DocumentUploader({
  category = 'other',
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  onUpload,
  onSuccess
}: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimeType === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    // Reset states
    setErrorMessage(null);
    setUploadStatus('idle');

    // Validate file size
    if (file.size > maxSize) {
      setErrorMessage(`File size exceeds ${formatFileSize(maxSize)}`);
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(`File type ${file.type} is not allowed`);
      return;
    }

    setSelectedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await onUpload(file);
      clearInterval(progressInterval);

      if (result.success) {
        setUploadProgress(100);
        setUploadStatus('success');
        setTimeout(() => {
          setSelectedFile(null);
          setUploadStatus('idle');
          setUploadProgress(0);
          onSuccess?.();
        }, 2000);
      } else {
        setUploadStatus('error');
        setErrorMessage(result.error || 'Upload failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      setErrorMessage('Upload failed. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!selectedFile && (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
          animate={{
            scale: isDragging ? 1.02 : 1,
            borderColor: isDragging ? '#3B82F6' : '#475569'
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <Cloud className="w-10 h-10 text-blue-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Document
              </h3>
              <p className="text-sm text-slate-400">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Max size: {formatFileSize(maxSize)} • Formats: PDF, JPEG, PNG
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure upload</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileCheck className="w-4 h-4" />
                <span>Auto verification</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected File */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                uploadStatus === 'success' ? 'bg-green-500/20' :
                uploadStatus === 'error' ? 'bg-red-500/20' :
                'bg-blue-500/20'
              }`}>
                {uploadStatus === 'uploading' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                {uploadStatus === 'success' && <Check className="w-5 h-5 text-green-500" />}
                {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {uploadStatus === 'idle' && getFileIcon(selectedFile.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white">{selectedFile.name}</p>
                    <p className="text-sm text-slate-400">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  {uploadStatus !== 'uploading' && (
                    <button
                      onClick={handleRemoveFile}
                      className="p-1 hover:bg-slate-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {uploadStatus === 'uploading' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400">Uploading...</span>
                      <span className="text-slate-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Scanning for viruses and verifying document...
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {uploadStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-green-400"
                  >
                    Document uploaded successfully!
                  </motion.div>
                )}

                {/* Error Message */}
                {uploadStatus === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Tips */}
      <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
          <div className="text-xs text-slate-300">
            <p className="font-medium mb-1">Upload Guidelines:</p>
            <ul className="space-y-0.5 text-slate-400">
              <li>• Ensure documents are clear and legible</li>
              <li>• All pages must be included for multi-page documents</li>
              <li>• Sensitive information will be encrypted</li>
              <li>• Documents are automatically backed up</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}