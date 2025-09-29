'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, UserPlus, Award, Calendar, Clock, TrendingUp,
  Search, Filter, Mail, Phone, Edit2, Trash2, Eye,
  CheckCircle, XCircle, AlertCircle, BarChart3, PieChart,
  Briefcase, MapPin, Star, Target, Activity, Download
} from 'lucide-react';
import { format } from 'date-fns';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  performance: number;
  attendance: number;
  salary: number;
  leaves: {
    taken: number;
    remaining: number;
  };
}

export default function StaffManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'performance' | 'attendance'>('directory');
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    departments: 0,
    averagePerformance: 0,
    todayAttendance: {
      present: 0,
      absent: 0,
      onLeave: 0,
      total: 0
    }
  });

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);

      // Fetch summary
      const summaryRes = await fetch('/api/admin/staff?type=summary');
      const summaryData = await summaryRes.json();
      if (summaryData.success) {
        setSummary(summaryData.data);
      }

      // Fetch employees
      const empRes = await fetch('/api/admin/staff?type=employees');
      const empData = await empRes.json();
      if (empData.success) {
        setEmployees(empData.data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'on-leave':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-700 text-slate-400';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const departmentColors: { [key: string]: string } = {
    'Operations': 'bg-blue-500',
    'Technology': 'bg-purple-500',
    'Marketing': 'bg-green-500',
    'Human Resources': 'bg-yellow-500',
    'Legal & Compliance': 'bg-red-500',
    'Finance': 'bg-cyan-500'
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;
    const matchesSearch = !searchQuery ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

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
              <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
              <p className="text-slate-400">Manage employees and track performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.totalEmployees}</p>
            <p className="text-sm text-slate-400">Total Employees</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.activeEmployees}</p>
            <p className="text-sm text-slate-400">Active</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.departments}</p>
            <p className="text-sm text-slate-400">Departments</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{summary.averagePerformance.toFixed(0)}%</p>
            <p className="text-sm text-slate-400">Avg Performance</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {summary.todayAttendance.present}/{summary.todayAttendance.total}
            </p>
            <p className="text-sm text-slate-400">Present Today</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
          {['directory', 'performance', 'attendance'].map((tab) => (
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
          {activeTab === 'directory' && (
            <div>
              {/* Filters */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search employees..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={selectedDepartment || ''}
                    onChange={(e) => setSelectedDepartment(e.target.value || null)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg"
                  >
                    <option value="">All Departments</option>
                    {['Operations', 'Technology', 'Marketing', 'Human Resources', 'Legal & Compliance', 'Finance'].map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Employee Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{employee.name}</h3>
                          <p className="text-sm text-slate-400">{employee.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Briefcase className="w-4 h-4" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {format(new Date(employee.joinDate), 'MMM yyyy')}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Performance</span>
                        <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            employee.performance >= 90 ? 'bg-green-500' :
                            employee.performance >= 75 ? 'bg-blue-500' :
                            employee.performance >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${employee.performance}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500">
                        Leave: {employee.leaves.taken}/{employee.leaves.taken + employee.leaves.remaining}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <BarChart3 className="w-16 h-16" />
                  <p className="ml-4">Performance chart visualization</p>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {employees
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 5)
                    .map((emp, index) => (
                      <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-slate-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-slate-600 text-slate-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className={`text-sm font-medium ${getPerformanceColor(emp.performance)}`}>
                            {emp.performance}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Department Performance */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Department Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Operations', 'Technology', 'Marketing', 'Human Resources', 'Legal & Compliance', 'Finance'].map(dept => {
                    const deptEmployees = employees.filter(e => e.department === dept);
                    const avgPerformance = deptEmployees.length > 0
                      ? deptEmployees.reduce((sum, e) => sum + e.performance, 0) / deptEmployees.length
                      : 0;

                    return (
                      <div key={dept} className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white">{dept}</span>
                          <div className={`w-3 h-3 rounded ${departmentColors[dept]}`} />
                        </div>
                        <p className={`text-2xl font-bold ${getPerformanceColor(avgPerformance)}`}>
                          {avgPerformance.toFixed(0)}%
                        </p>
                        <p className="text-xs text-slate-500">{deptEmployees.length} employees</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Attendance */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Today's Attendance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-white">Present</span>
                    </div>
                    <span className="text-lg font-bold text-green-400">{summary.todayAttendance.present}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-white">Absent</span>
                    </div>
                    <span className="text-lg font-bold text-red-400">{summary.todayAttendance.absent}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-white">On Leave</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">{summary.todayAttendance.onLeave}</span>
                  </div>
                </div>
              </div>

              {/* Attendance Rate */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Monthly Attendance Rate</h3>
                <div className="flex items-center justify-center h-32">
                  <div className="relative">
                    <div className="text-4xl font-bold text-white">94%</div>
                    <div className="text-sm text-slate-400 text-center">Average</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Working Days</span>
                    <span className="text-white">22</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Holidays</span>
                    <span className="text-white">2</span>
                  </div>
                </div>
              </div>

              {/* Leave Summary */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Leave Summary</h3>
                <div className="space-y-3">
                  {employees.slice(0, 5).map(emp => (
                    <div key={emp.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{emp.name.split(' ')[0]}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(emp.leaves.taken / (emp.leaves.taken + emp.leaves.remaining)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {emp.leaves.taken}/{emp.leaves.taken + emp.leaves.remaining}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}