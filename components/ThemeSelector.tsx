"use client";

import { useState, useRef, useEffect } from "react";
import { useThemeContext } from "./ThemeProvider";
import { themes } from "@/lib/themes";

export function ThemeSelector() {
  const { theme, setTheme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover transition-colors duration-200 cursor-pointer"
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: theme.accent }}
        />
        {theme.name}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-mv-surface border border-mv-border rounded-lg overflow-hidden shadow-lg z-50 min-w-[160px]">
          {themes.map((t) => (
            <button
              key={t.slug}
              onClick={() => {
                setTheme(t.slug);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm font-mono flex items-center gap-3 transition-colors duration-150 cursor-pointer ${
                t.slug === theme.slug
                  ? "text-mv-accent bg-mv-surface-active"
                  : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
              }`}
            >
              <span className="flex gap-1">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.bg }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.accent }}
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.secondary }}
                />
              </span>
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
