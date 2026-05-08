import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#FFD700",
          dark: "#B8860B",
          light: "#FFF3B0",
        },
        dark: {
          DEFAULT: "#0a0a1a",
          card: "#12122a",
          border: "#1e1e3a",
        },
      },
      fontFamily: {
        bebas: ["var(--font-bebas)", "cursive"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 15px rgba(255, 215, 0, 0.4)",
        "gold-sm": "0 0 8px rgba(255, 215, 0, 0.3)",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "pop-in": "popIn 0.2s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
