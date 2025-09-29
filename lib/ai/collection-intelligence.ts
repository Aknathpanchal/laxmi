export interface CollectionCase {
  userId: string;
  loanId: string;
  outstandingAmount: number;
  daysOverdue: number;
  previousAttempts: number;
  customerProfile: any;
}

export interface CollectionStrategy {
  priority: 'high' | 'medium' | 'low';
  recommendedActions: string[];
  bestTimeToContact: string;
  communicationChannel: string;
  negotiationOptions: Array<{
    type: string;
    terms: string;
    likelihood: number;
  }>;
  estimatedRecovery: number;
}

class CollectionIntelligence {
  async analyzeCase(caseData: CollectionCase): Promise<CollectionStrategy> {
    let priority: 'high' | 'medium' | 'low' = 'medium';
    const recommendedActions: string[] = [];

    // Determine priority based on amount and overdue days
    if (caseData.outstandingAmount > 100000 || caseData.daysOverdue > 90) {
      priority = 'high';
    } else if (caseData.outstandingAmount < 10000 && caseData.daysOverdue < 30) {
      priority = 'low';
    }

    // Recommend actions based on previous attempts
    if (caseData.previousAttempts === 0) {
      recommendedActions.push('Send friendly reminder SMS');
      recommendedActions.push('Automated voice call');
    } else if (caseData.previousAttempts < 3) {
      recommendedActions.push('Personal phone call from agent');
      recommendedActions.push('Email with payment options');
    } else {
      recommendedActions.push('Field visit');
      recommendedActions.push('Legal notice preparation');
    }

    // Determine best time to contact
    const bestTimeToContact = this.determineBestContactTime(caseData.customerProfile);

    // Determine communication channel
    const communicationChannel = this.determineChannel(caseData);

    // Generate negotiation options
    const negotiationOptions = this.generateNegotiationOptions(caseData);

    // Estimate recovery probability
    const estimatedRecovery = this.estimateRecovery(caseData);

    return {
      priority,
      recommendedActions,
      bestTimeToContact,
      communicationChannel,
      negotiationOptions,
      estimatedRecovery
    };
  }

  private determineBestContactTime(profile: any): string {
    // Simplified logic - in production would use ML model
    if (profile?.employmentType === 'salaried') {
      return 'Evening (6 PM - 8 PM)';
    } else if (profile?.employmentType === 'business') {
      return 'Morning (10 AM - 12 PM)';
    }
    return 'Afternoon (2 PM - 4 PM)';
  }

  private determineChannel(caseData: CollectionCase): string {
    if (caseData.daysOverdue < 15) {
      return 'SMS';
    } else if (caseData.daysOverdue < 30) {
      return 'Phone Call';
    } else if (caseData.daysOverdue < 60) {
      return 'Field Visit';
    }
    return 'Legal Notice';
  }

  private generateNegotiationOptions(caseData: CollectionCase): any[] {
    const options = [];

    // Settlement option
    if (caseData.daysOverdue > 60) {
      options.push({
        type: 'Settlement',
        terms: `Pay ${caseData.outstandingAmount * 0.8} immediately`,
        likelihood: 0.6
      });
    }

    // Restructuring option
    options.push({
      type: 'Restructuring',
      terms: 'Extend tenure by 6 months with revised EMI',
      likelihood: 0.7
    });

    // Partial payment option
    options.push({
      type: 'Partial Payment',
      terms: `Pay ${caseData.outstandingAmount * 0.3} now, rest in 3 months`,
      likelihood: 0.8
    });

    return options;
  }

  private estimateRecovery(caseData: CollectionCase): number {
    let recoveryProbability = 0.5;

    // Adjust based on overdue days
    if (caseData.daysOverdue < 30) {
      recoveryProbability += 0.3;
    } else if (caseData.daysOverdue < 60) {
      recoveryProbability += 0.1;
    } else if (caseData.daysOverdue > 90) {
      recoveryProbability -= 0.2;
    }

    // Adjust based on previous attempts
    if (caseData.previousAttempts > 5) {
      recoveryProbability -= 0.2;
    }

    return Math.max(0.1, Math.min(0.95, recoveryProbability)) * caseData.outstandingAmount;
  }

  async trackCollectionActivity(caseId: string, activity: any): Promise<void> {
    console.log(`Collection activity tracked for case ${caseId}:`, activity);
  }
}

export const collectionIntelligence = new CollectionIntelligence();