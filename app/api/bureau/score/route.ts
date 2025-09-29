import { NextRequest, NextResponse } from "next/server";

interface BureauRequest {
  customerId: string;
  bureauType: "cibil" | "experian" | "crif" | "equifax" | "multi";
  pan: string;
  fullName: string;
  dob: string;
  mobile: string;
  consentId: string;
  purpose: string;
}

interface BureauScore {
  bureau: string;
  score: number;
  scoreDate: string;
  reportId: string;
  accounts: {
    total: number;
    active: number;
    closed: number;
    written_off: number;
    settled: number;
  };
  enquiries: {
    last30Days: number;
    last90Days: number;
    last180Days: number;
  };
  creditUtilization: number;
  paymentHistory: {
    onTime: number;
    delayed30Days: number;
    delayed60Days: number;
    delayed90Days: number;
  };
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BureauRequest = await request.json();

    // Validate consent
    if (!body.consentId) {
      return NextResponse.json(
        { error: "Customer consent required for bureau pull" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.customerId || !body.pan || !body.fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let bureauScores: BureauScore[] = [];

    if (body.bureauType === "multi") {
      // Pull from all bureaus
      bureauScores = await Promise.all([
        pullCIBIL(body),
        pullExperian(body),
        pullCRIF(body),
        pullEquifax(body)
      ]);
    } else {
      // Pull from specific bureau
      const score = await pullBureauScore(body.bureauType, body);
      bureauScores = [score];
    }

    // Calculate composite score
    const compositeScore = calculateCompositeScore(bureauScores);

    // Generate risk assessment
    const riskAssessment = generateRiskAssessment(compositeScore, bureauScores);

    // Log bureau pull for compliance
    const bureauLog = {
      customerId: body.customerId,
      consentId: body.consentId,
      bureausPulled: bureauScores.map(s => s.bureau),
      timestamp: new Date().toISOString(),
      purpose: body.purpose,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    };

    // In production, save to audit log
    // await saveBureauLog(bureauLog);

    return NextResponse.json({
      success: true,
      customerId: body.customerId,
      bureauScores,
      compositeScore,
      riskAssessment,
      pulledAt: new Date().toISOString(),
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Valid for 30 days
    });
  } catch (error) {
    console.error("Bureau pull error:", error);
    return NextResponse.json(
      { error: "Bureau score retrieval failed" },
      { status: 500 }
    );
  }
}

async function pullBureauScore(bureauType: string, data: BureauRequest): Promise<BureauScore> {
  switch (bureauType) {
    case "cibil":
      return pullCIBIL(data);
    case "experian":
      return pullExperian(data);
    case "crif":
      return pullCRIF(data);
    case "equifax":
      return pullEquifax(data);
    default:
      throw new Error(`Unsupported bureau type: ${bureauType}`);
  }
}

async function pullCIBIL(data: BureauRequest): Promise<BureauScore> {
  // Simulate CIBIL API call
  // In production, integrate with actual TransUnion CIBIL API

  await new Promise(resolve => setTimeout(resolve, 200));

  const score = Math.floor(Math.random() * 250) + 650; // 650-900 range

  return {
    bureau: "CIBIL",
    score,
    scoreDate: new Date().toISOString(),
    reportId: `CIB${Date.now()}`,
    accounts: {
      total: Math.floor(Math.random() * 10) + 1,
      active: Math.floor(Math.random() * 5) + 1,
      closed: Math.floor(Math.random() * 3),
      written_off: 0,
      settled: 0
    },
    enquiries: {
      last30Days: Math.floor(Math.random() * 3),
      last90Days: Math.floor(Math.random() * 5),
      last180Days: Math.floor(Math.random() * 8)
    },
    creditUtilization: Math.random() * 60 + 20, // 20-80%
    paymentHistory: {
      onTime: Math.floor(Math.random() * 30) + 70, // 70-100%
      delayed30Days: Math.floor(Math.random() * 20),
      delayed60Days: Math.floor(Math.random() * 10),
      delayed90Days: Math.floor(Math.random() * 5)
    },
    recommendations: generateRecommendations(score)
  };
}

async function pullExperian(data: BureauRequest): Promise<BureauScore> {
  // Simulate Experian API call
  await new Promise(resolve => setTimeout(resolve, 180));

  const score = Math.floor(Math.random() * 250) + 650;

  return {
    bureau: "Experian",
    score,
    scoreDate: new Date().toISOString(),
    reportId: `EXP${Date.now()}`,
    accounts: {
      total: Math.floor(Math.random() * 8) + 1,
      active: Math.floor(Math.random() * 4) + 1,
      closed: Math.floor(Math.random() * 3),
      written_off: 0,
      settled: 0
    },
    enquiries: {
      last30Days: Math.floor(Math.random() * 2),
      last90Days: Math.floor(Math.random() * 4),
      last180Days: Math.floor(Math.random() * 7)
    },
    creditUtilization: Math.random() * 50 + 25,
    paymentHistory: {
      onTime: Math.floor(Math.random() * 25) + 75,
      delayed30Days: Math.floor(Math.random() * 15),
      delayed60Days: Math.floor(Math.random() * 8),
      delayed90Days: Math.floor(Math.random() * 3)
    },
    recommendations: generateRecommendations(score)
  };
}

async function pullCRIF(data: BureauRequest): Promise<BureauScore> {
  // Simulate CRIF High Mark API call
  await new Promise(resolve => setTimeout(resolve, 220));

  const score = Math.floor(Math.random() * 200) + 700;

  return {
    bureau: "CRIF",
    score,
    scoreDate: new Date().toISOString(),
    reportId: `CRF${Date.now()}`,
    accounts: {
      total: Math.floor(Math.random() * 12) + 1,
      active: Math.floor(Math.random() * 6) + 1,
      closed: Math.floor(Math.random() * 4),
      written_off: 0,
      settled: Math.floor(Math.random() * 2)
    },
    enquiries: {
      last30Days: Math.floor(Math.random() * 3),
      last90Days: Math.floor(Math.random() * 6),
      last180Days: Math.floor(Math.random() * 10)
    },
    creditUtilization: Math.random() * 45 + 30,
    paymentHistory: {
      onTime: Math.floor(Math.random() * 20) + 80,
      delayed30Days: Math.floor(Math.random() * 12),
      delayed60Days: Math.floor(Math.random() * 6),
      delayed90Days: Math.floor(Math.random() * 2)
    },
    recommendations: generateRecommendations(score)
  };
}

async function pullEquifax(data: BureauRequest): Promise<BureauScore> {
  // Simulate Equifax API call
  await new Promise(resolve => setTimeout(resolve, 190));

  const score = Math.floor(Math.random() * 230) + 670;

  return {
    bureau: "Equifax",
    score,
    scoreDate: new Date().toISOString(),
    reportId: `EQX${Date.now()}`,
    accounts: {
      total: Math.floor(Math.random() * 9) + 1,
      active: Math.floor(Math.random() * 5) + 1,
      closed: Math.floor(Math.random() * 3),
      written_off: 0,
      settled: 0
    },
    enquiries: {
      last30Days: Math.floor(Math.random() * 2),
      last90Days: Math.floor(Math.random() * 5),
      last180Days: Math.floor(Math.random() * 9)
    },
    creditUtilization: Math.random() * 55 + 25,
    paymentHistory: {
      onTime: Math.floor(Math.random() * 22) + 78,
      delayed30Days: Math.floor(Math.random() * 14),
      delayed60Days: Math.floor(Math.random() * 7),
      delayed90Days: Math.floor(Math.random() * 4)
    },
    recommendations: generateRecommendations(score)
  };
}

function generateRecommendations(score: number): string[] {
  const recommendations: string[] = [];

  if (score >= 750) {
    recommendations.push("Excellent credit score - eligible for premium rates");
    recommendations.push("Pre-approved for higher loan amounts");
  } else if (score >= 650) {
    recommendations.push("Good credit score - standard rates applicable");
    recommendations.push("Maintain payment discipline");
  } else {
    recommendations.push("Build credit history with smaller loans");
    recommendations.push("Reduce credit utilization below 30%");
    recommendations.push("Avoid multiple loan applications");
  }

  return recommendations;
}

function calculateCompositeScore(scores: BureauScore[]): number {
  if (scores.length === 0) return 0;

  // Weighted average with CIBIL having highest weight
  const weights: Record<string, number> = {
    CIBIL: 0.4,
    Experian: 0.25,
    CRIF: 0.2,
    Equifax: 0.15
  };

  let totalWeight = 0;
  let weightedSum = 0;

  scores.forEach(score => {
    const weight = weights[score.bureau] || 0.25;
    weightedSum += score.score * weight;
    totalWeight += weight;
  });

  return Math.round(weightedSum / totalWeight);
}

function generateRiskAssessment(compositeScore: number, bureauScores: BureauScore[]) {
  let riskLevel: "low" | "medium" | "high" | "very_high";
  let creditDecision: "approve" | "review" | "reject";
  let maxLoanAmount: number;
  let suggestedInterestRate: number;

  if (compositeScore >= 750) {
    riskLevel = "low";
    creditDecision = "approve";
    maxLoanAmount = 500000;
    suggestedInterestRate = 1.25;
  } else if (compositeScore >= 650) {
    riskLevel = "medium";
    creditDecision = "approve";
    maxLoanAmount = 200000;
    suggestedInterestRate = 1.5;
  } else if (compositeScore >= 550) {
    riskLevel = "high";
    creditDecision = "review";
    maxLoanAmount = 50000;
    suggestedInterestRate = 1.75;
  } else {
    riskLevel = "very_high";
    creditDecision = "reject";
    maxLoanAmount = 0;
    suggestedInterestRate = 2.0;
  }

  // Check for red flags
  const redFlags: string[] = [];
  bureauScores.forEach(score => {
    if (score.accounts.written_off > 0) {
      redFlags.push("Has written-off accounts");
    }
    if (score.accounts.settled > 1) {
      redFlags.push("Multiple settled accounts");
    }
    if (score.enquiries.last30Days > 5) {
      redFlags.push("High recent credit inquiries");
    }
    if (score.creditUtilization > 80) {
      redFlags.push("Very high credit utilization");
    }
  });

  return {
    riskLevel,
    creditDecision,
    maxLoanAmount,
    suggestedInterestRate,
    compositeScore,
    redFlags,
    strengths: compositeScore >= 650 ?
      ["Good payment history", "Low credit utilization", "Stable credit profile"] : [],
    recommendations: generateRecommendations(compositeScore)
  };
}