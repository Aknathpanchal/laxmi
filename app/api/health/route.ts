import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import redis from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'checking',
        redis: 'checking',
        external: {
          razorpay: 'operational',
          whatsapp: 'operational',
          sms: 'operational',
          email: 'operational'
        }
      },
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };

    // Check PostgreSQL database
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthStatus.services.database = 'operational';
    } catch (dbError) {
      healthStatus.services.database = 'error';
      healthStatus.status = 'degraded';
      console.error('Database health check failed:', dbError);
    }

    // Check Redis
    try {
      if (redis.isOpen) {
        await redis.ping();
        healthStatus.services.redis = 'operational';
      } else {
        await redis.connect();
        await redis.ping();
        healthStatus.services.redis = 'operational';
      }
    } catch (redisError) {
      healthStatus.services.redis = 'error';
      healthStatus.status = 'degraded';
      console.error('Redis health check failed:', redisError);
    }

    // Check external services (simplified)
    if (!process.env.RAZORPAY_KEY_ID) {
      healthStatus.services.external.razorpay = 'not_configured';
    }

    if (!process.env.TWILIO_ACCOUNT_SID) {
      healthStatus.services.external.sms = 'not_configured';
      healthStatus.services.external.whatsapp = 'not_configured';
    }

    if (!process.env.SENDGRID_API_KEY) {
      healthStatus.services.external.email = 'not_configured';
    }

    return NextResponse.json(healthStatus, {
      status: healthStatus.status === 'healthy' ? 200 : 503
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 503 }
    );
  }
}