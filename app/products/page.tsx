"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard, Wallet, AlertCircle, PartyPopper, Heart, Plane,
  ArrowRight, CheckCircle, TrendingUp, Shield, Clock, Calculator, ChevronDown,
  Banknote, Users, Award, Zap, Building, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const loanProducts = [
  {
    id: "salary-advance",
    title: "Salary Advance",
    description: "Get advance up to 2x your monthly salary instantly",
    icon: Wallet,
    amount: "₹5,000 - ₹2,00,000",
    tenure: "1 - 3 months",
    rate: "1.5% per month",
    features: [
      "Instant approval for salaried employees",
      "Auto-deduction from next salary",
      "No collateral required",
      "500+ partner companies"
    ],
    eligibility: [
      "Age: 21-58 years",
      "Monthly income: ₹15,000+",
      "6+ months employment",
      "Salary account required"
    ],
    color: "from-[#34d399] to-[#10b981]",
    popular: true
  },
  {
    id: "personal",
    title: "Personal Loan",
    description: "Quick cash for all your personal needs",
    icon: CreditCard,
    amount: "₹10,000 - ₹5,00,000",
    tenure: "3 - 24 months",
    rate: "1.5% per month",
    features: [
      "30-second approval",
      "Flexible repayment options",
      "Minimal documentation",
      "100% paperless process"
    ],
    eligibility: [
      "Age: 21-60 years",
      "Monthly income: ₹15,000+",
      "CIBIL Score: 650+",
      "Indian citizen"
    ],
    color: "from-[#38bdf8] to-[#34d399]"
  },
  {
    id: "emergency",
    title: "Emergency Fund",
    description: "24-hour support for medical and urgent needs",
    icon: AlertCircle,
    amount: "₹10,000 - ₹2,00,000",
    tenure: "3 - 12 months",
    rate: "1.2% per month",
    features: [
      "24-hour approval",
      "Direct hospital payment",
      "Compassionate support",
      "No questions asked"
    ],
    eligibility: [
      "Emergency proof",
      "Basic KYC documents",
      "Income proof",
      "Medical documents"
    ],
    color: "from-[#fbbf24] to-[#34d399]"
  },
  {
    id: "festival",
    title: "Festival Advance",
    description: "Celebrate every festival without financial worry",
    icon: PartyPopper,
    amount: "₹5,000 - ₹1,00,000",
    tenure: "1 - 6 months",
    rate: "1.2% per month",
    features: [
      "Special festival rates",
      "Quick disbursal",
      "Flexible repayment",
      "All festivals covered"
    ],
    eligibility: [
      "Regular income proof",
      "Basic KYC",
      "3 months bank statement",
      "Employment proof"
    ],
    color: "from-[#fbbf24] to-[#38bdf8]"
  },
  {
    id: "medical",
    title: "Medical Loan",
    description: "Healthcare financing for planned treatments",
    icon: Heart,
    amount: "₹25,000 - ₹10,00,000",
    tenure: "6 - 48 months",
    rate: "1.0% per month",
    features: [
      "Lowest interest rates",
      "Hospital tie-ups",
      "Insurance coordination",
      "Cashless facility"
    ],
    eligibility: [
      "Treatment estimate",
      "Doctor prescription",
      "Income documents",
      "Insurance papers"
    ],
    color: "from-[#34d399] to-[#38bdf8]"
  },
  {
    id: "travel",
    title: "Travel Now Pay Later",
    description: "Book your dream vacation today, pay next month",
    icon: Plane,
    amount: "₹25,000 - ₹3,00,000",
    tenure: "3 - 12 months",
    rate: "1.3% per month",
    features: [
      "Instant booking credit",
      "Travel insurance included",
      "Partner discounts",
      "Zero down payment"
    ],
    eligibility: [
      "Travel itinerary",
      "Valid passport/visa",
      "Income: ₹25,000+",
      "Return tickets"
    ],
    color: "from-[#38bdf8] to-[#fbbf24]"
  }
];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#38bdf8] via-[#34d399] to-[#38bdf8] text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 pt-24">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">All Loan Products</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-sora">
                Loan Products for Every Need
              </h1>
              <p className="text-xl mb-8 opacity-90 max-w-2xl">
                From salary advances to emergency funds, find the perfect loan solution
                tailored to your requirements with instant approval.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <p className="text-3xl font-bold">30 Sec</p>
                  <p className="text-sm opacity-80">Instant Approval</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm opacity-80">Paperless</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm opacity-80">Partner Companies</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-sm opacity-80">Support Available</p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Shield className="w-5 h-5" />
                  <span>RBI Licensed NBFC</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Clock className="w-5 h-5" />
                  <span>Quick Disbursal</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <TrendingUp className="w-5 h-5" />
                  <span>Competitive Rates</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Product - Salary Advance */}
      <section className="py-20 bg-gradient-to-br from-[#ecfdf5] to-[#f0fdfa]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#34d399]/10 rounded-full text-[#34d399] font-semibold mb-4 border border-[#34d399]/20">
              <Zap className="w-5 h-5" />
              Most Popular
            </div>
            <h2 className="text-4xl font-bold font-sora mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">Salary Advance - Our Flagship Product</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Specially designed for salaried employees. Get up to 2 months salary in advance with auto-deduction facility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12 max-w-5xl mx-auto border border-gray-100"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#34d399] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Instant Salary Advance</h3>
                    <p className="text-gray-700">For all salaried professionals</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {[
                    "Get 2X your monthly salary instantly",
                    "Auto-deduction from next salary",
                    "No paperwork or collateral",
                    "500+ partner companies",
                    "Lowest interest rates"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#34d399] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/products/salary-advance">
                  <button className="px-8 py-3 bg-gradient-to-r from-[#34d399] to-[#10b981] text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                    Apply for Salary Advance
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <div className="bg-gradient-to-br from-[#ecfdf5] to-[#f0fdfa] rounded-2xl p-6 border border-gray-100">
                <h4 className="font-semibold mb-4 text-lg">Quick Stats</h4>
                <div className="space-y-4">
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Amount Range</span>
                    <span className="font-semibold">₹5,000 - ₹2,00,000</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Interest Rate</span>
                    <span className="font-semibold text-[#34d399]">1.5% per month</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-700">Tenure</span>
                    <span className="font-semibold">1-3 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Processing Time</span>
                    <span className="font-semibold text-[#34d399]">30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4 bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">All Loan Products</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Choose from our comprehensive range of loan offerings designed for every financial need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loanProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Product Header */}
                <div className={`bg-gradient-to-r ${product.color} p-6 text-white relative`}>
                  {product.popular && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                      POPULAR
                    </div>
                  )}
                  <product.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                  <p className="opacity-90">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="font-semibold text-sm">{product.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tenure</p>
                      <p className="font-semibold text-sm">{product.tenure}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</p>
                      <p className="font-semibold text-lg text-[var(--emerald-green)]">
                        {product.rate}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 flex-1">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Learn More
                      </button>
                    </Link>
                    <Link href="/apply" className="flex-1">
                      <button className={`w-full px-4 py-2 bg-gradient-to-r ${product.color} text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2`}>
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Expandable Eligibility */}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedProduct(
                      selectedProduct === product.id ? null : product.id
                    )}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium">Eligibility Criteria</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        selectedProduct === product.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {selectedProduct === product.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      className="px-6 pb-6"
                    >
                      <ul className="space-y-2">
                        {product.eligibility.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4 text-gray-900 dark:text-white">Why Choose Laxmi?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not just another lending platform. We're your financial partner committed to your prosperity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4 font-sora">
              Ready to Get Your Loan?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who've transformed their financial journey with Laxmi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <button className="px-8 py-4 bg-white text-[var(--royal-blue)] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply Now
                </button>
              </Link>
              <Link href="/resources/emi-calculator">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 justify-center">
                  <Calculator className="w-5 h-5" />
                  Calculate EMI
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const whyChooseUs = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "30-second approval with AI-powered decisioning"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Bank-grade encryption and data protection"
  },
  {
    icon: Users,
    title: "Trusted by Many",
    description: "50,000+ happy customers and counting"
  },
  {
    icon: Award,
    title: "RBI Licensed",
    description: "Fully compliant and regulated NBFC"
  }
];