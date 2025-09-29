"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Briefcase, FileText, CreditCard, CheckCircle,
  ArrowRight, ArrowLeft, Upload, Building, Phone,
  Mail, MapPin, Calendar, IndianRupee, Shield,
  AlertCircle, ChevronRight, Loader2
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { loansService } from "@/lib/api";

const steps = [
  { id: 1, title: "Personal Details", icon: User },
  { id: 2, title: "Employment Info", icon: Briefcase },
  { id: 3, title: "Documents", icon: FileText },
  { id: 4, title: "Loan Details", icon: CreditCard },
  { id: 5, title: "Review & Submit", icon: CheckCircle }
];

export default function ApplyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    pan: "",
    aadhaar: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Employment Info
    employmentType: "salaried",
    companyName: "",
    designation: "",
    monthlyIncome: "",
    workEmail: "",
    officeAddress: "",
    employmentYears: "",

    // Documents
    panCard: null,
    aadhaarCard: null,
    salarySlips: null,
    bankStatement: null,

    // Loan Details
    loanAmount: "",
    loanPurpose: "",
    tenure: "1",

    // Agreement
    termsAccepted: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare loan application data matching backend API
      const applicationData = {
        fullName: formData.fullName,
        mobileNumber: formData.phone,
        email: formData.email,
        panCard: formData.pan,
        aadhaarCard: formData.aadhaar,
        loanAmount: parseFloat(formData.loanAmount),
        loanType: 'PERSONAL' as const,
        tenure: parseInt(formData.tenure) * 12, // Convert years to months
        purpose: formData.loanPurpose,
        employmentType: formData.employmentType.toUpperCase() as 'SALARIED' | 'SELF_EMPLOYED',
        monthlyIncome: parseFloat(formData.monthlyIncome),
        employerName: formData.companyName,
        designation: formData.designation,
        workExperience: parseInt(formData.employmentYears),
        requestGreenLoan: false,
        enableVoiceBiometric: false,
        acceptStepUpEMI: false
      };

      // Submit loan application
      const response = await loansService.applyLoan(applicationData);

      if (response.success && response.data) {
        // Store application details for tracking
        if (response.data.id) {
          localStorage.setItem('lastApplicationId', response.data.id);
          localStorage.setItem('lastLoanNumber', response.data.loanNumber);
        }
        // Redirect to success page with loan details
        router.push(`/track-application?id=${response.data.id}`);
      } else {
        setError(response.error || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5] py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-sora mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">{t.application.title || "Apply for Instant Loan"}</h1>
          <p className="text-xl text-gray-700">
            {t.application.subtitle || "Complete your application in 5 minutes"}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-gradient-to-r from-[#34d399] to-[#10b981] text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 ml-2 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-[#34d399] to-[#10b981]'
                        : 'bg-gray-300'
                    }`} />
                  )}
                </div>
                <p className="text-sm mt-2 font-medium">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">{t.application.steps?.personal || "Personal Information"}</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.application.fields?.fullName || "Full Name"} *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder={t.application.placeholders?.fullName || "Enter your full name"}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.application.fields?.email || "Email Address"} *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder={t.application.placeholders?.email || "your@email.com"}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.application.fields?.mobile || "Phone Number"} *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder={t.application.placeholders?.mobile || "+91 98765 43210"}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">PAN Number *</label>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="ABCDE1234F"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Aadhaar Number *</label>
                      <input
                        type="text"
                        name="aadhaar"
                        value={formData.aadhaar}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="1234 5678 9012"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] dark:bg-gray-700"
                      rows={3}
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Mumbai"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="MH">Maharashtra</option>
                        <option value="DL">Delhi</option>
                        <option value="KA">Karnataka</option>
                        <option value="TN">Tamil Nadu</option>
                        <option value="GJ">Gujarat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Employment Info */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Employment Information</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Employment Type *</label>
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] dark:bg-gray-700"
                      required
                    >
                      <option value="salaried">Salaried Employee</option>
                      <option value="self-employed">Self Employed</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Your Company Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Designation *</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Your Job Title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Monthly Income *</label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="₹ 50,000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Work Email</label>
                      <input
                        type="email"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="work@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Years in Current Job *</label>
                      <select
                        name="employmentYears"
                        value={formData.employmentYears}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        required
                      >
                        <option value="">Select Years</option>
                        <option value="<1">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="2-5">2-5 years</option>
                        <option value="5+">More than 5 years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Office Address</label>
                    <textarea
                      name="officeAddress"
                      value={formData.officeAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] dark:bg-gray-700"
                      rows={3}
                      placeholder="Enter your office address"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Upload Documents</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        Please upload clear, readable copies of your documents in PDF, JPG, or PNG format.
                        Maximum file size: 5MB per document.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">PAN Card *</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#34d399] transition-colors bg-gray-50 hover:bg-gray-100">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'panCard')}
                          className="hidden"
                          id="panCard"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="panCard" className="cursor-pointer">
                          <p className="text-sm text-gray-700">
                            {formData.panCard ? 'PAN Card uploaded ✓' : 'Click to upload PAN Card'}
                          </p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Aadhaar Card *</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#34d399] transition-colors bg-gray-50 hover:bg-gray-100">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'aadhaarCard')}
                          className="hidden"
                          id="aadhaarCard"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="aadhaarCard" className="cursor-pointer">
                          <p className="text-sm text-gray-700">
                            {formData.aadhaarCard ? 'Aadhaar Card uploaded ✓' : 'Click to upload Aadhaar Card'}
                          </p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Salary Slips (Last 3 months) *</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#34d399] transition-colors bg-gray-50 hover:bg-gray-100">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'salarySlips')}
                          className="hidden"
                          id="salarySlips"
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                        />
                        <label htmlFor="salarySlips" className="cursor-pointer">
                          <p className="text-sm text-gray-700">
                            {formData.salarySlips ? 'Salary Slips uploaded ✓' : 'Click to upload Salary Slips'}
                          </p>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bank Statement (6 months)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#34d399] transition-colors bg-gray-50 hover:bg-gray-100">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'bankStatement')}
                          className="hidden"
                          id="bankStatement"
                          accept=".pdf"
                        />
                        <label htmlFor="bankStatement" className="cursor-pointer">
                          <p className="text-sm text-gray-700">
                            {formData.bankStatement ? 'Bank Statement uploaded ✓' : 'Click to upload Bank Statement'}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Loan Details */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Loan Requirements</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount Required *</label>
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] dark:bg-gray-700"
                      placeholder="₹ 50,000"
                      required
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Amount between ₹10,000 to ₹5,00,000
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Purpose of Loan *</label>
                    <select
                      name="loanPurpose"
                      value={formData.loanPurpose}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] dark:bg-gray-700"
                      required
                    >
                      <option value="">Select Purpose</option>
                      <option value="medical">Medical Emergency</option>
                      <option value="education">Education</option>
                      <option value="wedding">Wedding</option>
                      <option value="travel">Travel</option>
                      <option value="home">Home Renovation</option>
                      <option value="debt">Debt Consolidation</option>
                      <option value="business">Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Repayment Tenure *</label>
                    <select
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--emerald-green)] dark:bg-gray-700"
                      required
                    >
                      <option value="1">1 Month (Next Salary)</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>

                  {/* EMI Preview */}
                  <div className="bg-gradient-to-r from-[#f8fbff] to-[#ecfdf5] rounded-lg p-6 border border-gray-100">
                    <h3 className="font-semibold mb-4 text-gray-900">Loan Preview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Loan Amount:</span>
                        <span className="font-semibold">₹{formData.loanAmount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Interest (1.5% per month):</span>
                        <span>₹{Math.round((Number(formData.loanAmount) || 0) * 0.015 * Number(formData.tenure))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Processing Fee (2%):</span>
                        <span>₹{Math.round((Number(formData.loanAmount) || 0) * 0.02)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                        <span>Total Payable:</span>
                        <span className="text-[#34d399]">
                          ₹{Math.round(
                            (Number(formData.loanAmount) || 0) +
                            (Number(formData.loanAmount) || 0) * 0.015 * Number(formData.tenure) +
                            (Number(formData.loanAmount) || 0) * 0.02
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">EMI Amount:</span>
                        <span className="font-semibold">
                          ₹{Math.round(
                            ((Number(formData.loanAmount) || 0) +
                            (Number(formData.loanAmount) || 0) * 0.015 * Number(formData.tenure) +
                            (Number(formData.loanAmount) || 0) * 0.02) / Number(formData.tenure)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Review Your Application</h2>

                  <div className="space-y-4">
                    {/* Personal Details Review */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <User className="w-5 h-5" />
                        Personal Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-700">Name:</span>
                          <span className="ml-2">{formData.fullName}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Email:</span>
                          <span className="ml-2">{formData.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Phone:</span>
                          <span className="ml-2">{formData.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">PAN:</span>
                          <span className="ml-2">{formData.pan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Employment Review */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Briefcase className="w-5 h-5" />
                        Employment Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-700">Company:</span>
                          <span className="ml-2">{formData.companyName}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Designation:</span>
                          <span className="ml-2">{formData.designation}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Monthly Income:</span>
                          <span className="ml-2">₹{formData.monthlyIncome}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Experience:</span>
                          <span className="ml-2">{formData.employmentYears} years</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Details Review */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <CreditCard className="w-5 h-5" />
                        Loan Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-700">Amount:</span>
                          <span className="ml-2 font-semibold">₹{formData.loanAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Tenure:</span>
                          <span className="ml-2">{formData.tenure} months</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Purpose:</span>
                          <span className="ml-2">{formData.loanPurpose}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                      <span className="text-sm">
                        I hereby declare that all the information provided is true and accurate.
                        I agree to the <Link href="/terms" className="text-[#34d399] underline">Terms & Conditions</Link> and
                        <Link href="/privacy" className="text-[#34d399] underline ml-1">Privacy Policy</Link>.
                        I authorize Laxmi to verify my details and check my credit score.
                      </span>
                    </label>
                  </div>

                  {/* Security Note */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800">
                        Your data is secured with 256-bit encryption. We never share your information with third parties.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-[#34d399] to-[#10b981] text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    !formData.termsAccepted
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#34d399] to-[#10b981] text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <p className="text-gray-700">
            Need help with your application?
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="tel:+918888881111" className="flex items-center gap-2 text-[#34d399] hover:underline">
              <Phone className="w-5 h-5" />
              Call: +91 88888 81111
            </a>
            <a href="mailto:support@laxmione.com" className="flex items-center gap-2 text-[#34d399] hover:underline">
              <Mail className="w-5 h-5" />
              Email Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}