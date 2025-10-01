'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  User, Shield, Bell, Globe, Smartphone,
  Mail, Lock, Eye, EyeOff, Check,
  AlertCircle, ChevronRight, ToggleLeft,
  ToggleRight, Download, Trash2, Edit3,
  Save, X, CreditCard, Key, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
// import { userService } from '@/lib/api/user.service';
// import { authService } from '@/lib/api/auth.service';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

interface NotificationSetting {
  id: string;
  label: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface SecuritySetting {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile data
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: 'loan_updates', label: 'Loan Status Updates', email: true, sms: true, push: true },
    { id: 'payment_reminders', label: 'Payment Reminders', email: true, sms: false, push: true },
    { id: 'offers', label: 'Special Offers', email: false, sms: false, push: true },
    { id: 'documents', label: 'Document Requests', email: true, sms: true, push: false },
    { id: 'security', label: 'Security Alerts', email: true, sms: true, push: true }
  ]);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    { id: 'two_factor', label: 'Two-Factor Authentication', enabled: false, description: 'Add an extra layer of security' },
    { id: 'biometric', label: 'Biometric Login', enabled: true, description: 'Use fingerprint or face recognition' },
    { id: 'session_timeout', label: 'Auto Logout', enabled: true, description: 'Logout after 15 minutes of inactivity' },
    { id: 'login_alerts', label: 'Login Alerts', enabled: true, description: 'Get notified of new device logins' }
  ]);

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Language settings
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const sections: SettingSection[] = [
    { id: 'profile', title: 'Profile Settings', icon: User },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'notifications', title: 'Notifications', icon: Bell },
    { id: 'language', title: 'Language', icon: Globe },
    { id: 'devices', title: 'Connected Devices', icon: Smartphone }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' }
  ];

  const connectedDevices = [
    { id: 1, name: 'iPhone 13 Pro', type: 'Mobile', lastActive: '2 hours ago', current: true },
    { id: 2, name: 'MacBook Pro', type: 'Desktop', lastActive: '1 day ago', current: false },
    { id: 3, name: 'Samsung Galaxy Tab', type: 'Tablet', lastActive: '3 days ago', current: false }
  ];

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // const response = await userService.updateProfile(profileData);
      // if (response.success && response.data) {
      //   updateUser(response.data);
      //   setMessage({ type: 'success', text: 'Profile updated successfully' });
      //   setIsEditing(false);
      // }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    try {
      // const response = await authService.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });
      // if (response.success) {
      //   setMessage({ type: 'success', text: 'Password changed successfully' });
      //   setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = (id: string, type: 'email' | 'sms' | 'push') => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, [type]: !notif[type] } : notif
    ));
  };

  const handleSecurityToggle = (id: string) => {
    setSecuritySettings(prev => prev.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    // Update i18n language
    // i18n.changeLanguage(code);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X />
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
          <input
            type="tel"
            value={profileData.mobile}
            onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={profileData.city}
            onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={profileData.state}
            onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
          <input
            type="text"
            value={profileData.pincode}
            onChange={(e) => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-6">Security Settings</h3>

        <div className="space-y-4">
          {securitySettings.map(setting => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{setting.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
              </div>
              <button
                onClick={() => handleSecurityToggle(setting.id)}
                className="ml-4"
              >
                {setting.enabled ? (
                  <ToggleRight className="w-10 h-10 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-6">Change Password</h3>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Notification Type</th>
              <th className="text-center py-3 px-4">
                <Mail className="inline" /> Email
              </th>
              <th className="text-center py-3 px-4">
                <Smartphone className="inline" /> SMS
              </th>
              <th className="text-center py-3 px-4">
                <Bell className="inline" /> Push
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(notif => (
              <tr key={notif.id} className="border-b">
                <td className="py-4 px-4">{notif.label}</td>
                <td className="text-center py-4 px-4">
                  <button
                    onClick={() => handleNotificationToggle(notif.id, 'email')}
                    className={`p-2 rounded ${notif.email ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {notif.email ? <Check /> : <X />}
                  </button>
                </td>
                <td className="text-center py-4 px-4">
                  <button
                    onClick={() => handleNotificationToggle(notif.id, 'sms')}
                    className={`p-2 rounded ${notif.sms ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {notif.sms ? <Check /> : <X />}
                  </button>
                </td>
                <td className="text-center py-4 px-4">
                  <button
                    onClick={() => handleNotificationToggle(notif.id, 'push')}
                    className={`p-2 rounded ${notif.push ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {notif.push ? <Check /> : <X />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setMessage({ type: 'success', text: 'Notification preferences saved' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-6">Language Preferences</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedLanguage === lang.code
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-lg font-medium">{lang.name}</div>
            {selectedLanguage === lang.code && (
              <Check className="text-blue-600 mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDeviceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-6">Connected Devices</h3>

      <div className="space-y-4">
        {connectedDevices.map(device => (
          <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <Smartphone className="w-8 h-8 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">{device.name}</h4>
                <p className="text-sm text-gray-600">
                  {device.type} • Last active {device.lastActive}
                </p>
              </div>
              {device.current && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  Current Device
                </span>
              )}
            </div>
            {!device.current && (
              <button className="text-red-600 hover:text-red-700">
                <Trash2 />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <button className="text-red-600 hover:text-red-700 font-medium">
          Sign out from all devices
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'language':
        return renderLanguageSettings();
      case 'devices':
        return renderDeviceSettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.type === 'success' ? <Check /> : <AlertCircle />}
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}