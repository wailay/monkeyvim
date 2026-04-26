"use client";

import { useState, useCallback, useRef } from "react";
import type { Challenge, VimMode, CommandAttempt } from "@/lib/types";
import { getChallengesForMode, shuffleChallenges } from "@/lib/challenges";
import { useTimer } from "./useTimer";

export type ChallengeStatus = "active" | "correct";

export function useChallenge(mode: VimMode) {
  const [challenges, setChallenges] = useState(() => shuffleChallenges(getChallengesForMode(mode)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [status, setStatus] = useState<ChallengeStatus>("active");
  const [attempts, setAttempts] = useState<CommandAttempt[]>([]);
  const [streak, setStreak] = useState(0);
  const { elapsed, start: timerStart, stop: timerStop, reset: timerReset } = useTimer();
  const hasStartedRef = useRef(false);
  const keystrokeCountRef = useRef(0);

  const current = challenges[currentIndex % challenges.length] as Challenge | undefined;

  const handleKeystroke = useCallback(() => {
    keystrokeCountRef.current++;
  }, []);

  const startTimer = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      timerStart();
    }
  }, [timerStart]);

  const advance = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setStatus("active");
    hasStartedRef.current = false;
    keystrokeCountRef.current = 0;
    timerReset();
  }, [timerReset]);

  const validate = useCallback(
    (content: string, cursorPos: number) => {
      if (!current || status !== "active") return;

      const contentMatch = content === current.expectedContent;
      const isMotionOnly = current.initialContent === current.expectedContent;
      const cursorMatch = cursorPos === current.expectedCursorPos;

      const correct = isMotionOnly ? cursorMatch : contentMatch;

      if (correct) {
        const timeMs = timerStop();
        const keystrokes = keystrokeCountRef.current;
        const ideal = current.expectedCommand.length;
        const score = keystrokes <= ideal ? 100 : Math.max(0, Math.round(100 * ideal / keystrokes));
        setStatus("correct");
        setStreak((s) => s + 1);
        setAttempts((prev) => [
          ...prev,
          {
            challengeId: current.id,
            correct: true,
            timeMs,
            timestamp: Date.now(),
            keystrokeCount: keystrokes,
            score,
          },
        ]);

        setTimeout(() => advance(), 600);
      }
      // No incorrect auto-validation — user has unlimited time
    },
    [current, status, timerStop, advance]
  );

  const skip = useCallback(() => {
    if (current) {
      setAttempts((prev) => [
        ...prev,
        {
          challengeId: current.id,
          correct: false,
          timeMs: timerStop(),
          timestamp: Date.now(),
          keystrokeCount: keystrokeCountRef.current,
          score: 0,
        },
      ]);
    }
    setStreak(0);
    advance();
  }, [current, timerStop, advance]);

  const reset = useCallback(() => {
    setResetCount((c) => c + 1);
    setStatus("active");
    hasStartedRef.current = false;
    keystrokeCountRef.current = 0;
    timerReset();
  }, [timerReset]);

  const resetSession = useCallback(() => {
    setChallenges(shuffleChallenges(getChallengesForMode(mode)));
    setCurrentIndex(0);
    setResetCount((c) => c + 1);
    setStatus("active");
    setAttempts([]);
    setStreak(0);
    hasStartedRef.current = false;
    keystrokeCountRef.current = 0;
    timerReset();
  }, [mode, timerReset]);

  const correctAttemptsList = attempts.filter((a) => a.correct);
  const averageScore = correctAttemptsList.length > 0
    ? Math.round(correctAttemptsList.reduce((sum, a) => sum + a.score, 0) / correctAttemptsList.length)
    : 0;
  const averageTimeMs = correctAttemptsList.length > 0
    ? correctAttemptsList.reduce((sum, a) => sum + a.timeMs, 0) / correctAttemptsList.length
    : 0;

  return {
    current,
    status,
    validate,
    handleKeystroke,
    streak,
    averageScore,
    averageTimeMs,
    elapsed,
    startTimer,
    attempts,
    skip,
    reset,
    resetSession,
    challengeKey: `${mode}-${currentIndex}-${resetCount}`,
  };
}
