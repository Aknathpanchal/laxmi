import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { emailOrMobile, password } = body;

    // Validation
    if (!emailOrMobile || !password) {
      return NextResponse.json(
        { error: 'Email/Mobile and password are required' },
        { status: 400 }
      );
    }

    // Determine if input is email or mobile
    const isEmail = emailOrMobile.includes('@');
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile);

    if (!isEmail && !isMobile) {
      return NextResponse.json(
        { error: 'Invalid email or mobile number' },
        { status: 400 }
      );
    }

    // Fetch user from database
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: emailOrMobile }
        : { mobile: emailOrMobile },
      include: {
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 403 }
      );
    }

    // Generate session token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        mobileNumber: user.mobile
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log login activity (commented out as model doesn't exist yet)
    // await prisma.loginActivity.create({
    //   data: {
    //     userId: user.id,
    //     ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    //     userAgent: request.headers.get('user-agent') || 'unknown',
    //     status: 'SUCCESS'
    //   }
    // });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'User',
          email: user.email,
          mobile: user.mobile,
          isEmailVerified: !!user.emailVerified,
          isMobileVerified: !!user.mobileVerified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}