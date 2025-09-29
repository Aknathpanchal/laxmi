'use client';

import { motion } from "framer-motion";
import { Lock, Shield, Eye, Database, UserCheck, Bell, Globe, Mail } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PrivacyPage() {
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
            <Lock className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sora">
              Privacy Policy
            </h1>
            <p className="text-xl">Your privacy is our priority</p>
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
                <Shield className="w-6 h-6 text-[var(--emerald-green)]" />
                Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                LaxmiOne Financial Services Private Limited ("we", "our", or "us") is committed
                to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you use our services.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We comply with all applicable data protection laws, including the Information
                Technology Act, 2000, and guidelines issued by the Reserve Bank of India.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-[var(--royal-blue)]" />
                Information We Collect
              </h2>

              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <ul className="space-y-1">
                    <li>• Full name, date of birth, gender</li>
                    <li>• PAN card, Aadhaar card, and other KYC documents</li>
                    <li>• Contact details (phone, email, address)</li>
                    <li>• Employment and income information</li>
                    <li>• Bank account details</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Financial Information</h3>
                  <ul className="space-y-1">
                    <li>• Credit history and credit score</li>
                    <li>• Loan application details</li>
                    <li>• Transaction history</li>
                    <li>• Financial statements and documents</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technical Information</h3>
                  <ul className="space-y-1">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Location data (with your permission)</li>
                    <li>• Usage patterns and preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[var(--emerald-green)]" />
                How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Processing loan applications and disbursements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Verifying identity and creditworthiness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Preventing fraud and money laundering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Complying with legal and regulatory requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Improving our services and customer experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Sending service-related communications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--emerald-green)]">✓</span>
                  <span>Marketing (with your consent)</span>
                </li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-[var(--royal-blue)]" />
                Information Sharing
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may share your information with:
              </p>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Credit Bureaus</h3>
                  <p className="text-sm">CIBIL, Experian, CRIF, Equifax for credit assessment</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Regulatory Authorities</h3>
                  <p className="text-sm">RBI, Income Tax Department, and other government agencies as required by law</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Service Providers</h3>
                  <p className="text-sm">Payment processors, KYC verification services, cloud storage providers</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Banking Partners</h3>
                  <p className="text-sm">For loan disbursement and collection purposes</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                We do not sell, rent, or trade your personal information to third parties for
                marketing purposes.
              </p>
            </div>

            {/* Data Security */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[var(--gold)]" />
                Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• 256-bit SSL encryption for data transmission</li>
                <li>• Secure servers with firewall protection</li>
                <li>• Regular security audits and penetration testing</li>
                <li>• Access controls and authentication mechanisms</li>
                <li>• Data encryption at rest and in transit</li>
                <li>• PCI-DSS compliance for payment data</li>
                <li>• ISO 27001 certified information security management</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[var(--emerald-green)]" />
                Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Access</h3>
                  <p className="text-sm">Request a copy of your personal data</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Correction</h3>
                  <p className="text-sm">Update or correct inaccurate information</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Deletion</h3>
                  <p className="text-sm">Request deletion (subject to legal requirements)</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-1">Portability</h3>
                  <p className="text-sm">Receive your data in a structured format</p>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-[var(--royal-blue)]" />
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze website traffic and usage patterns</li>
                <li>• Personalize your experience</li>
                <li>• Detect and prevent fraud</li>
                <li>• Improve our services</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                You can control cookies through your browser settings. However, disabling cookies
                may affect the functionality of our services.
              </p>
            </div>

            {/* Data Retention */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We retain your personal information for as long as necessary to fulfill the
                purposes outlined in this policy, comply with legal obligations, resolve disputes,
                and enforce our agreements. Typically:
              </p>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300 mt-4">
                <li>• Active loan data: Duration of loan + 7 years</li>
                <li>• Application data: 3 years from rejection/withdrawal</li>
                <li>• Transaction records: 10 years as per regulatory requirements</li>
                <li>• Marketing data: Until you opt-out</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our services are not directed to individuals under 18 years of age. We do not
                knowingly collect personal information from children. If you become aware that
                a child has provided us with personal information, please contact us immediately.
              </p>
            </div>

            {/* Updates */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Policy Updates</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting the new policy on our website and updating the
                "Last Updated" date. Your continued use of our services after such modifications
                constitutes your acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-[var(--emerald-green)]" />
                Contact Us
              </h2>
              <div className="bg-gradient-to-br from-[var(--emerald-green)]/10 to-[var(--royal-blue)]/10 rounded-lg p-6">
                <p className="font-semibold mb-2">Data Protection Officer</p>
                <p className="text-gray-600 dark:text-gray-300">
                  LaxmiOne Financial Services Pvt. Ltd.<br />
                  Email: privacy@laxmione.com<br />
                  Phone: 1800-123-5555<br />
                  Address: Mumbai, Maharashtra 400001
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Last Updated: January 1, 2024
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}