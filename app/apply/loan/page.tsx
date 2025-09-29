"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Check, Upload, FileText,
  DollarSign, Calendar, User, Building, MapPin,
  Phone, Mail, CreditCard, Calculator, Eye,
  AlertTriangle, Info, CheckCircle, Clock,
  Download, Zap, Shield, Star, Award, Target
} from "lucide-react";

interface LoanApplication {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    dependents: number;
  };

  // Address Information
  addressInfo: {
    currentAddress: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
      residenceType: string;
      yearsAtAddress: number;
    };
    permanentAddress: {
      sameAsCurrent: boolean;
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
    };
  };

  // Employment Information
  employmentInfo: {
    type: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS' | 'FREELANCER';
    companyName: string;
    designation: string;
    workExperience: number;
    monthlyIncome: number;
    salaryAccountBank: string;
    workAddress: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
    };
  };

  // Loan Details
  loanDetails: {
    type: string;
    amount: number;
    tenure: number;
    purpose: string;
    emiAmount?: number;
    interestRate?: number;
    processingFee?: number;
  };

  // Financial Information
  financialInfo: {
    bankAccounts: Array<{
      bankName: string;
      accountType: string;
      accountNumber: string;
      ifscCode: string;
    }>;
    existingLoans: Array<{
      loanType: string;
      bankName: string;
      outstandingAmount: number;
      emiAmount: number;
    }>;
    creditCards: Array<{
      bankName: string;
      limit: number;
      outstandingAmount: number;
    }>;
    totalMonthlyObligations: number;
  };

  // Documents
  documents: {
    identity: File | null;
    address: File | null;
    income: File | null;
    bankStatement: File | null;
    employment: File | null;
  };
}

const LOAN_TYPES = [
  { id: 'personal', name: 'Personal Loan', rate: 12.5, maxAmount: 1000000, maxTenure: 60 },
  { id: 'salary-advance', name: 'Salary Advance', rate: 11.5, maxAmount: 500000, maxTenure: 24 },
  { id: 'emergency', name: 'Emergency Fund', rate: 14.0, maxAmount: 200000, maxTenure: 12 },
  { id: 'festival', name: 'Festival Advance', rate: 13.0, maxAmount: 150000, maxTenure: 18 },
  { id: 'medical', name: 'Medical Emergency', rate: 13.5, maxAmount: 300000, maxTenure: 24 },
  { id: 'travel', name: 'Travel Loan', rate: 15.0, maxAmount: 250000, maxTenure: 36 }
];

const EMPLOYMENT_TYPES = [
  { value: 'SALARIED', label: 'Salaried Employee' },
  { value: 'SELF_EMPLOYED', label: 'Self Employed Professional' },
  { value: 'BUSINESS', label: 'Business Owner' },
  { value: 'FREELANCER', label: 'Freelancer/Consultant' }
];

const STEPS = [
  { id: 1, name: 'Loan Type', description: 'Choose your loan type' },
  { id: 2, name: 'Personal Info', description: 'Basic personal details' },
  { id: 3, name: 'Employment', description: 'Work and income details' },
  { id: 4, name: 'Financial', description: 'Financial information' },
  { id: 5, name: 'Documents', description: 'Upload documents' },
  { id: 6, name: 'Review', description: 'Review and submit' }
];

