import { NextRequest, NextResponse } from 'next/server';
import { DocumentStatus } from '@/backend/services/document-management';

// Mock database - In production, use actual database
const documentsDB: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { documentId, status, remarks } = await request.json();

    if (!documentId || !status) {
      return NextResponse.json(
        { error: 'Document ID and status required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!Object.values(DocumentStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const document = documentsDB.get(documentId);
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document verification status
    const updatedDocument = {
      ...document,
      status,
      verifiedAt: new Date(),
      verifiedBy: 'current_admin_id', // In production, get from auth
      verificationRemarks: remarks || null,
      updatedAt: new Date()
    };

    documentsDB.set(documentId, updatedDocument);

    // Send notification to user
    // In production, trigger email/SMS notification

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: `Document ${status === DocumentStatus.VERIFIED ? 'verified' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Verify document error:', error);
    return NextResponse.json(
      { error: 'Failed to verify document' },
      { status: 500 }
    );
  }
}