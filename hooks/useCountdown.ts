"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseCountdownOptions {
  duration: number; // seconds
  onExpire: () => void;
}

export function useCountdown({ duration, onExpire }: UseCountdownOptions) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!running) return;

    let rafId: number;

    function tick() {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, duration - elapsed);
      setRemaining(left);

      if (left <= 0) {
        setRunning(false);
        onExpireRef.current();
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [running, duration]);

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setRemaining(duration);
    setRunning(true);
  }, [duration]);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(duration);
  }, [duration]);

  const cancel = useCallback(() => {
    setRunning(false);
  }, []);

  return { remaining, running, start, reset, cancel };
}