export default function LoanApplicationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<LoanApplication>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      dependents: 0
    },
    addressInfo: {
      currentAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        residenceType: '',
        yearsAtAddress: 0
      },
      permanentAddress: {
        sameAsCurrent: true,
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: ''
      }
    },
    employmentInfo: {
      type: 'SALARIED',
      companyName: '',
      designation: '',
      workExperience: 0,
      monthlyIncome: 0,
      salaryAccountBank: '',
      workAddress: {
        line1: '',
        city: '',
        state: '',
        pincode: ''
      }
    },
    loanDetails: {
      type: '',
      amount: 0,
      tenure: 0,
      purpose: '',
      emiAmount: 0,
      interestRate: 0,
      processingFee: 0
    },
    financialInfo: {
      bankAccounts: [],
      existingLoans: [],
      creditCards: [],
      totalMonthlyObligations: 0
    },
    documents: {
      identity: null,
      address: null,
      income: null,
      bankStatement: null,
      employment: null
    }
  });

  const [eligibilityCheck, setEligibilityCheck] = useState<{
    checked: boolean;
    eligible: boolean;
    maxAmount: number;
    recommendedAmount: number;
    reasons: string[];
  }>({
    checked: false,
    eligible: false,
    maxAmount: 0,
    recommendedAmount: 0,
    reasons: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate EMI whenever loan details change
  useEffect(() => {
    if (application.loanDetails.amount && application.loanDetails.tenure && application.loanDetails.interestRate) {
      const monthlyRate = application.loanDetails.interestRate / 100 / 12;
      const emi = (application.loanDetails.amount * monthlyRate * Math.pow(1 + monthlyRate, application.loanDetails.tenure)) /
                  (Math.pow(1 + monthlyRate, application.loanDetails.tenure) - 1);

      setApplication(prev => ({
        ...prev,
        loanDetails: {
          ...prev.loanDetails,
          emiAmount: Math.round(emi),
          processingFee: Math.round(application.loanDetails.amount * 0.02) // 2% processing fee
        }
      }));
    }
  }, [application.loanDetails.amount, application.loanDetails.tenure, application.loanDetails.interestRate]);

  const checkEligibility = async () => {
    setLoading(true);
    try {
      // Mock eligibility check
      await new Promise(resolve => setTimeout(resolve, 2000));

      const income = application.employmentInfo.monthlyIncome;
      const requestedAmount = application.loanDetails.amount;
      const maxEligibleAmount = income * 40; // 40x monthly income
      const recommendedAmount = Math.min(requestedAmount, maxEligibleAmount * 0.8);

      const eligible = income >= 25000 && requestedAmount <= maxEligibleAmount;
      const reasons = [];

      if (income < 25000) {
        reasons.push('Minimum monthly income requirement not met (₹25,000)');
      }
      if (requestedAmount > maxEligibleAmount) {
        reasons.push(`Requested amount exceeds maximum eligible amount (₹${maxEligibleAmount.toLocaleString()})`);
      }
      if (eligible) {
        reasons.push('Good credit profile');
        reasons.push('Stable employment history');
        reasons.push('Adequate income for EMI payment');
      }

      setEligibilityCheck({
        checked: true,
        eligible,
        maxAmount: maxEligibleAmount,
        recommendedAmount,
        reasons
      });
    } catch (err) {
      setError('Failed to check eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (documentType: keyof typeof application.documents, file: File) => {
    setApplication(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!application.loanDetails.type && application.loanDetails.amount > 0 && application.loanDetails.tenure > 0;
      case 2:
        return !!(application.personalInfo.firstName && application.personalInfo.lastName &&
                 application.personalInfo.email && application.personalInfo.phone &&
                 application.addressInfo.currentAddress.line1 && application.addressInfo.currentAddress.city);
      case 3:
        return !!(application.employmentInfo.companyName && application.employmentInfo.designation &&
                 application.employmentInfo.monthlyIncome > 0);
      case 4:
        return application.financialInfo.bankAccounts.length > 0;
      case 5:
        return !!(application.documents.identity && application.documents.address && application.documents.income);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const submitApplication = async () => {
    setLoading(true);
    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In real implementation, this would submit to API
      console.log('Application submitted:', application);

      // Redirect to success page or show confirmation
      alert('Application submitted successfully! You will receive a confirmation email shortly.');
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Loan Type</h2>
              <p className="text-gray-600">Select the loan that best fits your needs</p>
            </div>

            <div className="grid gap-4">
              {LOAN_TYPES.map((loan) => (
                <div
                  key={loan.id}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    application.loanDetails.type === loan.name
                      ? 'border-[var(--royal-blue)] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setApplication(prev => ({
                      ...prev,
                      loanDetails: {
                        ...prev.loanDetails,
                        type: loan.name,
                        interestRate: loan.rate
                      }
                    }));
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{loan.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Up to {formatCurrency(loan.maxAmount)} • {loan.maxTenure} months max
                      </p>
                      <p className="text-sm font-medium text-[var(--emerald-green)] mt-2">
                        Starting from {loan.rate}% p.a.
                      </p>
                    </div>
                    {application.loanDetails.type === loan.name && (
                      <CheckCircle className="h-6 w-6 text-[var(--royal-blue)]" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {application.loanDetails.type && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={application.loanDetails.amount || ''}
                        onChange={(e) => setApplication(prev => ({
                          ...prev,
                          loanDetails: { ...prev.loanDetails, amount: Number(e.target.value) }
                        }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenure (months) *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={application.loanDetails.tenure || ''}
                        onChange={(e) => setApplication(prev => ({
                          ...prev,
                          loanDetails: { ...prev.loanDetails, tenure: Number(e.target.value) }
                        }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                        placeholder="Enter tenure"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Loan *
                  </label>
                  <input
                    type="text"
                    value={application.loanDetails.purpose}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      loanDetails: { ...prev.loanDetails, purpose: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    placeholder="Describe the purpose of your loan"
                  />
                </div>

                {application.loanDetails.emiAmount > 0 && (
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">Loan Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">EMI Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(application.loanDetails.emiAmount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interest Rate</p>
                        <p className="font-semibold text-gray-900">{application.loanDetails.interestRate}% p.a.</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Processing Fee</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(application.loanDetails.processingFee || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Interest</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency((application.loanDetails.emiAmount * application.loanDetails.tenure) - application.loanDetails.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={application.personalInfo.firstName}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={application.personalInfo.lastName}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={application.personalInfo.email}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={application.personalInfo.phone}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={application.personalInfo.dateOfBirth}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={application.personalInfo.gender}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, gender: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={application.personalInfo.maritalStatus}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, maritalStatus: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Dependents
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={application.personalInfo.dependents}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, dependents: Number(e.target.value) }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Address *</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={application.addressInfo.currentAddress.line1}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        addressInfo: {
                          ...prev.addressInfo,
                          currentAddress: { ...prev.addressInfo.currentAddress, line1: e.target.value }
                        }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={application.addressInfo.currentAddress.city}
                        onChange={(e) => setApplication(prev => ({
                          ...prev,
                          addressInfo: {
                            ...prev.addressInfo,
                            currentAddress: { ...prev.addressInfo.currentAddress, city: e.target.value }
                          }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={application.addressInfo.currentAddress.state}
                        onChange={(e) => setApplication(prev => ({
                          ...prev,
                          addressInfo: {
                            ...prev.addressInfo,
                            currentAddress: { ...prev.addressInfo.currentAddress, state: e.target.value }
                          }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        value={application.addressInfo.currentAddress.pincode}
                        onChange={(e) => setApplication(prev => ({
                          ...prev,
                          addressInfo: {
                            ...prev.addressInfo,
                            currentAddress: { ...prev.addressInfo.currentAddress, pincode: e.target.value }
                          }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employment Information</h2>
              <p className="text-gray-600">Details about your work and income</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  value={application.employmentInfo.type}
                  onChange={(e) => setApplication(prev => ({
                    ...prev,
                    employmentInfo: { ...prev.employmentInfo, type: e.target.value as any }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                >
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization Name *
                  </label>
                  <input
                    type="text"
                    value={application.employmentInfo.companyName}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      employmentInfo: { ...prev.employmentInfo, companyName: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    value={application.employmentInfo.designation}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      employmentInfo: { ...prev.employmentInfo, designation: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience (years) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={application.employmentInfo.workExperience}
                    onChange={(e) => setApplication(prev => ({
                      ...prev,
                      employmentInfo: { ...prev.employmentInfo, workExperience: Number(e.target.value) }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={application.employmentInfo.monthlyIncome}
                      onChange={(e) => setApplication(prev => ({
                        ...prev,
                        employmentInfo: { ...prev.employmentInfo, monthlyIncome: Number(e.target.value) }
                      }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {application.employmentInfo.monthlyIncome > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Quick Eligibility Check
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Income</span>
                      <span className="font-medium">{formatCurrency(application.employmentInfo.monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Estimated Eligibility</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(application.employmentInfo.monthlyIncome * 40)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Max EMI (40% of income)</span>
                      <span className="font-medium">{formatCurrency(application.employmentInfo.monthlyIncome * 0.4)}</span>
                    </div>

                    {!eligibilityCheck.checked && (
                      <button
                        onClick={checkEligibility}
                        disabled={loading}
                        className="w-full mt-3 px-4 py-2 bg-[var(--royal-blue)] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {loading ? 'Checking...' : 'Check Detailed Eligibility'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {eligibilityCheck.checked && (
                <div className={`rounded-lg p-4 ${eligibilityCheck.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {eligibilityCheck.eligible ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <h4 className={`font-semibold ${eligibilityCheck.eligible ? 'text-green-800' : 'text-red-800'}`}>
                      {eligibilityCheck.eligible ? 'Congratulations! You are eligible' : 'Eligibility Requirements Not Met'}
                    </h4>
                  </div>

                  {eligibilityCheck.eligible && (
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Maximum Eligible Amount</span>
                        <p className="font-semibold text-green-700">{formatCurrency(eligibilityCheck.maxAmount)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Recommended Amount</span>
                        <p className="font-semibold text-green-700">{formatCurrency(eligibilityCheck.recommendedAmount)}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Assessment Details:</p>
                    <ul className="space-y-1">
                      {eligibilityCheck.reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Information</h2>
              <p className="text-gray-600">Details about your financial profile</p>
            </div>

            <div className="space-y-6">
              {/* Bank Account Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Bank Account *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., HDFC Bank"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      onChange={(e) => {
                        const bankAccount = {
                          bankName: e.target.value,
                          accountType: 'SAVINGS',
                          accountNumber: '',
                          ifscCode: ''
                        };
                        setApplication(prev => ({
                          ...prev,
                          financialInfo: {
                            ...prev.financialInfo,
                            bankAccounts: [bankAccount]
                          }
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type *
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent">
                      <option value="SAVINGS">Savings Account</option>
                      <option value="CURRENT">Current Account</option>
                      <option value="SALARY">Salary Account</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Existing Financial Obligations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Financial Obligations</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Existing Loan EMIs
                      </label>
                      <input
                        type="number"
                        placeholder="Monthly EMI amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Credit Card Payments
                      </label>
                      <input
                        type="number"
                        placeholder="Monthly payments"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Obligations
                      </label>
                      <input
                        type="number"
                        placeholder="Other monthly expenses"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <Info className="h-4 w-4 inline mr-1" />
                    Include all existing loan EMIs, credit card minimum payments, and other monthly financial obligations
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Financial Assessment</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Income</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(application.employmentInfo.monthlyIncome)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Proposed EMI</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(application.loanDetails.emiAmount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">EMI to Income Ratio</p>
                    <p className="font-semibold text-gray-900">
                      {application.employmentInfo.monthlyIncome > 0 ?
                        Math.round((application.loanDetails.emiAmount || 0) / application.employmentInfo.monthlyIncome * 100) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available for EMI</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(application.employmentInfo.monthlyIncome * 0.4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
              <p className="text-gray-600">Please upload the required documents</p>
            </div>

            <div className="space-y-6">
              {[
                { key: 'identity', label: 'Identity Proof', description: 'Aadhaar Card / PAN Card / Passport', required: true },
                { key: 'address', label: 'Address Proof', description: 'Utility Bill / Bank Statement / Aadhaar Card', required: true },
                { key: 'income', label: 'Income Proof', description: 'Salary Slips / ITR / Bank Statement', required: true },
                { key: 'bankStatement', label: 'Bank Statement', description: 'Last 3 months bank statement', required: false },
                { key: 'employment', label: 'Employment Proof', description: 'Employment Letter / Offer Letter', required: false }
              ].map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {doc.label} {doc.required && <span className="text-red-500">*</span>}
                      </h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                    {application.documents[doc.key as keyof typeof application.documents] && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      {application.documents[doc.key as keyof typeof application.documents] ?
                        `Uploaded: ${application.documents[doc.key as keyof typeof application.documents]?.name}` :
                        'Drag and drop your file here, or click to browse'
                      }
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(doc.key as keyof typeof application.documents, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id={`file-${doc.key}`}
                    />
                    <label
                      htmlFor={`file-${doc.key}`}
                      className="inline-flex items-center px-4 py-2 bg-[var(--royal-blue)] text-white rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                      Choose File
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Important Notes:</h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Ensure all documents are clear and readable</li>
                    <li>• Documents should be recent (not older than 3 months for income proof)</li>
                    <li>• All personal information should match across documents</li>
                    <li>• File size should not exceed 5MB per document</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-600">Please review your application before submitting</p>
            </div>

            <div className="space-y-6">
              {/* Application Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Application Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Loan Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loan Type:</span>
                        <span className="font-medium">{application.loanDetails.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{formatCurrency(application.loanDetails.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenure:</span>
                        <span className="font-medium">{application.loanDetails.tenure} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EMI:</span>
                        <span className="font-medium text-green-600">{formatCurrency(application.loanDetails.emiAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">{application.loanDetails.interestRate}% p.a.</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Personal Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{application.personalInfo.firstName} {application.personalInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{application.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{application.personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employment:</span>
                        <span className="font-medium">{application.employmentInfo.designation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="font-medium">{formatCurrency(application.employmentInfo.monthlyIncome)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Uploaded</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(application.documents).map(([key, file]) => (
                    <div key={key} className="flex items-center gap-3">
                      {file ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} Proof
                      </span>
                      {file && <span className="text-xs text-gray-500">✓ Uploaded</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                    <span>I confirm that all the information provided is true and accurate to the best of my knowledge.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                    <span>I agree to the Terms & Conditions and Privacy Policy of LaxmiOne NBFC.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                    <span>I authorize LaxmiOne to verify my information and access my credit report.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 rounded border-gray-300" />
                    <span>I would like to receive updates about new products and offers via email/SMS.</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={submitApplication}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      Submit Application
                    </div>
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-3">
                  Your application will be processed within 24-48 hours
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
              <p className="text-gray-600">Quick and easy loan application process</p>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {STEPS.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.id <= currentStep
                    ? 'bg-[var(--royal-blue)] border-[var(--royal-blue)] text-white'
                    : 'border-gray-300 text-gray-300'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-[var(--royal-blue)]' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--royal-blue)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--royal-blue)] text-white rounded-lg hover:bg-blue-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}