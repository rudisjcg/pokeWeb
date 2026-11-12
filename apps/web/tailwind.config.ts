import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./canvas/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "var(--ink-950)",
          900: "var(--ink-900)",
          800: "var(--ink-800)",
          700: "var(--ink-700)",
        },
        line: "var(--line)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        volt: "var(--volt)",
        danger: "var(--danger)",
        type: "var(--type)",
        "type-2": "var(--type-2)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
