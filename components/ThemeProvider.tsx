"use client";

import { createContext, useContext } from "react";
import { useTheme } from "@/hooks/useTheme";
import type { Theme, FontSize } from "@/lib/types";
import { defaultTheme } from "@/lib/themes";

interface ThemeContextValue {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (slug: string) => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  fontSize: "small",
  setTheme: () => {},
  setFontSize: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, fontSize, setTheme, setFontSize } = useTheme();

  return (
    <ThemeContext value={{ theme, fontSize, setTheme, setFontSize }}>
      {children}
    </ThemeContext>
  );
}
