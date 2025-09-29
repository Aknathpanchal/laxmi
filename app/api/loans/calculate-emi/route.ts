import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      loanAmount,
      interestRate,
      tenure, // in months
    } = body;

    // Validation
    if (!loanAmount || !interestRate || !tenure) {
      return NextResponse.json(
        { error: 'Loan amount, interest rate, and tenure are required' },
        { status: 400 }
      );
    }

    if (loanAmount < 10000 || loanAmount > 5000000) {
      return NextResponse.json(
        { error: 'Loan amount must be between ₹10,000 and ₹50,00,000' },
        { status: 400 }
      );
    }

    if (tenure < 3 || tenure > 60) {
      return NextResponse.json(
        { error: 'Tenure must be between 3 and 60 months' },
        { status: 400 }
      );
    }

    // EMI Calculation
    const monthlyRate = interestRate / 12 / 100;
    const emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    );

    // Total payment and interest
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule (first 12 months only for response size)
    const schedule = [];
    let balance = loanAmount;

    for (let month = 1; month <= Math.min(tenure, 12); month++) {
      const interestPayment = Math.round(balance * monthlyRate);
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, Math.round(balance))
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        loanAmount,
        interestRate,
        tenure,
        emi,
        totalPayment,
        totalInterest,
        effectiveRate: ((totalInterest / loanAmount) * 100).toFixed(2),
        schedule: schedule
      }
    });

  } catch (error) {
    console.error('EMI calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate EMI' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const amount = searchParams.get('amount');
  const rate = searchParams.get('rate');
  const tenure = searchParams.get('tenure');

  if (!amount || !rate || !tenure) {
    return NextResponse.json(
      { error: 'Amount, rate, and tenure are required' },
      { status: 400 }
    );
  }

  const loanAmount = parseFloat(amount);
  const interestRate = parseFloat(rate);
  const tenureMonths = parseInt(tenure);

  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  return NextResponse.json({
    success: true,
    data: {
      emi,
      totalPayment: emi * tenureMonths,
      totalInterest: (emi * tenureMonths) - loanAmount
    }
  });
}