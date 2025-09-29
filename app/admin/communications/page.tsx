'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiMessageSquare,
  FiSend,
  FiUsers,
  FiTrendingUp,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiFileText,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import MessageComposer from '@/components/communications/MessageComposer';
import CampaignManager from '@/components/communications/CampaignManager';

export default function CommunicationsDashboard() {
  const [activeTab, setActiveTab] = useState<'compose' | 'campaigns' | 'templates' | 'history' | 'analytics'>('compose');
  const [stats, setStats] = useState({
    totalSent: 15234,
    delivered: 14890,
    pending: 344,
    failed: 87,
    todayMessages: 523,
    activeCampaigns: 3,
    scheduledMessages: 12,
    templates: 18
  });
  const [templates, setTemplates] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch templates
      if (activeTab === 'compose' || activeTab === 'templates') {
        const templatesRes = await fetch('/api/communications/templates');
        const templatesData = await templatesRes.json();
        if (templatesData.success) {
          setTemplates(templatesData.templates);
        }
      }

      // Fetch campaigns
      if (activeTab === 'campaigns') {
        const campaignsRes = await fetch('/api/communications/campaigns');
        const campaignsData = await campaignsRes.json();
        if (campaignsData.success) {
          setCampaigns(campaignsData.campaigns);
        }
      }

      // Fetch message history
      if (activeTab === 'history') {
        const messagesRes = await fetch('/api/communications/messages');
        const messagesData = await messagesRes.json();
        if (messagesData.success) {
          setMessages(messagesData.messages);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageData: any) => {
    try {
      const response = await fetch('/api/communications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        alert('Message sent successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    }
  };

  const handleCampaignAction = async (campaignId: string, action: string) => {
    try {
      const response = await fetch('/api/communications/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: campaignId, action })
      });

      if (response.ok) {
        alert(`Campaign ${action} successfully!`);
        fetchData();
      }
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
    }
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: FiSend },
    { id: 'campaigns', label: 'Campaigns', icon: FiUsers },
    { id: 'templates', label: 'Templates', icon: FiFileText },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Communications Center</h1>
        <p className="text-gray-600">Manage all customer communications from one place</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Messages</p>
              <p className="text-2xl font-bold text-gray-800">{stats.todayMessages}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% from yesterday</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiSend className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivery Rate</p>
              <p className="text-2xl font-bold text-green-600">97.8%</p>
              <p className="text-xs text-gray-600 mt-1">{stats.delivered}/{stats.totalSent}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.activeCampaigns}</p>
              <p className="text-xs text-gray-600 mt-1">{stats.scheduledMessages} scheduled</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FiUsers className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed Messages</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-xs text-gray-600 mt-1">{stats.pending} pending retry</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <FiRefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'compose' && (
              <MessageComposer onSend={handleSendMessage} templates={templates} />
            )}

            {activeTab === 'campaigns' && (
              <CampaignManager
                campaigns={campaigns}
                onRefresh={fetchData}
                onAction={handleCampaignAction}
              />
            )}

            {activeTab === 'templates' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Message Templates</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Template
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          template.type === 'email'
                            ? 'bg-blue-100 text-blue-700'
                            : template.type === 'sms'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {template.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{template.body}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          Used {template.usageCount || 0} times
                        </span>
                        <div className="space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Message History</h3>
                  <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Recipient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Subject/Body
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sent At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {messages.map((message) => (
                        <tr key={message.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              message.type === 'email'
                                ? 'bg-blue-100 text-blue-700'
                                : message.type === 'sms'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {message.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{message.to}</td>
                          <td className="px-4 py-3 text-sm">
                            <p className="line-clamp-1">
                              {message.subject || message.body}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              message.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : message.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : message.status === 'sent'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {message.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {message.sentAt
                              ? new Date(message.sentAt).toLocaleString()
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Channel Performance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Email</span>
                        <FiMail className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold">8,234</p>
                      <p className="text-sm text-gray-500">Messages sent</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs">
                          <span>Open Rate</span>
                          <span>42%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">SMS</span>
                        <FiMessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">5,432</p>
                      <p className="text-sm text-gray-500">Messages sent</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs">
                          <span>Delivery Rate</span>
                          <span>98%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '98%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">WhatsApp</span>
                        <FaWhatsapp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-bold">1,568</p>
                      <p className="text-sm text-gray-500">Messages sent</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs">
                          <span>Read Rate</span>
                          <span>76%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '76%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Message Volume (Last 7 Days)</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {[65, 80, 95, 70, 85, 90, 75].map((height, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}