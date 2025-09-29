import { apiClient, ApiResponse } from './api-client';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender?: string;
  maritalStatus?: string;
  panCard?: string;
  aadharNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  kycStatus: string;
  creditScore?: number;
}

export interface KYCDocument {
  documentType: string;
  documentNumber: string;
  documentImage?: File | string;
  verificationStatus?: string;
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  accountType: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface CreditScoreResponse {
  score: number;
  rating: string;
  factors: {
    paymentHistory: number;
    creditUtilization: number;
    creditAge: number;
    creditMix: number;
    newCredit: number;
  };
  lastUpdated: string;
  recommendations: string[];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  employmentType?: string;
  companyName?: string;
  designation?: string;
  monthlyIncome?: number;
}

export interface EmploymentDetails {
  employmentType: string;
  companyName?: string;
  designation?: string;
  workEmail?: string;
  monthlyIncome: number;
  workExperience?: number;
  officeAddress?: string;
  hrContactNumber?: string;
}

class UsersService {
  // Get user profile
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/api/users/profile');
  }

  // Update user profile
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/api/users/update', data);
  }

  // Upload profile image
  async uploadProfileImage(image: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/users/profile-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  // KYC Verification
  async submitKYC(documents: KYCDocument[]): Promise<ApiResponse<any>> {
    return apiClient.post('/api/users/kyc', { documents });
  }

  // Get KYC status
  async getKYCStatus(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/users/kyc');
  }

  // Upload KYC document
  async uploadKYCDocument(documentType: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await fetch('/api/users/kyc/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  // Get credit score
  async getCreditScore(): Promise<ApiResponse<CreditScoreResponse>> {
    return apiClient.get<CreditScoreResponse>('/api/users/credit-score');
  }

  // Refresh credit score
  async refreshCreditScore(): Promise<ApiResponse<CreditScoreResponse>> {
    return apiClient.post<CreditScoreResponse>('/api/users/credit-score/refresh');
  }

  // Bank accounts management
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get<BankAccount[]>('/api/users/bank-accounts');
  }

  async addBankAccount(account: Omit<BankAccount, 'id' | 'isVerified'>): Promise<ApiResponse<BankAccount>> {
    return apiClient.post<BankAccount>('/api/users/bank-accounts', account);
  }

  async updateBankAccount(id: string, account: Partial<BankAccount>): Promise<ApiResponse<BankAccount>> {
    return apiClient.patch<BankAccount>(`/api/users/bank-accounts/${id}`, account);
  }

  async deleteBankAccount(id: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/users/bank-accounts/${id}`);
  }

  async verifyBankAccount(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/users/bank-accounts/${id}/verify`, {});
  }

  async setPrimaryBankAccount(id: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/users/bank-accounts/${id}/set-primary`, {});
  }

  // Employment details
  async getEmploymentDetails(): Promise<ApiResponse<EmploymentDetails>> {
    return apiClient.get<EmploymentDetails>('/api/users/employment');
  }

  async updateEmploymentDetails(data: EmploymentDetails): Promise<ApiResponse<EmploymentDetails>> {
    return apiClient.put<EmploymentDetails>('/api/users/employment', data);
  }

  // Documents
  async getDocuments(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>('/api/users/documents');
  }

  async uploadDocument(documentType: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    const response = await fetch('/api/users/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/users/documents/${documentId}`);
  }

  // Notifications preferences
  async getNotificationPreferences(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/users/notification-preferences');
  }

  async updateNotificationPreferences(preferences: any): Promise<ApiResponse<any>> {
    return apiClient.put('/api/users/notification-preferences', preferences);
  }

  // Security settings
  async enable2FA(): Promise<ApiResponse<{ qrCode: string; secret: string }>> {
    return apiClient.post('/api/users/security/2fa/enable', {});
  }

  async disable2FA(code: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/users/security/2fa/disable', { code });
  }

  async verify2FA(code: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/users/security/2fa/verify', { code });
  }
}

export const usersService = new UsersService();