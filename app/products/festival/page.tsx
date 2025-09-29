"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Sparkles, CheckCircle, Clock, Shield, TrendingUp,
  ArrowRight, Calculator, FileText, Users, Zap,
  Phone, ChevronRight, Star, Award, Gift,
  Calendar, PartyPopper, Heart
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function FestivalAdvancePage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenure, setTenure] = useState(6);
  const emi = Math.round((loanAmount * 1.2 / 100 * tenure + loanAmount) / tenure);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white py-20">
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
              <span>Festival Advance</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-sora">
              Festival Advance
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Celebrate every festival with joy - Get instant funds from ₹5,000 to ₹2,00,000
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Instant Festival Cash</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span>Special Festival Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Flexible Repayment</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  Apply Now
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

      {/* Festival Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Why Choose Festival Advance?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Make every celebration memorable without financial worries
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {festivalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Types */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Festivals We Support</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get advance for all major festivals across religions and cultures
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {festivals.map((festival, index) => (
              <motion.div
                key={festival.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-3">{festival.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{festival.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{festival.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Festival Loan Calculator</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹5,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tenure: {tenure} months
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>2 months</span>
                    <span>12 months</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm opacity-80">Monthly EMI</p>
                      <p className="text-2xl font-bold">₹{emi.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Interest Rate</p>
                      <p className="text-2xl font-bold">1.2%</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Total Payable</p>
                      <p className="text-2xl font-bold">₹{(emi * tenure).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <Link href="/apply" className="block">
                  <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                    Apply for Festival Advance
                  </button>
                </Link>
              </div>
            </motion.div>
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
            <h2 className="text-4xl font-bold font-sora mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get your festival advance in 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {festivalSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
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
            <h2 className="text-4xl font-bold font-sora mb-4">Festival Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              How our customers celebrated with LaxmiOne
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {festivalTestimonials.map((testimonial, index) => (
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
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.festival}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 font-sora">Ready to Celebrate?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get your festival advance now and make this celebration unforgettable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <button className="px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply for Festival Advance
                </button>
              </Link>
              <a href="tel:+918888881111">
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

const festivalFeatures = [
  {
    icon: Zap,
    title: "Instant Approval",
    description: "Get approved in 30 seconds and receive money before the festival rush"
  },
  {
    icon: Gift,
    title: "Special Festival Rates",
    description: "Enjoy reduced interest rates during festival seasons"
  },
  {
    icon: Calendar,
    title: "Flexible Repayment",
    description: "Start repayment after festivals with comfortable EMI options"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Bank-grade security for all your financial transactions"
  },
  {
    icon: Sparkles,
    title: "No Hidden Charges",
    description: "Transparent pricing with no surprise fees or charges"
  },
  {
    icon: Heart,
    title: "Quick Disbursal",
    description: "Money transferred within 10 minutes of approval"
  }
];

const festivals = [
  { name: "Diwali", icon: "🪔", period: "Oct-Nov" },
  { name: "Holi", icon: "🎨", period: "Mar-Apr" },
  { name: "Eid", icon: "🌙", period: "Varies" },
  { name: "Christmas", icon: "🎄", period: "December" },
  { name: "Dussehra", icon: "🏹", period: "Sep-Oct" },
  { name: "Ganesh Chaturthi", icon: "🐘", period: "Aug-Sep" },
  { name: "Navratri", icon: "💃", period: "Sep-Oct" },
  { name: "Karva Chauth", icon: "🌙", period: "October" }
];

const festivalSteps = [
  {
    title: "Apply for Festival Advance",
    description: "Fill our quick application form mentioning the festival and amount needed. Takes less than 3 minutes."
  },
  {
    title: "Instant Approval",
    description: "Get approved instantly with our AI-powered assessment. Special festival rates applied automatically."
  },
  {
    title: "Celebrate & Repay",
    description: "Receive money immediately and enjoy your festival. Start repayment after the celebration period."
  }
];

const festivalTestimonials = [
  {
    name: "Sneha Reddy",
    festival: "Diwali 2023",
    comment: "Got ₹75,000 in 5 minutes for Diwali shopping and home decoration. The festival rates were amazing!"
  },
  {
    name: "Arjun Singh",
    festival: "Holi 2024",
    comment: "Perfect timing for my daughter's wedding during Holi season. Flexible repayment helped a lot."
  },
  {
    name: "Fatima Khan",
    festival: "Eid 2024",
    comment: "Bought gifts for entire family and hosted a grand Eid celebration. Best festival advance service!"
  }
];