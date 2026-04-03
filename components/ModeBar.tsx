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

type Category = "fundamentals" | "applied" | "meta";

const modes: { mode: VimMode; key: string; label: string; category: Category }[] = [
  { mode: "c", key: "c", label: "change", category: "fundamentals" },
  { mode: "d", key: "d", label: "delete", category: "fundamentals" },
  { mode: "y", key: "y", label: "yank", category: "fundamentals" },
  { mode: "motion", key: "w", label: "motions", category: "fundamentals" },
  { mode: "find", key: "f", label: "find", category: "fundamentals" },
  { mode: "refactor", key: "", label: "refactor", category: "applied" },
  { mode: "format", key: "", label: "format", category: "applied" },
  { mode: "fix", key: "", label: "fix", category: "applied" },
  { mode: "random", key: "?", label: "random", category: "meta" },
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
        {modes.map((m, i) => {
          const prev = modes[i - 1];
          const showDivider = prev && prev.category !== m.category;

          return (
            <div key={m.mode} className="flex items-center gap-2">
              {showDivider && (
                <span className="text-mv-text-faint text-sm select-none">|</span>
              )}
              <button
                onClick={() => onSelectMode(m.mode)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-mono text-sm transition-colors duration-150 cursor-pointer ${
                  selectedMode === m.mode
                    ? "bg-mv-accent text-mv-bg font-medium"
                    : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
                }`}
              >
                {m.key && (
                  <span className={`font-bold ${selectedMode === m.mode ? "" : "text-mv-accent"}`}>
                    {m.key}
                  </span>
                )}
                <span>{m.label}</span>
              </button>
            </div>
          );
        })}
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
