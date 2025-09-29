import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        mobile: true,
        status: true
      }
    });

    return NextResponse.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error: any) {
    console.error('Test DB error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}