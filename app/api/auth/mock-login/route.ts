import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock users for testing
const mockUsers = [
  {
    id: '1',
    email: 'test@laxmione.com',
    mobile: '9876543210',
    password: 'Test@123',
    name: 'Test User',
    status: 'ACTIVE'
  },
  {
    id: '2',
    email: 'admin@laxmione.com',
    mobile: '9876543211',
    password: 'Test@123',
    name: 'Admin User',
    status: 'ACTIVE'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrMobile, password } = body;

    // Find user by email or mobile
    const user = mockUsers.find(u =>
      u.email === emailOrMobile || u.mobile === emailOrMobile
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        mobile: user.mobile
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          isEmailVerified: true,
          isMobileVerified: true
        }
      }
    });

  } catch (error) {
    console.error('Mock login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}