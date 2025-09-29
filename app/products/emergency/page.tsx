"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle, Clock, Shield, Phone, Heart, Zap,
  ArrowRight, CheckCircle, ChevronRight, Star,
  Ambulance, Hospital, Stethoscope, Activity
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function EmergencyFundPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(50000);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative">
          {/* Breadcrumb */}
          <div className="container mx-auto px-4 pt-24">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/products" className="hover:text-white transition-colors">Loans</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Emergency Fund</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Ambulance className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold font-sora">
                    Emergency Fund
                  </h1>
                  <p className="text-xl opacity-90 mt-2">24-Hour Support When You Need It Most</p>
                </div>
              </div>

              <p className="text-xl mb-8 max-w-2xl leading-relaxed">
                Life doesn't wait. Get instant emergency funds up to ₹2 lakhs within 24 hours.
                No questions asked, just compassionate support.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Clock className="w-6 h-6 mb-2" />
                  <p className="font-semibold">24-Hour Approval</p>
                  <p className="text-sm opacity-80">Round the clock processing</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Heart className="w-6 h-6 mb-2" />
                  <p className="font-semibold">Compassionate Care</p>
                  <p className="text-sm opacity-80">Understanding support team</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Shield className="w-6 h-6 mb-2" />
                  <p className="font-semibold">100% Confidential</p>
                  <p className="text-sm opacity-80">Your privacy protected</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/apply">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2 justify-center"
                  >
                    Apply for Emergency Fund
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <a href="tel:+918888881111">
                  <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 justify-center">
                    <Phone className="w-5 h-5" />
                    Call Emergency Helpline
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Types */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">We Cover All Emergency Situations</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whatever the emergency, we're here to help with instant financial support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {emergencyTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <type.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{type.description}</p>
                <p className="text-sm font-semibold text-[var(--emerald-green)]">
                  Up to {type.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Calculator */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Calculate Emergency Loan</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  See how much you need to repay with flexible tenure options
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emergency Amount Needed: ₹{loanAmount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹10,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                {/* Repayment Info */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Processing Time:</span>
                    <span className="font-semibold text-red-600">Within 24 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Interest Rate:</span>
                    <span className="font-semibold">1.2% per month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Max Tenure:</span>
                    <span className="font-semibold">12 months</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-semibold">Monthly EMI:</span>
                    <span className="font-bold text-red-600">
                      ₹{Math.round((loanAmount * 1.12) / 12).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link href="/apply" className="block">
                  <button className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                    Apply for This Amount
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Emergency Loan Process</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple 3-step process designed for speed
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start bg-gray-50 dark:bg-gray-800 rounded-2xl p-6"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    {step.time && (
                      <p className="text-sm text-red-600 font-semibold mt-2">
                        ⏱️ {step.time}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Real Stories of Help</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              How we've helped people in their time of need
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
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.emergency}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4 font-sora">
              Don't Let Money Be a Worry During Emergencies
            </h2>
            <p className="text-xl mb-8 opacity-90">
              We're here 24/7 to provide instant financial support when you need it most
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <button className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply for Emergency Fund
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 justify-center">
                  <Phone className="w-5 h-5" />
                  24/7 Emergency Helpline
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const emergencyTypes = [
  {
    icon: Hospital,
    title: "Medical Emergency",
    description: "Hospital bills, surgery, treatments",
    amount: "₹2,00,000"
  },
  {
    icon: Heart,
    title: "Family Crisis",
    description: "Urgent family support needs",
    amount: "₹1,00,000"
  },
  {
    icon: Activity,
    title: "Accident Care",
    description: "Immediate accident expenses",
    amount: "₹1,50,000"
  },
  {
    icon: Stethoscope,
    title: "Critical Care",
    description: "ICU and critical treatments",
    amount: "₹2,00,000"
  }
];

const processSteps = [
  {
    title: "Submit Emergency Request",
    description: "Fill a simple form with minimal details. Our emergency team prioritizes your application immediately.",
    time: "2 minutes"
  },
  {
    title: "Quick Verification",
    description: "Basic KYC check and emergency validation. We understand urgency and process with compassion.",
    time: "30 minutes"
  },
  {
    title: "Instant Fund Transfer",
    description: "Once approved, funds are transferred directly to your bank or hospital account.",
    time: "Within 24 hours"
  }
];

const testimonials = [
  {
    name: "Suresh Kumar",
    emergency: "Medical Emergency",
    comment: "My father needed urgent surgery. LaxmiOne approved my loan within hours. Forever grateful for their quick response."
  },
  {
    name: "Priya Sharma",
    emergency: "Accident Care",
    comment: "After my accident, hospital bills were overwhelming. The emergency fund helped me focus on recovery, not money."
  },
  {
    name: "Amit Patel",
    emergency: "Family Crisis",
    comment: "During our family emergency, LaxmiOne's 24/7 support team was incredibly understanding and helpful."
  }
];