'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MessageSquare, Phone, Mail, Clock, CheckCircle, XCircle,
  AlertTriangle, User, Search, Filter, RefreshCw, Download,
  Settings, Bell, Eye, ExternalLink, Calendar, Star,
  TrendingUp, TrendingDown, Activity, Award, Target,
  Users, FileText, BarChart3, PieChart as PieChartIcon,
  Headphones, ThumbsUp, ThumbsDown, MessageCircle,
  Send, Paperclip, Smile, ArrowRight, Timer,
  BookOpen, HelpCircle, Info, Flag, Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
// SupportAgentLayout is already applied by ConditionalLayout based on user role

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    userId: string;
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    accountType: string;
  };
  issue: {
    category: 'LOAN_INQUIRY' | 'PAYMENT_ISSUE' | 'TECHNICAL_SUPPORT' | 'ACCOUNT_ACCESS' | 'COMPLAINT' | 'FEEDBACK';
    subcategory: string;
    subject: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
  };
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  resolution: {
    type?: 'SOLVED' | 'WORKAROUND' | 'ESCALATED' | 'DUPLICATE';
    description?: string;
    satisfactionRating?: number;
    feedback?: string;
  };
  timeline: {
    createdAt: string;
    assignedAt: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    closedAt?: string;
  };
  sla: {
    responseTime: number; // in minutes
    resolutionTime: number; // in hours
    breached: boolean;
  };
  communication: {
    totalMessages: number;
    lastContactAt: string;
    channel: 'EMAIL' | 'PHONE' | 'CHAT' | 'WHATSAPP';
  };
  tags: string[];
  attachments: number;
}

interface SupportMetrics {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    escalated: number;
  };
  performance: {
    avgResponseTime: number; // minutes
    avgResolutionTime: number; // hours
    firstCallResolution: number; // percentage
    customerSatisfaction: number; // rating out of 5
    ticketsPerDay: number;
    resolutionRate: number; // percentage
  };
  sla: {
    responseCompliance: number; // percentage
    resolutionCompliance: number; // percentage
    breachedTickets: number;
    criticalTickets: number;
  };
  workload: {
    assignedTickets: number;
    dailyTarget: number;
    weeklyTarget: number;
    currentProgress: number; // percentage
  };
}

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  content: string;
  views: number;
  helpful: number;
  tags: string[];
  lastUpdated: string;
}

