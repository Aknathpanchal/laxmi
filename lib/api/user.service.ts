import { apiClient, ApiResponse } from './api-client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  dob?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  mobile?: string;
  address?: string;
  dob?: string;
}

class UserService {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/api/user/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>('/api/user/profile', data);
  }

  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/user/change-password', data);
  }

  async updateNotificationPreferences(data: any): Promise<ApiResponse<any>> {
    return apiClient.put('/api/user/notifications', data);
  }

  async getNotificationPreferences(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/user/notifications');
  }

  async uploadDocument(file: File, documentType: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return apiClient.post('/api/user/documents', formData);
  }

  async getDocuments(): Promise<ApiResponse<any>> {
    return apiClient.get('/api/user/documents');
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/user/documents/${documentId}`);
  }
}

export const userService = new UserService();