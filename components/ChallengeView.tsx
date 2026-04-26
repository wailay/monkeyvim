"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CircleHelp } from "lucide-react";
import { VimEditor, type VimEditorHandle } from "./VimEditor";
import { useChallenge, type ChallengeStatus } from "@/hooks/useChallenge";
import { useCountdown } from "@/hooks/useCountdown";
import { ResultsView } from "./ResultsView";
import type { VimMode } from "@/lib/types";
import { Tooltip } from "./Tooltip";

interface ChallengeViewProps {
  mode: VimMode;
  showHint: boolean;
  onToggleHint: () => void;
  timerEnabled: boolean;
  timerDuration: number;
}

function statusBorderClass(status: ChallengeStatus): string {
  return status === "correct" ? "ring-2 ring-mv-correct" : "";
}

export function ChallengeView({
  mode,
  showHint,
  onToggleHint,
  timerEnabled,
  timerDuration,
}: ChallengeViewProps) {
  const editorRef = useRef<VimEditorHandle>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const [tabPressed, setTabPressed] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const {
    current,
    status,
    validate,
    handleKeystroke,
    streak,
    averageScore,
    averageTimeMs,
    attempts,
    skip,
    reset,
    resetSession,
    startTimer,
    challengeKey,
  } = useChallenge(mode);

  const handleSessionExpire = useCallback(() => {
    setSessionEnded(true);
  }, []);

  const {
    remaining: countdownRemaining,
    running: countdownRunning,
    start: startCountdown,
    reset: resetCountdown,
  } = useCountdown({
    duration: timerDuration,
    onExpire: handleSessionExpire,
  });

  const [prevTimerEnabled, setPrevTimerEnabled] = useState(timerEnabled);
  const [waitingForStart, setWaitingForStart] = useState(timerEnabled);
  if (prevTimerEnabled !== timerEnabled) {
    setPrevTimerEnabled(timerEnabled);
    setWaitingForStart(timerEnabled);
    setSessionEnded(false);
  }

  useEffect(() => {
    if (!timerEnabled || sessionEnded) {
      resetCountdown();
    }
  }, [timerEnabled, sessionEnded, resetCountdown]);

  useEffect(() => {
    if (status === "active" && !waitingForStart && !sessionEnded) {
      startTimer();
    }
  }, [challengeKey, status, waitingForStart, sessionEnded, startTimer]);

  const handleRestart = useCallback(() => {
    resetSession();
    setSessionEnded(false);
    setWaitingForStart(timerEnabled);
    resetCountdown();
  }, [resetSession, timerEnabled, resetCountdown]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInEditor = target?.closest?.(".cm-editor");
      const isInInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (sessionEnded) {
        return;
      }

      if (waitingForStart && !isInInput) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === " ") {
          setWaitingForStart(false);
          startCountdown();
          requestAnimationFrame(() => editorRef.current?.focus());
        }
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        setTabPressed(true);
        resetButtonRef.current?.focus();
        return;
      }

      if (e.key === "Enter" && tabPressed) {
        e.preventDefault();
        reset();
        setTabPressed(false);
        requestAnimationFrame(() => editorRef.current?.focus());
        return;
      }

      if (e.key === " " && tabPressed) {
        e.preventDefault();
        skip();
        setTabPressed(false);
        requestAnimationFrame(() => editorRef.current?.focus());
        return;
      }

      if (e.key === "s" && tabPressed) {
        e.preventDefault();
        onToggleHint();
        setTabPressed(false);
        requestAnimationFrame(() => editorRef.current?.focus());
        return;
      }

      if (e.key !== "Tab") {
        setTabPressed(false);
        if (!isInEditor && !isInInput) {
          e.preventDefault();
          e.stopPropagation();
          requestAnimationFrame(() => editorRef.current?.focus());
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabPressed, reset, skip, onToggleHint, waitingForStart, startCountdown, sessionEnded]);

  if (!current) return null;

  if (sessionEnded) {
    return (
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
        <ResultsView
          attempts={attempts}
          duration={timerDuration}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  const remainingSeconds = Math.ceil(countdownRemaining);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-6 sm:gap-8 font-mono text-sm">
        <Tooltip text="Consecutive correct answers in a row">
          <div className="flex items-center gap-2 text-mv-text-muted">
            <span className="text-mv-text-faint">streak</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={streak}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.12 }}
                className={streak > 0 ? "text-mv-accent" : "text-mv-text-muted"}
              >
                {streak}
              </motion.span>
            </AnimatePresence>
          </div>
        </Tooltip>
        <Tooltip text="How efficiently you get there">
          <div className="flex items-center gap-2 text-mv-text-muted">
            <span className="text-mv-text-faint">score</span>
            <span
              className={
                averageScore > 0 ? "text-mv-accent" : "text-mv-text-muted"
              }
            >
              {averageScore}
            </span>
          </div>
        </Tooltip>
        <Tooltip text="Average time to complete a challenge">
          <div className="flex items-center gap-2 text-mv-text-muted">
            <span className="text-mv-text-faint">avg time</span>
            <span className={averageTimeMs > 0 ? "text-mv-accent" : "text-mv-text-muted"}>
              {averageTimeMs > 0 ? `${(averageTimeMs / 1000).toFixed(1)}s` : "—"}
            </span>
          </div>
        </Tooltip>
        {timerEnabled && (
          <Tooltip text="Time remaining in this session">
            <div className="flex items-center gap-2 text-mv-text-muted">
              <span className="text-mv-text-faint">time</span>
              <motion.span
                animate={
                  countdownRunning
                    ? { scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  countdownRunning
                    ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                className={`inline-block ${
                  countdownRunning && remainingSeconds <= 5
                    ? "text-mv-accent font-semibold"
                    : countdownRunning
                      ? "text-mv-accent"
                      : "text-mv-text-muted"
                }`}
              >
                {remainingSeconds}s
              </motion.span>
            </div>
          </Tooltip>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={challengeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex items-center justify-center gap-3 text-center">
            <p className="text-mv-text font-mono text-base sm:text-lg">{current.prompt}</p>
            <button
              onClick={onToggleHint}
              className={`shrink-0 w-4 h-4 flex items-center justify-center rounded-full text-sm font-mono transition-colors duration-150 cursor-pointer ${
                showHint
                  ? "bg-mv-accent text-mv-bg"
                  : "text-mv-text-faint hover:text-mv-accent hover:bg-mv-surface-hover"
              }`}
              title="Toggle solution (s)"
            >
              <CircleHelp size={16} />
            </button>
          </div>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-mv-accent/15 text-mv-accent">
                  solution
                </span>
                <span className="text-sm font-mono text-mv-accent font-medium">
                  {current.expectedCommand}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`transition-all duration-200 rounded-lg ${statusBorderClass(status)}`}
          >
            <VimEditor
              ref={editorRef}
              initialContent={current.initialContent}
              cursorPos={current.cursorPos}
              onStateChange={validate}
              onKeystroke={handleKeystroke}
              onSkip={skip}
              challengeKey={challengeKey}
              waitingForStart={waitingForStart}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative flex items-center justify-center w-full">
        <button
          ref={resetButtonRef}
          onClick={reset}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer ${
            tabPressed
              ? "bg-mv-accent text-mv-bg"
              : "text-mv-text-faint hover:text-mv-accent hover:bg-mv-surface-hover"
          }`}
          title="Reset challenge (tab + enter)"
        >
          <RotateCcw size={16} />
        </button>
        <span className="hidden sm:inline absolute right-0 text-[11px] font-mono text-mv-text-faint">
          tips: <span className="text-mv-text-muted">:q</span> skip
        </span>
      </div>
    </div>
  );
}
