"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Pencil } from "lucide-react";

const PRESETS = [15, 30, 60] as const;

interface TimerBarProps {
  enabled: boolean;
  duration: number;
  onToggle: () => void;
  onDurationChange: (seconds: number) => void;
}

export function TimerBar({ enabled, duration, onToggle, onDurationChange }: TimerBarProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustomDuration = enabled && !PRESETS.includes(duration as typeof PRESETS[number]);

  useEffect(() => {
    if (showCustom) {
      inputRef.current?.focus();
    }
  }, [showCustom]);

  const handleCustomSubmit = () => {
    if (!showCustom) return;
    const val = parseInt(customValue, 10);
    if (val > 0 && val <= 3600) {
      onDurationChange(val);
      if (!enabled) onToggle();
    }
    setShowCustom(false);
    setCustomValue("");
  };

  const handlePresetClick = (seconds: number) => {
    onDurationChange(seconds);
    if (!enabled) onToggle();
    setShowCustom(false);
  };

  return (
    <div className="flex items-center gap-2 bg-mv-surface rounded-lg px-2 py-1.5">
      {/* Timer toggle */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-mono text-sm transition-colors duration-150 cursor-pointer ${
          enabled
            ? "bg-mv-accent text-mv-bg font-medium"
            : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
        }`}
      >
        <Timer size={14} />
        <span>time</span>
      </button>

      {/* Preset & custom buttons */}
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 overflow-hidden"
          >
            {PRESETS.map((seconds) => (
              <button
                key={seconds}
                onClick={() => handlePresetClick(seconds)}
                className={`px-3 py-1.5 rounded-md font-mono text-sm transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  duration === seconds && !isCustomDuration
                    ? "bg-mv-accent text-mv-bg font-medium"
                    : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
                }`}
              >
                {seconds}
              </button>
            ))}

            {/* Custom input / button */}
            {showCustom ? (
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={customValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "" || /^\d+$/.test(v)) setCustomValue(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomSubmit();
                  if (e.key === "Escape") {
                    setShowCustom(false);
                    setCustomValue("");
                  }
                }}
                onBlur={() => requestAnimationFrame(handleCustomSubmit)}
                placeholder="sec"
                className="w-14 px-2 py-1 rounded-md font-mono text-sm bg-mv-bg border border-mv-border text-mv-text placeholder:text-mv-text-faint outline-none focus:border-mv-accent"
              />
            ) : (
              <button
                onClick={() => setShowCustom(true)}
                className={`px-3 py-1.5 rounded-md font-mono text-sm transition-colors duration-150 cursor-pointer ${
                  isCustomDuration
                    ? "bg-mv-accent text-mv-bg font-medium"
                    : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
                }`}
                title="Custom duration"
              >
                {isCustomDuration ? duration : <Pencil size={14} />}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
