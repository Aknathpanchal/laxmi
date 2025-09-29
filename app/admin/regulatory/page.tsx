'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Shield, AlertTriangle, CheckCircle, Clock,
  Calendar, Upload, Download, TrendingUp, AlertCircle,
  BarChart3, PieChart, Activity, Target, Award, XCircle,
  FileCheck, FileClock, FileX, ChevronRight, Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface Report {
  id: string;
  name: string;
  type: string;
  status: 'submitted' | 'pending' | 'in-progress' | 'overdue';
  dueDate: string;
  submittedDate: string | null;
  period: string;
  submittedBy: string | null;
}

interface Audit {
  id: string;
  type: string;
  date: string;
  status: string;
  findings: number;
  critical: number;
  resolved: number;
}

export default function RegulatoryReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'compliance' | 'audits' | 'penalties'>('reports');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [compliance, setCompliance] = useState({
    kycCompliance: 0,
    amlCompliance: 0,
    dataPrivacy: 0,
    fairPractices: 0,
    overall: 0
  });
  const [summary, setSummary] = useState({
    upcomingReports: 0,
    overdueReports: 0,
    complianceScore: 0,
    recentAudits: 0,
    totalPenalties: 0,
    pendingFilings: 0
  });

  useEffect(() => {
    fetchRegulatoryData();
  }, []);

  const fetchRegulatoryData = async () => {
    try {
      setLoading(true);

      // Fetch summary
      const summaryRes = await fetch('/api/admin/regulatory?type=summary');
      const summaryData = await summaryRes.json();
      if (summaryData.success) {
        setSummary(summaryData.data);
      }

      // Fetch reports
      const reportsRes = await fetch('/api/admin/regulatory?type=reports');
      const reportsData = await reportsRes.json();
      if (reportsData.success) {
        setReports(reportsData.data.reports);
      }

      // Fetch compliance
      const complianceRes = await fetch('/api/admin/regulatory?type=compliance');
      const complianceData = await complianceRes.json();
      if (complianceData.success) {
        setCompliance(complianceData.data.compliance);
      }

      // Fetch audits
      const auditsRes = await fetch('/api/admin/regulatory?type=audits');
      const auditsData = await auditsRes.json();
      if (auditsData.success) {
        setAudits(auditsData.data.audits);
      }
    } catch (error) {
      console.error('Failed to fetch regulatory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-700 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <FileClock className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const reportTypes = [
    { id: 'RBI', name: 'RBI Reports', color: 'bg-blue-500' },
    { id: 'MCA', name: 'MCA Filings', color: 'bg-purple-500' },
    { id: 'GST', name: 'GST Returns', color: 'bg-green-500' },
    { id: 'TDS', name: 'TDS Returns', color: 'bg-yellow-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-white mb-2">Regulatory Compliance</h1>
              <p className="text-slate-400">Manage regulatory reports and compliance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Submit Report</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
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
            <p className="text-2xl font-bold text-white">{summary.pendingFilings}</p>
            <p className="text-sm text-slate-400">Pending Filings</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.overdueReports}</p>
            <p className="text-sm text-slate-400">Overdue</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.complianceScore}%</p>
            <p className="text-sm text-slate-400">Compliance Score</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileCheck className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.recentAudits}</p>
            <p className="text-sm text-slate-400">Recent Audits</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.upcomingReports}</p>
            <p className="text-sm text-slate-400">Due This Month</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.totalPenalties}</p>
            <p className="text-sm text-slate-400">Penalties</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
          {['reports', 'compliance', 'audits', 'penalties'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Reports List */}
              <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">Regulatory Reports</h3>
                </div>
                <div className="p-4 space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          reportTypes.find(t => t.id === report.type)?.color || 'bg-slate-600'
                        }/20`}>
                          {getStatusIcon(report.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{report.name}</h4>
                          <p className="text-sm text-slate-400">{report.type} • {report.period}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-slate-500">
                              Due: {format(new Date(report.dueDate), 'MMM dd, yyyy')}
                            </span>
                            {report.submittedDate && (
                              <span className="text-xs text-green-400">
                                Submitted: {format(new Date(report.submittedDate), 'MMM dd')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Types */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Report Categories</h3>
                  <div className="space-y-3">
                    {reportTypes.map((type) => {
                      const typeReports = reports.filter(r => r.type === type.id);
                      const submitted = typeReports.filter(r => r.status === 'submitted').length;

                      return (
                        <div key={type.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded ${type.color}`} />
                            <span className="text-sm text-white">{type.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-400">
                              {submitted}/{typeReports.length}
                            </span>
                            <div className="w-16 bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full ${type.color}`}
                                style={{ width: `${typeReports.length > 0 ? (submitted / typeReports.length) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h3>
                  <div className="space-y-3">
                    {reports
                      .filter(r => r.status === 'pending' || r.status === 'in-progress')
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .slice(0, 5)
                      .map((report) => (
                        <div key={report.id} className="flex items-center justify-between">
                          <span className="text-sm text-white truncate">{report.name}</span>
                          <span className="text-xs text-slate-400">
                            {format(new Date(report.dueDate), 'MMM dd')}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Scores */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Compliance Metrics</h3>
                <div className="space-y-4">
                  {Object.entries(compliance).map(([key, value]) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-300">{label}</span>
                          <span className={`text-sm font-medium ${getComplianceColor(value)}`}>
                            {value}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              value >= 90 ? 'bg-green-500' :
                              value >= 75 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Compliance Checklist</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">KYC Documentation</span>
                    </div>
                    <span className="text-xs text-green-400">Completed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">AML Policy Update</span>
                    </div>
                    <span className="text-xs text-green-400">Completed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white">Fair Practices Code Review</span>
                    </div>
                    <span className="text-xs text-yellow-400">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-white">Data Privacy Assessment</span>
                    </div>
                    <span className="text-xs text-red-400">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">Audit History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-900">
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Audit Type</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Date</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Findings</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Critical</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Resolved</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audits.map((audit) => (
                      <tr key={audit.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="px-6 py-4 text-sm text-white">{audit.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {format(new Date(audit.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${
                            audit.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            audit.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {audit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">{audit.findings}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${
                            audit.critical > 0 ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {audit.critical}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          {audit.resolved}/{audit.findings}
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'penalties' && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Excellent Compliance Record</h3>
                <p className="text-slate-400">No recent penalties or violations</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}