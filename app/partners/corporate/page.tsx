'use client';

import { motion } from "framer-motion";
import {
  Building, Users, Briefcase, Heart, Shield,
  Clock, TrendingUp, CheckCircle, Wallet,
  Target, Phone, Mail, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function CorporatePartnersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--emerald-green)] via-teal-600 to-[var(--emerald-green)] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-sora">
              Corporate Tie-ups
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Empower your employees with financial wellness programs. 
              Offer instant salary advances and loans as a valued benefit.
            </p>
            <button className="px-8 py-4 bg-white text-[var(--royal-blue)] rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
              Partner With Us
            </button>
          </motion.div>
        </div>
      </section>

      {/* Benefits for Companies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Benefits for Your Organization</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enhance employee satisfaction and retention
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Heart className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Employee Satisfaction</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Provide valuable financial benefits that employees truly appreciate
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Users className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Reduced Attrition</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Financial wellness programs help retain top talent
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <TrendingUp className="w-12 h-12 text-[var(--royal-blue)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Increased Productivity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Financially secure employees are more focused and productive
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Shield className="w-12 h-12 text-[var(--gold)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Zero Cost</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No cost to company - completely free employee benefit program
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Clock className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Quick Setup</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easy integration with minimal paperwork and fast onboarding
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <Briefcase className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-xl font-bold mb-3">Enhanced Employer Brand</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stand out as an employer that cares about employee wellbeing
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Employee Financial Products</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive financial solutions for your workforce
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Wallet className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Salary Advance</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Instant access to earned salary before payday
              </p>
              <ul className="space-y-3">
                {[
                  "Up to 50% of monthly salary",
                  "Instant disbursement",
                  "Flexible repayment",
                  "No hidden charges",
                  "Digital process"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--emerald-green)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Briefcase className="w-12 h-12 text-[var(--royal-blue)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Personal Loans</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Exclusive rates for employees of partner companies
              </p>
              <ul className="space-y-3">
                {[
                  "Loans up to ₹10 lakhs",
                  "Preferential interest rates",
                  "Minimal documentation",
                  "Tenure up to 36 months",
                  "Pre-approved limits"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--royal-blue)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Partnership Process</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Simple steps to set up corporate tie-up
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Initial Discussion",
                  description: "Connect with our corporate partnerships team to discuss your requirements"
                },
                {
                  step: "02",
                  title: "Agreement Signing",
                  description: "Review and sign the partnership agreement with flexible terms"
                },
                {
                  step: "03",
                  title: "Employee Onboarding",
                  description: "We conduct awareness sessions and onboard your employees digitally"
                },
                {
                  step: "04",
                  title: "Go Live",
                  description: "Your employees can start accessing financial benefits immediately"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[var(--royal-blue)] to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="hidden lg:block w-6 h-6 text-gray-400 mt-4" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Trusted by Leading Companies</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join 500+ companies offering financial wellness to their employees
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                company: "Tech Solutions Pvt Ltd",
                size: "2,500+ employees",
                quote: "The salary advance program has been a game-changer for our employee satisfaction scores."
              },
              {
                company: "Manufacturing Corp",
                size: "5,000+ employees",
                quote: "Easy implementation and our employees love the instant access to financial support."
              },
              {
                company: "Retail Chain Ltd",
                size: "10,000+ employees",
                quote: "Financial wellness has improved, and we've seen a significant reduction in attrition."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <Target className="w-10 h-10 text-[var(--royal-blue)] mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.company}</p>
                  <p className="text-sm text-gray-500">{testimonial.size}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[var(--emerald-green)] via-teal-600 to-[var(--emerald-green)] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Ready to Transform Employee Benefits?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let's discuss how we can customize a financial wellness program for your organization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-white text-[var(--royal-blue)] rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
                Schedule a Demo
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>+91 88888 82222</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>corporate@laxmione.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}