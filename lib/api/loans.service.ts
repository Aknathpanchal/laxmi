import { apiClient, ApiResponse } from './api-client';

export interface LoanApplication {
  fullName: string;
  mobileNumber: string;
  email: string;
  panCard: string;
  aadhaarCard: string;
  loanAmount: number;
  loanType: 'PERSONAL' | 'HOME' | 'BUSINESS' | 'EDUCATION' | 'VEHICLE' | 'GOLD';
  tenure: number;
  purpose: string;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'STUDENT' | 'RETIRED';
  monthlyIncome: number;
  employerName?: string;
  designation?: string;
  workExperience?: number;
  preferredEMIDate?: number;
  requestGreenLoan?: boolean;
  enableVoiceBiometric?: boolean;
  acceptStepUpEMI?: boolean;
}

export interface EMICalculationRequest {
  principal: number;
  interestRate: number;
  tenure: number; // in months
}

export interface EMICalculationResponse {
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

export interface EligibilityCheckRequest {
  loanAmount: number;
  monthlyIncome: number;
  employmentType: string;
  creditScore?: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  interestRate: number;
  processingFee: number;
  features: string[];
}

export interface Loan {
  id: string;
  loanNumber: string;
  loanType: string;
  requestedAmount: number;
  approvedAmount?: number;
  disbursedAmount?: number;
  outstandingAmount?: number;
  interestRate: number;
  tenure: number;
  emiAmount?: number;
  status: string;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  nextDueDate?: string;
}

export interface PrepaymentCalculation {
  prepaymentAmount: number;
  savingsOnInterest: number;
  reducedTenure: number;
  newEMI?: number;
  closureAmount?: number;
}

export interface LoanRecommendation {
  loanType: string;
  recommendedAmount: number;
  recommendedTenure: number;
  interestRate: number;
  emi: number;
  eligibilityScore: number;
  reasons: string[];
}

class LoansService {
  // Apply for a loan
  async applyLoan(data: LoanApplication): Promise<ApiResponse<any>> {
    return apiClient.post('/api/loans/apply', data);
  }

  // Calculate EMI
  async calculateEMI(data: EMICalculationRequest): Promise<ApiResponse<EMICalculationResponse>> {
    return apiClient.post<EMICalculationResponse>('/api/loans/calculate-emi', data);
  }

  // Quick EMI calculation (GET)
  async quickEMICalculation(amount: number, rate: number, tenure: number): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/loans/calculate-emi?amount=${amount}&rate=${rate}&tenure=${tenure}`);
  }

  // Check eligibility
  async checkEligibility(data: EligibilityCheckRequest): Promise<ApiResponse<any>> {
    return apiClient.post('/api/loans/check-eligibility', data);
  }

  // Get loan products
  async getProducts(): Promise<ApiResponse<LoanProduct[]>> {
    return apiClient.get<LoanProduct[]>('/api/loans/products');
  }

  // Get user's loans
  async getMyLoans(): Promise<ApiResponse<Loan[]>> {
    return apiClient.get<Loan[]>('/api/loans/my-loans');
  }

  // Get loan by ID or details
  async getLoanById(id: string): Promise<ApiResponse<Loan>> {
    return apiClient.get<Loan>(`/api/loans/${id}`);
  }

  // Get loan details (detailed view)
  async getLoanDetails(id: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/loans/${id}`);
  }

  // Get repayment schedule
  async getRepaymentSchedule(loanId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/loans/schedule?loanId=${loanId}`);
  }

  // Calculate prepayment
  async calculatePrepayment(loanId: string, amount: number): Promise<ApiResponse<PrepaymentCalculation>> {
    return apiClient.post<PrepaymentCalculation>('/api/loans/prepayment', {
      loanId,
      prepaymentAmount: amount
    });
  }

  // Get AI recommendations
  async getRecommendations(userProfile?: any): Promise<ApiResponse<{ recommendations: LoanRecommendation[] }>> {
    return apiClient.get<{ recommendations: LoanRecommendation[] }>('/api/loans/recommendations');
  }

  // Upload loan documents
  async uploadDocuments(loanId: string, documents: FormData): Promise<ApiResponse<any>> {
    // For file uploads, we need to handle differently
    const response = await fetch(`/api/loans/${loanId}/documents`, {
      method: 'POST',
      body: documents,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  // Track application status
  async trackApplication(applicationId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/api/loans/track/${applicationId}`);
  }

  // Cancel loan application
  async cancelApplication(loanId: string, reason: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/loans/${loanId}/cancel`, { reason });
  }

  // Accept loan offer
  async acceptOffer(loanId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/loans/${loanId}/accept`, {});
  }

  // Initiate disbursement
  async initiateDisbursement(loanId: string, bankAccountId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/loans/${loanId}/disburse`, { bankAccountId });
  }
}

export const loansService = new LoansService();