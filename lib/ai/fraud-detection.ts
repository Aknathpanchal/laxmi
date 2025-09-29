export interface FraudCheckData {
  userId?: string;
  transactionType: string;
  amount?: number;
  deviceInfo?: any;
  behaviorMetrics?: any;
}

export interface FraudCheckResult {
  isFraudulent: boolean;
  riskScore: number;
  riskLevel: string;
  fraudIndicators: string[];
  suggestedActions: string[];
}

class FraudDetection {
  async checkFraud(data: FraudCheckData): Promise<FraudCheckResult> {
    const indicators: string[] = [];
    let riskScore = 0;

    // Check transaction amount
    if (data.amount && data.amount > 100000) {
      indicators.push('High value transaction');
      riskScore += 20;
    }

    // Check device info
    if (data.deviceInfo?.isVPN) {
      indicators.push('VPN detected');
      riskScore += 15;
    }

    // Check behavior metrics
    if (data.behaviorMetrics?.rapidClicks > 10) {
      indicators.push('Suspicious clicking pattern');
      riskScore += 10;
    }

    // Determine risk level
    let riskLevel = 'low';
    if (riskScore > 60) riskLevel = 'high';
    else if (riskScore > 30) riskLevel = 'medium';

    // Generate suggested actions
    const suggestedActions: string[] = [];
    if (riskLevel === 'high') {
      suggestedActions.push('Require additional verification');
      suggestedActions.push('Manual review required');
    } else if (riskLevel === 'medium') {
      suggestedActions.push('Monitor transaction');
    }

    return {
      isFraudulent: riskScore > 70,
      riskScore,
      riskLevel,
      fraudIndicators: indicators,
      suggestedActions
    };
  }

  async reportFraud(userId: string, details: any): Promise<void> {
    console.log(`Fraud reported for user ${userId}:`, details);
  }
}

export const fraudDetection = new FraudDetection();