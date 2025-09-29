"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  CreditCard, CheckCircle, Clock, Shield, TrendingUp,
  ArrowRight, Calculator, FileText, Users, Zap,
  Phone, ChevronRight, Star, Award, Banknote
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PersonalLoanPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const emi = Math.round((loanAmount * 1.5 / 100 * tenure + loanAmount) / tenure);

  const features = [
    {
      icon: Zap,
      title: t.features.list.instant.title,
      description: t.features.list.instant.description
    },
    {
      icon: Shield,
      title: t.features.list.secure.title,
      description: t.features.list.secure.description
    },
    {
      icon: Banknote,
      title: "Flexible Amounts",
      description: `Borrow from ${t.products.types.personal.amount} based on your needs`
    },
    {
      icon: Clock,
      title: t.features.list.flexible.title,
      description: `Choose repayment period from ${t.products.types.personal.tenure}`
    },
    {
      icon: Users,
      title: "No Guarantor",
      description: "No need for guarantor or collateral for your loan"
    },
    {
      icon: Award,
      title: "Best Rates",
      description: `Industry-leading interest rates ${t.products.types.personal.rate}`
    }
  ];

  const eligibility = [
    t.eligibility.age,
    t.eligibility.income,
    t.eligibility.credit,
    t.eligibility.employment,
    "Self-employed with minimum 2 years business vintage",
    "Valid bank account with 6 months statement"
  ];

  const documents = [
    "PAN Card (Mandatory)",
    "Aadhaar Card for KYC and address proof",
    "Latest 3 months salary slips (for salaried)",
    "Last 6 months bank statement",
    "ITR for last 2 years (for self-employed)",
    "Business proof (for self-employed)"
  ];

  const steps = [
    {
      title: t.process.steps.apply.title,
      description: t.process.steps.apply.description
    },
    {
      title: t.process.steps.verify.title,
      description: t.process.steps.verify.description
    },
    {
      title: t.process.steps.disbursal.title,
      description: t.process.steps.disbursal.description
    }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Mumbai",
      comment: "Got my loan approved in literally 30 seconds! The process was incredibly smooth and hassle-free."
    },
    {
      name: "Priya Patel",
      location: "Delhi",
      comment: "Best interest rates in the market. Customer service is excellent and always helpful."
    },
    {
      name: "Amit Kumar",
      location: "Bangalore",
      comment: "Needed urgent funds for medical emergency. Laxmi came through when I needed them most."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2563EB] via-[#10B981] to-[#2563EB] text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="hover:text-white/80">{t.navigation.home}</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/products" className="hover:text-white/80">{t.navigation.products}</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{t.products.types.personal.name}</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-sora">
              {t.products.types.personal.name}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {t.products.types.personal.description} - {t.products.types.personal.amount}
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{t.features.list.instant.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>{t.features.list.paperless.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Lowest Interest Rates</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[#2563EB] rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  {t.common.apply}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/resources/emi-calculator">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Calculate EMI
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4 text-gray-900 dark:text-white">Why Choose {t.common.appName} {t.products.types.personal.name}?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t.features.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Quick EMI Calculator</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tenure: {tenure} months
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>3 months</span>
                    <span>24 months</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-2xl p-6 text-white">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm opacity-80">Monthly EMI</p>
                      <p className="text-2xl font-bold">₹{emi.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Interest Rate</p>
                      <p className="text-2xl font-bold">1.5%</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Total Payable</p>
                      <p className="text-2xl font-bold">₹{(emi * tenure).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <Link href="/apply" className="block">
                  <button className="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                    Apply for This Amount
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold font-sora mb-4 text-gray-900 dark:text-white">{t.eligibility.title}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Simple requirements, minimal documentation
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  {t.eligibility.title}
                </h3>
                <ul className="space-y-4">
                  {eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <FileText className="w-6 h-6 text-blue-500" />
                  {t.eligibility.documents}
                </h3>
                <ul className="space-y-4">
                  {documents.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4 text-gray-900 dark:text-white">{t.process.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get your personal loan in 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4 text-gray-900 dark:text-white">{t.testimonials.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t.testimonials.subtitle}
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
                <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 font-sora">Ready to Get Your {t.products.types.personal.name}?</h2>
            <p className="text-xl mb-8 opacity-90">
              Apply now and get instant approval in just 30 seconds
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <button className="px-8 py-4 bg-white text-[#2563EB] rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  {t.common.apply}
                </button>
              </Link>
              <a href={`tel:${t.footer.contact.phone}`}>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}