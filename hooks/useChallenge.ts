"use client";

import { useState, useCallback, useRef } from "react";
import type { Challenge, VimMode, CommandAttempt } from "@/lib/types";
import { getChallengesForMode, shuffleChallenges } from "@/lib/challenges";
import { useTimer } from "./useTimer";

export type ChallengeStatus = "active" | "correct" | "incorrect";

export function useChallenge(mode: VimMode) {
  const [challenges] = useState(() => shuffleChallenges(getChallengesForMode(mode)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [status, setStatus] = useState<ChallengeStatus>("active");
  const [attempts, setAttempts] = useState<CommandAttempt[]>([]);
  const [streak, setStreak] = useState(0);
  const timer = useTimer();
  const hasStartedRef = useRef(false);

  const current = challenges[currentIndex % challenges.length] as Challenge | undefined;

  const startTimer = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      timer.start();
    }
  }, [timer]);

  const validate = useCallback(
    (content: string, cursorPos: number) => {
      if (!current || status !== "active") return;

      // Start timer on first interaction
      startTimer();

      const contentMatch = content === current.expectedContent;
      const isMotionOnly = current.initialContent === current.expectedContent;
      const cursorMatch = cursorPos === current.expectedCursorPos;

      const correct = isMotionOnly
        ? cursorMatch
        : contentMatch;


      if (correct) {
        const timeMs = timer.stop();
        setStatus("correct");
        setStreak((s) => s + 1);
        setAttempts((prev) => [
          ...prev,
          {
            challengeId: current.id,
            correct: true,
            timeMs,
            timestamp: Date.now(),
          },
        ]);

        // Move to next challenge after a brief delay
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setStatus("active");
          hasStartedRef.current = false;
          timer.reset();
        }, 600);
      } else {
        // Only mark incorrect if something actually changed
        const contentChanged = content !== current.initialContent;
        const cursorChanged = cursorPos !== current.cursorPos;

        if (contentChanged || cursorChanged) {
          const timeMs = timer.stop();
          setStatus("incorrect");
          setStreak(0);
          setAttempts((prev) => [
            ...prev,
            {
              challengeId: current.id,
              correct: false,
              timeMs,
              timestamp: Date.now(),
            },
          ]);

          // Reset after a brief delay
          setTimeout(() => {
            setStatus("active");
            hasStartedRef.current = false;
            timer.reset();
          }, 800);
        }
      }
    },
    [current, status, timer, startTimer]
  );

  const skip = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setStatus("active");
    hasStartedRef.current = false;
    timer.reset();
  }, [timer]);

  const reset = useCallback(() => {
    setResetCount((c) => c + 1);
    setStatus("active");
    hasStartedRef.current = false;
    timer.reset();
  }, [timer]);

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
  const avgTime = correctAttempts > 0
    ? Math.round(
        attempts.filter((a) => a.correct).reduce((sum, a) => sum + a.timeMs, 0) / correctAttempts
      )
    : 0;

  return {
    current,
    status,
    validate,
    streak,
    accuracy,
    avgTime,
    totalAttempts,
    correctAttempts,
    elapsed: timer.elapsed,
    attempts,
    skip,
    reset,
    challengeKey: `${mode}-${currentIndex}-${resetCount}`,
  };
}
