'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  Filter,
  Search,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Users,
  Timer,
  Award,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  Settings
} from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    userId: string;
  };
  subject: string;
  category: 'LOAN_INQUIRY' | 'PAYMENT_ISSUE' | 'TECHNICAL_SUPPORT' | 'ACCOUNT_ACCESS' | 'COMPLAINT' | 'FEEDBACK';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  assignedAgent?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  responseTime?: number;
  resolutionTime?: number;
  satisfaction?: number;
  tags: string[];
}

interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  activeTickets: number;
  totalTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  specialties: string[];
  workload: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  firstContactResolution: number;
  ticketVolumeGrowth: number;
}

export default function SupportDashboard() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'agents' | 'analytics'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketFilter, setTicketFilter] = useState({
    status: 'ALL',
    priority: 'ALL',
    category: 'ALL',
    agent: 'ALL'
  });

  // Mock data
  const supportMetrics: SupportMetrics = {
    totalTickets: 2847,
    openTickets: 342,
    resolvedTickets: 2505,
    avgResponseTime: 45, // minutes
    avgResolutionTime: 2.3, // hours
    customerSatisfaction: 4.6,
    firstContactResolution: 78.5,
    ticketVolumeGrowth: 12.5
  };

  const supportTickets: SupportTicket[] = [
    {
      id: '1',
      ticketNumber: 'TKT-2024-0001',
      customer: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 98765 43210',
        userId: 'USR-001'
      },
      subject: 'Unable to access loan account',
      category: 'ACCOUNT_ACCESS',
      priority: 'HIGH',
      status: 'OPEN',
      assignedAgent: {
        id: 'AGT-001',
        name: 'Rahul Kumar'
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      tags: ['urgent', 'login-issue']
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-0002',
      customer: {
        name: 'Amit Patel',
        email: 'amit.patel@email.com',
        phone: '+91 87654 32109',
        userId: 'USR-002'
      },
      subject: 'EMI payment not reflecting',
      category: 'PAYMENT_ISSUE',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedAgent: {
        id: 'AGT-002',
        name: 'Sneha Reddy'
      },
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      responseTime: 30,
      tags: ['payment', 'emi']
    }
  ];

  const supportAgents: SupportAgent[] = [
    {
      id: 'AGT-001',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@laxmione.com',
      status: 'ONLINE',
      activeTickets: 12,
      totalTickets: 245,
      avgResponseTime: 25,
      avgResolutionTime: 1.8,
      satisfactionScore: 4.7,
      specialties: ['Account Issues', 'Technical Support'],
      workload: 'MEDIUM'
    },
    {
      id: 'AGT-002',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@laxmione.com',
      status: 'ONLINE',
      activeTickets: 8,
      totalTickets: 189,
      avgResponseTime: 18,
      avgResolutionTime: 2.1,
      satisfactionScore: 4.8,
      specialties: ['Payment Issues', 'Loan Inquiries'],
      workload: 'LOW'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400 bg-red-900/20';
      case 'HIGH': return 'text-orange-400 bg-orange-900/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20';
      case 'LOW': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-blue-400 bg-blue-900/20';
      case 'IN_PROGRESS': return 'text-yellow-400 bg-yellow-900/20';
      case 'WAITING_CUSTOMER': return 'text-purple-400 bg-purple-900/20';
      case 'RESOLVED': return 'text-green-400 bg-green-900/20';
      case 'CLOSED': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'text-green-400';
      case 'AWAY': return 'text-yellow-400';
      case 'OFFLINE': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Support Dashboard</h1>
            <p className="text-slate-400">Manage customer support tickets and agent performance</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Open Tickets</p>
                <p className="text-2xl font-bold text-white">{supportMetrics.openTickets}</p>
                <p className="text-red-400 text-xs">Needs attention</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{supportMetrics.avgResponseTime}m</p>
                <p className="text-green-400 text-xs">-8% from last week</p>
              </div>
              <Timer className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-white">{supportMetrics.customerSatisfaction}/5</p>
                <p className="text-green-400 text-xs">+0.2 from last month</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">First Contact Resolution</p>
                <p className="text-2xl font-bold text-white">{supportMetrics.firstContactResolution}%</p>
                <p className="text-green-400 text-xs">+3% from last month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-slate-800 p-1 rounded-lg"
        >
          {[
            { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
            { id: 'agents', label: 'Agent Management', icon: Users },
            { id: 'analytics', label: 'Support Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <select
                    value={ticketFilter.status}
                    onChange={(e) => setTicketFilter({...ticketFilter, status: e.target.value})}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>

                  <select
                    value={ticketFilter.priority}
                    onChange={(e) => setTicketFilter({...ticketFilter, priority: e.target.value})}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="ALL">All Priority</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              {/* Tickets List */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-blue-400">{ticket.ticketNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <h3 className="text-white font-medium mb-2">{ticket.subject}</h3>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{ticket.customer.name}</span>
                          </div>
                          {ticket.assignedAgent && (
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400">Assigned to:</span>
                              <span className="text-blue-400">{ticket.assignedAgent.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <MessageCircle className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-6">
              {/* Agent Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Online Agents</h3>
                    <Activity className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">8/12</p>
                  <p className="text-green-400 text-sm">All systems operational</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Avg Response Time</h3>
                    <Timer className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">22m</p>
                  <p className="text-green-400 text-sm">-5m from yesterday</p>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Team Satisfaction</h3>
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">4.7/5</p>
                  <p className="text-green-400 text-sm">Excellent performance</p>
                </div>
              </div>

              {/* Agents List */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Support Agents</h3>
                <div className="space-y-4">
                  {supportAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {agent.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-700 ${getAgentStatusColor(agent.status)} bg-current`}></div>
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{agent.name}</h4>
                            <p className="text-slate-400 text-sm">{agent.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {agent.specialties.map((specialty, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="text-white font-medium">{agent.activeTickets}</p>
                            <p className="text-slate-400">Active</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">{agent.avgResponseTime}m</p>
                            <p className="text-slate-400">Response</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">{agent.satisfactionScore}</p>
                            <p className="text-slate-400">Rating</p>
                          </div>
                          <div className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              agent.workload === 'HIGH' ? 'text-red-400 bg-red-900/20' :
                              agent.workload === 'MEDIUM' ? 'text-yellow-400 bg-yellow-900/20' :
                              'text-green-400 bg-green-900/20'
                            }`}>
                              {agent.workload}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ticket Volume Trends */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Ticket Volume Trends</h3>
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">This Week</span>
                      <span className="text-white font-medium">142 tickets</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Last Week</span>
                      <span className="text-white font-medium">126 tickets</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Growth</span>
                      <span className="text-green-400 font-medium">+12.7%</span>
                    </div>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Category Distribution</h3>
                    <PieChart className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { category: 'Payment Issues', count: 45, percentage: 32 },
                      { category: 'Account Access', count: 28, percentage: 20 },
                      { category: 'Loan Inquiries', count: 35, percentage: 25 },
                      { category: 'Technical Support', count: 20, percentage: 14 },
                      { category: 'Other', count: 14, percentage: 9 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-slate-400">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{item.count}</span>
                          <span className="text-slate-400 text-sm">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resolution Time Analysis */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Resolution Time Analysis</h3>
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Average Resolution</span>
                      <span className="text-white font-medium">2.3 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">&lt; 1 Hour</span>
                      <span className="text-green-400 font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">1-4 Hours</span>
                      <span className="text-yellow-400 font-medium">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">&gt; 4 Hours</span>
                      <span className="text-red-400 font-medium">20%</span>
                    </div>
                  </div>
                </div>

                {/* Customer Satisfaction Breakdown */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Satisfaction Breakdown</h3>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { rating: '5 Stars', count: 156, percentage: 65 },
                      { rating: '4 Stars', count: 62, percentage: 26 },
                      { rating: '3 Stars', count: 15, percentage: 6 },
                      { rating: '2 Stars', count: 5, percentage: 2 },
                      { rating: '1 Star', count: 2, percentage: 1 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-slate-400">{item.rating}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{item.count}</span>
                          <span className="text-slate-400 text-sm">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}