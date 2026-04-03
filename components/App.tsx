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
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
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
