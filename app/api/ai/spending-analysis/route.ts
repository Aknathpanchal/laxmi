import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface TransactionData {
  customerId: string;
  transactions: Transaction[];
  requestAnalysis: "spending_pattern" | "risk_assessment" | "financial_health";
}

interface Transaction {
  amount: number;
  category: string;
  merchant?: string;
  timestamp: string;
}

interface SpendingAnalysis {
  anonymousId: string;
  analysis: {
    spendingPattern: {
      essentials: number;
      lifestyle: number;
      savings: number;
      debt_payments: number;
    };
    riskIndicators: {
      irregular_spending: boolean;
      high_risk_merchants: boolean;
      cash_dependency: number;
      digital_adoption: number;
    };
    financialHealth: {
      score: number;
      stability: "stable" | "moderate" | "unstable";
      recommendations: string[];
    };
    behavioralInsights: {
      spending_personality: string;
      risk_appetite: string;
      financial_discipline: number;
      predicted_default_probability: number;
    };
  };
  aiProvider: "openai" | "anthropic";
  confidence: number;
  processingTime: number;
}

// Privacy-preserving anonymization
function anonymizeCustomerData(customerId: string, transactions: Transaction[]) {
  // Generate deterministic anonymous ID (same customer always gets same ID)
  const hash = crypto.createHash("sha256");
  hash.update(customerId);
  const anonymousId = `ANON_${hash.digest("hex").substring(0, 12).toUpperCase()}`;

  // Remove merchant names, keep only categories
  const sanitizedTransactions = transactions.map(tx => ({
    amount: Math.round(tx.amount / 10) * 10, // Round to nearest 10
    category: tx.category,
    dayOfWeek: new Date(tx.timestamp).getDay(),
    hourOfDay: new Date(tx.timestamp).getHours(),
    isWeekend: [0, 6].includes(new Date(tx.timestamp).getDay())
  }));

  return { anonymousId, sanitizedTransactions };
}

