"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Home,
  ArrowRight,
  Percent,
  Calculator,
  Award,
  CheckCircle,
  XCircle,
  Info,
  Star,
  Zap
} from "lucide-react";
import Link from "next/link";

interface RateTier {
  id: string;
  creditScore: string;
  rate: string;
  processingFee: string;
  description: string;
  features: string[];
  badge?: string;
}

export default function InterestRatesPage() {
  const [loanType, setLoanType] = useState<string>("personal");

  const loanTypes = [
    { id: "personal", name: "Personal Loan", icon: TrendingDown },
    { id: "business", name: "Business Loan", icon: TrendingUp },
    { id: "education", name: "Education Loan", icon: Award }
  ];

  const rateTiers: RateTier[] = [
    {
      id: "1",
      creditScore: "750 - 900",
      rate: "8.99% - 11.99%",
      processingFee: "1.5% - 2%",
      description: "Excellent credit profile",
      features: [
        "Lowest interest rates",
        "Up to ₹5,00,000 loan amount",
        "Flexible tenure 6-60 months",
        "Zero prepayment charges",
        "Quick approval in 30 seconds"
      ],
      badge: "Best Rate"
    },
    {
      id: "2",
      creditScore: "650 - 749",
      rate: "12% - 16%",
      processingFee: "2%",
      description: "Good credit profile",
      features: [
        "Competitive rates",
        "Up to ₹3,00,000 loan amount",
        "Flexible tenure 6-48 months",
        "Minimal prepayment charges",
        "Fast approval process"
      ]
    },
    {
      id: "3",
      creditScore: "550 - 649",
      rate: "16% - 20%",
      processingFee: "2% - 2.5%",
      description: "Fair credit profile",
      features: [
        "Standard rates",
        "Up to ₹2,00,000 loan amount",
        "Flexible tenure 6-36 months",
        "Standard prepayment charges",
        "Regular approval process"
      ]
    },
    {
      id: "4",
      creditScore: "Below 550",
      rate: "20% - 24%",
      processingFee: "2.5% - 3%",
      description: "Building credit profile",
      features: [
        "Higher rates for risk",
        "Up to ₹1,00,000 loan amount",
        "Tenure 6-24 months",
        "Standard prepayment charges",
        "Manual verification required"
      ]
    }
  ];

  const charges = [
    {
      title: "Processing Fee",
      amount: "1.5% - 3%",
      description: "One-time fee, deducted from loan amount",
      icon: Calculator,
      included: true
    },
    {
      title: "Prepayment Charges",
      amount: "0% - 2%",
      description: "On outstanding principal after 6 months",
      icon: TrendingDown,
      included: true
    },
    {
      title: "Late Payment Fee",
      amount: "₹500 per instance",
      description: "Charged after 7 days of EMI due date",
      icon: TrendingUp,
      included: true
    },
    {
      title: "Bounce Charges",
      amount: "₹500 per bounce",
      description: "For failed EMI auto-debit attempts",
      icon: XCircle,
      included: true
    },
    {
      title: "GST",
      amount: "18%",
      description: "Applicable on processing fee and other charges",
      icon: Percent,
      included: true
    }
  ];

  const benefits = [
    "No hidden charges - complete transparency",
    "Reduce rates with timely repayments",
    "Special rates for repeat customers",
    "Flexible tenure options",
    "Quick top-up loan facility"
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
          <span className="text-[var(--royal-blue)] font-medium">Interest Rates</span>
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
            <Percent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">Interest Rates & Charges</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transparent pricing with rates starting from 8.99% per annum
          </p>
        </motion.div>

        {/* Loan Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm">
            {loanTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setLoanType(type.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    loanType === type.id
                      ? 'bg-[var(--royal-blue)] text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Rate Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {rateTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative ${
                tier.badge ? 'border-2 border-[var(--gold)]' : ''
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-[var(--gold)] text-white text-xs font-bold rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {tier.badge}
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">Credit Score: {tier.creditScore}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Interest Rate</div>
                  <div className="text-xl font-bold text-[var(--royal-blue)]">{tier.rate}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Processing Fee</div>
                  <div className="text-xl font-bold text-[var(--emerald-green)]">{tier.processingFee}</div>
                </div>
              </div>

              <div className="space-y-2">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Charges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Additional Charges</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charges.map((charge, index) => {
              const Icon = charge.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon className="w-5 h-5 text-[var(--royal-blue)]" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{charge.title}</h3>
                    <div className="text-lg font-semibold text-[var(--emerald-green)] mb-1">{charge.amount}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{charge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[var(--gold)] to-[var(--rose-gold)] rounded-2xl p-8 text-white mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            Why Choose Our Rates?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">Important Information</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Interest rates are subject to change based on RBI guidelines and market conditions</li>
                <li>• Final rate offered depends on credit assessment and risk profile</li>
                <li>• All charges are exclusive of applicable GST (18%)</li>
                <li>• Interest is calculated on reducing balance method</li>
                <li>• Check your loan agreement for exact rates and charges</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white text-center"
        >
          <Calculator className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Calculate Your EMI</h2>
          <p className="text-xl mb-6 opacity-90">
            Use our EMI calculator to plan your loan repayment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resources/emi-calculator">
              <button className="px-8 py-3 bg-white text-[var(--royal-blue)] rounded-lg font-semibold hover:shadow-lg transition-all">
                EMI Calculator
              </button>
            </Link>
            <Link href="/apply">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[var(--royal-blue)] transition-all">
                Apply Now
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}