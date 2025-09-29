"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  ArrowRight,
  User,
  Briefcase,
  CreditCard,
  MapPin,
  IndianRupee,
  Calendar,
  Smartphone,
  FileText,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function EligibilityCheckPage() {
  const [formData, setFormData] = useState({
    age: "",
    monthlyIncome: "",
    employmentType: "",
    creditScore: "",
    existingLoans: "",
    city: ""
  });
  const [result, setResult] = useState<null | { eligible: boolean; score: number; message: string }>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEligibility = () => {
    let score = 0;
    
    // Age scoring
    const age = parseInt(formData.age);
    if (age >= 25 && age <= 45) score += 25;
    else if (age >= 21 && age <= 58) score += 15;
    
    // Income scoring
    const income = parseInt(formData.monthlyIncome);
    if (income >= 50000) score += 30;
    else if (income >= 30000) score += 20;
    else if (income >= 15000) score += 10;
    
    // Employment scoring
    if (formData.employmentType === "salaried") score += 20;
    else if (formData.employmentType === "self-employed") score += 15;
    
    // Credit score
    const credit = parseInt(formData.creditScore);
    if (credit >= 750) score += 25;
    else if (credit >= 650) score += 15;
    else if (credit >= 550) score += 5;

    const eligible = score >= 60;
    let message = "";
    
    if (score >= 80) {
      message = "Excellent! You're highly eligible for our premium loan offers with the best interest rates.";
    } else if (score >= 60) {
      message = "Great! You qualify for our loan products. We'll offer competitive rates based on your profile.";
    } else if (score >= 40) {
      message = "You're close! Consider improving your credit score or income to qualify for better terms.";
    } else {
      message = "Currently not eligible. Focus on building your credit score and stable income to reapply.";
    }

    setResult({ eligible, score, message });
    setShowResult(true);
  };

  const isFormValid = Object.values(formData).every(value => value !== "");

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
          <span className="text-[var(--royal-blue)] font-medium">Eligibility Check</span>
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
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">Check Your Eligibility</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get instant eligibility results powered by AI. Takes only 30 seconds!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {!showResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[var(--royal-blue)]" />
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  />
                </div>

                {/* Monthly Income */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2 text-[var(--emerald-green)]" />
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    placeholder="Enter monthly income"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-[var(--gold)]" />
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange("employmentType", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  >
                    <option value="">Select type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business Owner</option>
                  </select>
                </div>

                {/* Credit Score */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-[var(--royal-blue)]" />
                    Credit Score (CIBIL)
                  </label>
                  <select
                    value={formData.creditScore}
                    onChange={(e) => handleInputChange("creditScore", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  >
                    <option value="">Select range</option>
                    <option value="800">750 - 900 (Excellent)</option>
                    <option value="700">650 - 749 (Good)</option>
                    <option value="600">550 - 649 (Fair)</option>
                    <option value="500">Below 550 (Poor)</option>
                  </select>
                </div>

                {/* Existing Loans */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[var(--emerald-green)]" />
                    Existing Loans
                  </label>
                  <select
                    value={formData.existingLoans}
                    onChange={(e) => handleInputChange("existingLoans", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  >
                    <option value="">Select option</option>
                    <option value="none">No Existing Loans</option>
                    <option value="1">1 Loan</option>
                    <option value="2">2 Loans</option>
                    <option value="3+">3+ Loans</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-[var(--gold)]" />
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={calculateEligibility}
                disabled={!isFormValid}
                className={`w-full mt-8 py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center ${
                  isFormValid
                    ? 'bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] hover:shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Check Eligibility
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky text-center"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                result?.eligible ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result?.eligible ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h2 className="text-3xl font-bold mb-4">
                {result?.eligible ? 'Congratulations!' : 'Not Quite There'}
              </h2>

              <div className="mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Eligibility Score</div>
                <div className="text-5xl font-bold text-[var(--royal-blue)]">{result?.score}%</div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{result?.message}</p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowResult(false);
                    setResult(null);
                  }}
                  className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Check Again
                </button>
                {result?.eligible && (
                  <Link href="/apply" className="flex-1">
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Apply Now
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI-Powered</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced algorithms analyze 500+ data points for accurate results
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get your eligibility status in just 30 seconds
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Impact</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Checking eligibility won't affect your credit score
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}