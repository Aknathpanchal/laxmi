"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  Home,
  ArrowRight,
  Clock,
  User,
  TrendingUp,
  Search,
  Calendar,
  ChevronRight,
  Sparkles,
  Target,
  Lightbulb,
  Newspaper
} from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All", icon: BookOpen, color: "bg-gray-500" },
    { id: "financial-tips", name: "Financial Tips", icon: Lightbulb, color: "bg-yellow-500" },
    { id: "credit-score", name: "Credit Score", icon: TrendingUp, color: "bg-blue-500" },
    { id: "loan-guides", name: "Loan Guides", icon: Target, color: "bg-green-500" },
    { id: "news", name: "News", icon: Newspaper, color: "bg-purple-500" }
  ];

  const blogPosts = [
    {
      id: "1",
      title: "10 Smart Ways to Improve Your Credit Score in 2025",
      excerpt: "Discover proven strategies to boost your CIBIL score and qualify for better loan terms. Learn from financial experts about the most effective methods.",
      author: "Priya Sharma",
      date: "Sep 15, 2025",
      readTime: "5 min",
      category: "credit-score",
      gradient: "from-blue-500 to-purple-600",
      featured: true
    },
    {
      id: "2",
      title: "Understanding Personal Loan Interest Rates",
      excerpt: "Everything you need to know about how lenders calculate interest rates and how you can get the best deal on your next loan.",
      author: "Rajesh Kumar",
      date: "Sep 10, 2025",
      readTime: "7 min",
      category: "loan-guides",
      gradient: "from-emerald-500 to-teal-600",
      featured: true
    },
    {
      id: "3",
      title: "How AI is Revolutionizing Lending",
      excerpt: "Explore how artificial intelligence is making loans more accessible, faster approvals, and better risk assessment for borrowers.",
      author: "Dr. Anita Desai",
      date: "Sep 5, 2025",
      readTime: "6 min",
      category: "news",
      gradient: "from-pink-500 to-rose-600",
      featured: true
    },
    {
      id: "4",
      title: "5 Common Loan Mistakes to Avoid",
      excerpt: "Learn about the most frequent errors applicants make and how to ensure your loan application is successful.",
      author: "Vikram Patel",
      date: "Aug 28, 2025",
      readTime: "4 min",
      category: "loan-guides",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: "5",
      title: "Building an Emergency Fund",
      excerpt: "Why you need an emergency fund, how much to save, and the best ways to build one quickly for financial security.",
      author: "Meera Reddy",
      date: "Aug 20, 2025",
      readTime: "8 min",
      category: "financial-tips",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      id: "6",
      title: "Debt Consolidation Guide",
      excerpt: "Understand the pros and cons of consolidating multiple debts and when it makes financial sense for you.",
      author: "Arjun Singh",
      date: "Aug 15, 2025",
      readTime: "6 min",
      category: "financial-tips",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      id: "7",
      title: "Credit Card vs Personal Loan",
      excerpt: "A detailed comparison to help you choose the right borrowing option based on your financial situation.",
      author: "Sneha Kapoor",
      date: "Aug 10, 2025",
      readTime: "5 min",
      category: "loan-guides",
      gradient: "from-fuchsia-500 to-pink-600"
    },
    {
      id: "8",
      title: "Build Credit from Scratch",
      excerpt: "Step-by-step guide for beginners with no credit history to establish a strong credit profile.",
      author: "Ravi Mehta",
      date: "Aug 5, 2025",
      readTime: "7 min",
      category: "credit-score",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: "9",
      title: "Understanding EMI Calculations",
      excerpt: "Learn how EMIs are calculated and discover strategies to manage your monthly payments effectively.",
      author: "Deepak Gupta",
      date: "Jul 30, 2025",
      readTime: "5 min",
      category: "financial-tips",
      gradient: "from-teal-500 to-emerald-600"
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
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
          <span className="text-[var(--royal-blue)] font-medium">Blog</span>
        </motion.nav>
      </div>

      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold font-sora mb-6">
            Financial <span className="text-[var(--emerald-green)]">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Expert advice and guides to help you make smarter financial decisions
          </p>
        </motion.div>

        {/* Search and Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-lg focus:ring-4 focus:ring-[var(--royal-blue)]/20 focus:border-[var(--royal-blue)] transition-all shadow-lg"
              placeholder="Search articles..."
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Articles */}
        {selectedCategory === "all" && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center">
                <Sparkles className="w-8 h-8 mr-3 text-[var(--gold)]" />
                Featured Articles
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
                >
                  <div className={`h-56 bg-gradient-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                    <Sparkles className="w-16 h-16 text-white/40 absolute top-4 right-4" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-[var(--royal-blue)] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <button className="text-[var(--royal-blue)] font-semibold flex items-center group-hover:gap-2 transition-all">
                        Read
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Articles Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8">
            {selectedCategory === "all" ? "Latest Articles" : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className={`h-48 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--royal-blue)] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <button className="text-[var(--royal-blue)] font-semibold text-sm">
                      Read
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No Articles Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or browse different categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="px-6 py-3 bg-[var(--royal-blue)] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-[var(--royal-blue)] via-[var(--emerald-green)] to-[var(--royal-blue)] rounded-3xl p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Get weekly financial insights, tips, and exclusive content delivered to your inbox
            </p>
            <div className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
                />
                <button className="px-8 py-4 bg-white text-[var(--royal-blue)] rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-lg">
                  Subscribe
                </button>
              </div>
              <p className="text-sm mt-4 opacity-75">Join 10,000+ subscribers • Unsubscribe anytime</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          <Link href="/resources/emi-calculator">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">EMI Calculator</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculate your monthly payments and plan your loan
              </p>
            </div>
          </Link>

          <Link href="/resources/interest-rates">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Interest Rates</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Check current rates starting from 8.99% per annum
              </p>
            </div>
          </Link>

          <Link href="/apply">
            <div className="bg-gradient-to-br from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Apply for Loan</h3>
              <p className="text-white/90 text-sm">
                Get instant approval in 30 seconds with AI
              </p>
            </div>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}