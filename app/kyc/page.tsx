"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Shield, Upload, Camera, Check, AlertCircle,
  FileText, User, CreditCard, Home, Briefcase,
  ChevronRight, Loader2, CheckCircle, X,
  Eye, Download, RefreshCw
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { usersService } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface KYCStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  status: "pending" | "in_progress" | "completed" | "rejected";
}

interface Document {
  type: string;
  name: string;
  status: "pending" | "verified" | "rejected";
  uploadedAt?: string;
  file?: File;
  preview?: string;
  rejectionReason?: string;
}

export default function KYCVerificationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [documents, setDocuments] = useState<Document[]>([
    { type: "pan", name: "PAN Card", status: "pending" },
    { type: "aadhaar_front", name: "Aadhaar Card (Front)", status: "pending" },
    { type: "aadhaar_back", name: "Aadhaar Card (Back)", status: "pending" },
    { type: "selfie", name: "Selfie with Document", status: "pending" },
    { type: "bank_statement", name: "Bank Statement", status: "pending" },
    { type: "salary_slip", name: "Salary Slip", status: "pending" }
  ]);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    panNumber: "",
    aadhaarNumber: "",
    dateOfBirth: "",
    fatherName: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [employmentInfo, setEmploymentInfo] = useState({
    employmentType: "salaried",
    companyName: "",
    designation: "",
    monthlyIncome: "",
    workEmail: "",
    officeAddress: "",
    employmentYears: ""
  });

  const steps: KYCStep[] = [
    {
      id: 1,
      title: "Personal Information",
      description: "Verify your identity details",
      icon: User,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "in_progress" : "pending"
    },
    {
      id: 2,
      title: "Document Upload",
      description: "Upload required documents",
      icon: FileText,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "in_progress" : "pending"
    },
    {
      id: 3,
      title: "Employment Details",
      description: "Provide employment information",
      icon: Briefcase,
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "in_progress" : "pending"
    },
    {
      id: 4,
      title: "Review & Submit",
      description: "Review and submit for verification",
      icon: CheckCircle,
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "in_progress" : "pending"
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview for images
    const reader = new FileReader();
    reader.onloadend = () => {
      setDocuments(prev => prev.map(doc =>
        doc.type === docType
          ? { ...doc, file, preview: reader.result as string, status: "pending" as const }
          : doc
      ));
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      setDocuments(prev => prev.map(doc =>
        doc.type === docType
          ? { ...doc, file, status: "pending" as const }
          : doc
      ));
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmploymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmploymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmitKYC = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare KYC documents
      const kycDocuments = documents
        .filter(doc => doc.file)
        .map(doc => ({
          documentType: doc.type,
          documentNumber: doc.type === 'pan' ? personalInfo.panNumber :
                         doc.type.startsWith('aadhaar') ? personalInfo.aadhaarNumber : '',
          documentImage: doc.file
        }));

      // Submit KYC
      const response = await usersService.submitKYC(kycDocuments);

      if (response.success) {
        setSuccessMessage("KYC submitted successfully! We'll verify your documents within 24 hours.");
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(response.error || "Failed to submit KYC");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting KYC");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: KYCStep) => {
    if (step.status === "completed") {
      return <Check className="w-5 h-5 text-white" />;
    }
    return <step.icon className="w-5 h-5 text-white" />;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">KYC Verification</h1>
            <p className="text-xl text-gray-600">Complete your verification to access all features</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.status === "completed" ? "bg-green-500" :
                      step.status === "in_progress" ? "bg-blue-600" :
                      "bg-gray-300"
                    } transition-colors`}>
                      {getStepIcon(step)}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                      steps[index + 1].status !== "pending" ? "bg-green-500" : "bg-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Alerts */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700">{successMessage}</span>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name (as per PAN)
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          value={personalInfo.panNumber}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="ABCDE1234F"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhaar Number
                        </label>
                        <input
                          type="text"
                          name="aadhaarNumber"
                          value={personalInfo.aadhaarNumber}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="XXXX XXXX XXXX"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={personalInfo.dateOfBirth}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={personalInfo.fatherName}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={personalInfo.city}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={personalInfo.address}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Document Upload */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Upload Documents</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {documents.map((doc) => (
                        <div key={doc.type} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.name}</h4>
                              <p className="text-sm text-gray-600">
                                {doc.status === "verified" && "Document verified"}
                                {doc.status === "rejected" && doc.rejectionReason}
                                {doc.status === "pending" && (doc.file ? "Ready to submit" : "Required")}
                              </p>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              doc.status === "verified" ? "bg-green-100" :
                              doc.status === "rejected" ? "bg-red-100" :
                              doc.file ? "bg-blue-100" : "bg-gray-100"
                            }`}>
                              {doc.status === "verified" ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : doc.status === "rejected" ? (
                                <X className="w-5 h-5 text-red-600" />
                              ) : doc.file ? (
                                <FileText className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Upload className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {doc.preview && (
                            <div className="mb-3 relative">
                              <img
                                src={doc.preview}
                                alt={doc.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
                                onClick={() => setDocuments(prev => prev.map(d =>
                                  d.type === doc.type ? { ...d, file: undefined, preview: undefined } : d
                                ))}
                              >
                                <X className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          )}

                          <input
                            type="file"
                            id={`upload-${doc.type}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, doc.type)}
                            accept="image/*,.pdf"
                          />
                          <label
                            htmlFor={`upload-${doc.type}`}
                            className={`block w-full text-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                              doc.file
                                ? "border-green-600 text-green-600 hover:bg-green-50"
                                : "border-blue-600 text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {doc.file ? (
                              <>
                                <RefreshCw className="w-4 h-4 inline mr-2" />
                                Replace Document
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload Document
                              </>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Employment Details */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Employment Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employment Type
                        </label>
                        <select
                          name="employmentType"
                          value={employmentInfo.employmentType}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="salaried">Salaried</option>
                          <option value="self-employed">Self Employed</option>
                          <option value="business">Business Owner</option>
                          <option value="professional">Professional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={employmentInfo.companyName}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Designation
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={employmentInfo.designation}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Income
                        </label>
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={employmentInfo.monthlyIncome}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="₹"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Employment
                        </label>
                        <input
                          type="number"
                          name="employmentYears"
                          value={employmentInfo.employmentYears}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Work Email
                        </label>
                        <input
                          type="email"
                          name="workEmail"
                          value={employmentInfo.workEmail}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Office Address
                        </label>
                        <input
                          type="text"
                          name="officeAddress"
                          value={employmentInfo.officeAddress}
                          onChange={handleEmploymentInfoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Review & Submit</h2>

                    <div className="space-y-6">
                      {/* Personal Info Summary */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-blue-600" />
                          Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <span className="ml-2 font-medium">{personalInfo.fullName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">PAN:</span>
                            <span className="ml-2 font-medium">{personalInfo.panNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Aadhaar:</span>
                            <span className="ml-2 font-medium">****{personalInfo.aadhaarNumber.slice(-4)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Date of Birth:</span>
                            <span className="ml-2 font-medium">{personalInfo.dateOfBirth}</span>
                          </div>
                        </div>
                      </div>

                      {/* Employment Info Summary */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                          Employment Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Company:</span>
                            <span className="ml-2 font-medium">{employmentInfo.companyName}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Designation:</span>
                            <span className="ml-2 font-medium">{employmentInfo.designation}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Monthly Income:</span>
                            <span className="ml-2 font-medium">₹{employmentInfo.monthlyIncome}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Experience:</span>
                            <span className="ml-2 font-medium">{employmentInfo.employmentYears} years</span>
                          </div>
                        </div>
                      </div>

                      {/* Documents Summary */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                          Documents Uploaded
                        </h3>
                        <div className="grid md:grid-cols-3 gap-3">
                          {documents.map((doc) => (
                            <div key={doc.type} className="flex items-center space-x-2">
                              {doc.file ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                              )}
                              <span className="text-sm">{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Terms & Conditions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span className="text-sm text-gray-700">
                            I hereby declare that all the information provided above is true and correct to the best of my knowledge.
                            I understand that any false information may lead to rejection of my application.
                          </span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitKYC}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Submit KYC</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}