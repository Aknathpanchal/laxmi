export interface BehaviorData {
  userId: string;
  sessionId: string;
  events: Array<{
    type: string;
    timestamp: number;
    data?: any;
  }>;
}

export interface BehaviorAnalysisResult {
  isAnomalous: boolean;
  anomalyScore: number;
  patterns: string[];
  recommendations: string[];
}

class BehaviorAnalytics {
  async analyzeBehavior(data: BehaviorData): Promise<BehaviorAnalysisResult> {
    const patterns: string[] = [];
    let anomalyScore = 0;

    // Analyze event frequency
    const eventFrequency = data.events.length / 60; // Events per minute
    if (eventFrequency > 100) {
      patterns.push('High event frequency');
      anomalyScore += 30;
    }

    // Check for repeated patterns
    const eventTypes = data.events.map(e => e.type);
    const uniqueEvents = new Set(eventTypes).size;
    if (uniqueEvents < eventTypes.length * 0.2) {
      patterns.push('Repetitive behavior detected');
      anomalyScore += 20;
    }

    // Time-based analysis
    const timestamps = data.events.map(e => e.timestamp);
    const intervals = timestamps.slice(1).map((t, i) => t - timestamps[i]);
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    if (avgInterval < 100) { // Less than 100ms between events
      patterns.push('Bot-like timing pattern');
      anomalyScore += 40;
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (anomalyScore > 50) {
      recommendations.push('Enable additional security checks');
      recommendations.push('Monitor user activity closely');
    }

    return {
      isAnomalous: anomalyScore > 60,
      anomalyScore,
      patterns,
      recommendations
    };
  }

  async trackEvent(userId: string, event: any): Promise<void> {
    console.log(`Event tracked for user ${userId}:`, event);
  }
}

export const behaviorAnalytics = new BehaviorAnalytics();