export default function SupportAgentDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [metrics, setMetrics] = useState<SupportMetrics | null>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'metrics' | 'knowledge' | 'tools'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [filter, setFilter] = useState({
    status: 'ALL',
    priority: 'ALL',
    category: 'ALL',
    search: ''
  });

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (user.role !== 'SUPPORT_AGENT') {
        router.push('/login');
        return;
      }
    }
  }, [user, isLoading, router]);

  // Mock data
  const mockTickets: SupportTicket[] = [
    {
      id: '1',
      ticketNumber: 'SUP-2024-001',
      customer: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        userId: 'USR-001',
        tier: 'GOLD',
        accountType: 'Premium'
      },
      issue: {
        category: 'PAYMENT_ISSUE',
        subcategory: 'EMI Not Reflected',
        subject: 'EMI payment not showing in account',
        description: 'I made my EMI payment 3 days ago but it is still not reflected in my loan account. Please help.',
        priority: 'HIGH',
        severity: 'MODERATE'
      },
      status: 'IN_PROGRESS',
      resolution: {},
      timeline: {
        createdAt: '2024-01-15T09:30:00Z',
        assignedAt: '2024-01-15T09:45:00Z',
        firstResponseAt: '2024-01-15T10:15:00Z'
      },
      sla: {
        responseTime: 30,
        resolutionTime: 4,
        breached: false
      },
      communication: {
        totalMessages: 5,
        lastContactAt: '2024-01-15T14:30:00Z',
        channel: 'CHAT'
      },
      tags: ['payment', 'emi', 'verification'],
      attachments: 2
    },
    {
      id: '2',
      ticketNumber: 'SUP-2024-002',
      customer: {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 87654 32109',
        userId: 'USR-002',
        tier: 'SILVER',
        accountType: 'Standard'
      },
      issue: {
        category: 'ACCOUNT_ACCESS',
        subcategory: 'Login Issues',
        subject: 'Unable to access mobile app',
        description: 'Getting error message when trying to log into the mobile app. Please reset my credentials.',
        priority: 'MEDIUM',
        severity: 'MINOR'
      },
      status: 'OPEN',
      resolution: {},
      timeline: {
        createdAt: '2024-01-15T11:20:00Z',
        assignedAt: '2024-01-15T11:35:00Z'
      },
      sla: {
        responseTime: 60,
        resolutionTime: 2,
        breached: false
      },
      communication: {
        totalMessages: 1,
        lastContactAt: '2024-01-15T11:20:00Z',
        channel: 'EMAIL'
      },
      tags: ['mobile-app', 'login', 'credentials'],
      attachments: 1
    }
  ];

  const mockMetrics: SupportMetrics = {
    tickets: {
      total: 156,
      open: 23,
      inProgress: 18,
      resolved: 112,
      escalated: 3
    },
    performance: {
      avgResponseTime: 25, // minutes
      avgResolutionTime: 3.2, // hours
      firstCallResolution: 78.5,
      customerSatisfaction: 4.6,
      ticketsPerDay: 12,
      resolutionRate: 92.3
    },
    sla: {
      responseCompliance: 94.7,
      resolutionCompliance: 89.2,
      breachedTickets: 8,
      criticalTickets: 2
    },
    workload: {
      assignedTickets: 41,
      dailyTarget: 15,
      weeklyTarget: 75,
      currentProgress: 73.3
    }
  };

  const mockKnowledgeBase: KnowledgeItem[] = [
    {
      id: '1',
      title: 'How to verify EMI payment status',
      category: 'Payment Issues',
      content: 'Step-by-step guide to verify and track EMI payments...',
      views: 245,
      helpful: 89,
      tags: ['emi', 'payment', 'verification'],
      lastUpdated: '2024-01-10'
    },
    {
      id: '2',
      title: 'Mobile app login troubleshooting',
      category: 'Technical Support',
      content: 'Common solutions for mobile app login issues...',
      views: 189,
      helpful: 156,
      tags: ['mobile-app', 'login', 'troubleshooting'],
      lastUpdated: '2024-01-08'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets(mockTickets);
      setMetrics(mockMetrics);
      setKnowledgeBase(mockKnowledgeBase);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTickets(mockTickets);
      setMetrics(mockMetrics);
      setKnowledgeBase(mockKnowledgeBase);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-blue-400 bg-blue-900/20';
      case 'IN_PROGRESS': return 'text-yellow-400 bg-yellow-900/20';
      case 'WAITING_CUSTOMER': return 'text-purple-400 bg-purple-900/20';
      case 'ESCALATED': return 'text-red-400 bg-red-900/20';
      case 'RESOLVED': return 'text-green-400 bg-green-900/20';
      case 'CLOSED': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'PLATINUM': return 'from-purple-600 to-pink-600';
      case 'GOLD': return 'from-yellow-600 to-orange-600';
      case 'SILVER': return 'from-gray-400 to-gray-600';
      case 'BRONZE': return 'from-orange-700 to-red-700';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LOAN_INQUIRY': return <FileText className="w-4 h-4" />;
      case 'PAYMENT_ISSUE': return <MessageSquare className="w-4 h-4" />;
      case 'TECHNICAL_SUPPORT': return <Settings className="w-4 h-4" />;
      case 'ACCOUNT_ACCESS': return <User className="w-4 h-4" />;
      case 'COMPLAINT': return <AlertTriangle className="w-4 h-4" />;
      case 'FEEDBACK': return <Star className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-slate-400">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render anything (redirect will happen)
  if (!user || user.role !== 'SUPPORT_AGENT') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
            />
            <p className="mt-4 text-slate-400">Loading support dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Headphones className="w-8 h-8 text-blue-400" />
              Support Agent Dashboard
            </h1>
            <p className="text-slate-400">Customer support tickets and performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs text-slate-500">Active Tickets</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.tickets.open}</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-blue-400">Assigned to you</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Timer className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs text-slate-500">Avg Response</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.avgResponseTime}m</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-400">Under SLA</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs text-slate-500">Satisfaction</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.customerSatisfaction}/5</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <ThumbsUp className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-400">Excellent rating</span>
            </div>
          </div>

          <div className="glass rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs text-slate-500">Resolution Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{metrics?.performance.resolutionRate}%</p>
            <div className="flex items-center gap-1 text-sm mt-2">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              <span className="text-purple-400">Above target</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-slate-800 p-1 rounded-lg mb-8"
        >
          {[
            { id: 'tickets', label: 'My Tickets', icon: MessageSquare },
            { id: 'metrics', label: 'Performance', icon: BarChart3 },
            { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
            { id: 'tools', label: 'Tools & Templates', icon: Settings }
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
              <div className="glass rounded-xl p-6 border border-slate-700">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={filter.search}
                        onChange={(e) => setFilter({...filter, search: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <select
                    value={filter.status}
                    onChange={(e) => setFilter({...filter, status: e.target.value})}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_CUSTOMER">Waiting Customer</option>
                  </select>

                  <select
                    value={filter.priority}
                    onChange={(e) => setFilter({...filter, priority: e.target.value})}
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
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Assigned Tickets ({tickets.length})
                </h3>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:shadow-glow transition-all cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Flag className={`w-4 h-4 ${getPriorityColor(ticket.issue.priority)}`} />
                            <span className="font-medium text-white">{ticket.ticketNumber}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <div className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getTierColor(ticket.customer.tier)} text-white`}>
                            {ticket.customer.tier}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">{ticket.issue.category.replace('_', ' ')}</p>
                          <p className="text-xs text-slate-500">
                            SLA: {ticket.sla.breached ? '❌ Breached' : '✅ On Track'}
                          </p>
                        </div>
                      </div>

                      <h4 className="text-white font-medium mb-2">{ticket.issue.subject}</h4>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{ticket.issue.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-slate-400 text-sm">Customer</p>
                          <p className="text-white font-medium">{ticket.customer.name}</p>
                          <p className="text-slate-400 text-xs">{ticket.customer.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Channel</p>
                          <p className="text-white font-medium">{ticket.communication.channel}</p>
                          <p className="text-slate-400 text-xs">{ticket.communication.totalMessages} messages</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Timeline</p>
                          <p className="text-white font-medium">
                            {Math.round((Date.now() - new Date(ticket.timeline.createdAt).getTime()) / (1000 * 60 * 60))}h ago
                          </p>
                          <p className="text-slate-400 text-xs">
                            Response: {ticket.sla.responseTime}m
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Created: {new Date(ticket.timeline.createdAt).toLocaleDateString()}</span>
                          {ticket.timeline.firstResponseAt && (
                            <>
                              <span>•</span>
                              <span>First response: {new Date(ticket.timeline.firstResponseAt).toLocaleTimeString()}</span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                            <MessageCircle className="w-4 h-4 inline mr-1" />
                            Reply
                          </button>
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Resolve
                          </button>
                          <button className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors">
                            <Eye className="w-4 h-4 inline mr-1" />
                            View
                          </button>
                        </div>
                      </div>

                      {ticket.tags.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-2">
                            <Flag className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-slate-400">Tags:</span>
                            {ticket.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Timer className="w-5 h-5 text-blue-400" />
                    Response Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Avg Response Time</span>
                      <span className="text-blue-400 font-semibold">{metrics?.performance.avgResponseTime}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">SLA Compliance</span>
                      <span className="text-green-400 font-semibold">{metrics?.sla.responseCompliance}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">First Call Resolution</span>
                      <span className="text-purple-400 font-semibold">{metrics?.performance.firstCallResolution}%</span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Quality Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Customer Satisfaction</span>
                      <span className="text-yellow-400 font-semibold">{metrics?.performance.customerSatisfaction}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Resolution Rate</span>
                      <span className="text-green-400 font-semibold">{metrics?.performance.resolutionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Escalation Rate</span>
                      <span className="text-orange-400 font-semibold">
                        {((metrics?.tickets.escalated || 0) / (metrics?.tickets.total || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Workload Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assigned Tickets</span>
                      <span className="text-white font-semibold">{metrics?.workload.assignedTickets}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Daily Target</span>
                      <span className="text-blue-400 font-semibold">{metrics?.workload.dailyTarget}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics?.workload.currentProgress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                      />
                    </div>
                    <div className="text-center text-sm text-slate-400">
                      {metrics?.workload.currentProgress}% of weekly target
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Statistics */}
              <div className="glass rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Ticket Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Open', count: metrics?.tickets.open, color: 'blue' },
                    { label: 'In Progress', count: metrics?.tickets.inProgress, color: 'yellow' },
                    { label: 'Resolved', count: metrics?.tickets.resolved, color: 'green' },
                    { label: 'Escalated', count: metrics?.tickets.escalated, color: 'red' },
                    { label: 'Total', count: metrics?.tickets.total, color: 'purple' }
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className={`text-3xl font-bold text-${item.color}-400`}>{item.count}</p>
                      <p className="text-slate-400 text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  Knowledge Base
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search knowledge base..."
                      className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>All Categories</option>
                    <option>Payment Issues</option>
                    <option>Technical Support</option>
                    <option>Account Access</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {knowledgeBase.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="glass rounded-lg p-6 border border-slate-700 hover:shadow-glow transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{item.content}</p>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {item.helpful} helpful
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Support Tools & Templates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Quick Responses',
                    description: 'Pre-built response templates',
                    icon: Send,
                    color: 'blue',
                    actions: ['EMI Inquiry', 'Login Help', 'Account Info']
                  },
                  {
                    title: 'Escalation Matrix',
                    description: 'When and how to escalate tickets',
                    icon: ArrowRight,
                    color: 'red',
                    actions: ['Technical Issues', 'Complaints', 'Billing Disputes']
                  },
                  {
                    title: 'Customer Tools',
                    description: 'Account lookup and verification',
                    icon: User,
                    color: 'green',
                    actions: ['Account Search', 'Payment History', 'KYC Status']
                  },
                  {
                    title: 'Documentation',
                    description: 'Policies and procedures',
                    icon: FileText,
                    color: 'purple',
                    actions: ['SLA Guidelines', 'Refund Policy', 'Privacy Policy']
                  },
                  {
                    title: 'Communication',
                    description: 'Multi-channel support tools',
                    icon: MessageCircle,
                    color: 'yellow',
                    actions: ['Live Chat', 'Email Templates', 'SMS Alerts']
                  },
                  {
                    title: 'Analytics',
                    description: 'Performance tracking tools',
                    icon: BarChart3,
                    color: 'indigo',
                    actions: ['Response Time', 'Resolution Rate', 'Satisfaction']
                  }
                ].map((tool) => (
                  <motion.div
                    key={tool.title}
                    whileHover={{ scale: 1.05 }}
                    className="glass rounded-lg p-6 border border-slate-700 hover:shadow-glow transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 bg-${tool.color}-500/20 rounded-xl`}>
                        <tool.icon className={`w-6 h-6 text-${tool.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{tool.title}</h4>
                        <p className="text-slate-400 text-sm">{tool.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {tool.actions.map((action, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-2 bg-slate-800/50 rounded text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}