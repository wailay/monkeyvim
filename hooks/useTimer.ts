"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Run the animation loop whenever we have a start time
    if (startTimeRef.current === null) return;

    function tick() {
      if (startTimeRef.current !== null) {
        setElapsed(performance.now() - startTimeRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  });

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const stop = useCallback((): number => {
    const ms = startTimeRef.current !== null
      ? performance.now() - startTimeRef.current
      : 0;
    startTimeRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    return ms;
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setElapsed(0);
  }, []);

  return { elapsed, start, stop, reset };
}
