import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
          card: "rgb(var(--color-bg-card) / <alpha-value>)",
          hover: "rgb(var(--color-bg-hover) / <alpha-value>)",
          border: "rgb(var(--color-bg-border) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        brand: {
          blue: {
            600: "rgb(var(--color-blue-600) / <alpha-value>)",
            500: "rgb(var(--color-blue-500) / <alpha-value>)",
            400: "rgb(var(--color-blue-400) / <alpha-value>)",
          },
          emerald: {
            600: "rgb(var(--color-emerald-600) / <alpha-value>)",
            500: "rgb(var(--color-emerald-500) / <alpha-value>)",
          },
          amber: {
            600: "rgb(var(--color-amber-600) / <alpha-value>)",
            500: "rgb(var(--color-amber-500) / <alpha-value>)",
          },
        },
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        glow: "0 0 20px rgba(37,99,235,0.15), 0 0 40px rgba(37,99,235,0.1)",
        card: "0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
