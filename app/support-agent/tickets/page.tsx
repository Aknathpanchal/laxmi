'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMessageSquare,
  FiUser,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiSearch,
  FiSend,
  FiPaperclip,
  FiTag,
  FiCalendar,
  FiRefreshCw,
  FiArrowUp,
  FiArrowRight
} from 'react-icons/fi';

interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'loan' | 'account' | 'complaint' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  responseTime?: number;
  messages: Message[];
  tags: string[];
}

interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [newTicketModal, setNewTicketModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/support/tickets?filter=${filter}`);
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const response = await fetch(`/api/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          sender: 'agent'
        })
      });

      if (response.ok) {
        setReplyMessage('');
        fetchTickets();
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTickets();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-purple-600 bg-purple-50';
      case 'waiting_customer': return 'text-yellow-600 bg-yellow-50';
      case 'resolved': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💰';
      case 'loan': return '📄';
      case 'account': return '👤';
      case 'complaint': return '⚠️';
      default: return '💬';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Support Tickets</h1>
          <p className="text-gray-600">Manage customer support requests</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Open Tickets</span>
              <FiMessageSquare className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {tickets.filter(t => t.status === 'open').length}
            </div>
            <div className="text-xs text-blue-500 mt-1">Needs attention</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">In Progress</span>
              <FiClock className="text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {tickets.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-xs text-purple-500 mt-1">Being handled</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Urgent</span>
              <FiAlertCircle className="text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.priority === 'urgent').length}
            </div>
            <div className="text-xs text-red-500 mt-1">High priority</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Resolved Today</span>
              <FiCheckCircle className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-xs text-green-500 mt-1">Great work!</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Avg Response</span>
              <FiRefreshCw className="text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">15m</div>
            <div className="text-xs text-orange-500 mt-1">-5m vs yesterday</div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FiFilter className="text-gray-400" />
              {['all', 'open', 'in_progress', 'urgent', 'resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                />
              </div>
              <button
                onClick={() => setNewTicketModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                New Ticket
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredTickets.map(ticket => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                        <span className="text-xs text-gray-500">#{ticket.ticketNumber}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'urgent' && <FiArrowUp className="inline mr-1" size={10} />}
                        {ticket.priority}
                      </span>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{ticket.customerName}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status.split('_').join(' ')}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      {new Date(ticket.updatedAt).toRelativeTimeString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          {selectedTicket && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Ticket Header */}
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.subject}</h3>
                      <p className="text-sm text-gray-500">Ticket #{selectedTicket.ticketNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(selectedTicket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_customer">Waiting Customer</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <p className="font-semibold">{selectedTicket.customerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-semibold">{selectedTicket.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-semibold">{selectedTicket.customerPhone}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedTicket.tags.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {selectedTicket.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          <FiTag className="inline mr-1" size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto mb-4 space-y-3">
                  {selectedTicket.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'agent'
                          ? 'bg-blue-500 text-white'
                          : message.sender === 'system'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm font-semibold mb-1">{message.senderName}</p>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <FiPaperclip size={20} />
                    </button>
                    <button
                      onClick={handleReply}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <FiSend />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extension for relative time
declare global {
  interface Date {
    toRelativeTimeString(): string;
  }
}

Date.prototype.toRelativeTimeString = function() {
  const seconds = Math.floor((new Date().getTime() - this.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};