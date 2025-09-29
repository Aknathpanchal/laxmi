"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const messages = [
  { lang: "English", text: "⚠️ IMPORTANT: Only make loan repayments through our official website laxmione.com or Laxmi mobile app. Never share OTP or passwords." },
  { lang: "हिन्दी", text: "⚠️ महत्वपूर्ण: केवल हमारी आधिकारिक वेबसाइट laxmione.com या Laxmi मोबाइल ऐप के माध्यम से ही लोन का भुगतान करें। कभी भी OTP या पासवर्ड साझा न करें।" },
  { lang: "मराठी", text: "⚠️ महत्त्वाचे: केवळ आमच्या अधिकृत वेबसाइट laxmione.com किंवा Laxmi मोबाइल अॅपद्वारे कर्ज परतफेड करा. कधीही OTP किंवा पासवर्ड शेअर करू नका." },
  { lang: "ગુજરાતી", text: "⚠️ મહત્વપૂર્ણ: માત્ર અમારી સત્તાવાર વેબસાઇટ laxmione.com અથવા Laxmi મોબાઇલ એપ દ્વારા જ લોન ચુકવણી કરો. ક્યારેય OTP અથવા પાસવર્ડ શેર કરશો નહીં." },
  { lang: "বাংলা", text: "⚠️ গুরুত্বপূর্ণ: শুধুমাত্র আমাদের অফিসিয়াল ওয়েবসাইট laxmione.com বা Laxmi মোবাইল অ্যাপের মাধ্যমে ঋণ পরিশোধ করুন। কখনও OTP বা পাসওয়ার্ড শেয়ার করবেন না।" },
  { lang: "தமிழ்", text: "⚠️ முக்கியம்: எங்கள் அதிகாரப்பூர்வ இணையதளம் laxmione.com அல்லது Laxmi மொபைல் ஆப் மூலம் மட்டுமே கடனை திருப்பிச் செலுத்துங்கள். OTP அல்லது கடவுச்சொல்லை பகிர வேண்டாம்." },
  { lang: "తెలుగు", text: "⚠️ ముఖ్యం: మా అధికారిక వెబ్‌సైట్ laxmione.com లేదా Laxmi మొబైల్ యాప్ ద్వారా మాత్రమే లోన్ చెల్లింపులు చేయండి. OTP లేదా పాస్‌వర్డ్‌లను ఎప్పుడూ షేర్ చేయవద్దు." },
];

export function SecurityBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <p className="text-sm font-medium">
              {messages[currentIndex].text}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 hover:bg-white/20 rounded transition"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}