import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mamoru: {
          50: "#eff8ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#0f1f4b",
        },
        status: {
          stable: "#10b981",    // 緑（安定）
          caution: "#f59e0b",   // 黄/橙（要観察・微熱・脱水）
          critical: "#ef4444",  // 赤（警告・高頻脈・離床）
        }
      },
      keyframes: {
        pulseFast: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'pulse-fast': 'pulseFast 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
