import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070710",
          900: "#0c0c18",
          800: "#141426",
          700: "#1d1d35",
          500: "#3a3a5e",
          300: "#8b8bb0",
          100: "#e7e7f5",
        },
        accent: {
          liaison: "#3da9ff",
          elision: "#ff5470",
          stress: "#ffd23f",
          weak: "#7a7a9a",
          sound: "#c084fc",
          breath: "#94a3b8",
          rhyme: "#34d399",
        },
      },
      fontFamily: {
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 32px rgba(61, 169, 255, 0.18)",
      },
      keyframes: {
        beat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        beat: "beat 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
