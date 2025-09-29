import { NextRequest, NextResponse } from 'next/server';

// Mock database
const budgetDB = {
  allocations: [
    {
      id: '1',
      department: 'Operations',
      allocated: 5000000,
      spent: 3250000,
      remaining: 1750000,
      quarter: 'Q4 2024',
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: '2',
      department: 'Technology',
      allocated: 3000000,
      spent: 2100000,
      remaining: 900000,
      quarter: 'Q4 2024',
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: '3',
      department: 'Marketing',
      allocated: 2000000,
      spent: 1500000,
      remaining: 500000,
      quarter: 'Q4 2024',
      lastUpdated: new Date('2024-01-12')
    },
    {
      id: '4',
      department: 'Human Resources',
      allocated: 1500000,
      spent: 900000,
      remaining: 600000,
      quarter: 'Q4 2024',
      lastUpdated: new Date('2024-01-08')
    },
    {
      id: '5',
      department: 'Legal & Compliance',
      allocated: 1000000,
      spent: 750000,
      remaining: 250000,
      quarter: 'Q4 2024',
      lastUpdated: new Date('2024-01-14')
    }
  ],
  expenses: [
    {
      id: 'exp1',
      department: 'Operations',
      category: 'Infrastructure',
      amount: 500000,
      description: 'Server upgrades',
      date: new Date('2024-01-15'),
      approvedBy: 'John Doe',
      status: 'approved'
    },
    {
      id: 'exp2',
      department: 'Marketing',
      category: 'Advertising',
      amount: 300000,
      description: 'Digital marketing campaign',
      date: new Date('2024-01-14'),
      approvedBy: 'Jane Smith',
      status: 'approved'
    },
    {
      id: 'exp3',
      department: 'Technology',
      category: 'Software',
      amount: 150000,
      description: 'License renewals',
      date: new Date('2024-01-13'),
      approvedBy: 'Mike Johnson',
      status: 'pending'
    }
  ],
  forecasts: {
    currentQuarter: {
      projected: 15000000,
      actual: 8500000,
      variance: -1500000
    },
    nextQuarter: {
      projected: 18000000,
      allocated: 0,
      departments: []
    },
    yearToDate: {
      budget: 60000000,
      spent: 42000000,
      remaining: 18000000
    }
  }
};

// GET - Fetch budget data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const department = searchParams.get('department');
    const quarter = searchParams.get('quarter');

    let responseData: any = {};

    switch (type) {
      case 'allocations':
        responseData.allocations = department
          ? budgetDB.allocations.filter(a => a.department === department)
          : budgetDB.allocations;
        break;

      case 'expenses':
        responseData.expenses = department
          ? budgetDB.expenses.filter(e => e.department === department)
          : budgetDB.expenses;
        break;

      case 'forecasts':
        responseData.forecasts = budgetDB.forecasts;
        break;

      case 'summary':
        const totalAllocated = budgetDB.allocations.reduce((sum, a) => sum + a.allocated, 0);
        const totalSpent = budgetDB.allocations.reduce((sum, a) => sum + a.spent, 0);
        const totalRemaining = budgetDB.allocations.reduce((sum, a) => sum + a.remaining, 0);

        responseData = {
          summary: {
            totalAllocated,
            totalSpent,
            totalRemaining,
            utilizationRate: ((totalSpent / totalAllocated) * 100).toFixed(2),
            departments: budgetDB.allocations.length,
            pendingExpenses: budgetDB.expenses.filter(e => e.status === 'pending').length
          }
        };
        break;

      default:
        responseData = budgetDB;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Budget fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget data' },
      { status: 500 }
    );
  }
}

// POST - Create budget allocation or expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'allocation') {
      const newAllocation = {
        id: `alloc_${Date.now()}`,
        ...data,
        lastUpdated: new Date()
      };
      budgetDB.allocations.push(newAllocation);

      return NextResponse.json({
        success: true,
        allocation: newAllocation
      });
    }

    if (type === 'expense') {
      const newExpense = {
        id: `exp_${Date.now()}`,
        ...data,
        date: new Date(),
        status: 'pending'
      };
      budgetDB.expenses.push(newExpense);

      // Update department spending
      const allocation = budgetDB.allocations.find(a => a.department === data.department);
      if (allocation) {
        allocation.spent += data.amount;
        allocation.remaining -= data.amount;
      }

      return NextResponse.json({
        success: true,
        expense: newExpense
      });
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Budget creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create budget item' },
      { status: 500 }
    );
  }
}

// PUT - Update budget allocation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    const allocationIndex = budgetDB.allocations.findIndex(a => a.id === id);
    if (allocationIndex === -1) {
      return NextResponse.json(
        { error: 'Allocation not found' },
        { status: 404 }
      );
    }

    budgetDB.allocations[allocationIndex] = {
      ...budgetDB.allocations[allocationIndex],
      ...updates,
      lastUpdated: new Date()
    };

    return NextResponse.json({
      success: true,
      allocation: budgetDB.allocations[allocationIndex]
    });

  } catch (error) {
    console.error('Budget update error:', error);
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}