"use client";

import { motion } from "framer-motion";
import type { ChallengeSet } from "@/lib/types";

interface ModeCardProps {
  set: ChallengeSet;
  index: number;
  onClick: () => void;
}

export function ModeCard({ set, index, onClick }: ModeCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="group relative p-6 rounded-xl border border-mv-border bg-mv-surface hover:bg-mv-surface-hover hover:border-mv-accent/40 transition-colors duration-200 text-left cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl font-mono font-bold text-mv-accent">
          {set.key}
        </span>
        <span className="text-xs font-mono text-mv-text-faint px-2 py-1 rounded bg-mv-bg">
          {set.challenges.length}
        </span>
      </div>
      <h3 className="text-lg font-mono font-medium text-mv-text mb-1">
        {set.label}
      </h3>
      <p className="text-sm text-mv-text-muted leading-relaxed">
        {set.description}
      </p>
    </motion.button>
  );
}
