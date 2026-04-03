"use client";

import { useState, useRef, useEffect } from "react";
import { ALargeSmall } from "lucide-react";
import { useThemeContext } from "./ThemeProvider";
import type { FontSize } from "@/lib/types";

const sizes: { value: FontSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export function FontSizeSelector() {
  const { fontSize, setFontSize } = useThemeContext();
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
        <ALargeSmall size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-mv-surface border border-mv-border rounded-lg overflow-hidden shadow-lg z-50 min-w-[120px]">
          {sizes.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setFontSize(s.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm font-mono transition-colors duration-150 cursor-pointer ${
                s.value === fontSize
                  ? "text-mv-accent bg-mv-surface-active"
                  : "text-mv-text-muted hover:text-mv-text hover:bg-mv-surface-hover"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
