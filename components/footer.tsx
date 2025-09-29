"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook, Twitter, Linkedin, Instagram, Youtube, Mail,
  Phone, MapPin, Clock, Shield, Award, TrendingUp, Sparkles,
  ArrowRight, ExternalLink, Download, ChevronRight, CreditCard
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/laxmione", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/laxmione", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/laxmione", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/laxmione", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/laxmione", label: "YouTube" },
];

const certifications = [
  { icon: Shield, text: "ISO 27001 Certified" },
  { icon: Award, text: "RBI Licensed NBFC" },
  { icon: TrendingUp, text: "AAA Credit Rating" },
];

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    products: [
      { name: t.footer.products.items.personal, href: "/products/personal-loan" },
      { name: t.footer.products.items.salary, href: "/products/salary-advance" },
      { name: t.footer.products.items.emergency, href: "/products/emergency" },
      { name: t.footer.products.items.medical, href: "/products/medical" },
      { name: "Travel Loan", href: "/products/travel-loan" },
      { name: "Festival Advance", href: "/products/festival" },
    ],
    company: [
      { name: t.footer.quickLinks.items.about, href: "/about" },
      { name: "Our Story", href: "/about/story" },
      { name: "Leadership Team", href: "/about/team" },
      { name: t.footer.quickLinks.items.careers, href: "/careers" },
      { name: "Press & Media", href: "/press" },
      { name: "Awards & Recognition", href: "/about/awards" },
      { name: "CSR Initiatives", href: "/about/csr" },
      { name: "Testimonials", href: "/testimonials" },
    ],
    resources: [
      { name: t.navigation.emiCalculator, href: "/resources/emi-calculator" },
      { name: "Eligibility Check", href: "/resources/eligibility" },
      { name: "Interest Rates", href: "/resources/rates" },
      { name: "Document Checklist", href: "/resources/documents" },
      { name: "How to Apply", href: "/resources/how-to-apply" },
      { name: t.navigation.faqs, href: "/resources/faqs" },
      { name: t.navigation.blog, href: "/blog" },
      { name: "Financial Literacy", href: "/resources/financial-literacy" },
    ],
    support: [
      { name: t.footer.quickLinks.items.contact, href: "/contact" },
      { name: "Customer Support", href: "/support" },
      { name: t.navigation.track, href: "/track-application" },
      { name: "Grievance Redressal", href: "/grievance" },
      { name: "Nodal Officer", href: "/nodal-officer" },
      { name: "Locate Branch", href: "/branches" },
      { name: "Download Forms", href: "/downloads" },
      { name: "Report Fraud", href: "/report-fraud" },
    ],
    legal: [
      { name: t.footer.legal.items.terms, href: "/terms" },
      { name: t.footer.legal.items.privacy, href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Fair Practice Code", href: "/fair-practice" },
      { name: "Interest Rate Policy", href: "/interest-policy" },
      { name: "KYC Policy", href: "/kyc-policy" },
      { name: "RBI Guidelines", href: "/rbi-guidelines" },
      { name: t.footer.legal.items.disclaimer, href: "/disclaimer" },
    ],
  };

  return (
    <footer className="bg-slate-900 pt-20 pb-8 mt-20 border-t border-slate-700">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 -mt-32">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="gradient-ocean rounded-3xl p-8 md:p-12 text-white shadow-xl-dark"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Stay Updated with Laxmi</h3>
              <p className="text-white/90">
                Get exclusive offers, financial tips, and updates on new loan products
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-white/30 border border-slate-700"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-slate-800 text-blue-400 rounded-full font-semibold hover:shadow-glow transition-all border border-slate-700"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">
                  {t.common.appName}
                </span>
                <p className="text-xs text-slate-500">NBFC Excellence</p>
              </div>
            </Link>
            <p className="text-slate-400 mb-6">
              {t.footer.about.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all border border-slate-700"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-[#0ea5e9]" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#34d399]" />
              {t.footer.products.title}
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">{t.footer.quickLinks.title}</h4>
            <ul className="space-y-3">
              {footerLinks.company.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">{t.navigation.resources}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.slice(0, 6).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">{t.footer.contact.title}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${t.footer.contact.phone}`}
                  className="text-slate-400 hover:text-emerald-500 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {t.footer.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t.footer.contact.email}`}
                  className="text-slate-400 hover:text-emerald-500 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t.footer.contact.email}
                </a>
              </li>
              <li className="text-slate-400 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  {t.footer.contact.address}
                </span>
              </li>
              <li className="text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{t.footer.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 bg-slate-800 rounded-full shadow-soft border border-slate-700"
              >
                <cert.icon className="w-5 h-5 text-[#34d399]" />
                <span className="text-slate-400 font-medium">{cert.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-emerald-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-gray-100">
            <p className="text-slate-400 mb-2">
              {t.footer.copyright}
            </p>
            <p className="text-xs text-slate-500">
              CIN: U65929MH2024PTC123456 | NBFC Registration: B.05.12345 | GSTIN: 27AABCL1234N1Z5
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {t.footer.disclaimer}
            </p>
          </div>

          {/* Mobile App Download */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 mb-4">Download our mobile app</p>
            <div className="flex justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#"
                className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 hover:shadow-glow transition-all"
              >
                <Download className="w-4 h-4" />
                App Store
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#"
                className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800 text-slate-100 rounded-lg border border-slate-700 hover:shadow-glow transition-all"
              >
                <Download className="w-4 h-4" />
                Play Store
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}