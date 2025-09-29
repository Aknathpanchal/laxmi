import { apiClient, ApiResponse } from './api-client';

export interface LoginRequest {
  emailOrMobile: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  userType?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
  };
}

export interface RegisterResponse {
  userId: string;
  token: string;
  requiresVerification: boolean;
  otp?: string; // Only in development
}

class AuthService {
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Temporarily use mock login due to Prisma issue
    const response = await apiClient.post<LoginResponse>('/api/auth/mock-login', data);

    // Store token if login successful
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', {
      ...data,
      userType: data.userType || 'CUSTOMER'
    });

    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    // Clear token from storage
    apiClient.clearToken();

    // Optionally call backend logout endpoint if exists
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.log('Logout endpoint not available');
    }
  }

  async verifyOTP(mobile: string, otp: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/verify-otp', { mobile, otp });
  }

  async sendOTP(mobile: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/send-otp', { mobile });
  }

  async resetPassword(email: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/reset-password', { email });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/change-password', data);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}

export const authService = new AuthService();