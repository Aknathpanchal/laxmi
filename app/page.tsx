"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Zap, Shield, Clock, Smartphone, Brain, Award, TrendingUp,
  Star, Users, CheckCircle, Play, ChevronDown, Globe, Briefcase, Heart,
  PiggyBank, Calculator, FileCheck, IndianRupee, Sparkles, Trophy,
  BadgeCheck, Rocket, Target, Phone, Mail, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { LoanCalculator } from "@/components/loan-calculator";
import { HeroSection } from "@/components/hero-section";
import { FeatureCards } from "@/components/feature-cards";
import { LoadingScreen } from "@/components/loading-screen";
import Image from "next/image";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.3]);

  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen" ref={containerRef}>
        {/* Enhanced Hero Section with Parallax */}
        <motion.div
          className="relative w-full overflow-hidden"
          style={{ opacity }}
        >
          {/* Animated Background - Reduced opacity for better visibility */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/3 via-[#34d399]/3 to-[#fbbf24]/3" />
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 50%)",
                y
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 80% 50%, rgba(52, 211, 153, 0.05) 0%, transparent 50%)",
                y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
              }}
            />
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full opacity-20 blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#34d399] to-[#fbbf24] rounded-full opacity-20 blur-3xl"
          />

          <div className="w-full">
            <HeroSection />
          </div>
        </motion.div>

        {/* Trust Badges Section */}
        <section className="py-16 bg-slate-900 border-b border-slate-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full mb-3">
                    <badge.icon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-1">{badge.value}</h3>
                  <p className="text-sm text-slate-500">{badge.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="py-20 gradient-dark">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-sm font-semibold mb-4">
                Why Choose Laxmi
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                <span className="gradient-primary bg-clip-text text-transparent">
                  Revolutionary Features
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Experience the future of digital lending with our cutting-edge technology and customer-first approach
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative card-dark overflow-hidden"
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-slate-800 rounded-2xl p-6 m-[1px]">
                    <div className="w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Loan Products Showcase */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold mb-4">
                Our Products
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                Loans for Every <span className="gradient-prosperity bg-clip-text text-transparent">Need</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Tailored financial solutions designed to meet your unique requirements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loanProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={product.link}>
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                      <div className="relative">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <product.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-slate-500 text-sm mb-4">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-violet-600 dark:text-violet-400 font-medium">
                            {product.rate}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Loan Calculator Section */}
        <section className="py-20 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-4 py-2 glass rounded-full text-sm font-semibold mb-4">
                  <Sparkles className="inline w-4 h-4 mr-1 text-yellow-500" />
                  Smart Calculator
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-6">
                  Calculate Your
                  <span className="block gradient-primary bg-clip-text text-transparent">
                    Dream Loan
                  </span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Get instant EMI calculations, see your eligibility, and understand the total cost - all in real-time
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-300">No hidden charges or surprises</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-300">Flexible tenure options up to 60 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-300">Lowest interest rates guaranteed</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <LoanCalculator />
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works - Visual Steps */}
        <section className="py-20 bg-slate-950 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                Get Your Loan in <span className="gradient-prosperity bg-clip-text text-transparent">3 Steps</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                From application to money in your account - experience the fastest loan process
              </p>
            </motion.div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-purple-600 -translate-y-1/2 hidden lg:block" />
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="card-dark p-8 relative z-10">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                        <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="text-center pt-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <step.icon className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-slate-400 mb-2">{step.description}</p>
                        <span className="text-sm text-violet-600 dark:text-violet-400 font-medium">{step.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 gradient-dark">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold mb-4">
                Customer Stories
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                Trusted by <span className="gradient-primary bg-clip-text text-transparent">Thousands</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Real stories from real customers who transformed their lives with Laxmi
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-dark p-6 hover-glow"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-400 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.designation}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <span className="text-xs text-slate-500">Loan Amount: {testimonial.loanAmount}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-950">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
                FAQs
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                Got <span className="gradient-primary bg-clip-text text-transparent">Questions?</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Everything you need to know about our services
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-2xl overflow-hidden shadow-soft"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
                  >
                    <span className="font-semibold text-slate-100">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                        activeFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeFaq === index ? 'auto' : 0,
                      opacity: activeFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-slate-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 gradient-indigo text-white relative overflow-hidden shadow-xl-dark">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <Rocket className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h2 className="text-4xl lg:text-5xl font-bold font-sora mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 50,000+ happy customers who've already taken the smart step towards financial freedom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-slate-800 text-blue-500 rounded-full font-semibold text-lg shadow-xl-dark hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Apply for Instant Loan
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Talk to Expert
                </motion.button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>RBI Licensed</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>Award Winning</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Comparison Table */}
        <FeatureCards />
      </div>
    </>
  );
}

