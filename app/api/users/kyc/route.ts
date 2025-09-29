import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rbacSystem } from '@/backend/lib/auth/rbac-system';
import { auditLogger } from '@/backend/lib/audit/audit-logger';
import { cache } from '@/backend/lib/cache/cache-manager';
import { jobQueue } from '@/backend/lib/jobs/job-queue';
import { s3Storage } from '@/backend/lib/storage/s3';
import jwt from 'jsonwebtoken';
import { rateLimit } from '@/backend/lib/security/rate-limiter';
import multer from 'multer';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface UserToken {
  userId: string;
  email: string;
  userType: string;
}

function getUserFromToken(request: NextRequest): UserToken | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as UserToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

const ALLOWED_DOCUMENT_TYPES = {
  'PAN': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  'AADHAR': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  'BANK_STATEMENT': ['application/pdf'],
  'SALARY_SLIP': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  'PASSPORT': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  'DRIVING_LICENSE': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'kyc-upload', 20, 3600); // 20 uploads per hour
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Too many upload attempts.',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      await auditLogger.logSecurity(
        'unauthorized_kyc_upload_attempt',
        'medium',
        { ipAddress: clientIp, userAgent: request.headers.get('user-agent') }
      );

      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'documents',
      'upload',
      { ownerId: userId }
    );

    if (!hasPermission) {
      await auditLogger.logAccess(
        'kyc_document',
        'upload_attempt',
        'upload',
        false,
        userId,
        { 
          ipAddress: clientIp,
          error: 'Insufficient permissions'
        }
      );

      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('document') as File;
    const documentType = formData.get('documentType') as string;
    const documentNumber = formData.get('documentNumber') as string;

    // Validation
    if (!file || !documentType || !documentNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: document, documentType, documentNumber' 
        },
        { status: 400 }
      );
    }

    // Validate document type
    if (!ALLOWED_DOCUMENT_TYPES[documentType as keyof typeof ALLOWED_DOCUMENT_TYPES]) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid document type. Allowed types: ${Object.keys(ALLOWED_DOCUMENT_TYPES).join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimeTypes = ALLOWED_DOCUMENT_TYPES[documentType as keyof typeof ALLOWED_DOCUMENT_TYPES];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file type for ${documentType}. Allowed types: ${allowedMimeTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size too large. Maximum allowed: ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        },
        { status: 400 }
      );
    }

    // Check if document type already exists for user
    const existingDocument = await prisma.kYCDocument.findFirst({
      where: {
        userId,
        type: documentType,
        status: { in: ['UPLOADED', 'VERIFIED'] }
      }
    });

    if (existingDocument) {
      return NextResponse.json(
        { 
          success: false, 
          error: `${documentType} document already uploaded. Please contact support to update.` 
        },
        { status: 409 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `kyc/${userId}/${documentType}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}.${fileExtension}`;

    // Upload to S3
    const uploadResult = await s3Storage.uploadFile(
      fileName,
      buffer,
      file.type,
      {
        userId,
        documentType,
        documentNumber: documentNumber.substring(0, 4) + '****' // Mask for security
      }
    );

    if (!uploadResult.success) {
      throw new Error('Failed to upload document to storage');
    }

    // Save document record to database
    const kycDocument = await prisma.kYCDocument.create({
      data: {
        userId,
        type: documentType,
        documentNumber,
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.url,
        fileSize: file.size,
        mimeType: file.type,
        status: 'UPLOADED',
        verificationStatus: 'PENDING',
        uploadedAt: new Date(),
        metadata: {
          originalFileName: file.name,
          ipAddress: clientIp,
          userAgent: request.headers.get('user-agent')
        }
      }
    });

    // Queue document for verification
    await jobQueue.addJob('verify-kyc', {
      userId,
      documentType,
      documentId: kycDocument.id
    }, {
      priority: 5,
      attempts: 3
    });

    // Invalidate user cache
    await cache.deleteByTag(`user:${userId}`);

    // Log successful upload
    await auditLogger.logAction(
      'kyc_document_uploaded',
      'kyc_document',
      kycDocument.id,
      {
        documentType,
        fileName: uploadResult.fileName,
        fileSize: file.size
      },
      userId
    );

    const response = {
      success: true,
      message: 'Document uploaded successfully and queued for verification',
      data: {
        documentId: kycDocument.id,
        documentType,
        status: kycDocument.status,
        verificationStatus: kycDocument.verificationStatus,
        uploadedAt: kycDocument.uploadedAt,
        estimatedVerificationTime: '24-48 hours'
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });

  } catch (error: any) {
    console.error('KYC document upload error:', error);

    // Log error
    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'kyc.upload',
      entityType: 'kyc_document',
      entityId: 'unknown',
      success: false,
      errorMessage: error.message,
      stackTrace: error.stack,
      userId,
      ipAddress: request.headers.get('x-forwarded-for'),
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload KYC document',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimit(clientIp, 'kyc-status', 100, 3600);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    // Authentication
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    userId = user.userId;

    // Authorization
    const hasPermission = await rbacSystem.checkPermission(
      userId,
      'documents',
      'read',
      { ownerId: userId }
    );

    if (!hasPermission) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check cache first
    const cacheKey = `user:kyc:${userId}`;
    let kycDocuments = await cache.get(cacheKey);

    if (!kycDocuments) {
      kycDocuments = await prisma.kYCDocument.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          status: true,
          verificationStatus: true,
          uploadedAt: true,
          verifiedAt: true,
          rejectedAt: true,
          rejectionReason: true,
          fileName: true,
          fileSize: true
        },
        orderBy: {
          uploadedAt: 'desc'
        }
      });

      // Cache for 5 minutes
      await cache.set(cacheKey, kycDocuments, { ttl: 300, tags: [`user:${userId}`] });
    }

    // Calculate overall KYC status
    const requiredDocuments = ['PAN', 'AADHAR', 'BANK_STATEMENT', 'SALARY_SLIP'];
    const verifiedDocuments = kycDocuments.filter(doc => doc.verificationStatus === 'VERIFIED');
    
    const kycStatus = {
      isComplete: requiredDocuments.every(type => 
        verifiedDocuments.some(doc => doc.type === type)
      ),
      completionPercentage: Math.round((verifiedDocuments.length / requiredDocuments.length) * 100),
      requiredDocuments,
      verifiedCount: verifiedDocuments.length,
      pendingCount: kycDocuments.filter(doc => doc.verificationStatus === 'PENDING').length,
      rejectedCount: kycDocuments.filter(doc => doc.verificationStatus === 'REJECTED').length
    };

    const response = {
      success: true,
      data: {
        kycStatus,
        documents: kycDocuments
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        version: 'v1'
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=300',
        'X-Response-Time': `${Date.now() - startTime}ms`
      }
    });

  } catch (error: any) {
    console.error('KYC status fetch error:', error);

    await auditLogger.log({
      level: 'error',
      category: 'api',
      action: 'kyc.status',
      entityType: 'kyc_document',
      entityId: userId || 'unknown',
      success: false,
      errorMessage: error.message,
      userId,
      duration: Date.now() - startTime
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch KYC status',
        requestId: crypto.randomUUID()
      },
      { status: 500 }
    );
  }
}