import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "hsl(var(--color-base) / <alpha-value>)",
          foreground: "hsl(var(--color-base-foreground) / <alpha-value>)"
        },
        primary: {
          DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
          foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
          foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
          foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)"
        },
        ring: "hsl(var(--color-ring) / <alpha-value>)"
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
