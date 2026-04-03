"use client";

import type { VimMode } from "@/lib/types";
import { TimerBar } from "./TimerBar";

interface ModeBarProps {
  selectedMode: VimMode;
  onSelectMode: (mode: VimMode) => void;
  timerEnabled: boolean;
  timerDuration: number;
  onTimerToggle: () => void;
  onTimerDurationChange: (seconds: number) => void;
}

const modes: { mode: VimMode; key: string; label: string }[] = [
  { mode: "c", key: "c", label: "change" },
  { mode: "d", key: "d", label: "delete" },
  { mode: "y", key: "y", label: "yank" },
  { mode: "motion", key: "w", label: "motions" },
  { mode: "find", key: "f", label: "find" },
  { mode: "random", key: "?", label: "random" },
];

export function ModeBar({
  selectedMode,
  onSelectMode,
  timerEnabled,
  timerDuration,
  onTimerToggle,
  onTimerDurationChange,
}: ModeBarProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-3 px-6">
      <div className="flex items-center gap-2 bg-mv-surface rounded-lg px-2 py-1.5">
        {modes.map((m) => (
          <button
            key={m.mode}
            onClick={() => onSelectMode(m.mode)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-mono text-sm transition-colors duration-150 cursor-pointer ${
              selectedMode === m.mode
                ? "bg-mv-accent text-mv-bg font-medium"
                : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
            }`}
          >
            <span className={`font-bold ${selectedMode === m.mode ? "" : "text-mv-accent"}`}>
              {m.key}
            </span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      <TimerBar
        enabled={timerEnabled}
        duration={timerDuration}
        onToggle={onTimerToggle}
        onDurationChange={onTimerDurationChange}
      />
    </div>
  );
}
