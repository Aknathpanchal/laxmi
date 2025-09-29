"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Activity, CheckCircle, Clock, Shield, TrendingUp,
  ArrowRight, Calculator, FileText, Users, Zap,
  Phone, ChevronRight, Star, Award, Heart,
  Stethoscope, Ambulance, Hospital, Cross
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function MedicalEmergencyPage() {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenure, setTenure] = useState(6);
  const emi = Math.round((loanAmount * 1.0 / 100 * tenure + loanAmount) / tenure);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 text-white py-20">
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
              <span>Medical Emergency</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-sora">
              Medical Emergency Loan
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Instant medical funding when every second counts - From ₹10,000 to ₹10,00,000
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <span>24-Hour Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Cross className="w-5 h-5" />
                <span>Direct Hospital Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Lowest Medical Rates</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
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

      {/* Medical Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Why Choose Medical Emergency Loan?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Fast, reliable funding for all your medical needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {medicalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Partners */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Partner Hospitals</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Direct cashless treatment at leading hospitals across India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {hospitalPartners.map((hospital, index) => (
              <motion.div
                key={hospital.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <Hospital className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">{hospital.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{hospital.location}</p>
                <p className="text-xs text-teal-600 mt-2">{hospital.specialties}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Medical Expenses Covered</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive coverage for all types of medical treatments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {medicalCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <ul className="space-y-1">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-teal-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
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
              <h2 className="text-3xl font-bold mb-6 text-center">Medical Loan Calculator</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>₹10,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tenure: {tenure} months
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>3 months</span>
                    <span>36 months</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm opacity-80">Monthly EMI</p>
                      <p className="text-2xl font-bold">₹{emi.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Interest Rate</p>
                      <p className="text-2xl font-bold">1.0%</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Total Payable</p>
                      <p className="text-2xl font-bold">₹{(emi * tenure).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <Link href="/apply" className="block">
                  <button className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                    Apply for Medical Loan
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get medical funding in 4 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {medicalSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
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
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Patient Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              How we helped families during medical emergencies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {medicalTestimonials.map((testimonial, index) => (
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
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.treatment}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 font-sora">Need Medical Funding?</h2>
            <p className="text-xl mb-8 opacity-90">
              Don't delay treatment - Get instant medical loan approval in 24 hours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <button className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                  Apply for Medical Loan
                </button>
              </Link>
              <a href="tel:+918888881111">
                <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all flex items-center gap-2 mx-auto sm:mx-0">
                  <Phone className="w-5 h-5" />
                  Emergency Helpline
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const medicalFeatures = [
  {
    icon: Activity,
    title: "24-Hour Approval",
    description: "Emergency medical loans approved within 24 hours, even on weekends"
  },
  {
    icon: Cross,
    title: "Direct Hospital Payment",
    description: "We pay directly to hospitals for cashless treatment experience"
  },
  {
    icon: Shield,
    title: "Lowest Medical Rates",
    description: "Special interest rates starting at 1% per month for medical emergencies"
  },
  {
    icon: Ambulance,
    title: "Emergency Support",
    description: "24/7 customer support for medical emergency loan applications"
  },
  {
    icon: Heart,
    title: "No Collateral",
    description: "Unsecured loans with minimal documentation during emergencies"
  },
  {
    icon: Stethoscope,
    title: "All Treatments",
    description: "Coverage for all medical treatments, surgeries, and procedures"
  }
];

const hospitalPartners = [
  { name: "Apollo Hospitals", location: "Pan India", specialties: "Multi-specialty" },
  { name: "Fortis Healthcare", location: "Major Cities", specialties: "Surgery & ICU" },
  { name: "Max Healthcare", location: "North India", specialties: "Cardiac & Neuro" },
  { name: "Manipal Hospitals", location: "South India", specialties: "Oncology & Organ Transplant" },
  { name: "Columbia Asia", location: "Bangalore & Pune", specialties: "Emergency & Critical Care" },
  { name: "AIIMS", location: "Delhi & Branches", specialties: "Government Partner" },
  { name: "Narayana Health", location: "Bangalore & Kolkata", specialties: "Affordable Healthcare" },
  { name: "Medanta", location: "Gurgaon", specialties: "Super Specialty" }
];

const medicalCategories = [
  {
    title: "Emergency Surgeries",
    icon: Activity,
    items: ["Heart Surgery", "Brain Surgery", "Cancer Treatment", "Organ Transplant", "Accident Treatment"]
  },
  {
    title: "Planned Procedures",
    icon: Stethoscope,
    items: ["Knee Replacement", "Cataract Surgery", "Dental Implants", "Cosmetic Surgery", "Fertility Treatment"]
  },
  {
    title: "Critical Care",
    icon: Heart,
    items: ["ICU Treatment", "Ventilator Support", "Dialysis", "Chemotherapy", "Radiation Therapy"]
  },
  {
    title: "Diagnostics",
    icon: Cross,
    items: ["MRI & CT Scans", "PET Scans", "Biopsy", "Blood Tests", "Health Checkups"]
  },
  {
    title: "Maternity Care",
    icon: Users,
    items: ["Normal Delivery", "C-Section", "NICU Care", "Prenatal Care", "Postnatal Care"]
  },
  {
    title: "Alternative Medicine",
    icon: Hospital,
    items: ["Ayurvedic Treatment", "Homeopathy", "Physiotherapy", "Rehabilitation", "Mental Health"]
  }
];

const medicalSteps = [
  {
    title: "Emergency Application",
    description: "Fill our emergency medical loan form with patient details and treatment requirements."
  },
  {
    title: "Medical Verification",
    description: "Our medical team verifies the treatment necessity with your doctor within 2 hours."
  },
  {
    title: "Instant Approval",
    description: "Get loan approval within 24 hours with special medical emergency rates."
  },
  {
    title: "Direct Payment",
    description: "We transfer funds directly to the hospital or your account for immediate treatment."
  }
];

const medicalTestimonials = [
  {
    name: "Rajesh Kumar",
    treatment: "Heart Surgery",
    comment: "LaxmiOne saved my father's life. Got ₹8 lakhs approved in 6 hours for emergency heart surgery."
  },
  {
    name: "Meera Sharma",
    treatment: "Cancer Treatment",
    comment: "The direct payment to the hospital made my mother's cancer treatment completely cashless."
  },
  {
    name: "Vijay Patel",
    treatment: "Accident Emergency",
    comment: "During my son's accident, they processed the loan at 2 AM. Truly 24/7 emergency support."
  }
];