'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Search, Filter, Calendar, User, Activity,
  ChevronLeft, ChevronRight, Download, RefreshCw, Clock,
  Shield, Settings, Database, AlertTriangle, CheckCircle,
  XCircle, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuditLog, AuditLog } from '@/lib/settings-utils';
import { format } from 'date-fns';

export function AuditLogViewer() {
  const { logs, loading, loadLogs } = useAuditLog();
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const logsPerPage = 20;

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    let filtered = [...logs];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    // Apply user filter
    if (selectedUser) {
      filtered = filtered.filter(log => log.userId === selectedUser);
    }

    // Apply date range filter
    if (dateRange.start) {
      filtered = filtered.filter(log =>
        new Date(log.timestamp) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(log =>
        new Date(log.timestamp) <= new Date(dateRange.end)
      );
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchQuery, selectedCategory, selectedUser, dateRange]);

  const categories = Array.from(new Set(logs.map(log => log.category)));
  const users = Array.from(new Set(logs.map(log => ({ id: log.userId, name: log.userName }))),
    (user) => user
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'Settings':
        return <Settings className="w-4 h-4" />;
      case 'Security':
        return <Shield className="w-4 h-4" />;
      case 'System':
        return <Database className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('Create') || action.includes('Add')) return 'text-green-400';
    if (action.includes('Update') || action.includes('Edit')) return 'text-blue-400';
    if (action.includes('Delete') || action.includes('Remove')) return 'text-red-400';
    return 'text-slate-400';
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Category', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        log.userName,
        log.action,
        log.category,
        log.ipAddress,
        JSON.stringify(log.details)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    a.click();
  };

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
          <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track all system activities and changes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => loadLogs()}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* User Filter */}
          <select
            value={selectedUser || ''}
            onChange={(e) => setSelectedUser(e.target.value || null)}
            className="bg-slate-700 text-white rounded-lg px-4 py-2"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Showing {startIndex + 1}-{Math.min(startIndex + logsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
          </span>
          {(searchQuery || selectedCategory || selectedUser || dateRange.start || dateRange.end) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setSelectedUser(null);
                setDateRange({ start: '', end: '' });
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Timestamp</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Action</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-300">IP Address</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-300">Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-white">
                            {format(new Date(log.timestamp), 'dd MMM yyyy')}
                          </p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm text-white">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded ${
                          log.category === 'Security' ? 'bg-red-500/20' :
                          log.category === 'Settings' ? 'bg-blue-500/20' :
                          'bg-slate-700'
                        }`}>
                          {getActionIcon(log.category)}
                        </div>
                        <span className="text-sm text-slate-300">{log.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-400 font-mono">{log.ipAddress}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                        className="p-1.5 rounded hover:bg-slate-600 transition-colors"
                      >
                        {expandedLog === log.id ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedLog === log.id && (
                    <tr className="bg-slate-900/50">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-300">Details</h4>
                          <div className="bg-slate-800 rounded-lg p-3">
                            <pre className="text-xs text-slate-400 overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>User Agent: {log.userAgent}</span>
                            <span>Log ID: {log.id}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded transition-colors flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = currentPage <= 3 ? i + 1 :
                  currentPage >= totalPages - 2 ? totalPages - 4 + i :
                  currentPage - 2 + i;

                if (pageNumber < 1 || pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded transition-colors flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing import at the top
import React from 'react';