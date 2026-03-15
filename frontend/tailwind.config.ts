import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        surface: {
          0: "#06080d",
          1: "#0c0f16",
          2: "#12151e",
          3: "#181c27",
        },
        edge: {
          DEFAULT: "#1e2333",
          light: "#2a2f42",
        },
        accent: {
          DEFAULT: "#00d4ff",
          dim: "rgba(0, 212, 255, 0.13)",
          glow: "rgba(0, 212, 255, 0.08)",
        },
        txt: {
          primary: "#f0f2f7",
          secondary: "#8a90a5",
          muted: "#555b73",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "xl": "12px",
      },
    },
  },
  plugins: [],
} satisfies Config;
