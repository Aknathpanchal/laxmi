'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiCalendar,
  FiFilter,
  FiPieChart,
  FiBarChart2,
  FiFileText,
  FiPrinter,
  FiMail,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';

interface FinancialReport {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  period: string;
  status: 'draft' | 'generated' | 'approved' | 'published';
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  sections: string[];
}

export default function FinancialReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [generating, setGenerating] = useState(false);

  // Predefined report templates
  const reportTemplates = [
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Comprehensive P&L analysis with revenue and expense breakdown',
      icon: FiDollarSign,
      color: 'green'
    },
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity position',
      icon: FiBarChart2,
      color: 'blue'
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Operating, investing, and financing activities',
      icon: FiTrendingUp,
      color: 'purple'
    },
    {
      id: 'budget-variance',
      name: 'Budget Variance Analysis',
      description: 'Actual vs budget comparison with variance analysis',
      icon: FiPieChart,
      color: 'orange'
    }
  ];

  // Mock recent reports
  const mockReports: FinancialReport[] = [
    {
      id: 'FIN001',
      name: 'Monthly Financial Report - January 2024',
      type: 'monthly',
      period: 'January 2024',
      status: 'published',
      generatedAt: '2024-02-01T10:00:00Z',
      generatedBy: 'admin@laxmione.com',
      fileSize: '2.4 MB',
      sections: ['P&L', 'Balance Sheet', 'Cash Flow', 'Ratios']
    },
    {
      id: 'FIN002',
      name: 'Q4 2023 Financial Report',
      type: 'quarterly',
      period: 'Q4 2023',
      status: 'approved',
      generatedAt: '2024-01-15T14:30:00Z',
      generatedBy: 'finance@laxmione.com',
      fileSize: '4.8 MB',
      sections: ['P&L', 'Balance Sheet', 'Cash Flow', 'Budget Analysis', 'YoY Comparison']
    },
    {
      id: 'FIN003',
      name: 'Annual Financial Report 2023',
      type: 'annual',
      period: '2023',
      status: 'published',
      generatedAt: '2024-01-05T09:00:00Z',
      generatedBy: 'cfo@laxmione.com',
      fileSize: '12.6 MB',
      sections: ['P&L', 'Balance Sheet', 'Cash Flow', 'Audit Report', 'Director Report']
    }
  ];

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const handleGenerateReport = async (templateId: string) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'financial',
          template: templateId,
          range: reportType === 'custom' ? 'custom' : `last-${reportType}`,
          format: 'pdf',
          includeCharts: true,
          includeRawData: true,
          dateRange: reportType === 'custom' ? dateRange : undefined
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial_report_${templateId}_${Date.now()}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (report: FinancialReport) => {
    // Mock download
    console.log('Downloading report:', report.id);
    alert(`Downloading ${report.name}...`);
  };

  const handleEmailReport = async (report: FinancialReport) => {
    // Mock email
    console.log('Emailing report:', report.id);
    alert(`Emailing ${report.name}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50';
      case 'approved': return 'text-blue-600 bg-blue-50';
      case 'generated': return 'text-yellow-600 bg-yellow-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Reports</h1>
          <p className="text-gray-600">Generate and manage financial reports</p>
        </div>

        {/* Report Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Generate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => !generating && handleGenerateReport(template.id)}
              >
                <div className={`p-3 rounded-lg bg-${template.color}-50 w-fit mb-4`}>
                  <template.icon className={`text-${template.color}-500`} size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg text-white transition-colors ${
                    generating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : `bg-${template.color}-500 hover:bg-${template.color}-600`
                  }`}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Custom Report Generator */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom Period</option>
            </select>

            {reportType === 'custom' && (
              <>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </>
            )}

            <button
              onClick={() => handleGenerateReport('custom')}
              disabled={generating}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {generating ? 'Generating...' : 'Generate Custom Report'}
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <FiFilter />
                Filter
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <FiCalendar />
                Schedule
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Report Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Period</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Generated</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FiFileText className="text-gray-400" />
                        <span className="font-medium">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-3 capitalize">{report.type}</td>
                    <td className="py-3">{report.period}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm">{report.fileSize}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="text-blue-500 hover:text-blue-600"
                          title="Download"
                        >
                          <FiDownload />
                        </button>
                        <button
                          onClick={() => handleEmailReport(report)}
                          className="text-green-500 hover:text-green-600"
                          title="Email"
                        >
                          <FiMail />
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-600"
                          title="Print"
                        >
                          <FiPrinter />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Details Modal */}
          {selectedReport && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{selectedReport.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Generated By:</span>
                  <p className="font-medium">{selectedReport.generatedBy}</p>
                </div>
                <div>
                  <span className="text-gray-500">Sections:</span>
                  <p className="font-medium">{selectedReport.sections.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  View Report
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}