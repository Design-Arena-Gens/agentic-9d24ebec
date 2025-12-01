"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import type { Filters } from "@/lib/types";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CumulativeGraphProps {
  data: { date: string; cumulative: number; distinctPrograms: number; trials: number }[];
  filters: Filters;
  programCount: number;
}

export const CumulativeGraph = ({
  data,
  filters,
  programCount
}: CumulativeGraphProps) => {
  const labels = data.map((item) => format(new Date(item.date), "MMM d"));

  const datasets = [
    {
      label: "Cumulative Trials",
      data: data.map((item) => item.cumulative),
      fill: true,
      tension: 0.4,
      borderColor: "rgba(80, 122, 255, 1)",
      backgroundColor: "rgba(80, 122, 255, 0.2)",
      pointRadius: 4,
      pointBackgroundColor: "rgba(80, 122, 255, 1)",
      pointBorderWidth: 2
    }
  ];

  const chartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (items: any[]) => items[0]?.label ?? "",
          label: (context: any) => {
            const item = data[context.dataIndex];
            return [
              `Cumulative Trials: ${context.formattedValue}`,
              `Programs: ${item?.distinctPrograms ?? 0}`,
              `Session Trials: ${item?.trials ?? 0}`
            ];
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148,163,184,0.2)"
        },
        ticks: {
          color: "rgba(71,85,105,0.8)"
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "rgba(71,85,105,0.8)"
        }
      }
    }
  };

  return (
    <motion.section
      id="trial-trends"
      className="glass-panel h-[420px] rounded-3xl p-6 shadow-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-base-foreground">
            Cumulative Program Exposure
          </h3>
          <p className="text-sm text-muted-foreground">
            Tracking aggregate trials across {programCount} program
            {programCount === 1 ? "" : "s"}. Filters apply instantly for adaptive
            decision-making.
          </p>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          {filters.dateRange.start && filters.dateRange.end
            ? `Window: ${filters.dateRange.start} ➜ ${filters.dateRange.end}`
            : "Full Observation"}
        </div>
      </div>
      <Line options={options} data={chartData} />
    </motion.section>
  );
};
