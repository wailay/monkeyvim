"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { Theme, FontSize } from "@/lib/types";
import { fontSizeValues } from "@/lib/types";
import {
  defaultTheme,
  getThemeBySlug,
  applyThemeToDocument,
} from "@/lib/themes";

const THEME_KEY = "monkeyvim-theme";
const FONT_SIZE_KEY = "monkeyvim-font-size";

interface StoreState {
  theme: Theme;
  fontSize: FontSize;
}

/** Stable reference for SSR — getServerSnapshot must not return a new object each call. */
const SERVER_SNAPSHOT: StoreState = {
  theme: defaultTheme,
  fontSize: "medium",
};

let current: StoreState = { theme: defaultTheme, fontSize: "medium" };
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): StoreState {
  return current;
}

function getServerSnapshot(): StoreState {
  return SERVER_SNAPSHOT;
}

function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = fontSizeValues[size];
}

// Initialize on first load
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    current = { ...current, theme: getThemeBySlug(savedTheme) };
  }
  const savedSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
  if (savedSize && savedSize in fontSizeValues) {
    current = { ...current, fontSize: savedSize };
  }
  applyThemeToDocument(current.theme);
  applyFontSize(current.fontSize);
}

export function useTheme() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((slug: string) => {
    const theme = getThemeBySlug(slug);
    current = { ...current, theme };
    applyThemeToDocument(theme);
    localStorage.setItem(THEME_KEY, slug);
    listeners.forEach((l) => l());
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    current = { ...current, fontSize: size };
    applyFontSize(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
    listeners.forEach((l) => l());
  }, []);

  return { theme: state.theme, fontSize: state.fontSize, setTheme, setFontSize };
}
