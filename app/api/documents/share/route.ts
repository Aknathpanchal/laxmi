import { NextRequest, NextResponse } from 'next/server';

// Mock database - In production, use actual database
const documentsDB: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { documentId, userIds, expiresIn } = await request.json();

    if (!documentId || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'Document ID and user IDs required' },
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

    // Calculate expiry date if provided
    let shareExpiresAt = null;
    if (expiresIn) {
      shareExpiresAt = new Date();
      shareExpiresAt.setDate(shareExpiresAt.getDate() + expiresIn);
    }

    // Create share records
    const shareRecords = userIds.map(userId => ({
      userId,
      documentId,
      sharedAt: new Date(),
      sharedBy: 'current_user_id', // In production, get from auth
      expiresAt: shareExpiresAt,
      accessCount: 0
    }));

    // Update document with shared users
    const updatedDocument = {
      ...document,
      sharedWith: [...new Set([...document.sharedWith, ...userIds])],
      shareRecords: [...(document.shareRecords || []), ...shareRecords],
      updatedAt: new Date()
    };

    documentsDB.set(documentId, updatedDocument);

    // Send notifications to shared users
    // In production, trigger email/SMS notifications

    return NextResponse.json({
      success: true,
      message: `Document shared with ${userIds.length} user(s)`,
      sharedWith: userIds,
      expiresAt: shareExpiresAt
    });

  } catch (error) {
    console.error('Share document error:', error);
    return NextResponse.json(
      { error: 'Failed to share document' },
      { status: 500 }
    );
  }
}

// Get share status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
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

    return NextResponse.json({
      success: true,
      sharedWith: document.sharedWith || [],
      shareRecords: document.shareRecords || []
    });

  } catch (error) {
    console.error('Get share status error:', error);
    return NextResponse.json(
      { error: 'Failed to get share status' },
      { status: 500 }
    );
  }
}

// Revoke share access
export async function DELETE(request: NextRequest) {
  try {
    const { documentId, userId } = await request.json();

    if (!documentId || !userId) {
      return NextResponse.json(
        { error: 'Document ID and user ID required' },
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

    // Remove user from shared list
    const updatedDocument = {
      ...document,
      sharedWith: document.sharedWith.filter((id: string) => id !== userId),
      shareRecords: document.shareRecords?.filter(
        (record: any) => record.userId !== userId
      ),
      updatedAt: new Date()
    };

    documentsDB.set(documentId, updatedDocument);

    return NextResponse.json({
      success: true,
      message: 'Share access revoked successfully'
    });

  } catch (error) {
    console.error('Revoke share error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke share access' },
      { status: 500 }
    );
  }
}