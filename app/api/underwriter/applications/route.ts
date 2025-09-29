import { NextRequest, NextResponse } from 'next/server';

// Mock database
const applicationsDB = {
  applications: [
    {
      id: 'APP001',
      applicantName: 'Rajesh Kumar',
      applicantId: 'USR001',
      loanType: 'Personal Loan',
      amount: 500000,
      term: 36,
      purpose: 'Home Renovation',
      status: 'pending',
      priority: 'high',
      creditScore: 720,
      income: 75000,
      debtToIncome: 35,
      employmentStatus: 'Salaried',
      employmentYears: 5,
      documentsVerified: true,
      documents: ['PAN', 'Aadhaar', 'Salary Slips', 'Bank Statements'],
      riskLevel: 'low',
      riskFactors: [],
      assignedDate: '2024-01-18',
      dueDate: '2024-01-20',
      assignedTo: 'underwriter@laxmione.com',
      previousLoans: 0,
      collateral: null
    },
    {
      id: 'APP002',
      applicantName: 'Priya Sharma',
      applicantId: 'USR002',
      loanType: 'Business Loan',
      amount: 1500000,
      term: 60,
      purpose: 'Business Expansion',
      status: 'under-review',
      priority: 'medium',
      creditScore: 680,
      income: 150000,
      debtToIncome: 42,
      employmentStatus: 'Self-Employed',
      employmentYears: 8,
      documentsVerified: true,
      documents: ['Business Registration', 'ITR', 'Bank Statements', 'GST Returns'],
      riskLevel: 'medium',
      riskFactors: ['High DTI', 'Business Less Than 3 Years'],
      assignedDate: '2024-01-17',
      dueDate: '2024-01-21',
      assignedTo: 'underwriter@laxmione.com',
      previousLoans: 1,
      collateral: null
    },
    {
      id: 'APP003',
      applicantName: 'Amit Patel',
      applicantId: 'USR003',
      loanType: 'Gold Loan',
      amount: 200000,
      term: 12,
      purpose: 'Medical Emergency',
      status: 'pending',
      priority: 'urgent',
      creditScore: 650,
      income: 45000,
      debtToIncome: 28,
      employmentStatus: 'Salaried',
      employmentYears: 3,
      documentsVerified: false,
      documents: ['PAN', 'Aadhaar'],
      riskLevel: 'low',
      riskFactors: [],
      assignedDate: '2024-01-19',
      dueDate: '2024-01-19',
      assignedTo: 'underwriter@laxmione.com',
      previousLoans: 0,
      collateral: {
        type: 'Gold',
        value: 250000,
        verified: true
      }
    },
    {
      id: 'APP004',
      applicantName: 'Neha Gupta',
      applicantId: 'USR004',
      loanType: 'Home Loan',
      amount: 3500000,
      term: 240,
      purpose: 'Property Purchase',
      status: 'approved',
      priority: 'medium',
      creditScore: 780,
      income: 125000,
      debtToIncome: 25,
      employmentStatus: 'Salaried',
      employmentYears: 7,
      documentsVerified: true,
      documents: ['All Documents Verified'],
      riskLevel: 'low',
      riskFactors: [],
      assignedDate: '2024-01-15',
      dueDate: '2024-01-18',
      assignedTo: 'underwriter@laxmione.com',
      previousLoans: 1,
      collateral: {
        type: 'Property',
        value: 4500000,
        verified: true
      },
      approvedDate: '2024-01-18',
      approvedBy: 'underwriter@laxmione.com'
    },
    {
      id: 'APP005',
      applicantName: 'Vikram Singh',
      applicantId: 'USR005',
      loanType: 'Education Loan',
      amount: 800000,
      term: 84,
      purpose: 'Higher Education',
      status: 'on-hold',
      priority: 'low',
      creditScore: 690,
      income: 60000,
      debtToIncome: 38,
      employmentStatus: 'Salaried',
      employmentYears: 4,
      documentsVerified: true,
      documents: ['Admission Letter', 'Fee Structure', 'Income Proof'],
      riskLevel: 'medium',
      riskFactors: ['Co-applicant Required'],
      assignedDate: '2024-01-16',
      dueDate: '2024-01-22',
      assignedTo: 'underwriter@laxmione.com',
      previousLoans: 0,
      collateral: null,
      holdReason: 'Awaiting co-applicant documents'
    }
  ]
};

