/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "#090b0e",
          surface: "#0f131a",
          card: "#141923",
          cardHover: "#1a2130",
          border: "rgba(255, 255, 255, 0.08)",
          borderBright: "rgba(255, 255, 255, 0.16)",
          text: "#f1f5f9",
          textMuted: "#94a3b8",
          textDim: "#64748b",
          cyan: "#00e5ff",
          cyanMuted: "#0284c7",
          amber: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        'lab-glow': '0 0 20px -5px rgba(0, 229, 255, 0.15)',
        'lab-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
