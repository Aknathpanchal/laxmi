import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';
import redis from '@/lib/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      mobileNumber,
      password,
      userType = 'CUSTOMER'
    } = body;

    // Validation
    if (!fullName || !email || !mobileNumber || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: 'Invalid mobile number' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobile: mobileNumber }]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email or mobile number' },
        { status: 409 }
      );
    }

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        mobile: mobileNumber,
        password: hashedPassword,
        role: 'USER',
        status: 'PENDING_VERIFICATION'
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        mobileNumber: user.mobile
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Redis with 10 minute expiry
    try {
      if (redis.isOpen) {
        await redis.set(`otp:${user.id}`, otp, 'EX', 600);
      }
    } catch (redisError) {
      console.log('Redis OTP store failed:', redisError);
      // Continue without storing OTP - it's not critical
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your mobile number.',
      data: {
        userId: user.id,
        token,
        requiresVerification: true,
        // In development, show OTP for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}