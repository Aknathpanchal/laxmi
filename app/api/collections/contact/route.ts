import { NextRequest, NextResponse } from 'next/server';

// Contact history database
const contactHistoryDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, method, notes, promiseToPayDate } = body;

    // Validate required fields
    if (!accountId || !method || !notes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create contact record
    const contactRecord = {
      id: `CONT-${Date.now()}`,
      accountId,
      method,
      notes,
      promiseToPayDate,
      contactedAt: new Date().toISOString(),
      contactedBy: 'current-agent@laxmione.com', // In production, get from auth
      result: promiseToPayDate ? 'promise_to_pay' : 'contacted',
      followUpRequired: !promiseToPayDate,
      followUpDate: promiseToPayDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    contactHistoryDB.push(contactRecord);

    // Send notification based on method
    if (method === 'sms' || method === 'whatsapp') {
      // Mock sending SMS/WhatsApp
      console.log(`Sending ${method} to customer...`);
    } else if (method === 'email') {
      // Mock sending email
      console.log('Sending email to customer...');
    }

    return NextResponse.json({
      success: true,
      message: 'Contact recorded successfully',
      record: contactRecord
    });
  } catch (error) {
    console.error('Failed to record contact:', error);
    return NextResponse.json(
      { error: 'Failed to record contact' },
      { status: 500 }
    );
  }
}

// GET - Fetch contact history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const agentId = searchParams.get('agentId');

    let history = [...contactHistoryDB];

    if (accountId) {
      history = history.filter(h => h.accountId === accountId);
    }

    if (agentId) {
      history = history.filter(h => h.contactedBy === agentId);
    }

    // Sort by most recent first
    history.sort((a, b) => new Date(b.contactedAt).getTime() - new Date(a.contactedAt).getTime());

    return NextResponse.json({
      success: true,
      history,
      total: history.length
    });
  } catch (error) {
    console.error('Failed to fetch contact history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact history' },
      { status: 500 }
    );
  }
}