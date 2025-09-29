"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
  HeadphonesIcon,
  Home,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Shield,
  Award
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "1800-123-4567",
      secondary: "+91-98765-43210",
      description: "Speak to our loan experts",
      available: "24/7 Support"
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "support@laxmione.com",
      secondary: "loans@laxmione.com",
      description: "Get email support",
      available: "Response within 2 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "Mumbai Head Office",
      secondary: "Bangalore Branch",
      description: "Meet us in person",
      available: "Mon-Sat: 9 AM - 6 PM"
    }
  ];

  const offices = [
    {
      city: "Mumbai",
      type: "Head Office",
      address: "Level 15, One World Center, Tower 2A, Jupiter Mill Compound, Senapati Bapat Marg, Lower Parel, Mumbai - 400013",
      phone: "+91-22-4567-8900",
      email: "mumbai@laxmione.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    {
      city: "Bangalore",
      type: "Branch Office",
      address: "4th Floor, Prestige Meridian, No. 29, MG Road, Bangalore - 560001",
      phone: "+91-80-4567-8900",
      email: "bangalore@laxmione.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    },
    {
      city: "Delhi",
      type: "Branch Office",
      address: "8th Floor, DLF Cyber City, Phase III, Gurgaon, Delhi NCR - 122002",
      phone: "+91-124-4567-8900",
      email: "delhi@laxmione.com",
      hours: "Mon-Sat: 9:00 AM - 6:00 PM"
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lucky max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Message Sent Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for contacting us. Our team will get back to you within 2 hours.
          </p>
          <Link href="/">
            <button className="w-full bg-[var(--royal-blue)] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <span className="text-[var(--royal-blue)] font-medium">Contact Us</span>
        </motion.nav>
      </div>

      {/* Header Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-full mb-6">
            <HeadphonesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-sora mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">{t.contact.title}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        {/* Quick Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lucky hover:shadow-xl transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-lg flex items-center justify-center mr-4">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">{info.title}</h3>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[var(--royal-blue)]">{info.primary}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{info.secondary}</p>
                <p className="text-sm text-gray-500">{info.description}</p>
                <div className="inline-flex items-center text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 mr-1" />
                  {info.available}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-[var(--royal-blue)]" />
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  >
                    <option value="">Select a subject</option>
                    <option value="loan-inquiry">Loan Inquiry</option>
                    <option value="application-status">Application Status</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--royal-blue)] focus:border-transparent dark:bg-gray-700"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          {/* Office Locations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-[var(--emerald-green)]" />
                Our Offices
              </h2>

              <div className="space-y-6">
                {offices.map((office, index) => (
                  <motion.div
                    key={office.city}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-l-4 border-[var(--royal-blue)] pl-4 pb-6"
                  >
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-bold">{office.city}</h3>
                      <span className="ml-2 text-xs bg-[var(--gold)] text-white px-2 py-1 rounded-full">
                        {office.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{office.address}</p>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-[var(--royal-blue)]" />
                        {office.phone}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-[var(--emerald-green)]" />
                        {office.email}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-[var(--gold)]" />
                        {office.hours}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lucky">
              <h3 className="text-xl font-bold mb-4">Find Us on Map</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map Coming Soon</p>
                  <button className="mt-2 text-[var(--royal-blue)] hover:underline flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View on Google Maps
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Support Hours & FAQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--emerald-green)] rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <Clock className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">Support Hours</h3>
            </div>
            <div className="space-y-2">
              <p className="flex justify-between"><span>Phone Support:</span> <span className="font-semibold">24/7</span></p>
              <p className="flex justify-between"><span>Email Support:</span> <span className="font-semibold">24/7</span></p>
              <p className="flex justify-between"><span>Office Visits:</span> <span className="font-semibold">9 AM - 6 PM</span></p>
              <p className="flex justify-between"><span>Weekend Support:</span> <span className="font-semibold">10 AM - 4 PM</span></p>
            </div>
            <div className="mt-6 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span className="text-sm opacity-90">SSL Secured Communications</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[var(--gold)] to-[var(--rose-gold)] rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">Quick Help</h3>
            </div>
            <p className="mb-6 opacity-90">
              Need instant answers? Check our comprehensive FAQ section for common questions and solutions.
            </p>
            <Link href="/resources/faqs">
              <button className="w-full bg-white text-[var(--royal-blue)] py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all">
                Browse FAQs
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}