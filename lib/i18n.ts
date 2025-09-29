import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to LaxmiOne",
      loading: "Loading...",
      applyNow: "Apply Now",
      learnMore: "Learn More",
      personalLoan: "Personal Loan",
      businessLoan: "Business Loan",
      goldLoan: "Gold Loan",
      emergencyLoan: "Emergency Loan",
      instantApproval: "Instant Approval",
      lowInterest: "Low Interest Rates",
      minimalDocs: "Minimal Documentation",
      quickDisbursement: "Quick Disbursement",
      secureProcess: "100% Secure Process",
      support247: "24/7 Customer Support",
      emiCalculator: "EMI Calculator",
      checkEligibility: "Check Eligibility",
      trackApplication: "Track Application",
      contactUs: "Contact Us",
      aboutUs: "About Us",
      termsAndConditions: "Terms & Conditions",
      privacyPolicy: "Privacy Policy",
      faq: "FAQs",
      language: "Language"
    }
  },
  hi: {
    translation: {
      welcome: "लक्ष्मीवन में आपका स्वागत है",
      loading: "लोड हो रहा है...",
      applyNow: "अभी आवेदन करें",
      learnMore: "और जानें",
      personalLoan: "व्यक्तिगत ऋण",
      businessLoan: "व्यापार ऋण",
      goldLoan: "स्वर्ण ऋण",
      emergencyLoan: "आपातकालीन ऋण",
      instantApproval: "तुरंत मंजूरी",
      lowInterest: "कम ब्याज दरें",
      minimalDocs: "न्यूनतम दस्तावेज़",
      quickDisbursement: "त्वरित वितरण",
      secureProcess: "100% सुरक्षित प्रक्रिया",
      support247: "24/7 ग्राहक सहायता",
      emiCalculator: "EMI कैलकुलेटर",
      checkEligibility: "पात्रता जांचें",
      trackApplication: "आवेदन ट्रैक करें",
      contactUs: "संपर्क करें",
      aboutUs: "हमारे बारे में",
      termsAndConditions: "नियम और शर्तें",
      privacyPolicy: "गोपनीयता नीति",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      language: "भाषा"
    }
  },
  bn: {
    translation: {
      welcome: "লক্ষ্মীওয়ানে স্বাগতম",
      loading: "লোড হচ্ছে...",
      applyNow: "এখনই আবেদন করুন",
      learnMore: "আরও জানুন",
      personalLoan: "ব্যক্তিগত ঋণ",
      businessLoan: "ব্যবসা ঋণ",
      goldLoan: "স্বর্ণ ঋণ",
      emergencyLoan: "জরুরি ঋণ",
      instantApproval: "তাত্ক্ষণিক অনুমোদন",
      lowInterest: "কম সুদের হার",
      minimalDocs: "ন্যূনতম ডকুমেন্টেশন",
      quickDisbursement: "দ্রুত বিতরণ",
      secureProcess: "100% নিরাপদ প্রক্রিয়া",
      support247: "24/7 গ্রাহক সহায়তা",
      emiCalculator: "EMI ক্যালকুলেটর",
      checkEligibility: "যোগ্যতা পরীক্ষা করুন",
      trackApplication: "আবেদন ট্র্যাক করুন",
      contactUs: "যোগাযোগ করুন",
      aboutUs: "আমাদের সম্পর্কে",
      termsAndConditions: "শর্তাবলী",
      privacyPolicy: "গোপনীয়তা নীতি",
      faq: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
      language: "ভাষা"
    }
  },
  ta: {
    translation: {
      welcome: "லக்ஷ்மிஒன்னுக்கு வரவேற்பு",
      loading: "ஏற்றுகிறது...",
      applyNow: "இப்போது விண்ணப்பிக்கவும்",
      learnMore: "மேலும் அறிக",
      personalLoan: "தனிநபர் கடன்",
      businessLoan: "வணிக கடன்",
      goldLoan: "தங்க கடன்",
      emergencyLoan: "அவசர கடன்",
      instantApproval: "உடனடி ஒப்புதல்",
      lowInterest: "குறைந்த வட்டி விகிதங்கள்",
      minimalDocs: "குறைந்தபட்ச ஆவணங்கள்",
      quickDisbursement: "விரைவான விநியோகம்",
      secureProcess: "100% பாதுகாப்பான செயல்முறை",
      support247: "24/7 வாடிக்கையாளர் ஆதரவு",
      emiCalculator: "EMI கணிப்பான்",
      checkEligibility: "தகுதியை சரிபார்க்கவும்",
      trackApplication: "விண்ணப்பத்தை கண்காணிக்கவும்",
      contactUs: "எங்களை தொடர்பு கொள்ளவும்",
      aboutUs: "எங்களை பற்றி",
      termsAndConditions: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
      privacyPolicy: "தனியுரிமை கொள்கை",
      faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      language: "மொழி"
    }
  },
  te: {
    translation: {
      welcome: "లక్ష్మీవన్ కు స్వాగతం",
      loading: "లోడ్ అవుతోంది...",
      applyNow: "ఇప్పుడు దరఖాస్తు చేయండి",
      learnMore: "మరింత తెలుసుకోండి",
      personalLoan: "వ్యక్తిగత రుణం",
      businessLoan: "వ్యాపార రుణం",
      goldLoan: "బంగారు రుణం",
      emergencyLoan: "అత్యవసర రుణం",
      instantApproval: "తక్షణ అనుమతి",
      lowInterest: "తక్కువ వడ్డీ రేట్లు",
      minimalDocs: "కనీస పత్రాలు",
      quickDisbursement: "త్వరిత పంపిణీ",
      secureProcess: "100% సురక్షిత ప్రక్రియ",
      support247: "24/7 కస్టమర్ మద్దతు",
      emiCalculator: "EMI కాలిక్యులేటర్",
      checkEligibility: "అర్హతను తనిఖీ చేయండి",
      trackApplication: "దరఖాస్తును ట్రాక్ చేయండి",
      contactUs: "మమ్మల్ని సంప్రదించండి",
      aboutUs: "మా గురించి",
      termsAndConditions: "నిబంధనలు మరియు షరతులు",
      privacyPolicy: "గోప్యతా విధానం",
      faq: "తరచుగా అడిగే ప్రశ్నలు",
      language: "భాష"
    }
  }
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;