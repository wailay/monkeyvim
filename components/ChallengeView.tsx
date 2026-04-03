"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CircleHelp } from "lucide-react";
import { VimEditor, type VimEditorHandle } from "./VimEditor";
import { useChallenge, type ChallengeStatus } from "@/hooks/useChallenge";
import type { VimMode } from "@/lib/types";
import { Tooltip } from "./Tooltip";

interface ChallengeViewProps {
  mode: VimMode;
  showHint: boolean;
  onToggleHint: () => void;
}

function statusBorderClass(status: ChallengeStatus): string {
  switch (status) {
    case "correct":
      return "ring-2 ring-mv-correct";
    case "incorrect":
      return "ring-2 ring-mv-incorrect";
    default:
      return "";
  }
}

export function ChallengeView({ mode, showHint, onToggleHint }: ChallengeViewProps) {
  const editorRef = useRef<VimEditorHandle>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const [tabPressed, setTabPressed] = useState(false);
  const {
    current,
    status,
    validate,
    handleKeystroke,
    streak,
    accuracy,
    averageScore,
    skip,
    reset,
    challengeKey,
  } = useChallenge(mode);

  // Tab + Enter to reset challenge
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInEditor = (e.target as HTMLElement)?.closest?.(".cm-editor");

      if (e.key === "Tab") {
        e.preventDefault();
        setTabPressed(true);
        // Move focus to the reset button so editor releases keyboard
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

      // Any other key resets tab state
      if (e.key !== "Tab") {
        setTabPressed(false);
        // Refocus editor, but prevent the keystroke from leaking into it
        if (!isInEditor) {
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
  }, [tabPressed, reset, skip, onToggleHint]);

  if (!current) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
      {/* Stats row */}
      <div className="flex items-center gap-8 font-mono text-sm">
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
        <Tooltip text="How often you get it right">
          <div className="flex items-center gap-2 text-mv-text-muted">
            <span className="text-mv-text-faint">acc</span>
            <span>{accuracy}%</span>
          </div>
        </Tooltip>
        <Tooltip text="How efficiently you get there">
          <div className="flex items-center gap-2 text-mv-text-muted">
            <span className="text-mv-text-faint">score</span>
            <span className={averageScore > 0 ? "text-mv-accent" : "text-mv-text-muted"}>
              {averageScore}
            </span>
          </div>
        </Tooltip>
      </div>

      {/* Challenge area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={challengeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-4 w-full"
        >
          {/* Prompt */}
          <div className="flex items-center justify-center gap-3">
            <p className="text-mv-text font-mono text-lg">
              {current.prompt}
            </p>
            <button
              onClick={onToggleHint}
              className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-sm font-mono transition-colors duration-150 cursor-pointer ${
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

          {/* Editor */}
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
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom row: restart centered, tips right */}
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
        <span className="absolute right-0 text-[11px] font-mono text-mv-text-faint">
          tips: <span className="text-mv-text-muted">:q</span> skip <span className="text-mv-text-faint mx-1">|</span> <span className="text-mv-text-muted">&lt;Esc&gt;</span> to validate
        </span>
      </div>
    </div>
  );
}
