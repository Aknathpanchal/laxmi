import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, newAllocation } = body;

    if (!categoryId || newAllocation === undefined) {
      return NextResponse.json(
        { error: 'Category ID and new allocation are required' },
        { status: 400 }
      );
    }

    // Mock update - in production, update database
    return NextResponse.json({
      success: true,
      message: 'Budget allocation updated successfully',
      categoryId,
      newAllocation
    });
  } catch (error) {
    console.error('Failed to update budget allocation:', error);
    return NextResponse.json(
      { error: 'Failed to update budget allocation' },
      { status: 500 }
    );
  }
}