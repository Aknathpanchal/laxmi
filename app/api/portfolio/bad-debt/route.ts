import { NextRequest, NextResponse } from "next/server";

interface BadDebtMetrics {
  portfolioId: string;
  asOfDate: string;
  totalPortfolio: {
    accounts: number;
    outstanding: number;
    disbursedAmount: number;
  };
  delinquency: {
    dpd0_30: { accounts: number; amount: number; percentage: number };
    dpd31_60: { accounts: number; amount: number; percentage: number };
    dpd61_90: { accounts: number; amount: number; percentage: number };
    dpd91_180: { accounts: number; amount: number; percentage: number };
    dpd180_plus: { accounts: number; amount: number; percentage: number };
    npa: { accounts: number; amount: number; percentage: number };
  };
  vintageAnalysis: {
    cohort: string;
    disbursedAmount: number;
    currentOutstanding: number;
    chargeOffRate: number;
    recoveryRate: number;
  }[];
  provisioningRequirement: {
    standard_assets: number;
    substandard_assets: number;
    doubtful_assets: number;
    loss_assets: number;
    total_provision: number;
    provision_coverage_ratio: number;
  };
  collectionEfficiency: {
    current_month: number;
    last_3_months: number;
    last_6_months: number;
    last_12_months: number;
  };
  earlyWarningSignals: {
    accountId: string;
    customerName: string;
    outstandingAmount: number;
    riskScore: number;
    predictedDPD: number;
    recommendedAction: string;
  }[];
  recoveryPipeline: {
    stage: string;
    accounts: number;
    amount: number;
    expectedRecovery: number;
    timelinesDays: number;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const portfolioId = searchParams.get("portfolioId") || "DEFAULT";
    const asOfDate = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Generate comprehensive bad debt metrics
    const metrics = await generateBadDebtMetrics(portfolioId, asOfDate);

    return NextResponse.json({
      success: true,
      metrics,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Bad debt metrics error:", error);
    return NextResponse.json(
      { error: "Failed to generate bad debt metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, loanId, amount, reason } = body;

    let result;

    switch (action) {
      case "write_off":
        result = await processWriteOff(loanId, amount, reason);
        break;
      case "restructure":
        result = await processRestructuring(loanId, body.restructureTerms);
        break;
      case "legal_action":
        result = await initiateLegalAction(loanId, body.legalDetails);
        break;
      case "settlement":
        result = await processSettlement(loanId, amount, body.settlementTerms);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Bad debt action error:", error);
    return NextResponse.json(
      { error: "Bad debt action failed" },
      { status: 500 }
    );
  }
}

async function generateBadDebtMetrics(portfolioId: string, asOfDate: string): Promise<BadDebtMetrics> {
  // In production, fetch from database
  const totalOutstanding = 10000000000; // 1000 Cr
  const totalAccounts = 50000;

  // Simulate delinquency buckets
  const delinquency = {
    dpd0_30: {
      accounts: Math.floor(totalAccounts * 0.05),
      amount: totalOutstanding * 0.03,
      percentage: 3
    },
    dpd31_60: {
      accounts: Math.floor(totalAccounts * 0.03),
      amount: totalOutstanding * 0.02,
      percentage: 2
    },
    dpd61_90: {
      accounts: Math.floor(totalAccounts * 0.02),
      amount: totalOutstanding * 0.015,
      percentage: 1.5
    },
    dpd91_180: {
      accounts: Math.floor(totalAccounts * 0.015),
      amount: totalOutstanding * 0.012,
      percentage: 1.2
    },
    dpd180_plus: {
      accounts: Math.floor(totalAccounts * 0.01),
      amount: totalOutstanding * 0.01,
      percentage: 1
    },
    npa: {
      accounts: Math.floor(totalAccounts * 0.008),
      amount: totalOutstanding * 0.008,
      percentage: 0.8
    }
  };

  // Vintage analysis by monthly cohorts
  const vintageAnalysis = generateVintageAnalysis();

  // RBI provisioning norms
  const provisioningRequirement = calculateProvisioning(delinquency, totalOutstanding);

  // Collection efficiency
  const collectionEfficiency = {
    current_month: 92.5,
    last_3_months: 91.2,
    last_6_months: 90.8,
    last_12_months: 89.5
  };

  // Early warning signals using ML
  const earlyWarningSignals = await detectEarlyWarningSignals();

  // Recovery pipeline stages
  const recoveryPipeline = [
    {
      stage: "Soft Collection",
      accounts: 2500,
      amount: 125000000,
      expectedRecovery: 93750000,
      timelinesDays: 30
    },
    {
      stage: "Hard Collection",
      accounts: 1200,
      amount: 75000000,
      expectedRecovery: 45000000,
      timelinesDays: 60
    },
    {
      stage: "Legal Notice",
      accounts: 500,
      amount: 45000000,
      expectedRecovery: 22500000,
      timelinesDays: 90
    },
    {
      stage: "SARFAESI",
      accounts: 100,
      amount: 25000000,
      expectedRecovery: 10000000,
      timelinesDays: 180
    },
    {
      stage: "DRT",
      accounts: 50,
      amount: 15000000,
      expectedRecovery: 3000000,
      timelinesDays: 365
    }
  ];

  return {
    portfolioId,
    asOfDate,
    totalPortfolio: {
      accounts: totalAccounts,
      outstanding: totalOutstanding,
      disbursedAmount: totalOutstanding * 1.2
    },
    delinquency,
    vintageAnalysis,
    provisioningRequirement,
    collectionEfficiency,
    earlyWarningSignals,
    recoveryPipeline
  };
}

function generateVintageAnalysis() {
  const cohorts = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const cohortDate = new Date(currentDate);
    cohortDate.setMonth(cohortDate.getMonth() - i);
    const cohortName = cohortDate.toISOString().substring(0, 7);

    cohorts.push({
      cohort: cohortName,
      disbursedAmount: 800000000 + Math.random() * 200000000,
      currentOutstanding: 700000000 + Math.random() * 150000000,
      chargeOffRate: Math.random() * 2 + 0.5, // 0.5-2.5%
      recoveryRate: Math.random() * 20 + 10 // 10-30%
    });
  }

  return cohorts;
}

function calculateProvisioning(delinquency: any, totalOutstanding: number) {
  // RBI provisioning norms for NBFCs
  const standardAssets = (totalOutstanding - Object.values(delinquency)
    .reduce((sum: number, bucket: any) => sum + bucket.amount, 0)) * 0.004; // 0.40%

  const substandardAssets = delinquency.dpd91_180.amount * 0.15; // 15%
  const doubtfulAssets = delinquency.dpd180_plus.amount * 0.25; // 25%
  const lossAssets = delinquency.npa.amount * 1.0; // 100%

  const totalProvision = standardAssets + substandardAssets + doubtfulAssets + lossAssets;
  const npaAmount = delinquency.dpd91_180.amount + delinquency.dpd180_plus.amount + delinquency.npa.amount;
  const provisionCoverageRatio = (totalProvision / npaAmount) * 100;

  return {
    standard_assets: standardAssets,
    substandard_assets: substandardAssets,
    doubtful_assets: doubtfulAssets,
    loss_assets: lossAssets,
    total_provision: totalProvision,
    provision_coverage_ratio: provisionCoverageRatio
  };
}

async function detectEarlyWarningSignals() {
  // ML-based early warning system
  // In production, this would call your ML model

  const signals = [];
  const riskAccounts = [
    { name: "Customer_A", amount: 250000, dpdPrediction: 45 },
    { name: "Customer_B", amount: 180000, dpdPrediction: 60 },
    { name: "Customer_C", amount: 320000, dpdPrediction: 35 },
    { name: "Customer_D", amount: 150000, dpdPrediction: 75 },
    { name: "Customer_E", amount: 420000, dpdPrediction: 50 }
  ];

  for (const account of riskAccounts) {
    signals.push({
      accountId: `ACC${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      customerName: account.name,
      outstandingAmount: account.amount,
      riskScore: Math.random() * 40 + 60, // 60-100 risk score
      predictedDPD: account.dpdPrediction,
      recommendedAction: getRecommendedAction(account.dpdPrediction)
    });
  }

  return signals;
}

function getRecommendedAction(predictedDPD: number): string {
  if (predictedDPD < 30) return "Preventive Call";
  if (predictedDPD < 60) return "Soft Collection";
  if (predictedDPD < 90) return "Field Visit";
  return "Legal Notice";
}

async function processWriteOff(loanId: string, amount: number, reason: string) {
  // Process write-off with audit trail
  return {
    loanId,
    writeOffAmount: amount,
    reason,
    approvalId: `WO${Date.now()}`,
    glEntry: {
      debit: "Bad Debt Expense",
      credit: "Loan Receivable",
      amount
    },
    status: "completed"
  };
}

async function processRestructuring(loanId: string, terms: any) {
  return {
    loanId,
    originalTerms: {
      amount: 100000,
      tenure: 12,
      interestRate: 1.5
    },
    newTerms: terms || {
      amount: 100000,
      tenure: 18,
      interestRate: 1.25,
      moratorium: 2
    },
    approvalStatus: "approved",
    effectiveDate: new Date().toISOString()
  };
}

async function initiateLegalAction(loanId: string, legalDetails: any) {
  return {
    loanId,
    caseId: `LEGAL${Date.now()}`,
    actionType: legalDetails?.type || "SARFAESI",
    noticeDate: new Date().toISOString(),
    hearingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedRecovery: legalDetails?.amount * 0.4 || 0,
    status: "notice_sent"
  };
}

async function processSettlement(loanId: string, settlementAmount: number, terms: any) {
  const originalAmount = 150000; // In production, fetch from DB
  const waiverAmount = originalAmount - settlementAmount;

  return {
    loanId,
    originalAmount,
    settlementAmount,
    waiverAmount,
    waiverPercentage: (waiverAmount / originalAmount) * 100,
    settlementTerms: terms || {
      upfrontPayment: settlementAmount * 0.3,
      installments: 3,
      monthlyAmount: (settlementAmount * 0.7) / 3
    },
    approvalStatus: "approved",
    settlementId: `SETTLE${Date.now()}`
  };
}

// Automated collection strategy optimization
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategyType, parameters } = body;

    const optimizedStrategy = await optimizeCollectionStrategy(strategyType, parameters);

    return NextResponse.json({
      success: true,
      strategy: optimizedStrategy,
      expectedImprovement: `${Math.random() * 10 + 5}%`,
      implementationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Strategy optimization failed" },
      { status: 500 }
    );
  }
}

async function optimizeCollectionStrategy(type: string, params: any) {
  // ML-based collection strategy optimization
  return {
    type,
    segments: [
      {
        segment: "Low Risk",
        strategy: "Digital First",
        channels: ["SMS", "WhatsApp", "Email"],
        intensity: "Low",
        expectedRecovery: 95
      },
      {
        segment: "Medium Risk",
        strategy: "Hybrid",
        channels: ["IVR", "Tele-calling", "Digital"],
        intensity: "Medium",
        expectedRecovery: 85
      },
      {
        segment: "High Risk",
        strategy: "Field Focused",
        channels: ["Field Visit", "Legal Notice", "Skip Tracing"],
        intensity: "High",
        expectedRecovery: 65
      }
    ],
    aiRecommendations: [
      "Implement voice stress analysis in tele-calling",
      "Use behavioral nudges in SMS campaigns",
      "Deploy predictive dialer for optimal call times",
      "Implement dynamic settlement offers based on propensity model"
    ]
  };
}