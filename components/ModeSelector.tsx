"use client";

import { motion } from "framer-motion";
import { ModeCard } from "./ModeCard";
import { challengeSets } from "@/lib/challenges";
import type { VimMode, ChallengeSet } from "@/lib/types";

interface ModeSelectorProps {
  onSelectMode: (mode: VimMode) => void;
}

const randomSet: ChallengeSet = {
  mode: "random",
  label: "Random",
  description: "A mix of all command types — test your overall vim knowledge",
  key: "?",
  challenges: [],
};

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const allSets = [...challengeSets, randomSet];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center gap-10 py-12"
    >
      <div className="text-center">
        <h1 className="text-2xl font-mono text-mv-text-muted mb-2">
          choose a <span className="text-mv-accent">mode</span>
        </h1>
        <p className="text-sm text-mv-text-faint">
          practice vim commands by category
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {allSets.map((set, i) => (
          <ModeCard
            key={set.mode}
            set={set}
            index={i}
            onClick={() => onSelectMode(set.mode)}
          />
        ))}
      </div>
    </motion.div>
  );
}
