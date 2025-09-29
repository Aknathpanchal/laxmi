import { useState, useEffect, useCallback } from 'react';

// Settings types
export interface SystemSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  appearance: AppearanceSettings;
  compliance: ComplianceSettings;
  features: FeatureSettings;
}

export interface GeneralSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
  fiscalYearStart: string;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    methods: ('sms' | 'email' | 'app')[];
    mandatory: boolean;
  };
  sessionTimeout: number;
  ipWhitelist: string[];
  loginAttempts: number;
  lockoutDuration: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notificationChannels: {
    loanApproval: ('email' | 'sms' | 'push')[];
    paymentReminder: ('email' | 'sms' | 'push')[];
    documentUpload: ('email' | 'sms' | 'push')[];
    systemAlerts: ('email' | 'sms' | 'push')[];
  };
  reminderDays: number[];
  escalationRules: EscalationRule[];
}

export interface IntegrationSettings {
  paymentGateways: {
    razorpay: {
      enabled: boolean;
      apiKey: string;
      secretKey: string;
      webhookSecret: string;
    };
    stripe: {
      enabled: boolean;
      publishableKey: string;
      secretKey: string;
    };
  };
  smsProvider: {
    provider: 'twilio' | 'aws' | 'custom';
    apiKey: string;
    fromNumber: string;
  };
  emailProvider: {
    provider: 'sendgrid' | 'aws' | 'smtp';
    apiKey: string;
    fromEmail: string;
  };
  creditBureau: {
    enabled: boolean;
    provider: 'experian' | 'equifax' | 'cibil';
    apiEndpoint: string;
    credentials: string;
  };
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCss: string;
  dashboardLayout: 'default' | 'compact' | 'expanded';
}

