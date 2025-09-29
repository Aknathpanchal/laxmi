import { NextRequest, NextResponse } from 'next/server';

// Mock budget database
const budgetDB = {
  categories: [
    {
      id: 'BUD001',
      name: 'Operations',
      allocated: 500000,
      spent: 325000,
      remaining: 175000,
      percentUsed: 65,
      trend: 'up' as const,
      lastMonth: 300000,
      variance: 8.3
    },
    {
      id: 'BUD002',
      name: 'Marketing',
      allocated: 200000,
      spent: 180000,
      remaining: 20000,
      percentUsed: 90,
      trend: 'up' as const,
      lastMonth: 150000,
      variance: 20
    },
    {
      id: 'BUD003',
      name: 'Technology',
      allocated: 300000,
      spent: 120000,
      remaining: 180000,
      percentUsed: 40,
      trend: 'down' as const,
      lastMonth: 145000,
      variance: -17.2
    },
    {
      id: 'BUD004',
      name: 'Human Resources',
      allocated: 150000,
      spent: 100000,
      remaining: 50000,
      percentUsed: 66.7,
      trend: 'stable' as const,
      lastMonth: 98000,
      variance: 2
    },
    {
      id: 'BUD005',
      name: 'Compliance',
      allocated: 100000,
      spent: 45000,
      remaining: 55000,
      percentUsed: 45,
      trend: 'down' as const,
      lastMonth: 52000,
      variance: -13.5
    },
    {
      id: 'BUD006',
      name: 'Customer Service',
      allocated: 80000,
      spent: 72000,
      remaining: 8000,
      percentUsed: 90,
      trend: 'up' as const,
      lastMonth: 65000,
      variance: 10.8
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'current-month';
    const categoryId = searchParams.get('categoryId');

    let categories = [...budgetDB.categories];

    // Filter by category if specified
    if (categoryId) {
      categories = categories.filter(c => c.id === categoryId);
    }

    // Simulate different data for different periods
    if (period === 'last-month') {
      categories = categories.map(cat => ({
        ...cat,
        spent: cat.lastMonth,
        remaining: cat.allocated - cat.lastMonth,
        percentUsed: (cat.lastMonth / cat.allocated) * 100
      }));
    } else if (period === 'current-quarter') {
      categories = categories.map(cat => ({
        ...cat,
        allocated: cat.allocated * 3,
        spent: cat.spent * 2.5,
        remaining: (cat.allocated * 3) - (cat.spent * 2.5),
        percentUsed: ((cat.spent * 2.5) / (cat.allocated * 3)) * 100
      }));
    } else if (period === 'current-year') {
      categories = categories.map(cat => ({
        ...cat,
        allocated: cat.allocated * 12,
        spent: cat.spent * 10,
        remaining: (cat.allocated * 12) - (cat.spent * 10),
        percentUsed: ((cat.spent * 10) / (cat.allocated * 12)) * 100
      }));
    }

    // Calculate totals
    const totals = {
      totalAllocated: categories.reduce((sum, cat) => sum + cat.allocated, 0),
      totalSpent: categories.reduce((sum, cat) => sum + cat.spent, 0),
      totalRemaining: categories.reduce((sum, cat) => sum + cat.remaining, 0),
      averageUtilization: categories.reduce((sum, cat) => sum + cat.percentUsed, 0) / categories.length
    };

    return NextResponse.json({
      success: true,
      categories,
      totals,
      period
    });
  } catch (error) {
    console.error('Failed to fetch budget data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget data' },
      { status: 500 }
    );
  }
}

// POST - Create new budget category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, allocated } = body;

    if (!name || !allocated) {
      return NextResponse.json(
        { error: 'Name and allocated amount are required' },
        { status: 400 }
      );
    }

    const newCategory = {
      id: `BUD${Date.now()}`,
      name,
      allocated,
      spent: 0,
      remaining: allocated,
      percentUsed: 0,
      trend: 'stable' as const,
      lastMonth: 0,
      variance: 0
    };

    budgetDB.categories.push(newCategory);

    return NextResponse.json({
      success: true,
      category: newCategory
    });
  } catch (error) {
    console.error('Failed to create budget category:', error);
    return NextResponse.json(
      { error: 'Failed to create budget category' },
      { status: 500 }
    );
  }
}