"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calculator,
  TrendingUp,
  PieChart,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Home,
  ArrowRight,
  InfoIcon
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  interestPercentage: number;
}

interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function EMICalculatorPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(24);
  const [showAmortization, setShowAmortization] = useState(false);

  // Calculate EMI and other details
  const calculateEMI = (): EMIResult => {
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = tenure;

    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    const interestPercentage = (totalInterest / totalPayment) * 100;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestPercentage: Math.round(interestPercentage * 100) / 100
    };
  };

  // Generate amortization schedule
  const generateAmortization = (): AmortizationEntry[] => {
    const schedule: AmortizationEntry[] = [];
    const monthlyRate = interestRate / 12 / 100;
    const emi = calculateEMI().emi;
    let balance = loanAmount;

    for (let month = 1; month <= tenure; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance = balance - principalPayment;

      schedule.push({
        month,
        emi,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, balance))
      });
    }

    return schedule;
  };

  const result = calculateEMI();
  const amortizationSchedule = generateAmortization();

  const resetCalculator = () => {
    setLoanAmount(500000);
    setInterestRate(12);
    setTenure(24);
    setShowAmortization(false);
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
          <span>Resources</span>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[var(--royal-blue)] font-medium">EMI Calculator</span>
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
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">EMI Calculator</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your monthly EMI, total interest, and get a detailed amortization schedule
          </p>
        </motion.div>

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-2 text-[var(--royal-blue)]" />
              Loan Details
            </h2>

            <div className="space-y-8">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Amount
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>₹50K</span>
                    <span>₹50L</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl font-bold text-[var(--royal-blue)]">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Interest Rate (% per annum)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>8%</span>
                    <span>24%</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl font-bold text-[var(--emerald-green)]">
                    {interestRate}%
                  </span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tenure (Months)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>6M</span>
                    <span>60M</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl font-bold text-[var(--gold)]">
                    {tenure} Months
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(tenure / 12).toFixed(1)} years)
                  </span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetCalculator}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Calculator
              </button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* EMI Result Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-[var(--emerald-green)]" />
                EMI Breakdown
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--royal-blue-light)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Monthly EMI</p>
                  <p className="text-2xl font-bold">₹{result.emi.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-[var(--emerald-green)] to-[var(--emerald-dark)] rounded-xl text-white">
                  <p className="text-sm opacity-90">Total Interest</p>
                  <p className="text-2xl font-bold">₹{result.totalInterest.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Payment</span>
                  <span className="text-xl font-bold">₹{result.totalPayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Interest Percentage</span>
                  <span className="text-lg font-semibold text-[var(--gold)]">{result.interestPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-[var(--gold)]" />
                Payment Breakdown
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[var(--royal-blue)] rounded mr-3"></div>
                    <span className="font-medium">Principal Amount</span>
                  </div>
                  <span className="font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[var(--emerald-green)] rounded mr-3"></div>
                    <span className="font-medium">Total Interest</span>
                  </div>
                  <span className="font-bold">₹{result.totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Quick Apply CTA */}
            <div className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
              <p className="mb-4 opacity-90">Get instant approval with our AI-powered system</p>
              <Link href="/apply">
                <button className="w-full bg-white text-[var(--royal-blue)] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Apply for Loan
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Amortization Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Download className="w-6 h-6 mr-2 text-[var(--royal-blue)]" />
              Amortization Schedule
            </h2>
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {showAmortization ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Schedule
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Schedule
                </>
              )}
            </button>
          </div>

          {showAmortization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2">Month</th>
                    <th className="text-right py-3 px-2">EMI</th>
                    <th className="text-right py-3 px-2">Principal</th>
                    <th className="text-right py-3 px-2">Interest</th>
                    <th className="text-right py-3 px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.map((entry) => (
                    <tr key={entry.month} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-2 px-2 font-medium">{entry.month}</td>
                      <td className="py-2 px-2 text-right">₹{entry.emi.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right text-[var(--royal-blue)]">₹{entry.principal.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right text-[var(--emerald-green)]">₹{entry.interest.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-2 text-right font-medium">₹{entry.balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>

        {/* Compare Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-[var(--gold)] to-[var(--rose-gold)] rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-xl mb-6 opacity-90">
              Our financial experts can help you find the perfect loan structure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-3 bg-white text-[var(--royal-blue)] rounded-lg font-semibold hover:shadow-lg transition-all">
                  Talk to Expert
                </button>
              </Link>
              <Link href="/resources/faqs">
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[var(--royal-blue)] transition-all">
                  View FAQs
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}