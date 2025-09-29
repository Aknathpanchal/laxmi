import { NextRequest, NextResponse } from 'next/server';

// Mock regulatory data
const regulatoryDB = {
  reports: [
    {
      id: 'rpt1',
      name: 'Monthly NBFC Return',
      type: 'RBI',
      status: 'submitted',
      dueDate: '2024-01-31',
      submittedDate: '2024-01-28',
      period: 'January 2024',
      submittedBy: 'Compliance Officer',
      fileUrl: null
    },
    {
      id: 'rpt2',
      name: 'Quarterly Asset Quality Report',
      type: 'RBI',
      status: 'pending',
      dueDate: '2024-02-15',
      submittedDate: null,
      period: 'Q4 2023',
      submittedBy: null,
      fileUrl: null
    },
    {
      id: 'rpt3',
      name: 'Annual Financial Statement',
      type: 'MCA',
      status: 'in-progress',
      dueDate: '2024-03-31',
      submittedDate: null,
      period: 'FY 2023-24',
      submittedBy: null,
      fileUrl: null
    },
    {
      id: 'rpt4',
      name: 'GST Return',
      type: 'GST',
      status: 'submitted',
      dueDate: '2024-01-20',
      submittedDate: '2024-01-19',
      period: 'December 2023',
      submittedBy: 'Tax Officer',
      fileUrl: null
    }
  ],
  compliance: {
    kycCompliance: 92,
    amlCompliance: 88,
    dataPrivacy: 95,
    fairPractices: 90,
    overall: 91
  },
  filings: {
    total: 48,
    submitted: 42,
    pending: 4,
    overdue: 2
  },
  audits: [
    {
      id: 'aud1',
      type: 'Internal Audit',
      date: '2024-01-10',
      status: 'completed',
      findings: 3,
      critical: 0,
      resolved: 2
    },
    {
      id: 'aud2',
      type: 'RBI Inspection',
      date: '2023-11-15',
      status: 'completed',
      findings: 5,
      critical: 1,
      resolved: 4
    },
    {
      id: 'aud3',
      type: 'Statutory Audit',
      date: '2024-02-01',
      status: 'scheduled',
      findings: 0,
      critical: 0,
      resolved: 0
    }
  ],
  penalties: {
    total: 2,
    amount: 150000,
    paid: 150000,
    pending: 0
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const reportType = searchParams.get('reportType');
    const status = searchParams.get('status');

    let responseData: any = {};

    switch (type) {
      case 'reports':
        let reports = [...regulatoryDB.reports];

        if (reportType) {
          reports = reports.filter(r => r.type === reportType);
        }

        if (status) {
          reports = reports.filter(r => r.status === status);
        }

        responseData.reports = reports;
        break;

      case 'compliance':
        responseData.compliance = regulatoryDB.compliance;
        break;

      case 'filings':
        responseData.filings = regulatoryDB.filings;
        break;

      case 'audits':
        responseData.audits = regulatoryDB.audits;
        break;

      case 'penalties':
        responseData.penalties = regulatoryDB.penalties;
        break;

      case 'summary':
        responseData = {
          upcomingReports: regulatoryDB.reports.filter(r => r.status === 'pending').length,
          overdueReports: regulatoryDB.filings.overdue,
          complianceScore: regulatoryDB.compliance.overall,
          recentAudits: regulatoryDB.audits.filter(a => a.status === 'completed').length,
          totalPenalties: regulatoryDB.penalties.total,
          pendingFilings: regulatoryDB.filings.pending
        };
        break;

      default:
        responseData = regulatoryDB;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Regulatory fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regulatory data' },
      { status: 500 }
    );
  }
}

// POST - Submit report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, fileUrl } = body;

    const report = regulatoryDB.reports.find(r => r.id === reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Update report status
    report.status = 'submitted';
    report.submittedDate = new Date().toISOString().split('T')[0];
    report.submittedBy = 'Current User'; // In production, get from auth
    report.fileUrl = fileUrl;

    // Update filings count
    regulatoryDB.filings.submitted++;
    regulatoryDB.filings.pending = Math.max(0, regulatoryDB.filings.pending - 1);

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}