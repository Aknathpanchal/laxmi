import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  DocumentCategory,
  DocumentStatus,
  FileValidator,
  DocumentCategorizer,
  VirusScanner
} from '@/backend/services/document-management';

// Mock database - In production, use actual database
const documentsDB: Map<string, any> = new Map();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as DocumentCategory;
    const checksum = formData.get('checksum') as string;
    const metadata = JSON.parse(formData.get('metadata') as string);
    const thumbnail = formData.get('thumbnail') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = FileValidator.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Virus scan
    const scanResult = await VirusScanner.scanFile(file);
    if (!scanResult.clean) {
      return NextResponse.json(
        { error: `File infected: ${scanResult.threat}` },
        { status: 400 }
      );
    }

    // Generate unique ID
    const documentId = uuidv4();
    const fileExtension = path.extname(file.name);
    const fileName = `${documentId}${fileExtension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Auto-categorize if not provided
    const finalCategory = category || DocumentCategorizer.categorizeByFileName(file.name);

    // Generate tags
    const tags = DocumentCategorizer.suggestTags(file.name, finalCategory);

    // Create document record
    const document = {
      id: documentId,
      userId: 'current_user_id', // In production, get from auth
      fileName: fileName,
      fileType: FileValidator.getMimeTypeCategory(file.type),
      fileSize: file.size,
      mimeType: file.type,
      category: finalCategory,
      status: DocumentStatus.PENDING,
      uploadedAt: new Date(),
      metadata: {
        ...metadata,
        virusScanStatus: 'clean',
        virusScanDate: new Date()
      },
      url: `/api/documents/download/${documentId}`,
      thumbnailUrl: thumbnail || null,
      checksum: checksum,
      tags: tags,
      sharedWith: [],
      expiresAt: null
    };

    // Save to mock database
    documentsDB.set(documentId, document);

    return NextResponse.json({
      success: true,
      document
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

// Get upload status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const documentId = searchParams.get('id');

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
    document
  });
}