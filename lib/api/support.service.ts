import { apiClient, ApiResponse } from './api-client';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  category: 'loan' | 'payment' | 'kyc' | 'technical' | 'complaint' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'reopened';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  rating?: number;
  feedback?: string;
  attachments?: string[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'agent' | 'system';
  message: string;
  attachments?: string[];
  createdAt: string;
  isInternal?: boolean;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: string;
  priority?: string;
  attachments?: File[];
  relatedLoanId?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  views: number;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialization: string[];
  availability: 'available' | 'busy' | 'offline';
  rating: number;
  totalTicketsResolved: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: string;
  attachments?: string[];
  metadata?: any;
}

class SupportService {
  // Ticket Management
  async createTicket(data: CreateTicketRequest): Promise<ApiResponse<SupportTicket>> {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    formData.append('category', data.category);

    if (data.priority) formData.append('priority', data.priority);
    if (data.relatedLoanId) formData.append('relatedLoanId', data.relatedLoanId);

    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await fetch('/api/support/ticket', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  async getTickets(filters?: {
    status?: string;
    category?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    tickets: SupportTicket[];
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
    return apiClient.get(`/api/support/tickets?${queryParams.toString()}`);
  }

  async getTicketById(ticketId: string): Promise<ApiResponse<SupportTicket>> {
    return apiClient.get<SupportTicket>(`/api/support/ticket/${ticketId}`);
  }

  async updateTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<ApiResponse<SupportTicket>> {
    return apiClient.patch<SupportTicket>(`/api/support/ticket/${ticketId}`, updates);
  }

  async closeTicket(ticketId: string, resolution?: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/support/ticket/${ticketId}/close`, { resolution });
  }

  async reopenTicket(ticketId: string, reason: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/support/ticket/${ticketId}/reopen`, { reason });
  }

  // Ticket Messages
  async getTicketMessages(ticketId: string): Promise<ApiResponse<TicketMessage[]>> {
    return apiClient.get<TicketMessage[]>(`/api/support/ticket/${ticketId}/messages`);
  }

  async sendMessage(ticketId: string, message: string, attachments?: File[]): Promise<ApiResponse<TicketMessage>> {
    if (attachments && attachments.length > 0) {
      const formData = new FormData();
      formData.append('message', message);
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch(`/api/support/ticket/${ticketId}/message`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${apiClient['token']}`,
        },
      });

      return response.json();
    } else {
      return apiClient.post<TicketMessage>(`/api/support/ticket/${ticketId}/message`, { message });
    }
  }

  // Rate ticket resolution
  async rateTicket(ticketId: string, rating: number, feedback?: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/support/ticket/${ticketId}/rate`, { rating, feedback });
  }

  // FAQs
  async getFAQs(category?: string, search?: string): Promise<ApiResponse<FAQ[]>> {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    return apiClient.get<FAQ[]>(`/api/support/faqs?${queryParams.toString()}`);
  }

  async getFAQById(faqId: string): Promise<ApiResponse<FAQ>> {
    return apiClient.get<FAQ>(`/api/support/faq/${faqId}`);
  }

  async rateFAQ(faqId: string, helpful: boolean): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/support/faq/${faqId}/rate`, { helpful });
  }

  // Live Chat
  async initiateLiveChat(topic?: string): Promise<ApiResponse<{
    sessionId: string;
    agent?: SupportAgent;
    estimatedWaitTime?: number;
  }>> {
    return apiClient.post('/api/support/chat/initiate', { topic });
  }

  async sendChatMessage(sessionId: string, message: string): Promise<ApiResponse<ChatMessage>> {
    return apiClient.post<ChatMessage>('/api/support/chat/message', { sessionId, message });
  }

  async getChatHistory(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    return apiClient.get<ChatMessage[]>(`/api/support/chat/${sessionId}/history`);
  }

  async endChatSession(sessionId: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/support/chat/${sessionId}/end`, {});
  }

  async requestCallback(data: {
    phoneNumber: string;
    preferredTime?: string;
    topic: string;
  }): Promise<ApiResponse<any>> {
    return apiClient.post('/api/support/callback', data);
  }

  // Support Categories
  async getSupportCategories(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/api/support/categories');
  }

  // Check support availability
  async checkAvailability(): Promise<ApiResponse<{
    isAvailable: boolean;
    workingHours: string;
    availableAgents: number;
    estimatedWaitTime: number;
  }>> {
    return apiClient.get('/api/support/availability');
  }

  // Upload attachment
  async uploadAttachment(file: File): Promise<ApiResponse<{ url: string; fileId: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/support/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  // Get knowledge base articles
  async getKnowledgeBase(search?: string): Promise<ApiResponse<any[]>> {
    const queryParams = search ? `?search=${search}` : '';
    return apiClient.get(`/api/support/knowledge-base${queryParams}`);
  }

  // Emergency support
  async requestEmergencySupport(reason: string): Promise<ApiResponse<{
    ticketId: string;
    estimatedResponseTime: number;
  }>> {
    return apiClient.post('/api/support/emergency', { reason });
  }
}

export const supportService = new SupportService();