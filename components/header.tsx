"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Phone, Mail, MapPin, User,
  Home, CreditCard, Info, FileText, Users, Briefcase,
  Shield, HelpCircle, LogIn, ArrowRight, Sparkles,
  Calculator, TrendingUp, Award
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigation = [
    {
      name: t.navigation.products,
      href: "/products",
      icon: CreditCard,
      submenu: [
        { name: t.products.types.salary.name, href: "/products/salary-advance", description: t.products.types.salary.description },
        { name: t.products.types.personal.name, href: "/products/personal-loan", description: t.products.types.personal.description },
        { name: t.products.types.emergency.name, href: "/products/emergency", description: t.products.types.emergency.description },
        { name: t.products.types.festival.name, href: "/products/festival", description: t.products.types.festival.description },
        { name: t.products.types.medical.name, href: "/products/medical", description: t.products.types.medical.description },
        { name: t.products.types.travel.name, href: "/products/travel", description: t.products.types.travel.description },
      ]
    },
{
  name: t.navigation.about,
  href: "/about",
  icon: Info,
  submenu: [
    { name: "Our Story", href: "/about#story", description: "Journey of innovation" },
    { name: "Leadership Team", href: "/about#leadership", description: "Meet our leaders" },
    { name: "Mission & Vision", href: "/about#mission", description: "Our purpose" },
    { name: "Timeline", href: "/about#timeline", description: "Road of our Journey" },
    { name: "Values", href: "/about#values", description: "Social responsibility" },
  ]
}
,
    {
      name: t.navigation.resources,
      href: "/resources",
      icon: FileText,
      submenu: [
        { name: t.navigation.emiCalculator, href: "/resources/emi-calculator", description: "Calculate your EMI" },
        { name: "Eligibility Check", href: "/resources/eligibility", description: "Check loan eligibility" },
        { name: "Document Guide", href: "/resources/documents", description: "Required documents" },
        { name: "Interest Rates", href: "/resources/rates", description: "Current rates" },
        { name: t.navigation.blog, href: "/resources/blog", description: "Financial insights" },
        { name: t.navigation.faqs, href: "/resources/faqs", description: "Common questions" },
      ]
    },
    {
      name: t.navigation.partners,
      href: "/partners",
      icon: Users,
      submenu: [
        { name: "Channel Partners", href: "/partners/channel", description: "Join our network" },
        { name: "Corporate Tie-ups", href: "/partners/corporate", description: "Business partnerships" },
        { name: "API Integration", href: "/partners/api", description: "Developer resources" },
        { name: "Investor Relations", href: "/partners/investors", description: "For investors" },
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass shadow-xl-dark"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar */}
      <div className={`border-b border-slate-700 transition-opacity duration-300 ${
        isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6 text-slate-400">
              <a href={`tel:${t.footer.contact.phone}`} className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                <Phone className="w-3 h-3" />
                <span>{t.footer.contact.phone}</span>
              </a>
              <a href={`mailto:${t.footer.contact.email}`} className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                <Mail className="w-3 h-3" />
                <span>{t.footer.contact.email}</span>
              </a>
              <span className="hidden md:flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{t.footer.contact.address}</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/track-application" className="hover:text-emerald-500 transition-colors">
                {t.navigation.track}
              </Link>
              <Link href="/login" className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                <User className="w-3 h-3" />
                {t.navigation.login}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <span className="text-2xl font-bold font-sora gradient-text">
                {t.common.appName}
              </span>
              <p className="text-xs text-slate-500">{t.common.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-blue-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              {t.navigation.home}
            </Link>

            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-blue-400 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.submenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-72 glass rounded-2xl shadow-xl-dark overflow-hidden"
                    >
                      <div className="p-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block px-4 py-3 rounded-lg hover:bg-slate-800/50 group transition-all"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-slate-100 group-hover:text-blue-400">
                                  {subitem.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {subitem.description}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link
              href="/contact"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-blue-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {t.navigation.contact}
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-slate-200 hover:text-emerald-500 font-semibold transition-colors"
            >
              {t.navigation.login}
            </Link>
            <Link href="/apply">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
              >
                {t.common.apply}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/95 border-t border-slate-700"
          >
            <div className="container mx-auto px-4 py-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                {t.navigation.home}
              </Link>
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-8">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-500 hover:text-emerald-500 transition-colors"
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t.navigation.contact}
              </Link>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center text-slate-200 font-semibold hover:text-blue-400 transition-colors"
                >
                  {t.navigation.login}
                </Link>
                <Link
                  href="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full mt-2 btn-primary">
                    {t.common.apply}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}