import { NextRequest, NextResponse } from 'next/server';

// Mock transactions database
const transactionsDB = [
  {
    id: 'TXN001',
    date: '2024-01-23',
    category: 'Operations',
    description: 'Server maintenance and hosting',
    amount: 45000,
    type: 'expense' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN002',
    date: '2024-01-23',
    category: 'Revenue',
    description: 'Loan interest collection',
    amount: 125000,
    type: 'income' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN003',
    date: '2024-01-22',
    category: 'Marketing',
    description: 'Digital advertising campaign',
    amount: 35000,
    type: 'expense' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN004',
    date: '2024-01-22',
    category: 'Human Resources',
    description: 'Monthly salaries',
    amount: 85000,
    type: 'expense' as const,
    status: 'pending' as const
  },
  {
    id: 'TXN005',
    date: '2024-01-21',
    category: 'Revenue',
    description: 'Processing fees',
    amount: 15000,
    type: 'income' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN006',
    date: '2024-01-21',
    category: 'Technology',
    description: 'Software licenses',
    amount: 22000,
    type: 'expense' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN007',
    date: '2024-01-20',
    category: 'Compliance',
    description: 'Regulatory filing fees',
    amount: 8000,
    type: 'expense' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN008',
    date: '2024-01-20',
    category: 'Customer Service',
    description: 'Call center operations',
    amount: 12000,
    type: 'expense' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN009',
    date: '2024-01-19',
    category: 'Revenue',
    description: 'Late payment penalties',
    amount: 8500,
    type: 'income' as const,
    status: 'completed' as const
  },
  {
    id: 'TXN010',
    date: '2024-01-19',
    category: 'Operations',
    description: 'Office supplies',
    amount: 5000,
    type: 'expense' as const,
    status: 'failed' as const
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'current-month';
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let transactions = [...transactionsDB];

    // Filter by category
    if (category) {
      transactions = transactions.filter(t => t.category === category);
    }

    // Filter by type
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    // Filter by status
    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate summary
    const summary = {
      totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      netCashFlow: 0,
      completedCount: transactions.filter(t => t.status === 'completed').length,
      pendingCount: transactions.filter(t => t.status === 'pending').length,
      failedCount: transactions.filter(t => t.status === 'failed').length
    };

    summary.netCashFlow = summary.totalIncome - summary.totalExpense;

    return NextResponse.json({
      success: true,
      transactions,
      summary,
      period
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}