"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ModeBar } from "@/components/ModeBar";
import { ChallengeView } from "@/components/ChallengeView";
import { Footer } from "@/components/Footer";
import type { VimMode } from "@/lib/types";

export default function App() {
  const [mode, setMode] = useState<VimMode>("c");
  const [showHint, setShowHint] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);

  const handleSelectMode = (newMode: VimMode) => {
    setMode(newMode);
    setShowHint(false);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />

      <ModeBar
        selectedMode={mode}
        onSelectMode={handleSelectMode}
        timerEnabled={timerEnabled}
        timerDuration={timerDuration}
        onTimerToggle={() => setTimerEnabled((e) => !e)}
        onTimerDurationChange={setTimerDuration}
      />
      <div className="mobile-keyboard-notice mx-4 mb-2 rounded-md border border-mv-border bg-mv-surface px-3 py-2 text-center font-mono text-xs text-mv-text-muted">
        <span className="text-mv-accent">heads up:</span> monkeyvim is built for a
        physical keyboard — connect one or switch to desktop for the full
        experience.
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 gap-6 sm:gap-8">
        <ChallengeView
          key={mode}
          mode={mode}
          showHint={showHint}
          onToggleHint={() => setShowHint((h) => !h)}
          timerEnabled={timerEnabled}
          timerDuration={timerDuration}
        />
      </main>

      <Footer />
    </div>
  );
}
