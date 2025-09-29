"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, CreditCard, FileText, Settings, Bell,
  LogOut, Menu, User, Wallet, Calculator, HelpCircle,
  ChevronDown, Award, Gift, Receipt, Phone, Mail,
  Target, Activity, History, Download, Star,
  Sparkles, Plus, Send, Shield, UserCheck, Eye
} from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-400"
    },
    {
      title: "My Loans",
      icon: CreditCard,
      href: "/dashboard/loans",
      color: "text-emerald-400"
    },
    {
      title: "Apply for Loan",
      icon: Plus,
      href: "/apply",
      color: "text-purple-400"
    },
    {
      title: "Payments",
      icon: Wallet,
      href: "/dashboard/payments",
      color: "text-yellow-400"
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/dashboard/documents",
      color: "text-indigo-400"
    },
    {
      title: "Credit Score",
      icon: Award,
      href: "/dashboard/credit-score",
      color: "text-pink-400"
    },
    {
      title: "Rewards",
      icon: Gift,
      href: "/dashboard/rewards",
      color: "text-orange-400"
    },
    {
      title: "Transaction History",
      icon: History,
      href: "/dashboard/transactions",
      color: "text-cyan-400"
    },
    {
      title: "EMI Calculator",
      icon: Calculator,
      href: "/resources/emi-calculator",
      color: "text-lime-400"
    },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/dashboard/support",
      color: "text-red-400"
    },
    {
      title: "Profile Settings",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-gray-400"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Mock user data
  const userData = {
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    customerId: "LX2024001234",
    tier: "Gold",
    creditScore: 750,
    availableCredit: 325000,
    rewardPoints: 2450,
    notifications: 3
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="glass border-r border-slate-700 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <motion.div
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold gradient-text">LaxmiOne</h1>
                  <p className="text-xs text-slate-500">Customer Portal</p>
                </div>
              )}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </motion.button>
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-b border-slate-700"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-slate-200">{userData.name}</p>
                <p className="text-xs text-slate-500">{userData.tier} Member</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Credit Score</p>
                <p className="font-bold text-emerald-400">{userData.creditScore}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <p className="text-slate-500">Rewards</p>
                <p className="font-bold text-yellow-400">{userData.rewardPoints}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <motion.button
              key={item.title}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                pathname === item.href
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-slate-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                pathname === item.href ? 'text-blue-400' : item.color
              }`} />
              {sidebarOpen && (
                <span className={`text-slate-200 font-medium ${
                  pathname === item.href ? 'text-blue-400' : ''
                }`}>
                  {item.title}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Quick Actions */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push('/apply')}
                className="w-full flex items-center gap-3 p-3 gradient-primary text-white rounded-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Apply Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push('/dashboard/payments')}
                className="w-full flex items-center gap-3 p-3 bg-emerald-500 text-white rounded-lg font-semibold"
              >
                <Send className="w-5 h-5" />
                Pay EMI
              </motion.button>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="glass border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-slate-100">
                {navigationItems.find(item => item.href === pathname)?.title || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Score: {userData.creditScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">₹{(userData.availableCredit / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300">{userData.rewardPoints} pts</span>
                </div>
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                {userData.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {userData.notifications}
                  </span>
                )}
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-slate-200">{userData.name.split(' ')[0]}</p>
                    <p className="text-xs text-slate-500">ID: {userData.customerId}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-64 glass rounded-xl shadow-xl border border-slate-700 p-2"
                    >
                      <div className="p-3 border-b border-slate-700">
                        <p className="font-medium text-slate-200">{userData.name}</p>
                        <p className="text-sm text-slate-400">{userData.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            {userData.tier} Member
                          </div>
                          <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            <UserCheck className="w-3 h-3 inline mr-1" />
                            Verified
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => router.push('/profile')}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </button>
                        <button
                          onClick={() => router.push('/dashboard/settings')}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button
                          onClick={() => router.push('/dashboard/support')}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Help & Support
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
                          <Download className="w-4 h-4" />
                          Download App
                        </button>
                      </div>
                      <div className="pt-2 border-t border-slate-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;