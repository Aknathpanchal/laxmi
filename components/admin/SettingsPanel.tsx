'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Shield, Bell, Palette, Globe, FileText,
  Save, RotateCcw, ChevronRight, Check, AlertCircle,
  Building, Lock, Mail, Phone, MapPin, Clock,
  DollarSign, Calendar, Languages, Database,
  Wifi, CreditCard, MessageSquare, Key, Eye, EyeOff
} from 'lucide-react';
import { useSettings, useAuditLog } from '@/lib/settings-utils';
import { useNotifications } from '@/contexts/NotificationContext';

export interface SettingsPanelProps {
  className?: string;
}

const settingCategories = [
  { id: 'general', label: 'General', icon: Building },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Wifi },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'compliance', label: 'Compliance', icon: FileText },
  { id: 'features', label: 'Features', icon: Globe }
];

export function SettingsPanel({ className = '' }: SettingsPanelProps) {
  const [activeCategory, setActiveCategory] = useState('general');
  const { settings, loading, saving, saveSettings, resetSettings } = useSettings();
  const { logAction } = useAuditLog();
  const { addNotification } = useNotifications();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    try {
      const result = await saveSettings(localSettings);
      if (result.success) {
        logAction('Settings Updated', activeCategory, { category: activeCategory });
        addNotification({
          type: 'SUCCESS',
          title: 'Settings Saved',
          message: `${activeCategory} settings have been updated`,
          priority: 'LOW'
        });
        setUnsavedChanges(false);
      }
    } catch (error) {
      addNotification({
        type: 'ERROR',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
        priority: 'HIGH'
      });
    }
  };

  const handleReset = () => {
    resetSettings(activeCategory as any);
    setLocalSettings(settings);
    setUnsavedChanges(false);
    addNotification({
      type: 'INFO',
      title: 'Settings Reset',
      message: `${activeCategory} settings have been reset to defaults`,
      priority: 'LOW'
    });
  };

  const updateSetting = (category: string, field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-full ${className}`}>
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
          <nav className="space-y-1">
            {settingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">
                {activeCategory} Settings
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Configure your {activeCategory} preferences
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {unsavedChanges && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  Unsaved Changes
                </span>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!unsavedChanges || saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Settings Forms */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeCategory === 'general' && (
                <GeneralSettings
                  settings={localSettings.general}
                  onChange={(field, value) => updateSetting('general', field, value)}
                />
              )}
              {activeCategory === 'security' && (
                <SecuritySettings
                  settings={localSettings.security}
                  onChange={(field, value) => updateSetting('security', field, value)}
                />
              )}
              {activeCategory === 'notifications' && (
                <NotificationSettings
                  settings={localSettings.notifications}
                  onChange={(field, value) => updateSetting('notifications', field, value)}
                />
              )}
              {activeCategory === 'integrations' && (
                <IntegrationSettings
                  settings={localSettings.integrations}
                  onChange={(field, value) => updateSetting('integrations', field, value)}
                />
              )}
              {activeCategory === 'appearance' && (
                <AppearanceSettings
                  settings={localSettings.appearance}
                  onChange={(field, value) => updateSetting('appearance', field, value)}
                />
              )}
              {activeCategory === 'compliance' && (
                <ComplianceSettings
                  settings={localSettings.compliance}
                  onChange={(field, value) => updateSetting('compliance', field, value)}
                />
              )}
              {activeCategory === 'features' && (
                <FeatureSettings
                  settings={localSettings.features}
                  onChange={(field, value) => updateSetting('features', field, value)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// General Settings Component
function GeneralSettings({ settings, onChange }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <span>Company Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Company Email</label>
            <input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => onChange('companyEmail', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Company Phone</label>
            <input
              type="tel"
              value={settings.companyPhone}
              onChange={(e) => onChange('companyPhone', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => onChange('timezone', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-slate-400 mb-2">Company Address</label>
          <textarea
            value={settings.companyAddress}
            onChange={(e) => onChange('companyAddress', e.target.value)}
            rows={3}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Regional Settings</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => onChange('currency', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => onChange('dateFormat', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => onChange('language', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings({ settings, onChange }: any) {
  const [showApiKeys, setShowApiKeys] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Lock className="w-5 h-5" />
          <span>Password Policy</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Minimum Length: {settings.passwordPolicy.minLength}
            </label>
            <input
              type="range"
              min="6"
              max="20"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => onChange('passwordPolicy', {
                ...settings.passwordPolicy,
                minLength: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Password Expiry (days): {settings.passwordPolicy.expiryDays}
            </label>
            <input
              type="range"
              min="30"
              max="365"
              value={settings.passwordPolicy.expiryDays}
              onChange={(e) => onChange('passwordPolicy', {
                ...settings.passwordPolicy,
                expiryDays: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireUppercase}
              onChange={(e) => onChange('passwordPolicy', {
                ...settings.passwordPolicy,
                requireUppercase: e.target.checked
              })}
              className="rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">Require uppercase letters</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireNumbers}
              onChange={(e) => onChange('passwordPolicy', {
                ...settings.passwordPolicy,
                requireNumbers: e.target.checked
              })}
              className="rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">Require numbers</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.passwordPolicy.requireSpecialChars}
              onChange={(e) => onChange('passwordPolicy', {
                ...settings.passwordPolicy,
                requireSpecialChars: e.target.checked
              })}
              className="rounded border-slate-600"
            />
            <span className="text-sm text-slate-300">Require special characters</span>
          </label>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Two-Factor Authentication</span>
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Enable 2FA</span>
            <button
              onClick={() => onChange('twoFactorAuth', {
                ...settings.twoFactorAuth,
                enabled: !settings.twoFactorAuth.enabled
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth.enabled ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactorAuth.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          {settings.twoFactorAuth.enabled && (
            <div className="space-y-2 pl-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth.methods.includes('sms')}
                  onChange={(e) => {
                    const methods = e.target.checked
                      ? [...settings.twoFactorAuth.methods, 'sms']
                      : settings.twoFactorAuth.methods.filter((m: string) => m !== 'sms');
                    onChange('twoFactorAuth', { ...settings.twoFactorAuth, methods });
                  }}
                  className="rounded border-slate-600"
                />
                <span className="text-sm text-slate-300">SMS</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth.methods.includes('email')}
                  onChange={(e) => {
                    const methods = e.target.checked
                      ? [...settings.twoFactorAuth.methods, 'email']
                      : settings.twoFactorAuth.methods.filter((m: string) => m !== 'email');
                    onChange('twoFactorAuth', { ...settings.twoFactorAuth, methods });
                  }}
                  className="rounded border-slate-600"
                />
                <span className="text-sm text-slate-300">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth.methods.includes('app')}
                  onChange={(e) => {
                    const methods = e.target.checked
                      ? [...settings.twoFactorAuth.methods, 'app']
                      : settings.twoFactorAuth.methods.filter((m: string) => m !== 'app');
                    onChange('twoFactorAuth', { ...settings.twoFactorAuth, methods });
                  }}
                  className="rounded border-slate-600"
                />
                <span className="text-sm text-slate-300">Authenticator App</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Other setting components would follow similar pattern...
function NotificationSettings({ settings, onChange }: any) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
      <p className="text-sm text-slate-400">Configure notification settings here...</p>
    </div>
  );
}

function IntegrationSettings({ settings, onChange }: any) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Integration Settings</h3>
      <p className="text-sm text-slate-400">Configure third-party integrations here...</p>
    </div>
  );
}

function AppearanceSettings({ settings, onChange }: any) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Appearance Settings</h3>
      <p className="text-sm text-slate-400">Customize the look and feel here...</p>
    </div>
  );
}

function ComplianceSettings({ settings, onChange }: any) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Compliance Settings</h3>
      <p className="text-sm text-slate-400">Configure compliance requirements here...</p>
    </div>
  );
}

function FeatureSettings({ settings, onChange }: any) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-white mb-4">Feature Settings</h3>
      <p className="text-sm text-slate-400">Enable or disable platform features here...</p>
    </div>
  );
}