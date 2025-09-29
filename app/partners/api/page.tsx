'use client';

import { motion } from "framer-motion";
import {
  Code, Zap, Shield, Book, Terminal, CheckCircle,
  Globe, Lock, RefreshCw, BarChart, Webhook, Database,
  FileCode, MessageSquare, Phone, Mail, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function APIIntegrationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 to-[var(--royal-blue)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <Code className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-sora">
              API Integration
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Power your platform with Laxmi's lending APIs. 
              Seamlessly integrate financial services into your application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-[var(--royal-blue)] rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
                Get API Access
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition">
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Why Choose Our API?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enterprise-grade APIs built for scale and reliability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Zap className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Average response time under 200ms with 99.9% uptime SLA
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Shield className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Bank-Grade Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                256-bit encryption, OAuth 2.0, and compliance with all RBI norms
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Book className="w-12 h-12 text-[var(--royal-blue)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Comprehensive Docs</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed documentation with code examples in multiple languages
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <RefreshCw className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Real-time Webhooks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant notifications on application status changes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Globe className="w-12 h-12 text-[var(--gold)] mb-4" />
              <h3 className="text-xl font-bold mb-3">RESTful Design</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Standard REST architecture with JSON responses
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <BarChart className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor API usage, performance metrics, and conversion rates
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* API Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Available API Products</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the APIs that fit your use case
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Terminal className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Loan Origination API</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Complete loan application workflow from KYC to disbursement
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Customer verification",
                  "Credit assessment",
                  "Document upload",
                  "E-sign integration",
                  "Instant disbursement"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--emerald-green)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                <code>POST /api/v1/loan/apply</code>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Database className="w-12 h-12 text-[var(--royal-blue)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Credit Score API</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Real-time credit scoring and risk assessment
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Instant credit check",
                  "Bureau integration",
                  "Risk categorization",
                  "Offer generation",
                  "Pre-approved limits"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--royal-blue)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                <code>GET /api/v1/credit/score</code>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Webhook className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Webhook API</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Real-time event notifications for loan lifecycle
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Application submitted",
                  "Document verified",
                  "Loan approved/rejected",
                  "Disbursement complete",
                  "Payment received"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                <code>POST /api/v1/webhooks</code>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <FileCode className="w-12 h-12 text-[var(--gold)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Repayment API</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Manage EMI payments and loan accounts
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Payment processing",
                  "EMI schedules",
                  "Account statements",
                  "Payment history",
                  "Outstanding balance"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300">
                <code>POST /api/v1/repayment</code>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Integration Process</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get started in 4 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Register & Get Credentials",
                  description: "Sign up for API access and receive your API keys and sandbox environment"
                },
                {
                  step: "02",
                  title: "Test in Sandbox",
                  description: "Use our sandbox environment to test all API endpoints with sample data"
                },
                {
                  step: "03",
                  title: "Integration Review",
                  description: "Our team reviews your integration and provides optimization suggestions"
                },
                {
                  step: "04",
                  title: "Go Live",
                  description: "Move to production with full support and monitoring"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-900 to-[var(--royal-blue)] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="hidden lg:block w-6 h-6 text-gray-400 mt-4" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Pay only for successful transactions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Free</span>
                <span className="text-gray-600 dark:text-gray-300">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 100 API calls/day",
                  "Sandbox access",
                  "Basic support",
                  "Standard documentation"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--emerald-green)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Get Started
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[var(--royal-blue)] to-purple-700 rounded-xl p-8 shadow-xl text-white relative"
            >
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited API calls",
                  "Production access",
                  "Priority support",
                  "Custom rate limits",
                  "Dedicated account manager"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white text-[var(--royal-blue)] rounded-lg font-semibold hover:bg-gray-100 transition">
                Contact Sales
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "White-label solutions",
                  "Custom integrations",
                  "24/7 support",
                  "SLA guarantee",
                  "On-premise deployment"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--emerald-green)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-[var(--royal-blue)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Ready to Integrate?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start building with our APIs today. Get sandbox access instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-white text-[var(--royal-blue)] rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
                Get API Keys
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>+91 88888 82222</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>api@laxmione.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}