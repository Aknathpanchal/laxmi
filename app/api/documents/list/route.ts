import { NextRequest, NextResponse } from 'next/server';
import { DocumentCategory, DocumentStatus } from '@/backend/services/document-management';

// Mock database - In production, use actual database
const documentsDB: Map<string, any> = new Map();

// Initialize with mock data
function initMockData() {
  const mockDocuments = [
    {
      id: '1',
      userId: 'current_user_id',
      fileName: 'aadhaar_card.pdf',
      fileType: 'pdf',
      fileSize: 245678,
      mimeType: 'application/pdf',
      category: DocumentCategory.IDENTITY,
      status: DocumentStatus.VERIFIED,
      uploadedAt: new Date('2024-01-15'),
      verifiedAt: new Date('2024-01-16'),
      verifiedBy: 'admin_user',
      metadata: {
        originalName: 'aadhaar_card.pdf',
        encoding: 'utf-8',
        pages: 1,
        virusScanStatus: 'clean',
        virusScanDate: new Date('2024-01-15')
      },
      url: '/api/documents/download/1',
      checksum: 'abc123',
      tags: ['identity', '2024', 'verified'],
      sharedWith: [],
      expiresAt: null
    },
    {
      id: '2',
      userId: 'current_user_id',
      fileName: 'bank_statement_jan.pdf',
      fileType: 'pdf',
      fileSize: 567890,
      mimeType: 'application/pdf',
      category: DocumentCategory.BANK_STATEMENT,
      status: DocumentStatus.PENDING,
      uploadedAt: new Date('2024-02-01'),
      metadata: {
        originalName: 'bank_statement_january.pdf',
        encoding: 'utf-8',
        pages: 5,
        virusScanStatus: 'clean',
        virusScanDate: new Date('2024-02-01')
      },
      url: '/api/documents/download/2',
      checksum: 'def456',
      tags: ['bank', 'january', '2024'],
      sharedWith: [],
      expiresAt: null
    },
    {
      id: '3',
      userId: 'current_user_id',
      fileName: 'salary_slip_dec.jpg',
      fileType: 'image',
      fileSize: 123456,
      mimeType: 'image/jpeg',
      category: DocumentCategory.INCOME,
      status: DocumentStatus.VERIFIED,
      uploadedAt: new Date('2024-01-20'),
      verifiedAt: new Date('2024-01-21'),
      verifiedBy: 'admin_user',
      metadata: {
        originalName: 'salary_slip_december.jpg',
        encoding: 'utf-8',
        dimensions: { width: 1920, height: 1080 },
        virusScanStatus: 'clean',
        virusScanDate: new Date('2024-01-20')
      },
      url: '/api/documents/download/3',
      thumbnailUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      checksum: 'ghi789',
      tags: ['income', 'december', '2023', 'salary'],
      sharedWith: ['manager_id'],
      expiresAt: null
    }
  ];

  mockDocuments.forEach(doc => documentsDB.set(doc.id, doc));
}

// Initialize mock data on first load
if (documentsDB.size === 0) {
  initMockData();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const category = searchParams.get('category') as DocumentCategory | null;
    const status = searchParams.get('status') as DocumentStatus | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get all documents
    let documents = Array.from(documentsDB.values());

    // Filter by user
    if (userId) {
      documents = documents.filter(doc => doc.userId === userId);
    }

    // Filter by category
    if (category) {
      documents = documents.filter(doc => doc.category === category);
    }

    // Filter by status
    if (status) {
      documents = documents.filter(doc => doc.status === status);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      documents = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchLower) ||
        doc.metadata.originalName.toLowerCase().includes(searchLower) ||
        doc.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by upload date (newest first)
    documents.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    // Pagination
    const totalCount = documents.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocuments = documents.slice(startIndex, endIndex);

    // Calculate statistics
    const statistics = {
      total: totalCount,
      verified: documents.filter(d => d.status === DocumentStatus.VERIFIED).length,
      pending: documents.filter(d => d.status === DocumentStatus.PENDING).length,
      rejected: documents.filter(d => d.status === DocumentStatus.REJECTED).length,
      categories: Object.values(DocumentCategory).map(cat => ({
        category: cat,
        count: documents.filter(d => d.category === cat).length
      }))
    };

    return NextResponse.json({
      success: true,
      documents: paginatedDocuments,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      },
      statistics
    });

  } catch (error) {
    console.error('List documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}