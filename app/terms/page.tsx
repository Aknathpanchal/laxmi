'use client';

import { motion } from "framer-motion";
import { Shield, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--emerald-green)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Terms & Conditions
            </h1>
            <p className="text-xl">Effective Date: January 1, 2024</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[var(--emerald-green)]" />
                1. Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Welcome to LaxmiOne. These Terms and Conditions govern your use of our services
                and form a binding legal agreement between you and LaxmiOne Financial Services
                Private Limited, a Non-Banking Financial Company (NBFC) registered with the
                Reserve Bank of India.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing or using our services, you agree to be bound by these terms. If you
                do not agree with any part of these terms, please do not use our services.
              </p>
            </div>

            {/* Eligibility */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[var(--emerald-green)]" />
                2. Eligibility Criteria
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                To use our loan services, you must:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">•</span>
                  Be at least 21 years of age and not more than 65 years
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">•</span>
                  Be an Indian citizen or resident
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">•</span>
                  Have a valid PAN card and Aadhaar card
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">•</span>
                  Have a minimum monthly income as specified for each loan product
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">•</span>
                  Have a satisfactory credit score as determined by our credit assessment
                </li>
              </ul>
            </div>

            {/* Loan Terms */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Loan Terms</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold mb-2">3.1 Interest Rates</h3>
                  <p>
                    Interest rates range from 10.99% to 24% per annum, calculated on a reducing
                    balance basis. The exact rate will be determined based on your credit profile,
                    loan amount, and tenure.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2 Processing Fees</h3>
                  <p>
                    A processing fee of up to 3% of the loan amount (plus applicable taxes) will
                    be charged at the time of loan disbursal.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.3 Prepayment</h3>
                  <p>
                    You may prepay your loan in full or in part after 3 EMIs. Prepayment charges
                    may apply as per RBI guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy and Security */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[var(--royal-blue)]" />
                4. Privacy and Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We take your privacy seriously. All personal and financial information provided
                is encrypted and stored securely. We comply with all applicable data protection
                laws and RBI guidelines.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Your information will only be used for:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--royal-blue)]">•</span>
                  Processing your loan application
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--royal-blue)]">•</span>
                  Credit assessment and verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--royal-blue)]">•</span>
                  Regulatory compliance and reporting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--royal-blue)]">•</span>
                  Customer service and support
                </li>
              </ul>
            </div>

            {/* Default and Recovery */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                5. Default and Recovery
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                In case of default (failure to pay EMI within 90 days of due date):
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Late payment charges of 2% per month will be applied
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Your credit score will be negatively impacted
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Legal action may be initiated for recovery
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  The loan account may be classified as NPA as per RBI guidelines
                </li>
              </ul>
            </div>

            {/* Dispute Resolution */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Dispute Resolution</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Any disputes arising out of these terms shall be resolved through:
              </p>
              <ol className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>1. Internal grievance redressal mechanism</li>
                <li>2. Banking Ombudsman (if not resolved internally)</li>
                <li>3. Arbitration under the Arbitration and Conciliation Act, 1996</li>
                <li>4. Courts of Mumbai shall have exclusive jurisdiction</li>
              </ol>
            </div>

            {/* Amendments */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Amendments</h2>
              <p className="text-gray-600 dark:text-gray-300">
                LaxmiOne reserves the right to modify these terms at any time. Changes will be
                effective immediately upon posting on our website. Continued use of our services
                after any modifications constitutes acceptance of the updated terms.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <p className="font-semibold mb-2">LaxmiOne Financial Services Pvt. Ltd.</p>
                <p className="text-gray-600 dark:text-gray-300">
                  RBI Registration No: B-14.03215<br />
                  Email: legal@laxmione.com<br />
                  Phone: 1800-123-5555<br />
                  Registered Office: Mumbai, Maharashtra
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}