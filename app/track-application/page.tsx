"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  FileText,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Home,
  ArrowRight,
  User,
  Shield,
  Calendar,
  MapPin,
  CreditCard,
  Zap,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface ApplicationStatus {
  id: string;
  currentStage: number;
  estimatedCompletion: string;
  applicationDate: string;
  loanAmount: number;
  status: 'in-progress' | 'approved' | 'rejected' | 'pending-documents';
  lastUpdate: string;
}

interface ApplicationStage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  icon: React.ComponentType<any>;
}

interface Document {
  name: string;
  status: 'uploaded' | 'pending' | 'verified' | 'rejected';
  uploadDate?: string;
  size?: string;
}

export default function TrackApplicationPage() {
  const { t } = useLanguage();
  const [applicationId, setApplicationId] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email'>('phone');
  const [verificationValue, setVerificationValue] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [applicationData, setApplicationData] = useState<ApplicationStatus | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);

  // Mock application data
  const mockApplicationData: ApplicationStatus = {
    id: "LA2024001234",
    currentStage: 3,
    estimatedCompletion: "2024-09-20T10:00:00Z",
    applicationDate: "2024-09-17T09:30:00Z",
    loanAmount: 250000,
    status: 'in-progress',
    lastUpdate: "2024-09-17T14:30:00Z"
  };

  const applicationStages: ApplicationStage[] = [
    {
      id: 1,
      title: "Application Submitted",
      description: "Your loan application has been received",
      status: 'completed',
      completedDate: "2024-09-17T09:30:00Z",
      icon: FileText
    },
    {
      id: 2,
      title: "Document Verification",
      description: "AI is analyzing your submitted documents",
      status: 'completed',
      completedDate: "2024-09-17T11:15:00Z",
      icon: Shield
    },
    {
      id: 3,
      title: "Credit Assessment",
      description: "Evaluating your creditworthiness and loan eligibility",
      status: 'current',
      icon: CreditCard
    },
    {
      id: 4,
      title: "Final Approval",
      description: "Final review and loan approval process",
      status: 'pending',
      icon: CheckCircle
    },
    {
      id: 5,
      title: "Disbursal",
      description: "Loan amount will be credited to your account",
      status: 'pending',
      icon: Zap
    }
  ];

  const documents: Document[] = [
    {
      name: "Aadhaar Card",
      status: 'verified',
      uploadDate: "2024-09-17T09:30:00Z",
      size: "1.2 MB"
    },
    {
      name: "PAN Card",
      status: 'verified',
      uploadDate: "2024-09-17T09:31:00Z",
      size: "856 KB"
    },
    {
      name: "Salary Slip (Latest)",
      status: 'verified',
      uploadDate: "2024-09-17T09:32:00Z",
      size: "2.1 MB"
    },
    {
      name: "Bank Statement",
      status: 'pending',
      size: "3.4 MB"
    }
  ];

  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo purposes, always show mock data
    if (applicationId) {
      setApplicationData(mockApplicationData);
    }

    setIsTracking(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'current':
      case 'uploaded':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffHours <= 0) return "Processing";
    if (diffHours < 24) return `${diffHours} hours`;
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays} days`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8"
        >
          <Link href="/" className="hover:text-[var(--royal-blue)] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[var(--royal-blue)] font-medium">Track Application</span>
        </motion.nav>
      </div>

      {/* Header Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-full mb-6">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">Track Your Application</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay updated on your loan application status and get real-time progress updates
          </p>
        </motion.div>

        {!applicationData ? (
          /* Search Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <h2 className="text-2xl font-bold mb-6 text-center">Enter Application Details</h2>

              <form onSubmit={handleTrackApplication} className="space-y-6">
                {/* Application ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">Application ID *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                      placeholder="LA2024001234"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Find your Application ID in the confirmation email or SMS
                  </p>
                </div>

                {/* Verification Method Toggle */}
                <div>
                  <label className="block text-sm font-medium mb-2">Verification Method</label>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setVerificationMethod('phone')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        verificationMethod === 'phone'
                          ? 'bg-white dark:bg-gray-800 text-[var(--royal-blue)] shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerificationMethod('email')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        verificationMethod === 'email'
                          ? 'bg-white dark:bg-gray-800 text-[var(--royal-blue)] shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </button>
                  </div>
                </div>

                {/* Verification Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {verificationMethod === 'phone' ? 'Registered Phone Number' : 'Registered Email Address'}
                  </label>
                  <div className="relative">
                    {verificationMethod === 'phone' ? (
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    ) : (
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    )}
                    <input
                      type={verificationMethod === 'phone' ? 'tel' : 'email'}
                      value={verificationValue}
                      onChange={(e) => setVerificationValue(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                      placeholder={verificationMethod === 'phone' ? '+91 98765 43210' : 'your.email@example.com'}
                    />
                  </div>
                </div>

                {/* Track Button */}
                <button
                  type="submit"
                  disabled={isTracking || !applicationId || !verificationValue}
                  className="w-full bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isTracking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Track Application
                    </>
                  )}
                </button>
              </form>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-300">Need Help?</p>
                    <p className="text-blue-600 dark:text-blue-400">
                      Can't find your Application ID? Check your email or SMS, or{' '}
                      <Link href="/contact" className="underline">contact our support team</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Application Status Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Application Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Application #{applicationData.id}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Submitted on {formatDate(applicationData.applicationDate)}
                  </p>
                </div>
                <button
                  onClick={() => setApplicationData(null)}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Track Another
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Loan Amount</p>
                  <p className="text-2xl font-bold">₹{applicationData.loanAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-[var(--emerald-green)] to-[var(--gold)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Current Stage</p>
                  <p className="text-2xl font-bold">{applicationData.currentStage}/5</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-[var(--gold)] to-[var(--rose-gold)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Estimated Completion</p>
                  <p className="text-lg font-bold">{getTimeRemaining(applicationData.estimatedCompletion)}</p>
                </div>
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-lg font-bold">{formatDate(applicationData.lastUpdate)}</p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <h3 className="text-2xl font-bold mb-8">Application Progress</h3>

              <div className="space-y-6">
                {applicationStages.map((stage, index) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          stage.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : stage.status === 'current'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {index < applicationStages.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            stage.status === 'completed'
                              ? 'bg-green-300'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold">{stage.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stage.status)}`}>
                            {stage.status === 'current' ? 'In Progress' : stage.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{stage.description}</p>
                        {stage.completedDate && (
                          <p className="text-sm text-gray-500">
                            Completed on {formatDate(stage.completedDate)}
                          </p>
                        )}
                        {stage.status === 'current' && (
                          <div className="mt-3 flex items-center text-sm text-blue-600">
                            <Clock className="w-4 h-4 mr-1" />
                            Processing... Expected completion in {getTimeRemaining(applicationData.estimatedCompletion)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Document Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-[var(--royal-blue)]" />
                  Document Status
                </h3>
                <button
                  onClick={() => setShowDocuments(!showDocuments)}
                  className="text-[var(--royal-blue)] hover:underline flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showDocuments ? 'Hide' : 'View'} Details
                </button>
              </div>

              {showDocuments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {doc.uploadDate && (
                            <p className="text-sm text-gray-500">
                              Uploaded on {formatDate(doc.uploadDate)} • {doc.size}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    3 of 4 documents verified successfully
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
                <p className="text-xl mb-6 opacity-90">
                  Our support team is here to help with any questions about your application
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <button className="px-8 py-3 bg-white text-[var(--royal-blue)] rounded-lg font-semibold hover:shadow-lg transition-all">
                      Contact Support
                    </button>
                  </Link>
                  <a href="tel:1800-123-4567" className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[var(--royal-blue)] transition-all">
                    Call 1800-123-4567
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}