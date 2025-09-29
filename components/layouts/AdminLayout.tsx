"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CreditCard, FileText, Settings,
  Bell, Search, LogOut, Menu, X, Shield, BarChart3,
  Wallet, AlertTriangle, Target, Award, Briefcase,
  MessageSquare, Download, RefreshCw, HelpCircle,
  ChevronDown, User, Building, TrendingUp, Package,
  Eye, UserCheck, Sparkles, Activity, Database
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigationItems = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: "/admin",
      color: "text-blue-400"
    },
    {
      title: "Loan Management",
      icon: CreditCard,
      color: "text-emerald-400",
      children: [
        { title: "All Loans", href: "/admin/loans", icon: Package },
        { title: "Pending Approvals", href: "/admin/loans/pending", icon: Eye },
        { title: "Loan Products", href: "/admin/loans/products", icon: Briefcase },
        { title: "Interest Rates", href: "/admin/loans/rates", icon: TrendingUp }
      ]
    },
    {
      title: "User Management",
      icon: Users,
      color: "text-purple-400",
      children: [
        { title: "All Users", href: "/admin/users", icon: Users },
        { title: "KYC Verification", href: "/admin/users/kyc", icon: UserCheck },
        { title: "User Analytics", href: "/admin/users/analytics", icon: BarChart3 }
      ]
    },
    {
      title: "Collections",
      icon: Wallet,
      color: "text-yellow-400",
      children: [
        { title: "Overdue Loans", href: "/admin/collections", icon: AlertTriangle },
        { title: "Collection Agents", href: "/admin/collections/agents", icon: UserCheck },
        { title: "Recovery Reports", href: "/admin/collections/reports", icon: FileText }
      ]
    },
    {
      title: "Risk & Compliance",
      icon: Shield,
      color: "text-red-400",
      children: [
        { title: "Risk Dashboard", href: "/admin/risk", icon: Target },
        { title: "Fraud Detection", href: "/admin/risk/fraud", icon: Shield },
        { title: "Compliance Reports", href: "/admin/risk/compliance", icon: FileText }
      ]
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-indigo-400"
    },
    {
      title: "Reports",
      icon: FileText,
      color: "text-pink-400",
      children: [
        { title: "Financial Reports", href: "/admin/reports/financial", icon: TrendingUp },
        { title: "Operational Reports", href: "/admin/reports/operational", icon: Activity },
        { title: "Regulatory Reports", href: "/admin/reports/regulatory", icon: Shield }
      ]
    },
    {
      title: "Support",
      icon: MessageSquare,
      href: "/admin/support",
      color: "text-orange-400"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      color: "text-gray-400"
    }
  ];

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
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
                  <h1 className="text-lg font-bold gradient-text">Admin Panel</h1>
                  <p className="text-xs text-slate-500">LaxmiOne NBFC</p>
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleExpanded(item.title)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      expandedItems.includes(item.title) ? 'bg-slate-800' : 'hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    {sidebarOpen && (
                      <>
                        <span className="text-slate-200 font-medium flex-1 text-left">
                          {item.title}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedItems.includes(item.title) ? 'rotate-180' : ''
                        }`} />
                      </>
                    )}
                  </motion.button>
                  <AnimatePresence>
                    {expandedItems.includes(item.title) && sidebarOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-8 mt-2 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <motion.button
                            key={child.title}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => router.push(child.href)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                              pathname === child.href ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <child.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{child.title}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push(item.href!)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    pathname === item.href ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-slate-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-blue-400' : item.color}`} />
                  {sidebarOpen && (
                    <span className={`text-slate-200 font-medium ${
                      pathname === item.href ? 'text-blue-400' : ''
                    }`}>
                      {item.title}
                    </span>
                  )}
                </motion.button>
              )}
            </div>
          ))}
        </nav>

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
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Refresh */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-slate-300" />
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-200">Admin User</p>
                    <p className="text-xs text-slate-500">Administrator</p>
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
                        <p className="font-medium text-slate-200">Admin User</p>
                        <p className="text-sm text-slate-400">admin@laxmione.com</p>
                      </div>
                      <div className="py-2">
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
                          <User className="w-4 h-4" />
                          Profile Settings
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
                          <Settings className="w-4 h-4" />
                          Preferences
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
                          <HelpCircle className="w-4 h-4" />
                          Help & Support
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

export default AdminLayout;