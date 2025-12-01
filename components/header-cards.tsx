import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { motion } from "framer-motion";

interface HeaderCardsProps {
  metrics: {
    totalPrograms: number;
    activePrograms: number;
    avgMastery: number;
    trialsLast7: number;
    atRiskPrograms: number;
  };
  onNavigate: (anchor: string, context: string) => void;
  contextLabel: string;
}

const cards = [
  {
    key: "totalPrograms",
    title: "Programs in View",
    accent: "bg-gradient-to-br from-primary/70 to-primary text-white",
    anchor: "#program-drilldown"
  },
  {
    key: "activePrograms",
    title: "Active Programs",
    accent: "bg-gradient-to-br from-emerald-500/80 to-emerald-600 text-white",
    anchor: "#active-programs"
  },
  {
    key: "avgMastery",
    title: "Avg. Mastery",
    accent: "bg-gradient-to-br from-accent/80 to-accent text-white",
    anchor: "#mastery-panel"
  },
  {
    key: "trialsLast7",
    title: "Trials (Last 7)",
    accent: "bg-gradient-to-br from-indigo-500/90 to-indigo-600 text-white",
    anchor: "#trial-trends"
  },
  {
    key: "atRiskPrograms",
    title: "Watchlist",
    accent: "bg-gradient-to-br from-amber-500/80 to-orange-500 text-white",
    anchor: "#watchlist"
  }
];

export const HeaderCards = ({
  metrics,
  onNavigate,
  contextLabel
}: HeaderCardsProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card, index) => {
        const value = metrics[card.key as keyof typeof metrics];
        return (
          <motion.button
            key={card.key}
            type="button"
            onClick={() => onNavigate(card.anchor, card.title)}
            className={clsx(
              "relative flex h-36 flex-col overflow-hidden rounded-3xl p-5 text-left shadow-card transition hover:scale-[1.01] focus:outline-none focus-visible:scale-[1.01]",
              card.accent
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide">
                {card.title}
              </span>
              <ArrowUpRightIcon className="h-5 w-5 opacity-80" />
            </div>
            <div className="mt-6 text-4xl font-semibold">
              {card.key === "avgMastery" ? `${value.toFixed(1)}%` : value}
            </div>
            <div className="mt-auto text-xs font-medium uppercase tracking-widest text-white/80">
              {contextLabel}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