export interface ComplianceSettings {
  kycRequired: boolean;
  kycDocuments: string[];
  amlChecks: boolean;
  dataRetentionDays: number;
  auditLogging: boolean;
  gdprCompliant: boolean;
  consentRequired: boolean;
  regulatoryReporting: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

export interface FeatureSettings {
  features: {
    [key: string]: {
      enabled: boolean;
      beta: boolean;
      roles: string[];
      config: any;
    };
  };
  modules: {
    loans: boolean;
    collections: boolean;
    analytics: boolean;
    reporting: boolean;
    customerPortal: boolean;
    mobileApp: boolean;
  };
  limits: {
    maxLoanAmount: number;
    minLoanAmount: number;
    maxTenure: number;
    minTenure: number;
    interestRateRange: [number, number];
    processingFeeRange: [number, number];
  };
}

export interface EscalationRule {
  id: string;
  name: string;
  triggerDays: number;
  action: 'notify' | 'escalate' | 'block';
  recipients: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Default settings
export const DEFAULT_SETTINGS: SystemSettings = {
  general: {
    companyName: 'LaxmiOne NBFC',
    companyEmail: 'contact@laxmione.com',
    companyPhone: '+91-1234567890',
    companyAddress: 'Mumbai, Maharashtra, India',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    language: 'en',
    fiscalYearStart: 'April'
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    twoFactorAuth: {
      enabled: true,
      methods: ['sms', 'email'],
      mandatory: false
    },
    sessionTimeout: 30,
    ipWhitelist: [],
    loginAttempts: 5,
    lockoutDuration: 30
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    notificationChannels: {
      loanApproval: ['email', 'sms'],
      paymentReminder: ['email', 'sms'],
      documentUpload: ['email'],
      systemAlerts: ['email']
    },
    reminderDays: [7, 3, 1],
    escalationRules: []
  },
  integrations: {
    paymentGateways: {
      razorpay: {
        enabled: true,
        apiKey: '',
        secretKey: '',
        webhookSecret: ''
      },
      stripe: {
        enabled: false,
        publishableKey: '',
        secretKey: ''
      }
    },
    smsProvider: {
      provider: 'twilio',
      apiKey: '',
      fromNumber: ''
    },
    emailProvider: {
      provider: 'sendgrid',
      apiKey: '',
      fromEmail: 'noreply@laxmione.com'
    },
    creditBureau: {
      enabled: false,
      provider: 'cibil',
      apiEndpoint: '',
      credentials: ''
    }
  },
  appearance: {
    theme: 'dark',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    customCss: '',
    dashboardLayout: 'default'
  },
  compliance: {
    kycRequired: true,
    kycDocuments: ['Aadhaar', 'PAN', 'Address Proof'],
    amlChecks: true,
    dataRetentionDays: 2555,
    auditLogging: true,
    gdprCompliant: true,
    consentRequired: true,
    regulatoryReporting: {
      enabled: true,
      frequency: 'monthly',
      recipients: ['compliance@laxmione.com']
    }
  },
  features: {
    features: {
      webSocket: {
        enabled: true,
        beta: false,
        roles: ['all'],
        config: {}
      },
      export: {
        enabled: true,
        beta: false,
        roles: ['all'],
        config: {
          formats: ['pdf', 'excel', 'csv']
        }
      },
      advancedSearch: {
        enabled: true,
        beta: false,
        roles: ['all'],
        config: {
          fuzzySearch: true,
          savedSearches: true
        }
      }
    },
    modules: {
      loans: true,
      collections: true,
      analytics: true,
      reporting: true,
      customerPortal: true,
      mobileApp: false
    },
    limits: {
      maxLoanAmount: 10000000,
      minLoanAmount: 10000,
      maxTenure: 360,
      minTenure: 3,
      interestRateRange: [8, 24],
      processingFeeRange: [0.5, 5]
    }
  }
};

// Settings management hooks
export function useSettings(category?: keyof SystemSettings) {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      const stored = localStorage.getItem('system_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error('Load settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates: Partial<SystemSettings>) => {
    try {
      setSaving(true);
      const updated = { ...settings, ...updates };
      // In production, save to API
      localStorage.setItem('system_settings', JSON.stringify(updated));
      setSettings(updated);
      return { success: true };
    } catch (err) {
      setError('Failed to save settings');
      console.error('Save settings error:', err);
      return { success: false, error: err };
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = (category?: keyof SystemSettings) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: DEFAULT_SETTINGS[category]
      }));
    } else {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  if (category) {
    return {
      settings: settings[category],
      loading,
      saving,
      error,
      saveSettings: (updates: any) => saveSettings({ [category]: updates }),
      resetSettings: () => resetSettings(category),
      reloadSettings: loadSettings
    };
  }

  return {
    settings,
    loading,
    saving,
    error,
    saveSettings,
    resetSettings,
    reloadSettings: loadSettings
  };
}

// Role and permission management
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      const mockRoles: Role[] = [
        {
          id: 'admin',
          name: 'Administrator',
          description: 'Full system access',
          permissions: ['*'],
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'manager',
          name: 'Manager',
          description: 'Management access',
          permissions: ['loans.*', 'reports.*', 'users.view'],
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'agent',
          name: 'Agent',
          description: 'Basic access',
          permissions: ['loans.view', 'loans.create', 'customers.view'],
          isSystem: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockPermissions: Permission[] = [
        {
          id: 'loans.view',
          name: 'View Loans',
          description: 'View loan applications and details',
          category: 'Loans',
          actions: ['read']
        },
        {
          id: 'loans.create',
          name: 'Create Loans',
          description: 'Create new loan applications',
          category: 'Loans',
          actions: ['create']
        },
        {
          id: 'loans.approve',
          name: 'Approve Loans',
          description: 'Approve loan applications',
          category: 'Loans',
          actions: ['approve']
        },
        {
          id: 'users.manage',
          name: 'Manage Users',
          description: 'Create and manage user accounts',
          category: 'Users',
          actions: ['create', 'update', 'delete']
        },
        {
          id: 'settings.manage',
          name: 'Manage Settings',
          description: 'Modify system settings',
          category: 'System',
          actions: ['update']
        }
      ];

      setRoles(mockRoles);
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRole: Role = {
      ...role,
      id: `role_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRoles(prev => [...prev, newRole]);
    return newRole;
  };

  const updateRole = async (id: string, updates: Partial<Role>) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === id
          ? { ...role, ...updates, updatedAt: new Date() }
          : role
      )
    );
  };

  const deleteRole = async (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isSystem) {
      throw new Error('Cannot delete system role');
    }
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  return {
    roles,
    permissions,
    loading,
    createRole,
    updateRole,
    deleteRole,
    reloadRoles: loadRolesAndPermissions
  };
}

// Audit logging
export function useAuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const logAction = useCallback((action: string, category: string, details: any) => {
    const log: AuditLog = {
      id: `log_${Date.now()}`,
      userId: 'current_user_id',
      userName: 'Current User',
      action,
      category,
      details,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      timestamp: new Date()
    };

    // In production, send to API
    console.log('Audit log:', log);
    setLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs

    return log;
  }, []);

  const loadLogs = async (filters?: {
    userId?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    try {
      setLoading(true);
      // In production, fetch from API with filters
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return mock data for now
      const mockLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => ({
        id: `log_${i}`,
        userId: `user_${i % 5}`,
        userName: `User ${i % 5}`,
        action: ['Settings Updated', 'Role Created', 'Permission Changed'][i % 3],
        category: ['Settings', 'Security', 'System'][i % 3],
        details: { field: 'example', oldValue: 'old', newValue: 'new' },
        ipAddress: `192.168.1.${i}`,
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - i * 3600000)
      }));

      setLogs(mockLogs);
      return mockLogs;
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    logAction,
    loadLogs
  };
}