"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award, Target, Users, TrendingUp, Shield, Heart,
  CheckCircle, Globe, Briefcase, Clock, Star, Building
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const stats = [
  { label: "Years of Excellence", value: "Since 2024", icon: Clock },
  { label: "Licensed by RBI", value: "NBFC", icon: Shield },
  { label: "Pan India Presence", value: "28 States", icon: Globe },
  { label: "Customer Satisfaction", value: "98%", icon: Star },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make starts and ends with our customers' best interests at heart."
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Complete transparency in our dealings with no hidden charges or surprise fees."
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Leveraging cutting-edge AI technology to make lending faster and fairer."
  },
  {
    icon: Users,
    title: "Inclusivity",
    description: "Making credit accessible to every Indian, regardless of their background."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering the highest standards of service in everything we do."
  },
  {
    icon: Globe,
    title: "Social Impact",
    description: "Empowering communities and contributing to India's economic growth."
  }
];

const milestones = [
  {
    year: "2024",
    title: "Foundation",
    description: "Laxmi was founded with a vision to revolutionize lending in India"
  },
  {
    year: "2024",
    title: "RBI License",
    description: "Received NBFC license from Reserve Bank of India"
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Launched India's first fully AI-powered lending platform"
  },
  {
    year: "2024",
    title: "Pan India Launch",
    description: "Expanded operations across 28 states and 8 union territories"
  }
];

const leadership = [
  {
    name: "Rajesh Kumar",
    role: "Chief Executive Officer",
    bio: "Former RBI official with 20+ years in financial services",
    expertise: ["Strategic Planning", "Regulatory Compliance", "Digital Transformation"]
  },
  {
    name: "Priya Sharma",
    role: "Chief Technology Officer",
    bio: "AI expert from IIT Delhi, previously at Google",
    expertise: ["Artificial Intelligence", "Machine Learning", "System Architecture"]
  },
  {
    name: "Amit Patel",
    role: "Chief Risk Officer",
    bio: "Risk management specialist with experience at major banks",
    expertise: ["Risk Management", "Credit Analysis", "Portfolio Management"]
  },
  {
    name: "Sneha Reddy",
    role: "Chief Operating Officer",
    bio: "Operations expert with background in fintech scaling",
    expertise: ["Operations", "Process Optimization", "Customer Experience"]
  }
];

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--emerald-green)] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sora mb-6">
              About Laxmi
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Transforming Lives Through Responsible Lending
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              We are India's most trusted AI-powered NBFC, committed to making credit accessible,
              affordable, and transparent for every Indian. Our mission is to empower dreams and
              enable financial inclusion through technology and trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold font-sora text-blue-400 text-center mb-12">Our Story</h2>

            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Laxmi was born from a simple observation: millions of Indians need quick,
                small-ticket loans for emergencies, opportunities, and dreams, but traditional
                banking systems weren't designed to serve them efficiently.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Founded in 2024 by a team of fintech veterans and AI experts, we set out to
                build a lending platform that could make credit decisions in seconds, not days.
                By leveraging artificial intelligence and alternative data, we've created a system
                that's not just faster, but fairer and more inclusive.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Today, we're proud to be RBI-licensed NBFC serving customers across India.
                Our AI-powered platform processes applications in 30 seconds, making us the
                fastest lending platform in the country. But speed is just the beginning -
                we're building a financial ecosystem that truly understands and serves the
                needs of modern India.
              </p>

              <div className="bg-blue-900 text-white p-8 rounded-2xl mt-8">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-lg">
                  To be India's most trusted financial partner, making credit accessible to
                  every Indian through technology, transparency, and trust.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl mt-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[var(--emerald-green)] flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Provide instant, affordable credit to millions of Indians
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[var(--emerald-green)] flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Use AI to make lending decisions fair and unbiased
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[var(--emerald-green)] flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Maintain complete transparency in our operations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[var(--emerald-green)] flex-shrink-0 mt-1" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Contribute to India's financial inclusion goals
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Milestones in our mission to transform lending
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  <div className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg ${
                    index % 2 === 0 ? "text-right" : "text-left"
                  }`}>
                    <span className="text-[var(--emerald-green)] font-bold text-lg">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-[var(--emerald-green)] rounded-full flex-shrink-0" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-sora mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experienced professionals driving our vision
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 " />
                </div>
                <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                <p className="text-[var(--emerald-green)] font-medium mb-3">{leader.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{leader.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {leader.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-sora mb-4">
              Join Us in Our Mission
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of India's financial inclusion revolution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/apply"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-300 text-[var(--royal-blue)] rounded-full font-semibold text-lg hover:shadow-xl transition-all"
              >
                Apply for Loan
              </motion.a>
              <motion.a
                href="/careers"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-gray hover:text-[var(--royal-blue)] transition-all"
              >
                Join Our Team
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}