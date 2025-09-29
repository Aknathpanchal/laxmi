"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, TrendingUp, Percent, Calendar, CheckCircle } from "lucide-react";

export function LoanCalculator() {
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(3);
  const [purpose, setPurpose] = useState("personal");

  const interestRate = 1.5;
  const processingFee = amount * 0.02; // 2% processing fee
  const monthlyInterest = (amount * interestRate * tenure) / 100;
  const totalAmount = amount + monthlyInterest;
  const monthlyEMI = totalAmount / tenure;

  const loanPurposes = [
    { value: "personal", label: "Personal", icon: "👤" },
    { value: "medical", label: "Medical", icon: "🏥" },
    { value: "education", label: "Education", icon: "🎓" },
    { value: "business", label: "Business", icon: "💼" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "wedding", label: "Wedding", icon: "💑" },
  ];

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[#38bdf8] to-[#34d399] rounded-lg flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">EMI Calculator</h3>
            <p className="text-sm text-gray-700">See your monthly payment instantly</p>
          </div>
        </div>
      </div>

      {/* Loan Purpose Selector */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">
          Select Loan Purpose
        </label>
        <div className="grid grid-cols-3 gap-2">
          {loanPurposes.map((item) => (
            <button
              key={item.value}
              onClick={() => setPurpose(item.value)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                purpose === item.value
                  ? "bg-gradient-to-r from-[#34d399] to-[#fbbf24] text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>Loan Amount</span>
            <span className="text-[#34d399] font-bold">₹{amount.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #34d399 0%, #34d399 ${
                ((amount - 10000) / (500000 - 10000)) * 100
              }%, #e5e7eb ${((amount - 10000) / (500000 - 10000)) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹10K</span>
            <span>₹5L</span>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>Tenure</span>
            <span className="text-[#34d399] font-bold">{tenure} months</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #34d399 0%, #34d399 ${
                ((tenure - 1) / 11) * 100
              }%, #e5e7eb ${((tenure - 1) / 11) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 month</span>
            <span>12 months</span>
          </div>
        </div>

        <div className="border-t pt-6 space-y-3">
          <div className="bg-gradient-to-r from-[#f8fbff] to-[#ecfdf5] rounded-xl p-4 space-y-3 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Interest Rate
              </span>
              <span className="font-semibold">{interestRate}% per month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Processing Fee
              </span>
              <span className="font-semibold">₹{processingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Total Interest
              </span>
              <span className="font-semibold">₹{monthlyInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Total Payable
              </span>
              <span className="font-semibold text-lg">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-[#38bdf8] to-[#34d399] p-6 rounded-xl text-white shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <p className="text-sm opacity-90 mb-2">Your Monthly EMI</p>
            <p className="text-4xl font-bold mb-2">₹{Math.round(monthlyEMI).toLocaleString()}</p>
            <p className="text-sm opacity-90">for {tenure} months</p>
          </motion.div>

          {/* Trust Messages */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#34d399]" />
              <span>No hidden charges</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#34d399]" />
              <span>Flexible repayment options</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#34d399]" />
              <span>Instant disbursal on approval</span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-gradient-to-r from-[#38bdf8] to-[#34d399] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Apply Now for ₹{amount.toLocaleString()}
        </motion.button>

        <p className="text-center text-xs text-gray-500">
          Get approval in 30 seconds • Money in bank within minutes
        </p>
      </div>
    </motion.div>
  );
}