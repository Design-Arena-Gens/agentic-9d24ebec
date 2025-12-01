"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyFilters,
  buildCumulativeSeries,
  defaultFilters,
  listFilterOptions,
  summarizePrograms
} from "@/lib/analytics";
import type { Filters } from "@/lib/types";
import { FilterSidebar } from "@/components/filter-sidebar";
import { HeaderCards } from "@/components/header-cards";
import { CumulativeGraph } from "@/components/cumulative-graph";
import { ProgramDrilldown } from "@/components/program-drilldown";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { listClients } from "@/lib/analytics";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [context, setContext] = useState("Organization View");

  const options = useMemo(() => listFilterOptions(), []);

  const filteredPrograms = useMemo(() => applyFilters(filters), [filters]);
  const aggregates = useMemo(
    () => summarizePrograms(filteredPrograms),
    [filteredPrograms]
  );
  const cumulativeSeries = useMemo(
    () => buildCumulativeSeries(filteredPrograms, filters),
    [filteredPrograms, filters]
  );

  const clients = useMemo(() => listClients(), []);

  useEffect(() => {
    const selectedClient = filters.clientId
      ? clients.find((client) => client.id === filters.clientId)?.name
      : null;
    const domainContext =
      filters.domains.length > 0 ? filters.domains.join(", ") : "All Domains";
    const tierContext =
      filters.tierLevels.length > 0 ? filters.tierLevels.join(", ") : null;

    const parts = [
      selectedClient ?? "All Clients",
      domainContext,
      tierContext ?? undefined
    ].filter(Boolean);
    setContext(parts.join(" • "));
  }, [filters, clients]);

  const handleNavigate = (anchor: string, label: string) => {
    setContext(`${label} • ${context}`);
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activePrograms = filteredPrograms.filter(
    (program) => program.status === "Active"
  );
  const atRiskPrograms = filteredPrograms.filter((program) => {
    const recent = program.sessions.slice(-5);
    const correct = recent.reduce((acc, session) => acc + session.correct, 0);
    const trials = recent.reduce(
      (acc, session) => acc + session.correct + session.incorrect,
      0
    );
    const rate = trials ? (correct / trials) * 100 : program.masteryRate;
    return rate < 65;
  });

  return (
    <main className="flex min-h-screen gap-6 bg-base/60 p-6">
      <div className="w-[320px] shrink-0">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          options={options}
        />
        <div className="mt-6">
          <ThemeSwitcher />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <motion.section
            className="glass-panel rounded-3xl p-6 shadow-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-base-foreground">
                  ABA Client Intelligence Workspace
                </h1>
                <p className="text-sm text-muted-foreground">
                  Align programming decisions with best-practice analytics for
                  BCBAs. Filters auto-apply to keep insights responsive.
                </p>
              </div>
              <div className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {context}
              </div>
            </div>
            <div className="mt-6">
              <HeaderCards
                metrics={aggregates}
                onNavigate={handleNavigate}
                contextLabel={context}
              />
            </div>
          </motion.section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CumulativeGraph
                data={cumulativeSeries}
                filters={filters}
                programCount={filteredPrograms.length}
              />
            </div>
            <motion.section
              id="mastery-panel"
              className="glass-panel flex flex-col gap-4 rounded-3xl p-6 shadow-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-base-foreground">
                  Mastery Distribution
                </h3>
                <InformationCircleIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Rapidly evaluate whether programs are within your chosen mastery
                band. Tier and prompt filters help align intensities.
              </p>
              <div className="flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {filteredPrograms.map((program) => (
                    <motion.div
                      key={program.id}
                      className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm shadow-inner dark:bg-slate-900/70"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <span className="w-32 font-semibold text-base-foreground">
                        {program.name}
                      </span>
                      <div className="relative h-2 flex-1 rounded-full bg-muted/40">
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-primary"
                          style={{ width: `${program.masteryRate}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-semibold text-primary">
                        {program.masteryRate.toFixed(0)}%
                      </span>
                    </motion.div>
                  ))}
                  {filteredPrograms.length === 0 && (
                    <motion.div
                      className="rounded-2xl bg-muted/20 p-4 text-center text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Adjust filters to surface matching programs.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          </div>

          <motion.section
            id="active-programs"
            className="glass-panel rounded-3xl p-6 shadow-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-base-foreground">
                  Active Program Load
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monitor caseload balance and identify dense therapy schedules.
                </p>
              </div>
              <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {activePrograms.length} Active
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {activePrograms.map((program) => (
                <div
                  key={program.id}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-base-foreground shadow-inner"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{program.name}</span>
                    <span className="rounded-full border border-white/20 bg-white/40 px-2 py-0.5 text-xs font-semibold">
                      {program.clientName}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {program.sessions.length} sessions logged • Mastery{" "}
                    {program.masteryRate.toFixed(1)}%
                  </div>
                </div>
              ))}
              {activePrograms.length === 0 && (
                <div className="rounded-2xl border border-muted/30 bg-muted/10 p-4 text-sm text-muted-foreground">
                  No active programs match the current filters.
                </div>
              )}
            </div>
          </motion.section>

          <ProgramDrilldown programs={filteredPrograms} />

          <motion.section
            id="watchlist"
            className="glass-panel rounded-3xl p-6 shadow-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-base-foreground">
                  Adaptive Watchlist
                </h3>
                <p className="text-sm text-muted-foreground">
                  Programs with recent accuracy below 65% for swift intervention.
                </p>
              </div>
              <div className="rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                {atRiskPrograms.length} flagged
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {atRiskPrograms.map((program) => (
                <div
                  key={program.id}
                  className="rounded-3xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-900 shadow-card dark:border-rose-900/60 dark:bg-rose-900/30 dark:text-rose-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{program.name}</span>
                    <span className="rounded-full border border-white/30 bg-white/40 px-2 py-0.5 text-xs font-semibold">
                      {program.clientName}
                    </span>
                  </div>
                  <p className="mt-2 text-xs">
                    Stabilize prompting hierarchy—consider re-baselining. Recent
                    mastery {program.masteryRate.toFixed(1)}%.
                  </p>
                </div>
              ))}
              {atRiskPrograms.length === 0 && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  No programs fall below the accuracy threshold. Great work!
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