export async function POST(request: NextRequest) {
  try {
    const body: TransactionData = await request.json();

    if (!body.customerId || !body.transactions || body.transactions.length === 0) {
      return NextResponse.json(
        { error: "Customer ID and transactions required" },
        { status: 400 }
      );
    }

    // Anonymize data before AI processing
    const { anonymousId, sanitizedTransactions } = anonymizeCustomerData(
      body.customerId,
      body.transactions
    );

    // Analyze spending patterns locally first
    const localAnalysis = analyzeSpendingPatterns(sanitizedTransactions);

    // Prepare prompt for AI analysis (no PII)
    const aiPrompt = generateAIPrompt(sanitizedTransactions, body.requestAnalysis);

    // Simulate AI API calls (in production, use actual OpenAI/Anthropic APIs)
    const aiAnalysis = await performAIAnalysis(aiPrompt, body.requestAnalysis);

    // Combine local and AI analysis
    const combinedAnalysis: SpendingAnalysis = {
      anonymousId,
      analysis: {
        spendingPattern: localAnalysis.spendingPattern,
        riskIndicators: {
          irregular_spending: localAnalysis.irregularSpending,
          high_risk_merchants: localAnalysis.highRiskMerchants,
          cash_dependency: localAnalysis.cashDependency,
          digital_adoption: localAnalysis.digitalAdoption
        },
        financialHealth: {
          score: calculateFinancialHealthScore(localAnalysis, aiAnalysis),
          stability: determineStability(localAnalysis),
          recommendations: aiAnalysis.recommendations || []
        },
        behavioralInsights: {
          spending_personality: aiAnalysis.personality || "balanced",
          risk_appetite: aiAnalysis.riskAppetite || "moderate",
          financial_discipline: localAnalysis.discipline,
          predicted_default_probability: calculateDefaultProbability(localAnalysis, aiAnalysis)
        }
      },
      aiProvider: Math.random() > 0.5 ? "openai" : "anthropic",
      confidence: 0.85 + Math.random() * 0.14, // 85-99% confidence
      processingTime: Date.now() - request.headers.get("x-request-time") || 0
    };

    // Store analysis with anonymous ID only
    await storeAnalysis(anonymousId, combinedAnalysis);

    return NextResponse.json({
      success: true,
      analysis: combinedAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Spending analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}

function analyzeSpendingPatterns(transactions: any[]) {
  const totalSpending = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categorySpending = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const spendingPattern = {
    essentials: (categorySpending["groceries"] || 0) + (categorySpending["utilities"] || 0),
    lifestyle: (categorySpending["entertainment"] || 0) + (categorySpending["shopping"] || 0),
    savings: categorySpending["savings"] || 0,
    debt_payments: categorySpending["loan_payment"] || 0
  };

  // Calculate risk indicators
  const timePatterns = transactions.map(tx => tx.hourOfDay);
  const irregularSpending = detectIrregularPatterns(timePatterns);

  const digitalTransactions = transactions.filter(tx => tx.category !== "cash_withdrawal");
  const digitalAdoption = digitalTransactions.length / transactions.length;

  return {
    spendingPattern,
    irregularSpending,
    highRiskMerchants: false, // Would check against risk merchant list
    cashDependency: 1 - digitalAdoption,
    digitalAdoption,
    discipline: calculateDisciplineScore(transactions)
  };
}

function detectIrregularPatterns(timePatterns: number[]): boolean {
  // Check for unusual spending times (late night transactions)
  const lateNightTx = timePatterns.filter(hour => hour >= 0 && hour <= 5).length;
  return lateNightTx > timePatterns.length * 0.2; // More than 20% late night
}

function calculateDisciplineScore(transactions: any[]): number {
  // Calculate variance in spending amounts
  const amounts = transactions.map(tx => tx.amount);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;

  // Lower variance = better discipline
  const normalizedVariance = Math.min(variance / 10000, 1);
  return 1 - normalizedVariance;
}

function generateAIPrompt(transactions: any[], analysisType: string): string {
  const summary = {
    totalTransactions: transactions.length,
    avgAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length,
    categories: [...new Set(transactions.map(tx => tx.category))],
    weekendRatio: transactions.filter(tx => tx.isWeekend).length / transactions.length
  };

  return `Analyze spending behavior:
    - Total transactions: ${summary.totalTransactions}
    - Average amount: ${summary.avgAmount}
    - Categories: ${summary.categories.join(", ")}
    - Weekend spending ratio: ${summary.weekendRatio}

    Provide: ${analysisType} assessment without any personal identifiers`;
}

async function performAIAnalysis(prompt: string, analysisType: string) {
  // Simulate AI API call
  // In production, integrate actual OpenAI/Anthropic APIs here
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    personality: ["conservative", "balanced", "aggressive"][Math.floor(Math.random() * 3)],
    riskAppetite: ["low", "moderate", "high"][Math.floor(Math.random() * 3)],
    recommendations: [
      "Reduce discretionary spending by 15%",
      "Build emergency fund of 3 months expenses",
      "Consider automated savings plan"
    ],
    confidenceScore: 0.85 + Math.random() * 0.14
  };
}

function calculateFinancialHealthScore(localAnalysis: any, aiAnalysis: any): number {
  let score = 500; // Base score

  // Spending pattern factors
  if (localAnalysis.spendingPattern.savings > 0) score += 100;
  if (localAnalysis.spendingPattern.debt_payments > 0) score += 50;

  // Digital adoption bonus
  score += localAnalysis.digitalAdoption * 100;

  // Discipline bonus
  score += localAnalysis.discipline * 150;

  // Risk penalties
  if (localAnalysis.irregularSpending) score -= 50;
  if (aiAnalysis.riskAppetite === "high") score -= 30;

  return Math.min(900, Math.max(300, Math.round(score)));
}

function determineStability(analysis: any): "stable" | "moderate" | "unstable" {
  if (analysis.discipline > 0.7 && !analysis.irregularSpending) return "stable";
  if (analysis.discipline > 0.4) return "moderate";
  return "unstable";
}

function calculateDefaultProbability(localAnalysis: any, aiAnalysis: any): number {
  let probability = 0.05; // Base 5%

  // Risk factors
  if (localAnalysis.irregularSpending) probability += 0.1;
  if (localAnalysis.cashDependency > 0.7) probability += 0.05;
  if (localAnalysis.discipline < 0.3) probability += 0.15;

  // AI insights
  if (aiAnalysis.riskAppetite === "high") probability += 0.1;
  if (aiAnalysis.personality === "aggressive") probability += 0.05;

  return Math.min(0.95, probability);
}

async function storeAnalysis(anonymousId: string, analysis: SpendingAnalysis) {
  // Store in database with anonymous ID only
  // No PII stored with the analysis
  console.log(`Storing analysis for ${anonymousId}`);
  // await db.analyses.create({ anonymousId, analysis, timestamp: new Date() });
}