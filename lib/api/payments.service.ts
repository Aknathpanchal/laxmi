import { apiClient, ApiResponse } from './api-client';

export interface PaymentInitiation {
  amount: number;
  purpose: 'loan_repayment' | 'processing_fee' | 'prepayment' | 'penalty' | 'other';
  loanId?: string;
  description?: string;
  bankAccountId?: string;
  paymentMethod?: 'upi' | 'netbanking' | 'debit_card' | 'credit_card' | 'wallet';
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl?: string;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  userId: string;
  loanId?: string;
  amount: number;
  type: 'credit' | 'debit';
  purpose: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded';
  paymentMethod?: string;
  bankReferenceNumber?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
}

export interface AutoPayMandate {
  id: string;
  userId: string;
  loanId: string;
  mandateId: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'biweekly';
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  endDate: string;
  bankAccountId: string;
  createdAt: string;
}

export interface PaymentSchedule {
  loanId: string;
  schedule: Array<{
    installmentNumber: number;
    dueDate: string;
    amount: number;
    principal: number;
    interest: number;
    status: 'pending' | 'paid' | 'overdue' | 'partial';
    paidAmount?: number;
    paidDate?: string;
    penaltyAmount?: number;
  }>;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

class PaymentsService {
  // Initiate payment
  async initiatePayment(data: PaymentInitiation): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>('/api/payments/initiate', data);
  }

  // Verify payment
  async verifyPayment(verification: PaymentVerification): Promise<ApiResponse<any>> {
    return apiClient.post('/api/payments/verify', verification);
  }

  // Get transaction history
  async getTransactionHistory(filters?: {
    loanId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    transactions: Transaction[];
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
    return apiClient.get(`/api/payments/transactions?${queryParams.toString()}`);
  }

  // Get transaction details
  async getTransactionDetails(transactionId: string): Promise<ApiResponse<Transaction>> {
    return apiClient.get<Transaction>(`/api/payments/transactions/${transactionId}`);
  }

  // Process refund
  async requestRefund(data: RefundRequest): Promise<ApiResponse<any>> {
    return apiClient.post('/api/payments/refund', data);
  }

  // Get refund status
  async getRefundStatus(refundId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/payments/refund/${refundId}/status`);
  }

  // Auto-pay mandate management
  async createAutoPayMandate(data: {
    loanId: string;
    bankAccountId: string;
    amount: number;
    frequency: string;
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<AutoPayMandate>> {
    return apiClient.post<AutoPayMandate>('/api/payments/autopay/create', data);
  }

  async getAutoPayMandates(): Promise<ApiResponse<AutoPayMandate[]>> {
    return apiClient.get<AutoPayMandate[]>('/api/payments/autopay');
  }

  async updateAutoPayMandate(mandateId: string, action: 'pause' | 'resume' | 'cancel'): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/payments/autopay/${mandateId}`, { action });
  }

  // Payment schedule
  async getPaymentSchedule(loanId: string): Promise<ApiResponse<PaymentSchedule>> {
    return apiClient.get<PaymentSchedule>(`/api/payments/schedule/${loanId}`);
  }

  // Make EMI payment
  async payEMI(loanId: string, data: {
    installmentNumber: number;
    amount: number;
    paymentMethod: string;
    bankAccountId?: string;
  }): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.post<PaymentResponse>(`/api/payments/emi/${loanId}`, data);
  }

  // Get payment methods
  async getPaymentMethods(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/payments/methods');
  }

  // Add payment method
  async addPaymentMethod(method: {
    type: string;
    details: any;
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/payments/methods', method);
  }

  // Delete payment method
  async deletePaymentMethod(methodId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/payments/methods/${methodId}`);
  }

  // Get payment receipt
  async getPaymentReceipt(transactionId: string): Promise<Blob> {
    const response = await fetch(`/api/payments/receipt/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });
    return response.blob();
  }

  // Calculate late payment charges
  async calculateLateCharges(loanId: string, daysOverdue: number): Promise<ApiResponse<{
    penaltyAmount: number;
    penaltyRate: number;
    totalDue: number;
  }>> {
    return apiClient.get(`/api/payments/late-charges?loanId=${loanId}&days=${daysOverdue}`);
  }

  // Bulk payment processing (for auto-debit)
  async processBulkPayments(payments: Array<{
    loanId: string;
    amount: number;
    dueDate: string;
  }>): Promise<ApiResponse<any>> {
    return apiClient.post('/api/payments/bulk-process', { payments });
  }

  // Payment reminders
  async getPaymentReminders(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/payments/reminders');
  }

  async updateReminderSettings(settings: {
    enableReminders: boolean;
    reminderDays: number[];
    reminderChannels: ('email' | 'sms' | 'push')[];
  }): Promise<ApiResponse<any>> {
    return apiClient.put('/api/payments/reminder-settings', settings);
  }
}

export const paymentsService = new PaymentsService();