// Data
const trustBadges = [
  { icon: Users, value: "50,000+", title: "Happy Customers" },
  { icon: IndianRupee, value: "₹500 Cr+", title: "Loans Disbursed" },
  { icon: Clock, value: "30 Sec", title: "Approval Time" },
  { icon: Star, value: "4.8/5", title: "Customer Rating" }
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "30-second approval with AI-powered instant decisioning"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Bank-grade 256-bit encryption protects your data"
  },
  {
    icon: Brain,
    title: "AI Credit Score",
    description: "Smart algorithms analyze 500+ data points"
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Apply anytime, no branch visits needed"
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Complete process on your phone in minutes"
  },
  {
    icon: Award,
    title: "RBI Licensed",
    description: "Fully compliant NBFC with transparent practices"
  },
  {
    icon: TrendingUp,
    title: "Flexible EMIs",
    description: "Choose tenure that suits your budget"
  },
  {
    icon: Rocket,
    title: "Instant Money",
    description: "Direct credit to your bank account"
  }
];

const loanProducts = [
  {
    name: "Personal Loan",
    description: "For all your personal needs",
    rate: "10.5% p.a. onwards",
    icon: Heart,
    link: "/products/personal-loan"
  },
  {
    name: "Business Loan",
    description: "Grow your business faster",
    rate: "12% p.a. onwards",
    icon: Briefcase,
    link: "/products/business-loan"
  },
  {
    name: "Emergency Loan",
    description: "Instant cash for urgencies",
    rate: "15% p.a. onwards",
    icon: Zap,
    link: "/products/emergency"
  },
  {
    name: "Education Loan",
    description: "Invest in your future",
    rate: "9% p.a. onwards",
    icon: Globe,
    link: "/products/education-loan"
  }
];

const steps = [
  {
    title: "Quick Apply",
    description: "Fill a simple form with basic details in under 2 minutes",
    time: "2 minutes",
    icon: FileCheck
  },
  {
    title: "Instant Approval",
    description: "Our AI analyzes your profile and gives instant decision",
    time: "30 seconds",
    icon: Brain
  },
  {
    title: "Get Money",
    description: "Approved amount credited directly to your bank",
    time: "5 minutes",
    icon: PiggyBank
  }
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    designation: "Software Engineer, Bangalore",
    content: "Got my personal loan approved in just 30 seconds! The process was incredibly smooth and the customer support was excellent.",
    loanAmount: "₹2,50,000"
  },
  {
    name: "Priya Sharma",
    designation: "Small Business Owner, Delhi",
    content: "Laxmi helped me expand my business when banks rejected my application. Best decision I ever made!",
    loanAmount: "₹5,00,000"
  },
  {
    name: "Amit Patel",
    designation: "Doctor, Mumbai",
    content: "Emergency medical loan saved my father's life. The quick disbursal and hassle-free process was a blessing.",
    loanAmount: "₹10,00,000"
  }
];

const faqs = [
  {
    question: "How quickly can I get the loan amount?",
    answer: "Once approved, the loan amount is credited to your bank account within 5 minutes. Our AI-powered system ensures instant approval decisions in just 30 seconds."
  },
  {
    question: "What documents do I need to apply?",
    answer: "Just your Aadhaar, PAN card, and bank statements. For salaried individuals, we also need salary slips. Everything can be uploaded digitally."
  },
  {
    question: "What is the minimum salary required?",
    answer: "You need a minimum monthly salary of ₹15,000 to be eligible for our personal loans. Different products have different eligibility criteria."
  },
  {
    question: "Can I prepay my loan without charges?",
    answer: "Yes! We don't charge any prepayment penalties. You can close your loan anytime without any extra charges."
  },
  {
    question: "Is my data safe with Laxmi?",
    answer: "Absolutely! We use bank-grade 256-bit encryption and are ISO certified for data security. Your information is completely safe with us."
  }
];