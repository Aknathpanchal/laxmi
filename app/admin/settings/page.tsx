'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Users,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Mail,
  Phone,
  CreditCard,
  FileText,
  Clock,
  AlertTriangle,
  Save,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
  Server,
  Wifi,
  Activity
} from 'lucide-react';

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password';
  options?: string[];
  sensitive?: boolean;
  lastModified: string;
  modifiedBy: string;
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'SLACK')[];
  recipients: string[];
  enabled: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'integrations' | 'audit'>('general');
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
  const [editingSettings, setEditingSettings] = useState<Set<string>>(new Set());

  // Mock data
  const systemSettings: SystemSetting[] = [
    {
      id: '1',
      category: 'general',
      name: 'Company Name',
      description: 'Legal name of the NBFC',
      value: 'Laxmi Non-Banking Financial Company',
      type: 'text',
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'admin@laxmione.com'
    },
    {
      id: '2',
      category: 'general',
      name: 'Business Hours',
      description: 'Operating hours for customer support',
      value: '09:00-18:00 IST',
      type: 'text',
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'admin@laxmione.com'
    },
    {
      id: '3',
      category: 'security',
      name: 'Session Timeout',
      description: 'User session timeout in minutes',
      value: 30,
      type: 'number',
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'security@laxmione.com'
    },
    {
      id: '4',
      category: 'security',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all admin users',
      value: true,
      type: 'boolean',
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'security@laxmione.com'
    },
    {
      id: '5',
      category: 'security',
      name: 'API Secret Key',
      description: 'Secret key for API authentication',
      value: 'sk_live_abc123xyz789...',
      type: 'password',
      sensitive: true,
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'security@laxmione.com'
    },
    {
      id: '6',
      category: 'integrations',
      name: 'Payment Gateway',
      description: 'Primary payment processing provider',
      value: 'Razorpay',
      type: 'select',
      options: ['Razorpay', 'PayU', 'CCAvenue', 'Paytm'],
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'finance@laxmione.com'
    }
  ];

  const notificationRules: NotificationRule[] = [
    {
      id: '1',
      name: 'Loan Application Received',
      description: 'Notify when a new loan application is submitted',
      trigger: 'NEW_LOAN_APPLICATION',
      channels: ['EMAIL', 'SLACK'],
      recipients: ['underwriter@laxmione.com', '#loan-applications'],
      enabled: true,
      priority: 'MEDIUM'
    },
    {
      id: '2',
      name: 'Payment Overdue',
      description: 'Alert when payment is overdue by 3+ days',
      trigger: 'PAYMENT_OVERDUE_3_DAYS',
      channels: ['EMAIL', 'SMS'],
      recipients: ['collections@laxmione.com'],
      enabled: true,
      priority: 'HIGH'
    },
    {
      id: '3',
      name: 'Fraud Detection Alert',
      description: 'Immediate alert for suspected fraudulent activity',
      trigger: 'FRAUD_DETECTED',
      channels: ['EMAIL', 'SMS', 'PUSH'],
      recipients: ['security@laxmione.com', 'admin@laxmione.com'],
      enabled: true,
      priority: 'CRITICAL'
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      user: 'admin@laxmione.com',
      action: 'SETTING_UPDATED',
      category: 'SECURITY',
      details: 'Updated session timeout from 60 to 30 minutes',
      ipAddress: '192.168.1.100',
      severity: 'INFO'
    },
    {
      id: '2',
      timestamp: '2024-01-15T13:45:00Z',
      user: 'security@laxmione.com',
      action: 'API_KEY_REGENERATED',
      category: 'SECURITY',
      details: 'Regenerated API secret key',
      ipAddress: '192.168.1.101',
      severity: 'WARNING'
    },
    {
      id: '3',
      timestamp: '2024-01-15T12:15:00Z',
      user: 'finance@laxmione.com',
      action: 'PAYMENT_GATEWAY_CHANGED',
      category: 'INTEGRATIONS',
      details: 'Changed payment gateway from PayU to Razorpay',
      ipAddress: '192.168.1.102',
      severity: 'INFO'
    }
  ];

  const togglePasswordVisibility = (settingId: string) => {
    const newShowPasswords = new Set(showPasswords);
    if (newShowPasswords.has(settingId)) {
      newShowPasswords.delete(settingId);
    } else {
      newShowPasswords.add(settingId);
    }
    setShowPasswords(newShowPasswords);
  };

  const toggleEditing = (settingId: string) => {
    const newEditingSettings = new Set(editingSettings);
    if (newEditingSettings.has(settingId)) {
      newEditingSettings.delete(settingId);
    } else {
      newEditingSettings.add(settingId);
    }
    setEditingSettings(newEditingSettings);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/20';
      case 'ERROR': return 'text-red-400 bg-red-900/20';
      case 'WARNING': return 'text-yellow-400 bg-yellow-900/20';
      case 'INFO': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/20';
      case 'HIGH': return 'text-orange-400 bg-orange-900/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20';
      case 'LOW': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const renderSettingValue = (setting: SystemSetting) => {
    const isEditing = editingSettings.has(setting.id);
    const isPasswordVisible = showPasswords.has(setting.id);

    if (!isEditing) {
      if (setting.type === 'password' && setting.sensitive) {
        return (
          <div className="flex items-center space-x-2">
            <span className="text-white">
              {isPasswordVisible ? setting.value : '••••••••••••'}
            </span>
            <button
              onClick={() => togglePasswordVisibility(setting.id)}
              className="text-slate-400 hover:text-white"
            >
              {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        );
      }
      if (setting.type === 'boolean') {
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            setting.value ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'
          }`}>
            {setting.value ? 'Enabled' : 'Disabled'}
          </span>
        );
      }
      return <span className="text-white">{setting.value.toString()}</span>;
    }

    // Render edit controls
    switch (setting.type) {
      case 'text':
      case 'password':
        return (
          <input
            type={setting.type}
            defaultValue={setting.value.toString()}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            defaultValue={setting.value.toString()}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm w-24"
          />
        );
      case 'boolean':
        return (
          <select
            defaultValue={setting.value.toString()}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        );
      case 'select':
        return (
          <select
            defaultValue={setting.value.toString()}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return <span className="text-white">{setting.value.toString()}</span>;
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
            <h1 className="text-3xl font-bold text-white">System Settings</h1>
            <p className="text-slate-400">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save All</span>
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Status</p>
                <p className="text-xl font-bold text-green-400">Operational</p>
                <p className="text-green-400 text-xs">All services running</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Database</p>
                <p className="text-xl font-bold text-green-400">Connected</p>
                <p className="text-green-400 text-xs">Response: 12ms</p>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">API Status</p>
                <p className="text-xl font-bold text-green-400">Healthy</p>
                <p className="text-green-400 text-xs">99.9% uptime</p>
              </div>
              <Server className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Security</p>
                <p className="text-xl font-bold text-yellow-400">Monitoring</p>
                <p className="text-yellow-400 text-xs">2 alerts pending</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-400" />
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
            { id: 'general', label: 'General', icon: Settings },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'integrations', label: 'Integrations', icon: Globe },
            { id: 'audit', label: 'Audit Logs', icon: FileText }
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
          {activeTab === 'general' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">General Settings</h3>
              <div className="space-y-6">
                {systemSettings.filter(s => s.category === 'general').map((setting) => (
                  <motion.div
                    key={setting.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-medium">{setting.name}</h4>
                          {setting.sensitive && (
                            <Lock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{setting.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 text-sm">Value:</span>
                            {renderSettingValue(setting)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                          <span>Modified: {new Date(setting.lastModified).toLocaleString()}</span>
                          <span>By: {setting.modifiedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleEditing(setting.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {editingSettings.has(setting.id) && (
                          <button className="p-2 text-green-400 hover:text-green-300 hover:bg-slate-600 rounded">
                            <Save className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Security Settings</h3>
                <div className="space-y-6">
                  {systemSettings.filter(s => s.category === 'security').map((setting) => (
                    <motion.div
                      key={setting.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-medium">{setting.name}</h4>
                            {setting.sensitive && (
                              <Lock className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mb-3">{setting.description}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400 text-sm">Value:</span>
                              {renderSettingValue(setting)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                            <span>Modified: {new Date(setting.lastModified).toLocaleString()}</span>
                            <span>By: {setting.modifiedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {setting.type === 'password' && (
                            <button className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-slate-600 rounded">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleEditing(setting.id)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Notification Rules</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add Rule
                </button>
              </div>
              <div className="space-y-4">
                {notificationRules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-white font-medium">{rule.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(rule.priority)}`}>
                          {rule.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rule.enabled ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'
                        }`}>
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{rule.description}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-slate-400">Channels: </span>
                        <span className="text-white">{rule.channels.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Trigger: </span>
                        <span className="text-white">{rule.trigger}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Third-party Integrations</h3>
              <div className="space-y-6">
                {systemSettings.filter(s => s.category === 'integrations').map((setting) => (
                  <motion.div
                    key={setting.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-2">{setting.name}</h4>
                        <p className="text-slate-400 text-sm mb-3">{setting.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400 text-sm">Current:</span>
                            {renderSettingValue(setting)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-400 hover:text-green-300 hover:bg-slate-600 rounded">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Audit Logs</h3>
                <div className="flex space-x-3">
                  <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                    <option>All Categories</option>
                    <option>Security</option>
                    <option>Settings</option>
                    <option>Integrations</option>
                  </select>
                  <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                    Export Logs
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                        <span className="text-white font-medium">{log.action}</span>
                        <span className="text-slate-400 text-sm">{log.category}</span>
                      </div>
                      <span className="text-slate-400 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{log.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}