// GET - Fetch applications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const riskLevel = searchParams.get('riskLevel');
    const assignedTo = searchParams.get('assignedTo');

    let applications = [...applicationsDB.applications];

    // Apply filters
    if (status) {
      applications = applications.filter(app => app.status === status);
    }
    if (priority) {
      applications = applications.filter(app => app.priority === priority);
    }
    if (riskLevel) {
      applications = applications.filter(app => app.riskLevel === riskLevel);
    }
    if (assignedTo) {
      applications = applications.filter(app => app.assignedTo === assignedTo);
    }

    // Calculate statistics
    const stats = {
      pending: applicationsDB.applications.filter(app => app.status === 'pending').length,
      underReview: applicationsDB.applications.filter(app => app.status === 'under-review').length,
      todaysDue: applicationsDB.applications.filter(app => {
        const dueDate = new Date(app.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString() && app.status === 'pending';
      }).length,
      highPriority: applicationsDB.applications.filter(app =>
        app.priority === 'high' || app.priority === 'urgent'
      ).length,
      avgProcessingTime: '2.5',
      approvalRate: 78,
      totalReviewed: applicationsDB.applications.filter(app =>
        app.status === 'approved' || app.status === 'rejected'
      ).length,
      totalApplications: applicationsDB.applications.length
    };

    return NextResponse.json({
      success: true,
      applications,
      stats
    });

  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST - Create new application (from loan application flow)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newApplication = {
      id: `APP${String(applicationsDB.applications.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'pending',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // 48 hours
      assignedTo: 'underwriter@laxmione.com', // In production, use round-robin or load balancing
      documentsVerified: false,
      riskLevel: calculateRiskLevel(body),
      riskFactors: calculateRiskFactors(body)
    };

    applicationsDB.applications.push(newApplication);

    return NextResponse.json({
      success: true,
      application: newApplication
    });

  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

// Helper function to calculate risk level
function calculateRiskLevel(application: any): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Credit score factor
  if (application.creditScore < 650) riskScore += 3;
  else if (application.creditScore < 700) riskScore += 2;
  else if (application.creditScore < 750) riskScore += 1;

  // DTI ratio factor
  if (application.debtToIncome > 50) riskScore += 3;
  else if (application.debtToIncome > 40) riskScore += 2;
  else if (application.debtToIncome > 30) riskScore += 1;

  // Loan amount vs income factor
  const loanToIncome = application.amount / (application.income * 12);
  if (loanToIncome > 5) riskScore += 3;
  else if (loanToIncome > 3) riskScore += 2;
  else if (loanToIncome > 2) riskScore += 1;

  // Employment factor
  if (application.employmentStatus === 'Unemployed') riskScore += 3;
  else if (application.employmentStatus === 'Self-Employed' && application.employmentYears < 2) riskScore += 2;
  else if (application.employmentYears < 1) riskScore += 1;

  // Determine risk level
  if (riskScore >= 8) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
}

// Helper function to identify risk factors
function calculateRiskFactors(application: any): string[] {
  const factors: string[] = [];

  if (application.creditScore < 650) {
    factors.push('Low Credit Score');
  }
  if (application.debtToIncome > 40) {
    factors.push('High DTI Ratio');
  }
  if (application.employmentYears < 2) {
    factors.push('Limited Employment History');
  }
  if (!application.collateral && application.amount > 1000000) {
    factors.push('No Collateral for Large Loan');
  }
  if (application.previousLoans > 2) {
    factors.push('Multiple Existing Loans');
  }

  return factors;
}