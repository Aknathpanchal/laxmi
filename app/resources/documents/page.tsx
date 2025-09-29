"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText,
  Download,
  Upload,
  CheckCircle,
  Home,
  ArrowRight,
  CreditCard,
  User,
  Building,
  Landmark,
  Briefcase,
  AlertCircle,
  Info,
  Shield
} from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  category: string;
  formats: string[];
  size: string;
  tips: string[];
}

export default function DocumentGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Documents", count: 10 },
    { id: "identity", name: "Identity Proof", count: 3 },
    { id: "income", name: "Income Proof", count: 3 },
    { id: "address", name: "Address Proof", count: 2 },
    { id: "bank", name: "Bank Documents", count: 2 }
  ];

  const documents: Document[] = [
    {
      id: "1",
      title: "PAN Card",
      description: "Permanent Account Number issued by Income Tax Department",
      icon: CreditCard,
      required: true,
      category: "identity",
      formats: ["PDF", "JPG", "PNG"],
      size: "Max 5 MB",
      tips: [
        "Ensure all corners are visible",
        "Text should be clear and readable",
        "Avoid glare or shadows"
      ]
    },
    {
      id: "2",
      title: "Aadhaar Card",
      description: "12-digit unique identification number issued by UIDAI",
      icon: User,
      required: true,
      category: "identity",
      formats: ["PDF", "JPG", "PNG"],
      size: "Max 5 MB",
      tips: [
        "Upload both front and back",
        "Mask first 8 digits for security",
        "Ensure photo is clearly visible"
      ]
    },
    {
      id: "3",
      title: "Salary Slips",
      description: "Last 3 months' salary slips from employer",
      icon: Briefcase,
      required: true,
      category: "income",
      formats: ["PDF"],
      size: "Max 10 MB",
      tips: [
        "Must show company letterhead",
        "Should include all deductions",
        "Must be signed by employer"
      ]
    },
    {
      id: "4",
      title: "Bank Statements",
      description: "Last 3 months' bank account statements",
      icon: Landmark,
      required: true,
      category: "bank",
      formats: ["PDF"],
      size: "Max 10 MB",
      tips: [
        "Must be from active salary account",
        "Should show regular credits",
        "Bank seal or digital signature required"
      ]
    },
    {
      id: "5",
      title: "Employment Letter",
      description: "Current employment verification letter",
      icon: Building,
      required: true,
      category: "income",
      formats: ["PDF", "JPG"],
      size: "Max 5 MB",
      tips: [
        "Should be on company letterhead",
        "Must include employee ID",
        "HR signature and stamp required"
      ]
    },
    {
      id: "6",
      title: "Address Proof",
      description: "Utility bill, rental agreement, or driving license",
      icon: Home,
      required: true,
      category: "address",
      formats: ["PDF", "JPG", "PNG"],
      size: "Max 5 MB",
      tips: [
        "Should not be older than 3 months",
        "Name and address must match",
        "Government issued documents preferred"
      ]
    },
    {
      id: "7",
      title: "ITR (Income Tax Returns)",
      description: "Last 2 years' ITR for self-employed",
      icon: FileText,
      required: false,
      category: "income",
      formats: ["PDF"],
      size: "Max 10 MB",
      tips: [
        "Must be acknowledged by IT Department",
        "Both years should show consistent income",
        "Include all annexures"
      ]
    },
    {
      id: "8",
      title: "Form 16",
      description: "TDS certificate from employer",
      icon: FileText,
      required: false,
      category: "income",
      formats: ["PDF"],
      size: "Max 5 MB",
      tips: [
        "Must match with salary slips",
        "Should be signed by employer",
        "Last financial year document"
      ]
    },
    {
      id: "9",
      title: "Business Registration",
      description: "GST certificate or business license",
      icon: Building,
      required: false,
      category: "identity",
      formats: ["PDF", "JPG"],
      size: "Max 5 MB",
      tips: [
        "Must be active and valid",
        "Name should match with applicant",
        "Latest renewal copy preferred"
      ]
    },
    {
      id: "10",
      title: "Bank Account Passbook",
      description: "First and last page of passbook",
      icon: Landmark,
      required: false,
      category: "bank",
      formats: ["PDF", "JPG", "PNG"],
      size: "Max 5 MB",
      tips: [
        "Should show account holder name",
        "IFSC code should be visible",
        "Account must be active"
      ]
    }
  ];

  const filteredDocuments = documents.filter(doc => 
    selectedCategory === "all" || doc.category === selectedCategory
  );

  const uploadProcess = [
    {
      step: 1,
      title: "Scan Documents",
      description: "Use scanner or phone camera with good lighting",
      icon: Upload
    },
    {
      step: 2,
      title: "Check Quality",
      description: "Ensure text is clear and all corners are visible",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Upload Securely",
      description: "Upload through our encrypted portal",
      icon: Shield
    },
    {
      step: 4,
      title: "Get Verified",
      description: "AI verification within 30 seconds",
      icon: CheckCircle
    }
  ];

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
          <span>Resources</span>
          <ArrowRight className="w-3 h-3" />
          <span className=" font-medium">Document Guide</span>
        </motion.nav>
      </div>

      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-full mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="">Document Guide</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete list of required documents for quick loan approval
          </p>
        </motion.div>

        {/* Upload Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Document Upload Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {uploadProcess.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold mb-1">Step {item.step}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex flex-wrap gap-3 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--royal-blue)] text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {filteredDocuments.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{doc.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                    </div>
                  </div>
                  {doc.required && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full font-medium">
                      Required
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Formats: {doc.formats.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Download className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {doc.size}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-1 text-[var(--gold)]" />
                      Quick Tips
                    </h4>
                    <ul className="space-y-1">
                      {doc.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6"
        >
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-3 text-yellow-900 dark:text-yellow-100">Important Notes</h3>
              <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  All documents must be clear, legible, and unaltered
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Self-attested copies are acceptable for most documents
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Original documents may be required for verification in some cases
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Documents in regional languages must have English translation
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Your data is encrypted and secure - we never share with unauthorized parties
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white text-center"
        >
          <Upload className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to Upload Documents?</h2>
          <p className="text-xl mb-6 opacity-90">
            Start your loan application and upload documents securely
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <button className="px-8 py-3 bg-white text-[var(--royal-blue)] rounded-lg font-semibold hover:shadow-lg transition-all">
                Apply Now
              </button>
            </Link>
            <Link href="/resources/faqs">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[var(--royal-blue)] transition-all">
                View FAQs
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}