import type { Filters } from "@/lib/types";
import { SearchSelect } from "./search-select";
import clsx from "clsx";
import { Fragment } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  options: {
    clients: { value: string; label: string }[];
    domains: string[];
    statuses: string[];
    therapists: string[];
    bcbas: string[];
    promptLevels: string[];
    tierLevels: string[];
  };
}

export const FilterSidebar = ({
  filters,
  onFiltersChange,
  options
}: FilterSidebarProps) => {
  const handleUpdate = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className="sidebar-scroll glass-panel flex h-full max-h-[calc(100vh-3rem)] flex-col gap-6 overflow-y-auto p-6 shadow-card">
      <header className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-base-foreground">
          Precision Filters
        </h2>
        <p className="text-sm text-muted-foreground">
          Filters apply instantly. Explore patterns by adjusting these controls.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <SearchSelect
          label="Client"
          placeholder="Search for a client..."
          options={options.clients}
          value={filters.clientId}
          onChange={(value) => handleUpdate("clientId", value)}
          emptyLabel="No client matches"
        />

        <div className="grid grid-cols-1 gap-4">
        <SearchSelect
          multiple
          label="Domain"
          placeholder="Search domains..."
          options={options.domains.map((domain) => ({
            value: domain,
            label: domain
          }))}
          value={filters.domains}
          onChange={(value) =>
            handleUpdate("domains", value as Filters["domains"])
          }
        />

        <SearchSelect
          multiple
          label="Program Status"
          placeholder="Select status..."
          options={options.statuses.map((status) => ({
            value: status,
            label: status
          }))}
          value={filters.statuses}
          onChange={(value) =>
            handleUpdate("statuses", value as Filters["statuses"])
          }
        />
      </div>

      <SearchSelect
        multiple
        label="Therapist"
        placeholder="Search therapist..."
        options={options.therapists.map((therapist) => ({
          value: therapist,
          label: therapist
        }))}
        value={filters.therapists}
        onChange={(value) =>
          handleUpdate("therapists", value as Filters["therapists"])
        }
      />

      <SearchSelect
        multiple
        label="BCBA"
        placeholder="Filter by BCBA..."
        options={options.bcbas.map((bcba) => ({
          value: bcba,
          label: bcba
        }))}
        value={filters.bcba}
        onChange={(value) => handleUpdate("bcba", value as Filters["bcba"])}
      />

      <SearchSelect
        multiple
        label="Prompt Level"
        placeholder="Search prompt level..."
        options={options.promptLevels.map((level) => ({
          value: level,
          label: level
        }))}
        value={filters.promptLevels}
        onChange={(value) =>
          handleUpdate("promptLevels", value as Filters["promptLevels"])
        }
      />

      <SearchSelect
        multiple
        label="Tier Level"
        placeholder="Select tier level..."
        options={options.tierLevels.map((tier) => ({
          value: tier,
          label: tier
        }))}
        value={filters.tierLevels}
        onChange={(value) =>
          handleUpdate("tierLevels", value as Filters["tierLevels"])
        }
      />

        <div className="flex flex-col gap-2 rounded-3xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Mastery Band
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Focus the view on programs within a mastery percentage span.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={filters.masteryRange[1]}
              value={filters.masteryRange[0]}
              onChange={(event) =>
                handleUpdate("masteryRange", [
                  Number(event.target.value),
                  filters.masteryRange[1]
                ])
              }
              className="glass-panel w-20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex-1">
              <div className="relative flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={filters.masteryRange[0]}
                  onChange={(event) =>
                    handleUpdate("masteryRange", [
                      Number(event.target.value),
                      filters.masteryRange[1]
                    ])
                  }
                  className="w-full accent-primary"
                />
                <input
                  type="range"
                  min={filters.masteryRange[0]}
                  max={100}
                  value={filters.masteryRange[1]}
                  onChange={(event) =>
                    handleUpdate("masteryRange", [
                      filters.masteryRange[0],
                      Number(event.target.value)
                    ])
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
            <input
              type="number"
              min={filters.masteryRange[0]}
              max={100}
              value={filters.masteryRange[1]}
              onChange={(event) =>
                handleUpdate("masteryRange", [
                  filters.masteryRange[0],
                  Number(event.target.value)
                ])
              }
              className="glass-panel w-20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Start Date
            </label>
            <input
              type="date"
              value={filters.dateRange.start ?? ""}
              onChange={(event) =>
                handleUpdate("dateRange", {
                  ...filters.dateRange,
                  start: event.target.value || null
                })
              }
              className="glass-panel rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              End Date
            </label>
            <input
              type="date"
              value={filters.dateRange.end ?? ""}
              onChange={(event) =>
                handleUpdate("dateRange", {
                  ...filters.dateRange,
                  end: event.target.value || null
                })
              }
              className="glass-panel rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 rounded-3xl border border-accent/30 bg-accent/10 p-4 text-accent-foreground">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          BCBA Focus Tip
        </h3>
        <p className="text-sm">
          Combine tier and prompt level filters to identify programs that may
          need additional environmental supports before your next review.
        </p>
        <button
          type="button"
          onClick={() => onFiltersChange(filters)}
          className={clsx(
            "rounded-xl bg-transparent text-xs font-semibold uppercase tracking-wider text-accent-foreground/80"
          )}
        >
          Filters auto-apply
        </button>
      </div>
    </aside>
  );
};
