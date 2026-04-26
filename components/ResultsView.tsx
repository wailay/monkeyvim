"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { CommandAttempt } from "@/lib/types";

interface ResultsViewProps {
  attempts: CommandAttempt[];
  duration: number;
  onRestart: () => void;
}

export function ResultsView({ attempts, duration, onRestart }: ResultsViewProps) {
  const correct = attempts.filter((a) => a.correct);
  const completed = correct.length;
  const total = attempts.length;
  const accuracy = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgTimeMs =
    completed > 0 ? correct.reduce((s, a) => s + a.timeMs, 0) / completed : 0;
  const avgScore =
    completed > 0
      ? Math.round(correct.reduce((s, a) => s + a.score, 0) / completed)
      : 0;

  const times = correct.map((a) => a.timeMs);
  const fastestMs = times.length > 0 ? Math.min(...times) : 0;
  const slowestMs = times.length > 0 ? Math.max(...times) : 0;
  const chartMax = slowestMs > 0 ? slowestMs : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6 sm:gap-8 w-full"
    >
      <div className="flex flex-col items-center gap-1">
        <p className="text-mv-text-faint font-mono text-[11px] uppercase tracking-[0.2em]">
          time&apos;s up
        </p>
        <p className="font-mono text-mv-text text-2xl sm:text-3xl">
          <span className="text-mv-accent">{completed}</span>{" "}
          <span className="text-mv-text-muted text-base sm:text-lg">
            challenge{completed === 1 ? "" : "s"} in {duration}s
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Stat
          label="accuracy"
          value={total > 0 ? `${accuracy}%` : "—"}
          accent={accuracy >= 80 && total > 0}
        />
        <Stat
          label="avg time"
          value={completed > 0 ? `${(avgTimeMs / 1000).toFixed(1)}s` : "—"}
          accent={completed > 0}
        />
        <Stat
          label="avg score"
          value={completed > 0 ? `${avgScore}` : "—"}
          accent={avgScore > 0}
        />
        <Stat
          label="fastest"
          value={completed > 0 ? `${(fastestMs / 1000).toFixed(1)}s` : "—"}
          accent={completed > 0}
        />
      </div>

      {completed > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <p className="text-mv-text-faint font-mono text-[10px] uppercase tracking-[0.2em]">
              time per challenge
            </p>
            <p className="text-mv-text-faint font-mono text-[10px]">
              {(fastestMs / 1000).toFixed(1)}s –{" "}
              {(slowestMs / 1000).toFixed(1)}s
            </p>
          </div>
          <div className="flex items-end gap-1 h-24 sm:h-32 w-full bg-mv-surface border border-mv-border rounded-lg p-3">
            {times.map((t, i) => {
              const heightPct = Math.max(4, (t / chartMax) * 100);
              const isFastest = t === fastestMs && fastestMs !== slowestMs;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${heightPct}%`, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.04,
                    ease: "easeOut",
                  }}
                  className={`flex-1 rounded-t-sm ${
                    isFastest ? "bg-mv-accent" : "bg-mv-accent/50"
                  }`}
                  style={{ minWidth: "4px" }}
                  title={`#${i + 1}: ${(t / 1000).toFixed(2)}s`}
                />
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        autoFocus
        className="self-center flex items-center gap-2 px-5 py-2 rounded-lg bg-mv-accent text-mv-bg font-mono text-sm hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-mv-accent/40"
      >
        <RotateCcw size={14} />
        restart
      </button>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-3 sm:py-4 bg-mv-surface border border-mv-border rounded-lg">
      <span className="text-mv-text-faint font-mono text-[10px] uppercase tracking-[0.15em]">
        {label}
      </span>
      <span
        className={`font-mono text-lg sm:text-xl ${
          accent ? "text-mv-accent" : "text-mv-text-muted"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
