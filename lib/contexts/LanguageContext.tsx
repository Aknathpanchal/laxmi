"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import mr from '@/locales/mr.json';
import gu from '@/locales/gu.json';
import pa from '@/locales/pa.json';
import bn from '@/locales/bn.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import kn from '@/locales/kn.json';
import ml from '@/locales/ml.json';
import or from '@/locales/or.json';
import as from '@/locales/as.json';
import ur from '@/locales/ur.json';

type TranslationData = typeof en;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationData;
  availableLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
}

const translations: Record<string, TranslationData> = {
  en,
  hi,
  mr,
  gu,
  pa,
  bn,
  ta,
  te,
  kn,
  ml,
  or,
  as,
  ur,
};

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [t, setT] = useState<TranslationData>(en);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguageState(savedLanguage);
    setT(translations[savedLanguage] || en);
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setT(translations[lang] || en);
    localStorage.setItem('language', lang);

    // Update document language attribute for SEO and accessibility
    document.documentElement.lang = lang;

    // Update text direction for RTL languages like Urdu
    if (lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}