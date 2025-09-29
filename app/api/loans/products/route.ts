import { NextRequest, NextResponse } from 'next/server';

// Loan products data
const loanProducts = [
  {
    id: 'personal-loan',
    name: 'Personal Loan',
    description: 'Quick personal loans for all your needs',
    minAmount: 10000,
    maxAmount: 500000,
    minTenure: 6,
    maxTenure: 60,
    interestRate: 12.0,
    processingFee: 2.0,
    features: [
      'No collateral required',
      'Quick approval in 30 seconds',
      'Flexible repayment options',
      'Minimal documentation'
    ],
    eligibility: [
      'Age: 21-60 years',
      'Minimum income: ₹15,000/month',
      'Credit score: 650+',
      'Employment: 1+ years'
    ],
    documents: [
      'PAN Card',
      'Aadhaar Card',
      'Salary slips (3 months)',
      'Bank statements (6 months)'
    ]
  },
  {
    id: 'business-loan',
    name: 'Business Loan',
    description: 'Grow your business with flexible funding',
    minAmount: 50000,
    maxAmount: 2000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: 14.0,
    processingFee: 2.5,
    features: [
      'Collateral-free loans',
      'Quick disbursal',
      'Customized repayment',
      'Doorstep service'
    ],
    eligibility: [
      'Business vintage: 2+ years',
      'Annual turnover: ₹10 lakh+',
      'ITR filed for 2 years',
      'Good credit history'
    ],
    documents: [
      'Business registration',
      'ITR & financial statements',
      'Bank statements (12 months)',
      'GST returns'
    ]
  },
  {
    id: 'gold-loan',
    name: 'Gold Loan',
    description: 'Instant cash against gold',
    minAmount: 5000,
    maxAmount: 5000000,
    minTenure: 3,
    maxTenure: 36,
    interestRate: 9.0,
    processingFee: 1.0,
    features: [
      'Lowest interest rates',
      'Instant approval',
      'Safe gold storage',
      'Part payment option'
    ],
    eligibility: [
      'Age: 18+ years',
      'Gold purity: 18-24 carats',
      'Valid ID proof',
      'No income proof needed'
    ],
    documents: [
      'PAN Card',
      'Aadhaar Card',
      'Gold ownership proof',
      'Address proof'
    ]
  },
  {
    id: 'education-loan',
    name: 'Education Loan',
    description: 'Invest in your future',
    minAmount: 50000,
    maxAmount: 2000000,
    minTenure: 12,
    maxTenure: 180,
    interestRate: 10.5,
    processingFee: 1.5,
    features: [
      'Moratorium period available',
      '100% finance for fees',
      'Tax benefits under 80E',
      'Co-borrower option'
    ],
    eligibility: [
      'Indian citizen',
      'Admission to recognized institute',
      'Co-applicant required',
      'Academic merit considered'
    ],
    documents: [
      'Admission letter',
      'Fee structure',
      'Academic records',
      'Income proof of co-applicant'
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('id');
    const category = searchParams.get('category');

    // If specific product requested
    if (productId) {
      const product = loanProducts.find(p => p.id === productId);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: product
      });
    }

    // Filter by category if provided
    let filteredProducts = loanProducts;
    if (category) {
      filteredProducts = loanProducts.filter(p =>
        p.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        products: filteredProducts,
        count: filteredProducts.length
      }
    });

  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}