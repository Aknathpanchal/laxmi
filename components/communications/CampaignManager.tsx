'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay,
  FiPause,
  FiSquare,
  FiEdit3,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiMessageSquare,
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'multi-channel';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  targetAudience: string[];
  templateId: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  stats: {
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
    pending: number;
  };
  createdBy?: string;
  createdAt: string;
}

interface CampaignManagerProps {
  campaigns?: Campaign[];
  onRefresh?: () => void;
  onAction?: (campaignId: string, action: string) => void;
}

export default function CampaignManager({
  campaigns = [],
  onRefresh,
  onAction
}: CampaignManagerProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  const statusColors = {
    draft: 'gray',
    scheduled: 'blue',
    running: 'green',
    paused: 'yellow',
    completed: 'indigo',
    cancelled: 'red'
  };

  const typeIcons = {
    email: FiMail,
    sms: FiMessageSquare,
    whatsapp: FaWhatsapp,
    'multi-channel': FiUsers
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return FiPlay;
      case 'paused':
        return FiPause;
      case 'completed':
        return FiCheckCircle;
      case 'cancelled':
        return FiSquare;
      case 'scheduled':
        return FiClock;
      default:
        return FiEdit3;
    }
  };

  const filteredCampaigns = filterStatus === 'all'
    ? campaigns
    : campaigns.filter(c => c.status === filterStatus);

  const calculateDeliveryRate = (campaign: Campaign) => {
    if (campaign.stats.sent === 0) return 0;
    return ((campaign.stats.delivered / campaign.stats.sent) * 100).toFixed(1);
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (campaign.stats.delivered === 0) return 0;
    return ((campaign.stats.opened / campaign.stats.delivered) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: Campaign) => {
    if (campaign.stats.opened === 0) return 0;
    return ((campaign.stats.clicked / campaign.stats.opened) * 100).toFixed(1);
  };

  const handleAction = (campaignId: string, action: string) => {
    if (onAction) {
      onAction(campaignId, action);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Campaign Management</h3>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filterStatus === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({campaigns.length})
          </button>
          {['scheduled', 'running', 'completed'].map(status => {
            const count = campaigns.filter(c => c.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterStatus === status
                    ? `bg-${statusColors[status as keyof typeof statusColors]}-500 text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => {
          const TypeIcon = typeIcons[campaign.type];
          const StatusIcon = getStatusIcon(campaign.status);
          const statusColor = statusColors[campaign.status];
          const deliveryRate = calculateDeliveryRate(campaign);
          const openRate = calculateOpenRate(campaign);
          const clickRate = calculateClickRate(campaign);

          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold">{campaign.name}</h4>
                    <span className={`flex items-center px-2 py-1 rounded-full text-xs bg-${statusColor}-100 text-${statusColor}-700`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {campaign.status}
                    </span>
                    <span className="flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {campaign.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-1" />
                      {campaign.stats.total.toLocaleString()} recipients
                    </span>
                    <span className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                    {campaign.scheduledAt && campaign.status === 'scheduled' && (
                      <span className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {campaign.status === 'scheduled' && (
                    <button
                      onClick={() => handleAction(campaign.id, 'start')}
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      title="Start Campaign"
                    >
                      <FiPlay className="w-4 h-4" />
                    </button>
                  )}
                  {campaign.status === 'running' && (
                    <button
                      onClick={() => handleAction(campaign.id, 'pause')}
                      className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
                      title="Pause Campaign"
                    >
                      <FiPause className="w-4 h-4" />
                    </button>
                  )}
                  {(campaign.status === 'scheduled' || campaign.status === 'paused') && (
                    <button
                      onClick={() => handleAction(campaign.id, 'cancel')}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      title="Cancel Campaign"
                    >
                      <FiSquare className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    title="View Details"
                  >
                    <FiBarChart2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {campaign.status !== 'draft' && campaign.stats.total > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{((campaign.stats.sent / campaign.stats.total) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${statusColor}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(campaign.stats.sent / campaign.stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Sent</p>
                  <p className="text-lg font-semibold">
                    {campaign.stats.sent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Delivered</p>
                  <p className="text-lg font-semibold text-green-600">
                    {campaign.stats.delivered.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{deliveryRate}% rate</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Opened</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {campaign.stats.opened.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{openRate}% rate</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Clicked</p>
                  <p className="text-lg font-semibold text-purple-600">
                    {campaign.stats.clicked.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{clickRate}% rate</p>
                </div>
              </div>

              {/* Failed Messages Alert */}
              {campaign.stats.failed > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700">
                    <FiAlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {campaign.stats.failed} message(s) failed to send
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Campaigns Found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all'
              ? 'Create your first campaign to get started'
              : `No ${filterStatus} campaigns`}
          </p>
        </div>
      )}

      {/* Campaign Details Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCampaign(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{selectedCampaign.name}</h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Campaign details content here */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold capitalize">{selectedCampaign.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold capitalize">{selectedCampaign.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created By</p>
                    <p className="font-semibold">{selectedCampaign.createdBy || 'System'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Template</p>
                    <p className="font-semibold">{selectedCampaign.templateId}</p>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Performance Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Recipients</span>
                      <span className="font-semibold">{selectedCampaign.stats.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Messages Sent</span>
                      <span className="font-semibold">{selectedCampaign.stats.sent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivered</span>
                      <span className="font-semibold text-green-600">
                        {selectedCampaign.stats.delivered.toLocaleString()} ({calculateDeliveryRate(selectedCampaign)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opened</span>
                      <span className="font-semibold text-blue-600">
                        {selectedCampaign.stats.opened.toLocaleString()} ({calculateOpenRate(selectedCampaign)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clicked</span>
                      <span className="font-semibold text-purple-600">
                        {selectedCampaign.stats.clicked.toLocaleString()} ({calculateClickRate(selectedCampaign)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed</span>
                      <span className="font-semibold text-red-600">
                        {selectedCampaign.stats.failed.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}