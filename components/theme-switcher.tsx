"use client";

import { useTheme } from "./theme-provider";
import clsx from "clsx";
import { motion } from "framer-motion";

const THEMES: { label: string; value: "light" | "dark" | "aqua" }[] = [
  { label: "Daylight", value: "light" },
  { label: "Midnight", value: "dark" },
  { label: "Aqua", value: "aqua" }
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex h-12 items-center justify-between rounded-full border border-white/30 bg-white/70 p-1.5 shadow-inner backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      {THEMES.map((item) => {
        const isActive = item.value === theme;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setTheme(item.value)}
            className={clsx(
              "relative flex h-9 flex-1 items-center justify-center text-sm font-semibold transition focus:outline-none",
              isActive ? "text-base-foreground" : "text-muted-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-primary/20 shadow-card"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
