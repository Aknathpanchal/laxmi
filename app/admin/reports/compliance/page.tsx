'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiDownload,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiFilter,
  FiMail,
  FiPrinter
} from 'react-icons/fi';

interface ComplianceReport {
  id: string;
  title: string;
  type: 'rbi' | 'kyc' | 'aml' | 'audit' | 'tax' | 'custom';
  period: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'overdue';
  complianceScore: number;
  issues: number;
  resolvedIssues: number;
  submittedBy?: string;
  submittedAt?: string;
  regulatoryBody: string;
}

interface ComplianceMetric {
  name: string;
  value: number;
  target: number;
  status: 'compliant' | 'warning' | 'non_compliant';
  trend: 'up' | 'down' | 'stable';
}

export default function ComplianceReportsPage() {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [filterType, setFilterType] = useState('all');

  // Mock compliance reports
  const mockReports: ComplianceReport[] = [
    {
      id: 'COMP001',
      title: 'Quarterly RBI Compliance Report',
      type: 'rbi',
      period: 'Q4 2023',
      dueDate: '2024-01-31',
      status: 'submitted',
      complianceScore: 94,
      issues: 2,
      resolvedIssues: 18,
      submittedBy: 'compliance@laxmione.com',
      submittedAt: '2024-01-25',
      regulatoryBody: 'Reserve Bank of India'
    },
    {
      id: 'COMP002',
      title: 'Monthly KYC Compliance Report',
      type: 'kyc',
      period: 'January 2024',
      dueDate: '2024-02-05',
      status: 'in_progress',
      complianceScore: 98,
      issues: 1,
      resolvedIssues: 45,
      regulatoryBody: 'RBI - KYC Division'
    },
    {
      id: 'COMP003',
      title: 'AML/CFT Annual Report',
      type: 'aml',
      period: '2023',
      dueDate: '2024-03-31',
      status: 'pending',
      complianceScore: 91,
      issues: 5,
      resolvedIssues: 32,
      regulatoryBody: 'Financial Intelligence Unit'
    },
    {
      id: 'COMP004',
      title: 'Internal Audit Report',
      type: 'audit',
      period: 'H2 2023',
      dueDate: '2024-01-15',
      status: 'approved',
      complianceScore: 89,
      issues: 0,
      resolvedIssues: 12,
      submittedBy: 'audit@laxmione.com',
      submittedAt: '2024-01-10',
      regulatoryBody: 'Internal Audit Committee'
    },
    {
      id: 'COMP005',
      title: 'GST Compliance Report',
      type: 'tax',
      period: 'December 2023',
      dueDate: '2024-01-20',
      status: 'overdue',
      complianceScore: 85,
      issues: 3,
      resolvedIssues: 8,
      regulatoryBody: 'GST Department'
    }
  ];

  // Mock compliance metrics
  const mockMetrics: ComplianceMetric[] = [
    {
      name: 'Overall Compliance Score',
      value: 92,
      target: 95,
      status: 'warning',
      trend: 'up'
    },
    {
      name: 'KYC Completion Rate',
      value: 98.5,
      target: 99,
      status: 'compliant',
      trend: 'up'
    },
    {
      name: 'AML Screening',
      value: 100,
      target: 100,
      status: 'compliant',
      trend: 'stable'
    },
    {
      name: 'Regulatory Filing Timeliness',
      value: 87,
      target: 100,
      status: 'warning',
      trend: 'down'
    },
    {
      name: 'Data Protection Compliance',
      value: 94,
      target: 95,
      status: 'warning',
      trend: 'up'
    },
    {
      name: 'Capital Adequacy Ratio',
      value: 15.2,
      target: 15,
      status: 'compliant',
      trend: 'up'
    }
  ];

  useEffect(() => {
    setReports(mockReports);
    setMetrics(mockMetrics);
    setLoading(false);
  }, []);

  const handleGenerateReport = async (type: string) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'compliance',
          subType: type,
          range: 'last30days',
          format: 'pdf',
          includeCharts: true
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance_report_${type}_${Date.now()}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleSubmitReport = async (report: ComplianceReport) => {
    console.log('Submitting report:', report.id);
    alert(`Submitting ${report.title} to ${report.regulatoryBody}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <FiCheckCircle className="text-green-500" />;
      case 'warning': return <FiAlertCircle className="text-yellow-500" />;
      case 'non_compliant': return <FiXCircle className="text-red-500" />;
      default: return null;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReports = filterType === 'all'
    ? reports
    : reports.filter(r => r.type === filterType);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Compliance Reports</h1>
          <p className="text-gray-600">Regulatory compliance tracking and reporting</p>
        </div>

        {/* Compliance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{metric.name}</span>
                {getStatusIcon(metric.status)}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}{metric.name.includes('Rate') || metric.name.includes('Ratio') ? '%' : ''}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Target: {metric.target}</span>
                {metric.trend === 'up' && <FiTrendingUp className="text-green-500" size={14} />}
                {metric.trend === 'down' && <FiTrendingUp className="text-red-500 rotate-180" size={14} />}
                {metric.trend === 'stable' && <FiActivity className="text-gray-500" size={14} />}
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      metric.status === 'compliant' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleGenerateReport('rbi')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all flex flex-col items-center"
          >
            <FiShield className="text-blue-500 mb-3" size={32} />
            <span className="font-semibold text-gray-900">RBI Report</span>
            <span className="text-xs text-gray-500 mt-1">Generate Now</span>
          </button>

          <button
            onClick={() => handleGenerateReport('kyc')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all flex flex-col items-center"
          >
            <FiFileText className="text-green-500 mb-3" size={32} />
            <span className="font-semibold text-gray-900">KYC Report</span>
            <span className="text-xs text-gray-500 mt-1">Generate Now</span>
          </button>

          <button
            onClick={() => handleGenerateReport('aml')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all flex flex-col items-center"
          >
            <FiAlertCircle className="text-orange-500 mb-3" size={32} />
            <span className="font-semibold text-gray-900">AML Report</span>
            <span className="text-xs text-gray-500 mt-1">Generate Now</span>
          </button>

          <button
            onClick={() => handleGenerateReport('audit')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all flex flex-col items-center"
          >
            <FiCheckCircle className="text-purple-500 mb-3" size={32} />
            <span className="font-semibold text-gray-900">Audit Report</span>
            <span className="text-xs text-gray-500 mt-1">Generate Now</span>
          </button>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Compliance Reports</h2>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="rbi">RBI</option>
                <option value="kyc">KYC</option>
                <option value="aml">AML</option>
                <option value="audit">Audit</option>
                <option value="tax">Tax</option>
              </select>
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
                  <th className="pb-3">Report</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Period</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Compliance</th>
                  <th className="pb-3">Issues</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr
                    key={report.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-500">{report.regulatoryBody}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="uppercase text-xs font-semibold text-gray-600">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{report.period}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <FiClock className="text-gray-400" size={14} />
                        <span className="text-sm">
                          {new Date(report.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getComplianceColor(report.complianceScore)}`}>
                          {report.complianceScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        <span className="text-red-600 font-semibold">{report.issues}</span>
                        <span className="text-gray-400"> / </span>
                        <span className="text-green-600">{report.resolvedIssues}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {(report.status === 'pending' || report.status === 'in_progress') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmitReport(report);
                            }}
                            className="text-blue-500 hover:text-blue-600"
                            title="Submit"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateReport(report.type);
                          }}
                          className="text-green-500 hover:text-green-600"
                          title="Download"
                        >
                          <FiDownload />
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-600"
                          title="Email"
                        >
                          <FiMail />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Report Details */}
          {selectedReport && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{selectedReport.title}</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Regulatory Body:</span>
                  <p className="font-medium">{selectedReport.regulatoryBody}</p>
                </div>
                {selectedReport.submittedBy && (
                  <div>
                    <span className="text-gray-500">Submitted By:</span>
                    <p className="font-medium">{selectedReport.submittedBy}</p>
                  </div>
                )}
                {selectedReport.submittedAt && (
                  <div>
                    <span className="text-gray-500">Submitted On:</span>
                    <p className="font-medium">
                      {new Date(selectedReport.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleGenerateReport(selectedReport.type)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Download Report
                </button>
                {(selectedReport.status === 'pending' || selectedReport.status === 'in_progress') && (
                  <button
                    onClick={() => handleSubmitReport(selectedReport)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Submit to Regulator
                  </button>
                )}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}