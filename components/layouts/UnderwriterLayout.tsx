'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FileText, Brain, Users, CreditCard, Shield, AlertTriangle,
  BarChart3, Settings, Bell, User, LogOut, Menu, X,
  Home, Calculator, Target, Award, TrendingUp, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

interface UnderwriterLayoutProps {
  children: React.ReactNode;
}

export default function UnderwriterLayout({ children }: UnderwriterLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/underwriter',
      icon: Home,
      description: 'Overview and metrics'
    },
    {
      name: 'Pending Applications',
      href: '/underwriter/applications',
      icon: FileText,
      description: 'Applications awaiting review'
    },
    {
      name: 'Risk Assessment',
      href: '/underwriter/risk',
      icon: Shield,
      description: 'Risk evaluation tools'
    },
    {
      name: 'Credit Analysis',
      href: '/underwriter/credit',
      icon: BarChart3,
      description: 'Credit scoring and analysis'
    },
    {
      name: 'Decision Engine',
      href: '/underwriter/decisions',
      icon: Brain,
      description: 'AI-powered decision support'
    },
    {
      name: 'Performance',
      href: '/underwriter/performance',
      icon: Target,
      description: 'Performance metrics'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">LaxmiOne</h2>
              <p className="text-xs text-slate-400">Underwriter Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400">
                  {item.description}
                </p>
              </div>
            </motion.a>
          ))}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user?.name || 'Underwriter'}</p>
              <p className="text-xs text-slate-400">Risk Assessment</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Quick stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400">Avg Processing: 2.5h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400">Approval Rate: 78%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-400">Risk Accuracy: 92%</span>
                </div>
              </div>

              {/* Notifications */}
              <NotificationCenter />

              {/* Settings */}
              <button className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}