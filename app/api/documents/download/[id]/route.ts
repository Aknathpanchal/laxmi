import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Mock database - In production, use actual database
const documentsDB: Map<string, any> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;
    const document = documentsDB.get(documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user has access
    const userId = 'current_user_id'; // In production, get from auth
    const isOwner = document.userId === userId;
    const isShared = document.sharedWith?.includes(userId);
    const isAdmin = false; // In production, check user role

    if (!isOwner && !isShared && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if share has expired
    if (isShared && document.shareRecords) {
      const shareRecord = document.shareRecords.find(
        (record: any) => record.userId === userId
      );
      if (shareRecord?.expiresAt && new Date(shareRecord.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: 'Share link has expired' },
          { status: 403 }
        );
      }
    }

    // Read file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', 'documents', document.fileName);

    try {
      const fileBuffer = await readFile(filePath);

      // Log download activity
      if (!document.downloadHistory) {
        document.downloadHistory = [];
      }
      document.downloadHistory.push({
        userId,
        downloadedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      });
      documentsDB.set(documentId, document);

      // Return file with appropriate headers
      const headers = new Headers();
      headers.set('Content-Type', document.mimeType);
      headers.set('Content-Disposition', `attachment; filename="${document.metadata.originalName}"`);
      headers.set('Content-Length', document.fileSize.toString());

      return new NextResponse(fileBuffer, {
        status: 200,
        headers
      });

    } catch (fileError) {
      console.error('File read error:', fileError);
      // If file doesn't exist, return mock data for development
      const mockContent = `Mock document content for ${document.fileName}`;
      return new NextResponse(mockContent, {
        status: 200,
        headers: {
          'Content-Type': document.mimeType || 'text/plain',
          'Content-Disposition': `attachment; filename="${document.metadata.originalName}"`
        }
      });
    }

  } catch (error) {
    console.error('Download document error:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}