"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Home,
  ArrowRight,
  Chrome,
  Facebook,
  Smartphone,
  Award,
  KeyRound
} from "lucide-react";
import Link from "next/link";
import { useAuth, type UserRole } from "@/contexts/AuthContext";

interface LoginForm {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
  selectedRole?: UserRole;
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginForm>({
    emailOrPhone: "",
    password: "",
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const success = await login(
        formData.emailOrPhone,
        formData.password,
        formData.selectedRole
      );

      if (!success) {
        setError('Invalid email/phone or password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const securityFeatures = [
    { icon: Shield, text: "256-bit SSL Encryption" },
    { icon: CheckCircle, text: "RBI Compliant Security" },
    { icon: Award, text: "ISO 27001 Certified" },
    { icon: KeyRound, text: "Multi-Factor Authentication" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#ecfdf5]">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-700 mb-8"
        >
          <Link href="/" className="hover:text-[#0ea5e9] transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-[#0ea5e9] font-medium">Login</span>
        </motion.nav>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding & Security */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
                  <span className="bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">Welcome Back</span>
                </h1>
                <p className="text-xl text-gray-700">
                  Access your Laxmi account and continue your financial journey
                </p>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Security is Our Priority</h3>
                <div className="grid grid-cols-2 gap-4">
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <feature.icon className="w-5 h-5 text-[#34d399]" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-gradient-to-r from-[#38bdf8] to-[#34d399] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-4">Trusted by 50,000+ Users</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-sm opacity-90">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">30s</p>
                    <p className="text-sm opacity-90">Avg Login</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-sm opacity-90">Support</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              {/* Tab Switcher */}
              <div className="flex mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-center font-semibold rounded-l-lg transition-colors ${
                    activeTab === 'login'
                      ? 'bg-[#0ea5e9] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 text-center font-semibold rounded-r-lg transition-colors ${
                    activeTab === 'register'
                      ? 'bg-[#0ea5e9] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Register
                </button>
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Login As</label>
                    <select
                      name="selectedRole"
                      value={formData.selectedRole || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, selectedRole: e.target.value as UserRole }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                    >
                      <option value="">Select Role</option>
                      <option value="USER">Customer</option>
                      <option value="UNDERWRITER">Sales Agent/Underwriter</option>
                      <option value="FINANCE_MANAGER">Finance Manager</option>
                      <option value="COLLECTION_AGENT">Collection Agent</option>
                      <option value="SUPPORT_AGENT">Support Agent</option>
                      <option value="RISK_ANALYST">Risk Analyst</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="SUPER_ADMIN">Super Administrator</option>
                    </select>
                  </div>

                  {/* Login Method Toggle */}
                  <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        loginMethod === 'email'
                          ? 'bg-white text-[#0ea5e9] shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        loginMethod === 'phone'
                          ? 'bg-white text-[#0ea5e9] shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </button>
                  </div>

                  {/* Email/Phone Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      {loginMethod === 'email' ? (
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      ) : (
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      )}
                      <input
                        type={loginMethod === 'email' ? 'email' : 'tel'}
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder={loginMethod === 'email' ? 'Enter your email' : '+91 98765 43210'}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34d399] focus:border-[#34d399] bg-white"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-[#34d399] focus:ring-[#34d399]"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[#0ea5e9] hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-700">{error}</span>
                    </motion.div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#38bdf8] to-[#34d399] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <User className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Chrome className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Registration Form */
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#fbbf24] to-[#38bdf8] rounded-full mb-6 shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">New to Laxmi?</h3>
                  <p className="text-gray-700 mb-6">
                    Join thousands who have already transformed their financial journey with instant AI-powered loans.
                  </p>
                  <Link href="/apply">
                    <button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#38bdf8] text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all mb-4">
                      Start Your Application
                    </button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-[#0ea5e9] hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Secure Login</p>
                    <p className="text-blue-700">
                      Your login is protected by bank-grade encryption and multi-factor authentication.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
              <Smartphone className="w-12 h-12 text-[#0ea5e9] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Mobile App</h3>
              <p className="text-sm text-gray-700">
                Download our mobile app for quick access to your account on the go.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
              <Shield className="w-12 h-12 text-[#34d399] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">Secure & Safe</h3>
              <p className="text-sm text-gray-700">
                Your data is protected with industry-leading security measures.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm text-center border border-gray-100">
              <Award className="w-12 h-12 text-[#fbbf24] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2 text-gray-900">RBI Licensed</h3>
              <p className="text-sm text-gray-700">
                We're a fully regulated NBFC licensed by the Reserve Bank of India.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}