"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Wallet, CheckCircle, Clock, Shield, TrendingUp,
  ArrowRight, Calculator, FileText, Building, Zap,
  Phone, ChevronRight, Star, CreditCard, Calendar
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function SalaryAdvancePage() {
  const { t } = useLanguage();
  const [salary, setSalary] = useState(30000);
  const [loanAmount, setLoanAmount] = useState(15000);
  const maxLoan = Math.min(salary * 2, 100000);
  const processingFee = loanAmount * 0.02;
  const interest = loanAmount * 0.015;
  const totalPayable = loanAmount + interest + processingFee;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--emerald-green)] via-teal-600 to-[var(--emerald-green)] text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="hover:text-white/80">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/products" className="hover:text-white/80">Products</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Salary Advance</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-sora">
              Instant Salary Advance
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Get up to 2 months salary advance instantly - Perfect for salaried employees
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>5 Minute Disbursal</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                <span>500+ Partner Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Auto-deduct from Salary</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[var(--emerald-green)] rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  Get Salary Advance
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/resources/eligibility">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all">
                  Check Eligibility
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits for Salaried */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Why Salaried Employees Love Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Designed specifically for working professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--emerald-green)] to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Salary Calculator */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Calculate Your Salary Advance</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Monthly Salary: ₹{salary.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="15000"
                    max="200000"
                    step="5000"
                    value={salary}
                    onChange={(e) => {
                      setSalary(Number(e.target.value));
                      setLoanAmount(Math.min(loanAmount, Number(e.target.value) * 2));
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹15,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Advance Amount: ₹{loanAmount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max={maxLoan}
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹5,000</span>
                    <span>₹{maxLoan.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[var(--emerald-green)] to-teal-600 rounded-2xl p-6 text-white">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Advance Amount:</span>
                      <span className="font-semibold">₹{loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest (1.5%):</span>
                      <span>₹{Math.round(interest).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee (2%):</span>
                      <span>₹{Math.round(processingFee).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Total Deduction from Next Salary:</span>
                      <span>₹{Math.round(totalPayable).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <Link href="/apply" className="block">
                  <button className="w-full py-4 bg-gradient-to-r from-[var(--emerald-green)] to-teal-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                    Apply for Salary Advance
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Companies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Our Partner Companies</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Employees from 500+ companies trust us for salary advances
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center h-24"
              >
                <span className="text-gray-600 dark:text-gray-300 font-semibold">{company}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold font-sora mb-4">Simple Eligibility Criteria</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                If you're a salaried employee, you're likely eligible!
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-[var(--emerald-green)]">Basic Requirements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Age: 21-58 years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Min Salary: ₹15,000/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Indian Citizen</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-[var(--emerald-green)]">Employment</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Permanent employee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>6+ months in current job</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Salary via bank transfer</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-[var(--emerald-green)]">Documents</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                    <span>PAN Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                    <span>Aadhaar Card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                    <span>Last 3 Salary Slips</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">How to Get Your Salary Advance</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              3 simple steps to instant cash
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[var(--emerald-green)] to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">What Employees Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real stories from real people
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.designation}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[var(--emerald-green)] to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 font-sora">
              Don't Wait Till Payday!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get instant salary advance in just 5 minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <button className="px-8 py-4 bg-white text-[var(--emerald-green)] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Get Salary Advance Now
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  Talk to Expert
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const benefits = [
  {
    icon: Zap,
    title: "Instant Approval",
    description: "No waiting, no queues. Get approved instantly with our AI system"
  },
  {
    icon: Calendar,
    title: "Flexible Repayment",
    description: "Auto-deduct from your next salary or pay in EMIs"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your data is encrypted and never shared with third parties"
  },
  {
    icon: CreditCard,
    title: "No Hidden Charges",
    description: "Transparent pricing with no surprises"
  },
  {
    icon: Building,
    title: "Company Tie-ups",
    description: "Special rates for employees of partner companies"
  },
  {
    icon: Wallet,
    title: "Repeat Advances",
    description: "Build credit history and get higher advances"
  }
];

const companies = [
  "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Cognizant",
  "Accenture", "IBM", "Capgemini", "Dell", "Amazon", "Flipkart"
];

const process = [
  {
    title: "Apply Online",
    description: "Fill a simple form with employment details and upload salary slips"
  },
  {
    title: "Instant Verification",
    description: "Our AI verifies your details and approves within seconds"
  },
  {
    title: "Get Money",
    description: "Money transferred to your bank account in 5 minutes"
  }
];

const testimonials = [
  {
    name: "Ankit Verma",
    designation: "Software Engineer",
    company: "Infosys",
    comment: "Got salary advance for a medical emergency. The process was incredibly fast and hassle-free!"
  },
  {
    name: "Sneha Reddy",
    designation: "Marketing Manager",
    company: "Amazon",
    comment: "Used it for my sister's wedding expenses. Auto-deduction from salary made repayment super convenient."
  },
  {
    name: "Rajesh Kumar",
    designation: "Senior Analyst",
    company: "TCS",
    comment: "Best part is no paperwork! Everything happens online and money comes instantly."
  }
];