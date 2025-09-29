'use client';

import { motion } from "framer-motion";
import {
  Users, Building, TrendingUp, Shield, Award, Target,
  Handshake, ChevronRight, MapPin, Phone, Mail
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function PartnersPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--emerald-green)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-sora">
              Partner With Laxmi
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join India's fastest growing NBFC network. Together, we can revolutionize
              financial inclusion and prosperity for millions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Partnership Opportunities</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Multiple ways to collaborate and grow together
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* DSA Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Users className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">DSA Partners</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Become a Direct Selling Agent and earn attractive commissions on every loan.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--emerald-green)]" />
                  <span>High commission rates</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--emerald-green)]" />
                  <span>Real-time tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--emerald-green)]" />
                  <span>Training & support</span>
                </li>
              </ul>
              <Link href="/partners/dsa">
                <button className="w-full py-3 bg-[var(--emerald-green)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                  Become a DSA Partner
                </button>
              </Link>
            </motion.div>

            {/* Corporate Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Building className="w-12 h-12 text-[var(--royal-blue)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Corporate Partners</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Offer employee loans and financial wellness programs for your workforce.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--royal-blue)]" />
                  <span>Employee benefits</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--royal-blue)]" />
                  <span>Salary advance loans</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--royal-blue)]" />
                  <span>Custom programs</span>
                </li>
              </ul>
              <Link href="/partners/corporate">
                <button className="w-full py-3 bg-[var(--royal-blue)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                  Corporate Partnership
                </button>
              </Link>
            </motion.div>

            {/* Investor Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <TrendingUp className="w-12 h-12 text-[var(--gold)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Investors</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Invest in India's financial inclusion story with attractive returns.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
                  <span>Secured investments</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
                  <span>Regular returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
                  <span>Transparent reporting</span>
                </li>
              </ul>
              <Link href="/partners/investors">
                <button className="w-full py-3 gradient-gold text-white rounded-lg font-semibold hover:opacity-90 transition">
                  Explore Investment
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Why Partner With Us?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Benefits that make Laxmi the preferred partner
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[var(--emerald-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[var(--emerald-green)]" />
              </div>
              <h4 className="font-semibold mb-2">RBI Licensed</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Fully compliant and regulated NBFC
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[var(--royal-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[var(--royal-blue)]" />
              </div>
              <h4 className="font-semibold mb-2">Industry Leading</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Best commission rates in the market
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h4 className="font-semibold mb-2">Technology First</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-powered platform for faster processing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Dedicated partner support team
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-8 font-sora">Get In Touch</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-[var(--emerald-green)] mb-2" />
                <h4 className="font-semibold mb-1">Call Us</h4>
                <p className="text-gray-600 dark:text-gray-300">+91 88888 82222</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-[var(--royal-blue)] mb-2" />
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-gray-600 dark:text-gray-300">partners@laxmione.com</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 text-[var(--gold)] mb-2" />
                <h4 className="font-semibold mb-1">Visit Us</h4>
                <p className="text-gray-600 dark:text-gray-300">Mumbai | Delhi | Bangalore</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}