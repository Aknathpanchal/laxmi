'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, FileText, FileSpreadsheet, FileCsv, Check, AlertCircle, Loader2
} from 'lucide-react';
import { exportData, PDFExporter, ExcelExporter, exportToCSV } from '@/lib/export-utils';
import { useNotifications } from '@/contexts/NotificationContext';

export interface ExportButtonProps {
  data: any;
  filename?: string;
  title?: string;
  variant?: 'button' | 'dropdown' | 'icon';
  className?: string;
  formats?: ('pdf' | 'excel' | 'csv')[];
  onExport?: (format: string) => void;
  preprocessData?: (data: any, format: string) => any;
}

export function ExportButton({
  data,
  filename = 'export',
  title = 'Export Data',
  variant = 'dropdown',
  className = '',
  formats = ['pdf', 'excel', 'csv'],
  onExport,
  preprocessData
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const formatIcons = {
    pdf: FileText,
    excel: FileSpreadsheet,
    csv: FileCsv
  };

  const formatLabels = {
    pdf: 'Export as PDF',
    excel: 'Export as Excel',
    csv: 'Export as CSV'
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setExporting(format);
    setIsOpen(false);

    try {
      // Preprocess data if needed
      const processedData = preprocessData ? preprocessData(data, format) : data;

      // Perform export
      await exportData(processedData, {
        filename,
        title,
        format,
        includeTimestamp: true
      });

      // Show success
      setSuccess(format);
      setTimeout(() => setSuccess(null), 3000);

      // Notify user
      addNotification({
        type: 'SUCCESS',
        title: 'Export Successful',
        message: `Data exported as ${format.toUpperCase()}`,
        priority: 'LOW'
      });

      // Callback
      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      console.error('Export error:', error);
      addNotification({
        type: 'ERROR',
        title: 'Export Failed',
        message: `Failed to export data as ${format.toUpperCase()}`,
        priority: 'HIGH'
      });
    } finally {
      setExporting(null);
    }
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleExport(formats[0])}
        disabled={exporting !== null}
        className={`p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors disabled:opacity-50 ${className}`}
      >
        {exporting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : success ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Download className="w-5 h-5" />
        )}
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleExport(formats[0])}
        disabled={exporting !== null}
        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 ${className}`}
      >
        {exporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : success ? (
          <>
            <Check className="w-4 h-4" />
            <span>Exported!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </>
        )}
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting !== null}
        className={`px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 ${className}`}
      >
        {exporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : success ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span>Exported!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="text-xs text-slate-400 px-3 py-2 font-medium">Export Format</p>
                {formats.map((format) => {
                  const Icon = formatIcons[format];
                  return (
                    <motion.button
                      key={format}
                      whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                      onClick={() => handleExport(format)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-slate-700/50 transition-colors"
                      disabled={exporting !== null}
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-white">{formatLabels[format]}</span>
                      {success === format && (
                        <Check className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick Export Buttons Component
export function QuickExportButtons({ data, filename = 'export', className = '' }: {
  data: any;
  filename?: string;
  className?: string;
}) {
  const [exporting, setExporting] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const handleQuickExport = async (format: 'pdf' | 'excel') => {
    setExporting(format);

    try {
      await exportData(data, {
        filename,
        format,
        includeTimestamp: true
      });

      addNotification({
        type: 'SUCCESS',
        title: `Exported to ${format.toUpperCase()}`,
        message: 'Download started',
        priority: 'LOW'
      });
    } catch (error) {
      addNotification({
        type: 'ERROR',
        title: 'Export Failed',
        message: 'Please try again',
        priority: 'HIGH'
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleQuickExport('pdf')}
        disabled={exporting !== null}
        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        title="Export as PDF"
      >
        {exporting === 'pdf' ? (
          <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
        ) : (
          <FileText className="w-4 h-4 text-red-500" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleQuickExport('excel')}
        disabled={exporting !== null}
        className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors disabled:opacity-50"
        title="Export as Excel"
      >
        {exporting === 'excel' ? (
          <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4 text-green-500" />
        )}
      </motion.button>
    </div>
  );
}