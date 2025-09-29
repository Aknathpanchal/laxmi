import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

// Mock database - In production, use actual database
const documentsDB: Map<string, any> = new Map();

// GET - Get document by ID
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

    return NextResponse.json({
      success: true,
      document
    });

  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;
    const updates = await request.json();

    const document = documentsDB.get(documentId);
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document
    const updatedDocument = {
      ...document,
      ...updates,
      updatedAt: new Date()
    };

    documentsDB.set(documentId, updatedDocument);

    return NextResponse.json({
      success: true,
      document: updatedDocument
    });

  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE - Delete document
export async function DELETE(
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

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'documents', document.fileName);
      await unlink(filePath);
    } catch (err) {
      console.warn('File deletion failed:', err);
      // Continue even if file deletion fails
    }

    // Remove from database
    documentsDB.delete(documentId);

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}