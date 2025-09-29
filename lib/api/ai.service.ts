import { apiClient, ApiResponse } from './api-client';

export interface CreditScoreAnalysis {
  score: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidence: number;
  factors: {
    incomeStability: number;
    debtToIncomeRatio: number;
    paymentHistory: number;
    creditUtilization: number;
    employmentHistory: number;
    financialBehavior: number;
  };
  insights: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  approvalProbability: number;
}

export interface FraudCheckResult {
  isFraudulent: boolean;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suspiciousPatterns: string[];
  verificationRequired: string[];
  recommendedActions: string[];
  metadata: {
    ipAddress?: string;
    deviceFingerprint?: string;
    behaviorScore?: number;
    velocityCheck?: boolean;
  };
}

export interface SpendingAnalysisRequest {
  monthlyIncome: number;
  expenses: {
    category: string;
    amount: number;
  }[];
  existingEMIs?: number;
  dependents?: number;
  location?: string;
}

export interface SpendingAnalysisResponse {
  affordableEMI: number;
  savingsRatio: number;
  spendingPatterns: {
    essentials: number;
    lifestyle: number;
    savings: number;
    debt: number;
  };
  financialHealth: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendations: string[];
  insights: {
    category: string;
    message: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface CollectionIntelligence {
  userId: string;
  loanId: string;
  strategy: 'soft' | 'moderate' | 'intensive';
  recommendedActions: {
    action: string;
    priority: number;
    expectedSuccess: number;
    timing: string;
  }[];
  contactPreferences: {
    channel: 'call' | 'sms' | 'email' | 'whatsapp';
    bestTime: string;
    frequency: string;
  };
  paymentProbability: number;
  riskOfDefault: number;
  suggestedSettlement?: {
    amount: number;
    terms: string;
  };
}

export interface DocumentAnalysis {
  documentType: string;
  isValid: boolean;
  extractedData: any;
  confidence: number;
  anomalies: string[];
  verificationStatus: 'verified' | 'needs_review' | 'rejected';
}

export interface BehaviorAnalytics {
  userId: string;
  behaviorScore: number;
  patterns: {
    loginFrequency: string;
    transactionPatterns: string;
    paymentBehavior: string;
    appUsage: string;
  };
  anomalies: string[];
  predictions: {
    defaultProbability: number;
    churnProbability: number;
    upsellProbability: number;
  };
  segments: string[];
}

export interface LoanRecommendationAI {
  userProfile: any;
  preferences?: {
    maxEMI?: number;
    preferredTenure?: number;
    purpose?: string;
  };
}

export interface AILoanRecommendation {
  recommendedProducts: Array<{
    productName: string;
    loanAmount: number;
    tenure: number;
    interestRate: number;
    emi: number;
    matchScore: number;
    reasons: string[];
  }>;
  insights: string[];
  alternativeOptions: any[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'very_high';
  riskScore: number;
  factors: {
    creditRisk: number;
    operationalRisk: number;
    marketRisk: number;
    fraudRisk: number;
  };
  mitigationStrategies: string[];
  monitoringRequired: boolean;
  reviewFrequency: 'daily' | 'weekly' | 'monthly';
}

class AIService {
  // Credit Scoring
  async analyzeCreditScore(userData: any): Promise<ApiResponse<CreditScoreAnalysis>> {
    return apiClient.post<CreditScoreAnalysis>('/api/ai/credit-score', userData);
  }

  // Fraud Detection
  async checkFraud(data: {
    userId?: string;
    transactionData?: any;
    applicationData?: any;
  }): Promise<ApiResponse<FraudCheckResult>> {
    return apiClient.post<FraudCheckResult>('/api/ai/fraud-check', data);
  }

  // Spending Analysis
  async analyzeSpending(data: SpendingAnalysisRequest): Promise<ApiResponse<SpendingAnalysisResponse>> {
    return apiClient.post<SpendingAnalysisResponse>('/api/ai/spending-analysis', data);
  }

  // Collection Intelligence
  async getCollectionStrategy(data: {
    userId: string;
    loanId: string;
    daysOverdue: number;
    overdueAmount: number;
  }): Promise<ApiResponse<CollectionIntelligence>> {
    return apiClient.post<CollectionIntelligence>('/api/ai/collection', data);
  }

  // Document Processing
  async analyzeDocument(documentFile: File, documentType: string): Promise<ApiResponse<DocumentAnalysis>> {
    const formData = new FormData();
    formData.append('document', documentFile);
    formData.append('documentType', documentType);

    const response = await fetch('/api/ai/document-analysis', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  // Behavior Analytics
  async analyzeBehavior(userId: string): Promise<ApiResponse<BehaviorAnalytics>> {
    return apiClient.get<BehaviorAnalytics>(`/api/ai/behavior/${userId}`);
  }

  // Loan Recommendations
  async getLoanRecommendations(data: LoanRecommendationAI): Promise<ApiResponse<AILoanRecommendation>> {
    return apiClient.post<AILoanRecommendation>('/api/ai/recommendations', data);
  }

  // Risk Assessment
  async assessRisk(data: {
    loanId?: string;
    userId?: string;
    portfolioData?: any;
  }): Promise<ApiResponse<RiskAssessment>> {
    return apiClient.post<RiskAssessment>('/api/ai/risk-assessment', data);
  }

  // Income Prediction
  async predictIncome(data: {
    currentIncome: number;
    profession: string;
    experience: number;
    education: string;
    location: string;
  }): Promise<ApiResponse<{
    predictedIncome: Array<{
      year: number;
      income: number;
      confidence: number;
    }>;
    growthRate: number;
    insights: string[];
  }>> {
    return apiClient.post('/api/ai/income-prediction', data);
  }

  // Customer Segmentation
  async segmentCustomer(userId: string): Promise<ApiResponse<{
    segment: string;
    characteristics: string[];
    recommendedProducts: string[];
    communicationStrategy: any;
  }>> {
    return apiClient.get(`/api/ai/customer-segment/${userId}`);
  }

  // Chatbot Support
  async chatWithSupport(message: string, context?: any): Promise<ApiResponse<{
    response: string;
    suggestedActions?: string[];
    needsHumanSupport: boolean;
  }>> {
    return apiClient.post('/api/ai/chat', { message, context });
  }

  // Underwriting Decision
  async getUnderwritingDecision(applicationData: any): Promise<ApiResponse<{
    decision: 'approve' | 'reject' | 'manual_review';
    score: number;
    reasons: string[];
    conditions?: string[];
    suggestedTerms?: {
      amount: number;
      tenure: number;
      interestRate: number;
    };
  }>> {
    return apiClient.post('/api/ai/underwriting', applicationData);
  }

  // OCR Service
  async extractTextFromImage(image: File): Promise<ApiResponse<{
    text: string;
    confidence: number;
    structuredData?: any;
  }>> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/ai/ocr', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }

  // Voice Biometric Verification
  async verifyVoice(audioFile: File, userId: string): Promise<ApiResponse<{
    isMatch: boolean;
    confidence: number;
    needsReenrollment: boolean;
  }>> {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('userId', userId);

    const response = await fetch('/api/ai/voice-verify', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${apiClient['token']}`,
      },
    });

    return response.json();
  }
}

export const aiService = new AIService();