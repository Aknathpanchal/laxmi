"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Star,
  Home,
  ArrowRight,
  Filter,
  Bookmark,
  Clock,
  Shield,
  CreditCard,
  FileText,
  Users,
  Settings,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPopular: boolean;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
  color: string;
}

export default function FAQsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const categories: Category[] = [
    { id: "all", name: "All Questions", icon: HelpCircle, count: 24, color: "text-gray-600" },
    { id: "general", name: "General", icon: Users, count: 6, color: "text-blue-600" },
    { id: "eligibility", name: "Eligibility", icon: CheckCircle, count: 5, color: "text-green-600" },
    { id: "documents", name: "Documents", icon: FileText, count: 4, color: "text-purple-600" },
    { id: "repayment", name: "Repayment", icon: CreditCard, count: 4, color: "text-orange-600" },
    { id: "security", name: "Security", icon: Shield, count: 3, color: "text-red-600" },
    { id: "account", name: "Account", icon: Settings, count: 2, color: "text-indigo-600" }
  ];

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How quickly can I get a loan approved?",
      answer: "With our AI-powered system, loan approval takes just 30 seconds! Once approved, the money is disbursed to your bank account within 30 minutes during banking hours. Our advanced algorithms analyze over 500 data points to provide instant decisions without manual intervention.",
      category: "general",
      isPopular: true,
      tags: ["approval", "speed", "ai"]
    },
    {
      id: "2",
      question: "What is the minimum and maximum loan amount?",
      answer: "You can apply for loans ranging from ₹10,000 to ₹5,00,000. The exact amount you're eligible for depends on your income, credit profile, and our AI assessment. Higher loan amounts may require additional verification.",
      category: "general",
      isPopular: true,
      tags: ["amount", "limits", "eligibility"]
    },
    {
      id: "3",
      question: "What are the eligibility criteria for a loan?",
      answer: "To be eligible, you must be: (1) An Indian citizen aged 21-58 years, (2) Have a minimum monthly income of ₹15,000, (3) Be employed (salaried or self-employed), (4) Have a valid bank account, (5) Provide necessary KYC documents. Our AI system will assess your eligibility instantly.",
      category: "eligibility",
      isPopular: true,
      tags: ["criteria", "requirements", "age", "income"]
    },
    {
      id: "4",
      question: "What documents do I need to apply?",
      answer: "Required documents include: (1) PAN Card, (2) Aadhaar Card, (3) Latest salary slips (last 3 months) or ITR, (4) Bank statements (last 3 months), (5) Employment proof. All documents can be uploaded digitally through our secure platform.",
      category: "documents",
      isPopular: true,
      tags: ["documents", "kyc", "upload"]
    },
    {
      id: "5",
      question: "What are the interest rates and charges?",
      answer: "Our interest rates start from 8.99% per annum and go up to 24% based on your credit profile. We have no hidden charges - only a processing fee of 2% of the loan amount (minimum ₹1,000). All charges are clearly disclosed before approval.",
      category: "general",
      isPopular: true,
      tags: ["interest", "rates", "charges", "fees"]
    },
    {
      id: "6",
      question: "How do I repay my loan?",
      answer: "Repayment is automatic through ECS/NACH from your registered bank account. You can also make manual payments through our app, website, or UPI. We offer flexible EMI options from 6 to 60 months. You can also prepay your loan anytime without penalty.",
      category: "repayment",
      isPopular: false,
      tags: ["repayment", "emi", "automatic", "prepayment"]
    },
    {
      id: "7",
      question: "Is my personal and financial data safe?",
      answer: "Absolutely! We use bank-grade 256-bit SSL encryption and are RBI licensed. Your data is stored in secure servers with multi-factor authentication. We're ISO 27001 certified for information security and never share your data with unauthorized parties.",
      category: "security",
      isPopular: true,
      tags: ["security", "encryption", "data", "privacy"]
    },
    {
      id: "8",
      question: "Can I apply if I have a low credit score?",
      answer: "Yes! Our AI considers 500+ data points beyond just credit scores. Even with a low CIBIL score, you may be eligible based on income stability, banking behavior, and other factors. We specialize in providing loans to underserved segments.",
      category: "eligibility",
      isPopular: false,
      tags: ["credit score", "cibil", "low score", "ai assessment"]
    },
    {
      id: "9",
      question: "What happens if I miss an EMI payment?",
      answer: "If you miss an EMI, you'll be charged a late fee of ₹500. We'll send reminders via SMS, email, and app notifications. If payment is delayed by more than 7 days, it may impact your credit score. Contact our support team immediately if you're facing payment difficulties.",
      category: "repayment",
      isPopular: false,
      tags: ["missed payment", "late fee", "credit impact"]
    },
    {
      id: "10",
      question: "Can I get a loan if I'm self-employed?",
      answer: "Yes, self-employed individuals can apply. You'll need to provide ITR for the last 2 years, bank statements for 6 months, business proof, and GST registration (if applicable). Our AI evaluates business income patterns and cash flows for assessment.",
      category: "eligibility",
      isPopular: false,
      tags: ["self-employed", "business", "itr", "gst"]
    },
    {
      id: "11",
      question: "How can I check my loan application status?",
      answer: "You can track your application status real-time through: (1) Our mobile app, (2) Website portal, (3) SMS updates, (4) Email notifications. Use your Application ID and registered mobile number/email to check status anytime.",
      category: "general",
      isPopular: false,
      tags: ["status", "tracking", "application"]
    },
    {
      id: "12",
      question: "Can I increase my loan amount after approval?",
      answer: "Once your current loan is active for at least 6 months with good repayment history, you can apply for a top-up loan. The additional amount will be processed as a fresh application with our standard approval process.",
      category: "general",
      isPopular: false,
      tags: ["increase", "top-up", "additional loan"]
    }
  ];

  const popularFAQs = faqs.filter(faq => faq.isPopular);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesPopular = !showPopularOnly || faq.isPopular;

    return matchesSearch && matchesCategory && matchesPopular;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

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
          <span className="text-[var(--royal-blue)] font-medium">FAQs</span>
        </motion.nav>
      </div>

      {/* Header Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">Frequently Asked Questions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find instant answers to common questions about our loan services
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lucky">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                placeholder="Search for questions, keywords, or topics..."
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>

              <button
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  showPopularOnly
                    ? 'bg-[var(--gold)] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Star className="w-3 h-3 mr-1" />
                Popular Only
              </button>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="flex overflow-x-auto pb-2 mb-8">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-[var(--royal-blue)] text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${selectedCategory === category.id ? 'text-white' : category.color}`} />
                    {category.name}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Popular Questions Section */}
        {!searchTerm && selectedCategory === "all" && !showPopularOnly && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-r from-[var(--gold)] to-[var(--rose-gold)] rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Star className="w-6 h-6 mr-2" />
                Most Popular Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {popularFAQs.slice(0, 4).map((faq, index) => (
                  <motion.button
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => {
                      setExpandedFAQ(faq.id);
                      document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-left p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <p className="font-medium">{faq.question}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  id={`faq-${faq.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[var(--royal-blue)] rounded-2xl"
                  >
                    <div className="flex items-start flex-1">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 pr-4">{faq.question}</h3>
                        <div className="flex items-center space-x-2">
                          {faq.isPopular && (
                            <span className="inline-flex items-center px-2 py-1 bg-[var(--gold)] text-white text-xs rounded-full">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </span>
                          )}
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            {categories.find(cat => cat.id === faq.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {faq.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No FAQs Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setShowPopularOnly(false);
                  }}
                  className="text-[var(--royal-blue)] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-6 opacity-90">
              Our support team is here to help you 24/7
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/contact">
                <button className="w-full bg-white text-[var(--royal-blue)] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Contact Us
                </button>
              </Link>
              <a href="tel:1800-123-4567">
                <button className="w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-[var(--royal-blue)] transition-all">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Call Support
                </button>
              </a>
              <a href="mailto:support@laxmione.com">
                <button className="w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-[var(--royal-blue)] transition-all">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Us
                </button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Help Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/resources/emi-calculator">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">EMI Calculator</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Calculate your monthly EMI and plan your repayments
                </p>
              </div>
            </Link>

            <Link href="/track-application">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Track Application</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Check the real-time status of your loan application
                </p>
              </div>
            </Link>

            <Link href="/apply">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Bookmark className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Apply Now</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Start your loan application and get instant approval
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}