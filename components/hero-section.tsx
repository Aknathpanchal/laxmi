"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Globe, ChevronDown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function HeroSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "",
    email: "",
  });

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#e8f4fd] to-[#ecfdf5]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/5 via-transparent to-[#34d399]/5" />

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full opacity-40"
            animate={{
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>


      <div className="relative z-10 w-full flex items-center min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-center lg:text-left px-4 lg:px-0"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-[#38bdf8]/20 to-[#34d399]/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 text-[#0ea5e9] border border-[#38bdf8]/30"
            >
              {t.hero.badge}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-sora leading-tight bg-gradient-to-r from-[#0ea5e9] to-[#10b981] bg-clip-text text-transparent">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t.hero.title}
              </motion.span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              {t.hero.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-gray-700">{t.hero.features.instant}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-gray-700">{t.hero.features.paperless}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[#38bdf8] to-[#34d399] rounded-full flex items-center justify-center text-white font-bold">✓</div>
                <span className="text-gray-700">{t.hero.features.secure}</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Application Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl relative border border-white/50"
          >
            {/* Language Selector */}
            <div className="absolute top-8 right-8">
              <LanguageSwitcher />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pr-32">
              {t.hero.cta.primary}
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.application.fields.fullName}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder={t.application.placeholders.fullName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.application.fields.mobile}
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder={t.application.placeholders.mobile}
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.application.fields.loanAmount}
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder={t.application.placeholders.amount}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.application.fields.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder={t.application.placeholders.email}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#38bdf8] to-[#34d399] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {t.hero.cta.primary}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                By clicking submit, you agree to our {t.navigation.terms} and {t.navigation.privacy}
              </p>
            </form>
          </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
}