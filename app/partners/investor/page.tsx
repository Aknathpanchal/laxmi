'use client';

import { motion } from "framer-motion";
import {
  TrendingUp, Shield, PieChart, FileText, Calendar,
  Award, Target, Users, Briefcase, CheckCircle,
  Download, ExternalLink, Phone, Mail, ArrowRight,
  BarChart3, DollarSign, Lock
} from "lucide-react";
import Link from "next/link";

export default function InvestorRelationsPage() {
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
              Investor Relations
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Invest in India's financial inclusion story. 
              Join us in building a more prosperous future with attractive returns.
            </p>
            <button className="px-8 py-4 bg-white text-[var(--gold)] rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
              Explore Investment Opportunities
            </button>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Investment Highlights</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Why Laxmi is a compelling investment opportunity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-[var(--emerald-green)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[var(--emerald-green)]" />
              </div>
              <h3 className="text-3xl font-bold mb-2">150% YoY</h3>
              <p className="text-gray-600 dark:text-gray-300">Portfolio Growth</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-[var(--royal-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[var(--royal-blue)]" />
              </div>
              <h3 className="text-3xl font-bold mb-2">2M+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Customers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h3 className="text-3xl font-bold mb-2">₹5000 Cr</h3>
              <p className="text-gray-600 dark:text-gray-300">AUM</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold mb-2">98.5%</h3>
              <p className="text-gray-600 dark:text-gray-300">Collection Efficiency</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Investment Products</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Diversified investment options to match your risk appetite
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Lock className="w-12 h-12 text-[var(--emerald-green)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Secured NCDs</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-[var(--emerald-green)] mb-2">10-12%</p>
                <p className="text-gray-600 dark:text-gray-300">Annual Returns</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Rated by CRISIL",
                  "Asset-backed security",
                  "Quarterly interest",
                  "3-5 year tenure",
                  "Tax benefits u/s 80C"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--emerald-green)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-[var(--emerald-green)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                Learn More
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-[var(--gold)]"
            >
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-12 h-12 text-[var(--gold)]" />
                <span className="bg-[var(--gold)]/10 text-[var(--gold)] px-3 py-1 rounded-full text-sm font-semibold">
                  Recommended
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Fixed Deposits</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-[var(--gold)] mb-2">9-11%</p>
                <p className="text-gray-600 dark:text-gray-300">Annual Returns</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "RBI regulated",
                  "Flexible tenure",
                  "Monthly/Quarterly payout",
                  "Premature withdrawal",
                  "Senior citizen benefits"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 gradient-gold text-white rounded-lg font-semibold hover:opacity-90 transition">
                Invest Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <Briefcase className="w-12 h-12 text-[var(--royal-blue)] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Equity Investment</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-[var(--royal-blue)] mb-2">Custom</p>
                <p className="text-gray-600 dark:text-gray-300">Growth Returns</p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Institutional rounds",
                  "Long-term growth",
                  "Voting rights",
                  "Board representation",
                  "Exit opportunities"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--royal-blue)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-[var(--royal-blue)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                Contact IR Team
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Financial Performance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Financial Performance</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Strong fundamentals and consistent growth trajectory
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[var(--emerald-green)] to-green-600 rounded-xl p-6 text-white"
              >
                <Target className="w-10 h-10 mb-3" />
                <h4 className="text-lg font-semibold mb-2">CRAR</h4>
                <p className="text-3xl font-bold">22.5%</p>
                <p className="text-sm opacity-90 mt-2">Well above regulatory minimum</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[var(--royal-blue)] to-blue-600 rounded-xl p-6 text-white"
              >
                <PieChart className="w-10 h-10 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Net NPA</h4>
                <p className="text-3xl font-bold">1.2%</p>
                <p className="text-sm opacity-90 mt-2">Industry-leading asset quality</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[var(--gold)] to-amber-600 rounded-xl p-6 text-white"
              >
                <TrendingUp className="w-10 h-10 mb-3" />
                <h4 className="text-lg font-semibold mb-2">ROE</h4>
                <p className="text-3xl font-bold">18%</p>
                <p className="text-sm opacity-90 mt-2">Strong profitability metrics</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6">Key Achievements</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Award,
                    title: "Best NBFC - MSME Lending",
                    subtitle: "Financial Express Awards 2024"
                  },
                  {
                    icon: Shield,
                    title: "A+ Credit Rating",
                    subtitle: "CRISIL & ICRA"
                  },
                  {
                    icon: Users,
                    title: "Top 10 NBFC",
                    subtitle: "By customer satisfaction"
                  },
                  {
                    icon: TrendingUp,
                    title: "Zero Fraud Cases",
                    subtitle: "Robust risk management"
                  }
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-[var(--emerald-green)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <achievement.icon className="w-6 h-6 text-[var(--emerald-green)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reports & Documents */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Reports & Disclosures</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Access our financial reports and regulatory filings
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  title: "Annual Report 2024",
                  date: "March 31, 2024",
                  size: "4.2 MB"
                },
                {
                  title: "Q4 FY24 Results",
                  date: "January 15, 2024",
                  size: "1.8 MB"
                },
                {
                  title: "Investor Presentation Q3 FY24",
                  date: "October 20, 2023",
                  size: "3.5 MB"
                },
                {
                  title: "Corporate Governance Report",
                  date: "September 30, 2023",
                  size: "2.1 MB"
                }
              ].map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex items-center justify-between hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-10 h-10 text-[var(--royal-blue)]" />
                    <div>
                      <h4 className="font-semibold mb-1">{doc.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {doc.date} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                    <Download className="w-5 h-5 text-[var(--emerald-green)]" />
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--royal-blue)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition">
                View All Reports
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 font-sora">Investor Events</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay updated with our upcoming investor meetings and conferences
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  title: "Q1 FY25 Earnings Call",
                  date: "15 October 2024",
                  time: "4:00 PM IST",
                  type: "Virtual"
                },
                {
                  title: "Annual General Meeting",
                  date: "28 September 2024",
                  time: "11:00 AM IST",
                  type: "Hybrid"
                },
                {
                  title: "Investor Meet - Mumbai",
                  date: "10 September 2024",
                  time: "2:00 PM IST",
                  type: "In-person"
                }
              ].map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-[var(--gold)]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          <p>📅 {event.date}</p>
                          <p>🕐 {event.time}</p>
                          <p>📍 {event.type}</p>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[var(--gold)] text-white rounded-lg font-semibold hover:bg-opacity-90 transition text-sm">
                      Register
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact IR Team */}
      <section className="py-16 bg-gradient-to-br from-[var(--emerald-green)] via-teal-600 to-[var(--emerald-green)] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 font-sora">Get In Touch With IR Team</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Have questions about investing? Our investor relations team is here to help.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--emerald-green)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--emerald-green)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Investor Helpline</h4>
                    <p className="text-gray-600 dark:text-gray-300">+91 88888 82222</p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--royal-blue)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--royal-blue)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-gray-600 dark:text-gray-300">investors@laxmione.com</p>
                    <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-4">IR Team</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rajesh Kumar</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Head - Investor Relations</p>
                    </div>
                    <button className="text-[var(--royal-blue)] hover:underline text-sm font-semibold">
                      Connect →
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Priya Sharma</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Senior Manager - IR</p>
                    </div>
                    <button className="text-[var(--royal-blue)] hover:underline text-sm font-semibold">
                      Connect →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400"
          >
            <p>
              <strong>Disclaimer:</strong> All investment products are subject to market risks. 
              Past performance is not indicative of future results. Please read all scheme-related 
              documents carefully before investing. The information provided is for general purposes 
              only and does not constitute financial advice.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}