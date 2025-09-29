'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend,
  FiPaperclip,
  FiUser,
  FiUsers,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiMail,
  FiMessageSquare,
  FiPhone
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface MessageComposerProps {
  onSend: (message: any) => void;
  templates?: any[];
}

export default function MessageComposer({ onSend, templates = [] }: MessageComposerProps) {
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [recipientType, setRecipientType] = useState<'individual' | 'group'>('individual');
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const messageTypes = [
    { id: 'email', label: 'Email', icon: FiMail, color: 'blue' },
    { id: 'sms', label: 'SMS', icon: FiMessageSquare, color: 'green' },
    { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'emerald' }
  ];

  const priorityLevels = [
    { id: 'low', label: 'Low', color: 'gray' },
    { id: 'normal', label: 'Normal', color: 'blue' },
    { id: 'high', label: 'High', color: 'orange' },
    { id: 'urgent', label: 'Urgent', color: 'red' }
  ];

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.body);
      if (template.subject) {
        setSubject(template.subject);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!recipients.trim()) {
      newErrors.recipients = 'Recipients are required';
    }

    if (messageType === 'email' && !subject.trim()) {
      newErrors.subject = 'Subject is required for email';
    }

    if (!message.trim() && !selectedTemplate) {
      newErrors.message = 'Message content is required';
    }

    if (scheduleType === 'scheduled') {
      if (!scheduledDate) {
        newErrors.scheduledDate = 'Scheduled date is required';
      }
      if (!scheduledTime) {
        newErrors.scheduledTime = 'Scheduled time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsSending(true);

    const messageData = {
      type: messageType,
      to: recipientType === 'individual'
        ? recipients.split(',').map(r => r.trim())
        : recipients,
      subject: messageType === 'email' ? subject : undefined,
      body: message,
      priority,
      templateId: selectedTemplate || undefined,
      scheduledAt: scheduleType === 'scheduled'
        ? `${scheduledDate}T${scheduledTime}:00`
        : undefined,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    try {
      await onSend(messageData);
      // Reset form
      setRecipients('');
      setSubject('');
      setMessage('');
      setSelectedTemplate('');
      setPriority('normal');
      setScheduleType('now');
      setScheduledDate('');
      setScheduledTime('');
      setAttachments([]);
      setErrors({});
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Compose Message</h3>

        {/* Message Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Type
          </label>
          <div className="flex space-x-2">
            {messageTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = messageType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setMessageType(type.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isSelected
                      ? `bg-${type.color}-50 border-2 border-${type.color}-500 text-${type.color}-700`
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipient Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="individual"
                checked={recipientType === 'individual'}
                onChange={(e) => setRecipientType(e.target.value as any)}
                className="mr-2"
              />
              <FiUser className="w-4 h-4 mr-1" />
              Individual
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="group"
                checked={recipientType === 'group'}
                onChange={(e) => setRecipientType(e.target.value as any)}
                className="mr-2"
              />
              <FiUsers className="w-4 h-4 mr-1" />
              Group/Segment
            </label>
          </div>
        </div>

        {/* Recipients */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {recipientType === 'individual' ? 'Recipients (comma-separated)' : 'Select Segment'}
          </label>
          {recipientType === 'individual' ? (
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder={
                messageType === 'email'
                  ? 'email1@example.com, email2@example.com'
                  : '+919876543210, +919876543211'
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.recipients ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ) : (
            <select
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.recipients ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a segment</option>
              <option value="segment-all">All Customers</option>
              <option value="segment-active-loans">Active Loan Customers</option>
              <option value="segment-emi-due">EMI Due This Week</option>
              <option value="segment-overdue">Overdue Payments</option>
              <option value="segment-eligible">Eligible for New Loan</option>
              <option value="segment-pending-kyc">Pending KYC</option>
            </select>
          )}
          {errors.recipients && (
            <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
          )}
        </div>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Template (Optional)
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">No template</option>
            {templates
              .filter(t => t.type === messageType)
              .map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
          </select>
        </div>

        {/* Subject (for email only) */}
        {messageType === 'email' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Enter your message here..."
            className={`w-full px-3 py-2 border rounded-lg ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {messageType === 'sms' && `${message.length}/160 characters`}
          </p>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex space-x-2">
            {priorityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setPriority(level.id as any)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  priority === level.id
                    ? `bg-${level.color}-100 text-${level.color}-700 border border-${level.color}-300`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send Time
          </label>
          <div className="flex space-x-4 mb-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="now"
                checked={scheduleType === 'now'}
                onChange={(e) => setScheduleType(e.target.value as any)}
                className="mr-2"
              />
              <FiClock className="w-4 h-4 mr-1" />
              Send Now
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="scheduled"
                checked={scheduleType === 'scheduled'}
                onChange={(e) => setScheduleType(e.target.value as any)}
                className="mr-2"
              />
              <FiCalendar className="w-4 h-4 mr-1" />
              Schedule
            </label>
          </div>

          {scheduleType === 'scheduled' && (
            <div className="flex space-x-2 mt-2">
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className={`px-3 py-2 border rounded-lg ${
                  errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={`px-3 py-2 border rounded-lg ${
                  errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          )}
        </div>

        {/* Attachments (for email only) */}
        {messageType === 'email' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <FiPaperclip className="w-4 h-4 mr-2" />
                <span>Add Attachment</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {attachments.length > 0 && (
                <span className="text-sm text-gray-600">
                  {attachments.length} file(s) attached
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setRecipients('');
              setSubject('');
              setMessage('');
              setSelectedTemplate('');
              setErrors({});
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiSend className="w-4 h-4 mr-2" />
            {isSending ? 'Sending...' : scheduleType === 'scheduled' ? 'Schedule' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}