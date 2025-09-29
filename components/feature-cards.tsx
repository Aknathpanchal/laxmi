"use client";

import { motion } from "framer-motion";
import { CreditCard, FileCheck, Banknote, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "No Credit Card Required",
    description: "Get loans without any credit card. We use alternative data for scoring.",
    gradient: "from-[#38bdf8] to-[#34d399]"
  },
  {
    icon: FileCheck,
    title: "Minimal Documentation",
    description: "Just Aadhaar & PAN. Our AI handles the rest of verification.",
    gradient: "from-[#38bdf8] to-[#34d399]"
  },
  {
    icon: Banknote,
    title: "Instant Disbursement",
    description: "Money credited to your bank account within minutes of approval.",
    gradient: "from-[#34d399] to-[#fbbf24]"
  },
  {
    icon: HeartHandshake,
    title: "Ethical Lending",
    description: "Transparent pricing. No hidden charges. Fair collection practices.",
    gradient: "from-[#fbbf24] to-[#38bdf8]"
  }
];

export function FeatureCards() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#38bdf8] to-[#34d399] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-[#34d399] transition-colors shadow-sm hover:shadow-lg">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}