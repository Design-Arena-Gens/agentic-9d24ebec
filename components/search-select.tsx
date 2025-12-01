"use client";

import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useMemo, useState } from "react";

type Option = {
  value: string;
  label: string;
  description?: string;
  badge?: string;
};

interface BaseProps {
  label: string;
  options: Option[];
  placeholder?: string;
  emptyLabel?: string;
}

interface SingleSelectProps extends BaseProps {
  multiple?: false;
  value: string | null;
  onChange: (value: string | null) => void;
}

interface MultiSelectProps extends BaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

type Props = SingleSelectProps | MultiSelectProps;

const OptionsList = ({
  filteredOptions,
  emptyLabel
}: {
  filteredOptions: Option[];
  emptyLabel?: string;
}) => (
  <Transition
    as={Fragment}
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <Combobox.Options className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-white/20 bg-white/95 p-2 text-sm shadow-xl dark:border-slate-700/80 dark:bg-slate-900/95">
      {filteredOptions.length === 0 && (
        <div className="px-3 py-2 text-muted-foreground/70">
          {emptyLabel ?? "No matches"}
        </div>
      )}

      {filteredOptions.map((option) => (
        <Combobox.Option
          key={option.value}
          value={option.value}
          className={({ active }) =>
            clsx(
              "flex cursor-pointer flex-col gap-1 rounded-xl px-3 py-2 transition",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )
          }
        >
          {({ active, selected }) => (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span
                  className={clsx(
                    "font-medium",
                    active ? "text-primary" : "text-base-foreground"
                  )}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs text-muted-foreground/80">
                    {option.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {option.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {option.badge}
                  </span>
                )}
                {selected && <CheckIcon className="h-4 w-4 text-primary" />}
              </div>
            </div>
          )}
        </Combobox.Option>
      ))}
    </Combobox.Options>
  </Transition>
);

export function SearchSelect(props: Props) {
  const { label, options, placeholder, emptyLabel } = props;
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (query.trim() === "") return options;
    const lower = query.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lower)
    );
  }, [query, options]);

  if (props.multiple) {
    const value = props.value;
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <Combobox multiple value={value} onChange={props.onChange}>
          <div className="relative w-full">
            <div
              className={clsx(
                "glass-panel flex min-h-[48px] w-full flex-wrap items-center gap-2 px-3 py-2 text-sm shadow-card transition",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              )}
            >
              {value.map((selected) => {
                const option = options.find((opt) => opt.value === selected);
                return (
                  <span
                    key={selected}
                    className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    {option?.label ?? selected}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onChange(value.filter((item) => item !== selected));
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              <Combobox.Input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                placeholder={value.length === 0 ? placeholder : ""}
                onChange={(event) => setQuery(event.target.value)}
              />
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    props.onChange([]);
                  }}
                  className="rounded-full border border-white/40 bg-white/50 p-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  Clear
                </button>
              )}
              <Combobox.Button className="ml-auto text-muted-foreground transition hover:text-primary">
                <ChevronUpDownIcon className="h-5 w-5" />
              </Combobox.Button>
            </div>
            <OptionsList filteredOptions={filtered} emptyLabel={emptyLabel} />
          </div>
        </Combobox>
      </div>
    );
  }

  const value = props.value;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Combobox value={value} onChange={props.onChange} nullable>
        <div className="relative w-full">
          <div
            className={clsx(
              "glass-panel flex min-h-[48px] w-full items-center gap-2 px-3 py-2 text-sm shadow-card transition",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            )}
          >
            <Combobox.Input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              displayValue={(selected: string) => {
                if (!selected) return "";
                const option = options.find((opt) => opt.value === selected);
                return option?.label ?? "";
              }}
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="ml-auto text-muted-foreground transition hover:text-primary">
              <ChevronUpDownIcon className="h-5 w-5" />
            </Combobox.Button>
          </div>
          <OptionsList filteredOptions={filtered} emptyLabel={emptyLabel} />
        </div>
      </Combobox>
    </div>
  );
}
