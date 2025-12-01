import type { EnrichedProgram } from "@/lib/analytics";
import { format } from "date-fns";
import clsx from "clsx";

interface ProgramDrilldownProps {
  programs: EnrichedProgram[];
}

export const ProgramDrilldown = ({ programs }: ProgramDrilldownProps) => {
  return (
    <section id="program-drilldown" className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-base-foreground">
            Program Drilldown
          </h2>
          <p className="text-sm text-muted-foreground">
            Click any summary card to deep link here with context preserved.
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {programs.map((program) => {
          const lastSession = [...program.sessions]
            .sort((a, b) => b.date.localeCompare(a.date))
            .at(0);
          const totalTrials = program.sessions.reduce(
            (acc, session) => acc + session.correct + session.incorrect,
            0
          );
          const recentAccuracy = (() => {
            const recent = program.sessions.slice(-5);
            const correct = recent.reduce((acc, session) => acc + session.correct, 0);
            const trials = recent.reduce(
              (acc, session) => acc + session.correct + session.incorrect,
              0
            );
            return trials ? Number(((correct / trials) * 100).toFixed(1)) : program.masteryRate;
          })();
          return (
            <article
              key={program.id}
              className={clsx(
                "relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-5 shadow-card transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/80"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-base-foreground">
                    {program.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {program.clientName} • {program.domain} • {program.currentPhase}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {program.status}
                  </span>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                    Tier {program.tierLevel.replace("Tier ", "")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-2xl bg-base/40 p-4 text-center shadow-inner">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Mastery
                  </span>
                  <span className="text-2xl font-semibold text-base-foreground">
                    {program.masteryRate.toFixed(1)}%
                  </span>
                </div>
                <div className="rounded-2xl bg-base/40 p-4 text-center shadow-inner">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Trials Logged
                  </span>
                  <span className="text-2xl font-semibold text-base-foreground">
                    {totalTrials}
                  </span>
                </div>
                <div className="rounded-2xl bg-base/40 p-4 text-center shadow-inner">
                  <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                    Recent Accuracy
                  </span>
                  <span
                    className={clsx(
                      "text-2xl font-semibold",
                      recentAccuracy >= 75
                        ? "text-emerald-600"
                        : recentAccuracy >= 60
                        ? "text-amber-500"
                        : "text-rose-500"
                    )}
                  >
                    {recentAccuracy}%
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-muted/40 bg-white/60 p-4 text-sm dark:border-slate-700/60 dark:bg-slate-900/60">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  BCBA Priorities
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-base-foreground/90">
                  {program.notes}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold uppercase tracking-wide text-primary">
                  BCBA: {program.bcbaOwner}
                </span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold uppercase tracking-wide text-primary">
                  Lead BCBA: {program.clientBcba}
                </span>
                <span className="rounded-full border border-muted/40 bg-muted/10 px-3 py-1 font-semibold uppercase tracking-wide text-muted-foreground">
                  {program.targetSkills.length} Targets
                </span>
                {lastSession && (
                  <span className="rounded-full border border-muted/40 bg-muted/10 px-3 py-1 font-semibold uppercase tracking-wide text-muted-foreground">
                    Last session {format(new Date(lastSession.date), "MMM d, yyyy")}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-muted/40 bg-base/50 p-4 dark:border-slate-800/70">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Session Snapshot (Last 4)
                </h4>
                <div className="mt-3 grid gap-3">
                  {program.sessions
                    .slice(-4)
                    .reverse()
                    .map((session) => {
                      const total = session.correct + session.incorrect;
                      const accuracy = total
                        ? Math.round((session.correct / total) * 100)
                        : 0;
                      return (
                        <div
                          key={`${program.id}-${session.date}-${session.therapist}`}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-medium text-base-foreground shadow-inner dark:bg-slate-900/80"
                        >
                          <div className="flex flex-col">
                            <span>{format(new Date(session.date), "MMM d")}</span>
                            <span className="text-muted-foreground">
                              {session.therapist} • {session.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-muted-foreground">
                              {session.correct}/{total} correct
                            </div>
                            <div
                              className={clsx(
                                "flex h-8 w-20 items-center justify-center rounded-xl font-semibold",
                                accuracy >= 80
                                  ? "bg-emerald-100 text-emerald-600"
                                  : accuracy >= 60
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-rose-100 text-rose-600"
                              )}
                            >
                              {accuracy}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
