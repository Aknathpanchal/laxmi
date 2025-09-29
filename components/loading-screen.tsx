"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Globe, ChevronRight, Shield, Clock,
  HeartHandshake, TrendingUp, Building, CreditCard,
  Banknote, Key, DoorOpen
} from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "or", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "অসমীয়া", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
];

export function LoadingScreen() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);

  const loadingStages = [
    'Preparing your gateway...',
    'Setting up security...',
    'Almost ready...',
    'Opening doors to prosperity...'
  ];

  useEffect(() => {
    // Check if language was already selected
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setSelectedLanguage(savedLang);
      setShowLanguageSelector(false);
      startLoading();
    }
  }, []);

  const startLoading = () => {
    // Animate progress
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            setDoorOpen(true);
            setTimeout(() => setIsLoading(false), 1500);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Change loading stages
    const stageTimer = setInterval(() => {
      setLoadingStage((prev) => {
        if (prev >= 3) {
          clearInterval(stageTimer);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
    setShowLanguageSelector(false);
    startLoading();
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gradient-to-br from-[#38bdf8] via-[#34d399] to-[#38bdf8] overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }} />
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0">
            {[CreditCard, Banknote, Shield, TrendingUp, Building, HeartHandshake].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <Icon size={40} />
              </motion.div>
            ))}
          </div>

          {showLanguageSelector ? (
            /* Language Selection Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full relative z-10 px-4"
            >
              {/* Logo */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4 text-center font-sora"
              >
                Laxmi
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/90 mb-12 text-center"
              >
                Select Your Preferred Language
              </motion.p>

              {/* Language Grid */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl"
              >
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="bg-white/20 backdrop-blur-md rounded-xl p-4 hover:bg-white/30 transition-all shadow-lg"
                  >
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <div className="text-white font-semibold">{lang.name}</div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* Loading Animation Screen */
            <div className="flex flex-col items-center justify-center h-full relative z-10 px-4">
              {/* Gateway Door Animation */}
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-48 h-64 relative"
                  animate={doorOpen ? { rotateY: 90 } : {}}
                  transition={{ duration: 1 }}
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  {/* Door Frame */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] rounded-t-full shadow-lg">
                    <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-white/10 rounded-t-full backdrop-blur-sm">
                      {/* Door Handle */}
                      <motion.div
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        animate={doorOpen ? { opacity: 0 } : { opacity: 1 }}
                      >
                        <Key className="w-8 h-8 text-white" />
                      </motion.div>

                      {/* Door Icon */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={doorOpen ? { opacity: 0 } : { opacity: 1 }}
                      >
                        <DoorOpen className="w-24 h-24 text-white/80" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Light beam when door opens */}
                  <AnimatePresence>
                    {doorOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 10 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-radial from-white/50 to-transparent rounded-full"
                        style={{ transformOrigin: "center" }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Welcome Text */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
              >
                Welcome to Laxmi
              </motion.h2>

              {/* Tagline */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/80 mb-8 text-center"
              >
                Your Gateway to Prosperity
              </motion.p>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "320px" }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-white to-[#fbbf24]"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-white/80">{progress}%</span>
                  <span className="text-sm text-white/80">{loadingStages[loadingStage]}</span>
                </div>
              </motion.div>

              {/* Feature Icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-4 gap-6 mt-8"
              >
                {[
                  { icon: Shield, label: '100% Secure' },
                  { icon: Clock, label: 'Instant Approval' },
                  { icon: HeartHandshake, label: '24/7 Support' },
                  { icon: TrendingUp, label: 'Transparent' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-white/80">{item.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}