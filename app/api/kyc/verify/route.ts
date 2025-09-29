import { NextRequest, NextResponse } from "next/server";

interface KYCRequest {
  customerId: string;
  verificationType: "pan" | "aadhaar" | "video";
  documentNumber?: string;
  name?: string;
  dob?: string;
  otp?: string;
  sessionId?: string;
}

interface KYCResponse {
  success: boolean;
  verificationType: string;
  verificationId: string;
  status: "verified" | "pending" | "failed";
  matchScore?: number;
  details?: any;
  nextSteps?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: KYCRequest = await request.json();

    // Validate request
    if (!body.customerId || !body.verificationType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const verificationId = `KYC${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    let response: KYCResponse;

    switch (body.verificationType) {
      case "pan":
        response = await verifyPAN(body, verificationId);
        break;
      case "aadhaar":
        response = await verifyAadhaar(body, verificationId);
        break;
      case "video":
        response = await initiateVideoKYC(body, verificationId);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid verification type" },
          { status: 400 }
        );
    }

    // Log KYC attempt for compliance
    const kycLog = {
      ...response,
      customerId: body.customerId,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    };

    // In production, save to audit log
    // await saveKYCLog(kycLog);

    return NextResponse.json(response);
  } catch (error) {
    console.error("KYC verification error:", error);
    return NextResponse.json(
      { error: "KYC verification failed" },
      { status: 500 }
    );
  }
}

async function verifyPAN(body: KYCRequest, verificationId: string): Promise<KYCResponse> {
  // Simulate PAN verification with NSDL
  // In production, integrate with actual NSDL API

  if (!body.documentNumber || !body.name) {
    throw new Error("PAN and name required for verification");
  }

  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock PAN pattern validation
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panPattern.test(body.documentNumber)) {
    return {
      success: false,
      verificationType: "pan",
      verificationId,
      status: "failed",
      details: { error: "Invalid PAN format" }
    };
  }

  // Simulate name matching
  const matchScore = Math.random() * 30 + 70; // 70-100 score

  return {
    success: true,
    verificationType: "pan",
    verificationId,
    status: "verified",
    matchScore,
    details: {
      pan: body.documentNumber,
      name: body.name,
      nameOnPan: body.name.toUpperCase(),
      status: "ACTIVE",
      category: "INDIVIDUAL"
    },
    nextSteps: ["Proceed to Aadhaar verification"]
  };
}

async function verifyAadhaar(body: KYCRequest, verificationId: string): Promise<KYCResponse> {
  // Simulate Aadhaar eKYC
  // In production, integrate with UIDAI through licensed AUA/KUA

  if (!body.documentNumber || !body.otp) {
    throw new Error("Aadhaar number and OTP required");
  }

  // Simulate OTP verification
  await new Promise(resolve => setTimeout(resolve, 150));

  // Mock Aadhaar validation
  const aadhaarPattern = /^\d{12}$/;
  const maskedAadhaar = body.documentNumber.replace(/\d/g, "X").substring(0, 8) + body.documentNumber.substring(8);

  if (!aadhaarPattern.test(body.documentNumber.replace(/\s/g, ""))) {
    return {
      success: false,
      verificationType: "aadhaar",
      verificationId,
      status: "failed",
      details: { error: "Invalid Aadhaar format" }
    };
  }

  // Simulate successful eKYC
  return {
    success: true,
    verificationType: "aadhaar",
    verificationId,
    status: "verified",
    matchScore: 100,
    details: {
      aadhaar: maskedAadhaar,
      name: body.name || "DEMO USER",
      dob: body.dob || "1990-01-01",
      address: {
        house: "123",
        street: "Demo Street",
        locality: "Demo Area",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
      },
      photo: "base64_encoded_photo_placeholder",
      verified: true
    },
    nextSteps: ["Complete loan agreement"]
  };
}

async function initiateVideoKYC(body: KYCRequest, verificationId: string): Promise<KYCResponse> {
  // Simulate Video KYC session initiation
  // In production, integrate with video KYC provider

  const sessionId = `VKYC${Date.now()}`;

  // Generate video session URL
  const videoUrl = `https://kyc.laxmione.com/video/${sessionId}`;

  return {
    success: true,
    verificationType: "video",
    verificationId,
    status: "pending",
    details: {
      sessionId,
      videoUrl,
      expiresIn: 1800, // 30 minutes
      instructions: [
        "Ensure good lighting",
        "Keep PAN and Aadhaar ready",
        "Stable internet connection required",
        "Session will be recorded for compliance"
      ]
    },
    nextSteps: [
      "Join video session",
      "Show original documents",
      "Complete liveness check",
      "Answer verification questions"
    ]
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const verificationId = searchParams.get("id");

  if (!verificationId) {
    return NextResponse.json(
      { error: "Verification ID required" },
      { status: 400 }
    );
  }

  // In production, fetch from database
  // const verification = await getVerification(verificationId);

  // Mock response
  return NextResponse.json({
    verificationId,
    status: "verified",
    completedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
}