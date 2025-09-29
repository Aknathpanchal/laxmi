export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: 'claude-3-opus-20240229',
    maxTokens: 4000
  },
  fraudDetection: {
    threshold: 0.7,
    highRiskThreshold: 0.9,
    modelVersion: 'v2.0'
  },
  creditScoring: {
    minScore: 300,
    maxScore: 900,
    defaultScore: 650
  },
  collectionIntelligence: {
    maxAttempts: 10,
    escalationThreshold: 5
  }
};

export default aiConfig;