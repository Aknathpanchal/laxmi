import { apiClient, ApiResponse } from './api-client';

export interface DashboardMetrics {
  totalUsers: number;
  activeLoans: number;
  totalDisbursed: number;
  totalRevenue: number;
  monthlyGrowth: number;
  npaPercentage: number;
  avgProcessingTime: number;
  approvalRate: number;
  userGrowth: Array<{ month: string; users: number }>;
  loanTrends: Array<{ month: string; amount: number; count: number }>;
  revenueBreakdown: {
    interest: number;
    processingFees: number;
    penalties: number;
    other: number;
  };
  portfolioHealth: {
    performing: number;
    underObservation: number;
    npa: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  mobile: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string;
  kycStatus: string;
  creditScore?: number;
  totalLoans: number;
  activeLoans: number;
}

export interface LoanManagement {
  id: string;
  loanNumber: string;
  userName: string;
  userId: string;
  amount: number;
  status: string;
  appliedDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  emi: number;
  tenure: number;
  interestRate: number;
  nextPaymentDate?: string;
  overdueAmount?: number;
  riskScore?: number;
}

export interface UserManagementRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoanApprovalRequest {
  loanId: string;
  action: 'approve' | 'reject' | 'hold';
  remarks?: string;
  sanctionedAmount?: number;
  modifiedTerms?: {
    interestRate?: number;
    tenure?: number;
    processingFee?: number;
  };
}

export interface SystemConfiguration {
  minLoanAmount: number;
  maxLoanAmount: number;
  minInterestRate: number;
  maxInterestRate: number;
  processingFeePercentage: number;
  lateFeePercentage: number;
  maxLoanTenure: number;
  minAge: number;
  maxAge: number;
  minCreditScore: number;
  autoApprovalThreshold: number;
  npaClassificationDays: number;
}

export interface RiskAnalytics {
  portfolioAtRisk: number;
  expectedLoss: number;
  totalExposure: number;
  riskDistribution: Array<{
    category: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  vintageAnalysis: Array<{
    cohort: string;
    totalLoans: number;
    currentNPA: number;
    npaRate: number;
  }>;
}

class AdminService {
  // Dashboard
  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    return apiClient.get<DashboardMetrics>('/api/admin/dashboard');
  }

  // User Management
  async getUsers(params?: UserManagementRequest): Promise<ApiResponse<{
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/admin/users?${queryParams.toString()}`);
  }

  async getUserDetails(userId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<AdminUser>(`/api/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, status: string, reason?: string): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/admin/users/${userId}/status`, { status, reason });
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/admin/users/${userId}/role`, { role });
  }

  async resetUserPassword(userId: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return apiClient.post(`/api/admin/users/${userId}/reset-password`, {});
  }

  // Loan Management
  async getLoans(filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    loans: LoanManagement[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/admin/loans?${queryParams.toString()}`);
  }

  async getLoanDetails(loanId: string): Promise<ApiResponse<LoanManagement>> {
    return apiClient.get<LoanManagement>(`/api/admin/loans/${loanId}`);
  }

  async processLoanApproval(request: LoanApprovalRequest): Promise<ApiResponse<any>> {
    return apiClient.post('/api/admin/loans/process', request);
  }

  async overrideLoanDecision(loanId: string, decision: any): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/admin/loans/${loanId}/override`, decision);
  }

  // KYC Verification
  async getPendingKYC(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/admin/kyc/pending');
  }

  async verifyKYC(userId: string, documentId: string, status: 'approved' | 'rejected', remarks?: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/admin/kyc/verify', {
      userId,
      documentId,
      status,
      remarks
    });
  }

  // Reports
  async generateReport(reportType: string, params: any): Promise<ApiResponse<any>> {
    return apiClient.post('/api/admin/reports/generate', {
      reportType,
      ...params
    });
  }

  async getReportsList(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/admin/reports');
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await fetch(`/api/admin/reports/${reportId}/download`, {
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });
    return response.blob();
  }

  // System Configuration
  async getSystemConfig(): Promise<ApiResponse<SystemConfiguration>> {
    return apiClient.get<SystemConfiguration>('/api/admin/config');
  }

  async updateSystemConfig(config: Partial<SystemConfiguration>): Promise<ApiResponse<any>> {
    return apiClient.put('/api/admin/config', config);
  }

  // Risk Analytics
  async getRiskAnalytics(): Promise<ApiResponse<RiskAnalytics>> {
    return apiClient.get<RiskAnalytics>('/api/admin/analytics/risk');
  }

  // Collections
  async getCollectionCases(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/admin/collections');
  }

  async assignCollectionCase(caseId: string, agentId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/admin/collections/${caseId}/assign`, { agentId });
  }

  // Audit Logs
  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/api/admin/audit-logs?${queryParams.toString()}`);
  }

  // Notifications
  async sendBulkNotification(notification: {
    title: string;
    message: string;
    targetUsers?: string[];
    targetSegment?: string;
    channel: 'email' | 'sms' | 'push' | 'all';
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/admin/notifications/bulk', notification);
  }

  // Fraud Management
  async getFraudAlerts(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/admin/fraud/alerts');
  }

  async investigateFraud(alertId: string, action: 'investigate' | 'dismiss' | 'block'): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/admin/fraud/alerts/${alertId}/action`, { action });
  }

  // Partner Management
  async getPartners(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/admin/partners');
  }

  async addPartner(partner: any): Promise<ApiResponse<any>> {
    return apiClient.post('/api/admin/partners', partner);
  }

  async updatePartner(partnerId: string, partner: any): Promise<ApiResponse<any>> {
    return apiClient.put(`/api/admin/partners/${partnerId}`, partner);
  }

  // Settings
  async getAdminSettings(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/admin/settings');
  }

  async updateAdminSettings(settings: any): Promise<ApiResponse<any>> {
    return apiClient.put('/api/admin/settings', settings);
  }
}

export const adminService = new AdminService();