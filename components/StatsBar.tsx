"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StatsBarProps {
  streak: number;
  accuracy: number;
  elapsed: number;
  onEnd: () => void;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${seconds}.${tenths}s`;
}

export function StatsBar({ streak, accuracy, elapsed, onEnd }: StatsBarProps) {
  return (
    <div className="flex items-center justify-between w-full font-mono text-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-mv-text-muted">
          <span className="text-mv-text-faint">streak</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={streak}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={streak > 0 ? "text-mv-accent" : "text-mv-text-muted"}
            >
              {streak}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 text-mv-text-muted">
          <span className="text-mv-text-faint">acc</span>
          <span>{accuracy}%</span>
        </div>
        <div className="flex items-center gap-2 text-mv-text-muted">
          <span className="text-mv-text-faint">time</span>
          <span>{formatTime(elapsed)}</span>
        </div>
      </div>
      <button
        onClick={onEnd}
        className="text-mv-text-faint hover:text-mv-text-muted transition-colors duration-200 cursor-pointer"
      >
        esc to quit
      </button>
    </div>
  );
}
