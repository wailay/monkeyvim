"use client";

import { motion } from "framer-motion";
import type { CommandAttempt } from "@/lib/types";

interface SessionSummaryProps {
  attempts: CommandAttempt[];
  onBack: () => void;
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function SessionSummary({ attempts, onBack }: SessionSummaryProps) {
  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const correctAttempts = attempts.filter((a) => a.correct);
  const avgTime =
    correctAttempts.length > 0
      ? correctAttempts.reduce((sum, a) => sum + a.timeMs, 0) /
        correctAttempts.length
      : 0;
  const bestTime =
    correctAttempts.length > 0
      ? Math.min(...correctAttempts.map((a) => a.timeMs))
      : 0;

  // Calculate best streak
  let bestStreak = 0;
  let currentStreak = 0;
  for (const a of attempts) {
    if (a.correct) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  const stats = [
    { label: "completed", value: `${correct}/${total}` },
    { label: "accuracy", value: `${accuracy}%` },
    { label: "avg time", value: formatMs(avgTime) },
    { label: "best time", value: formatMs(bestTime) },
    { label: "best streak", value: `${bestStreak}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center gap-8 py-16 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-mono text-mv-text-muted">
        session <span className="text-mv-accent">complete</span>
      </h2>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.2 }}
            className={`flex flex-col items-center ${
              i === stats.length - 1 ? "col-span-2" : ""
            }`}
          >
            <span className="text-3xl font-mono font-bold text-mv-accent">
              {stat.value}
            </span>
            <span className="text-sm font-mono text-mv-text-faint mt-1">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onBack}
        className="mt-4 px-6 py-2.5 rounded-lg border border-mv-border text-mv-text-muted hover:text-mv-text hover:border-mv-accent/40 hover:bg-mv-surface-hover font-mono text-sm transition-colors duration-200 cursor-pointer"
      >
        back to modes
      </motion.button>
    </motion.div>
  );
}
