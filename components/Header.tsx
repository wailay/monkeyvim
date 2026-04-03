"use client";

import { ThemeSelector } from "./ThemeSelector";
import { FontSizeSelector } from "./FontSizeSelector";

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-6">
      <div className="font-mono text-xl tracking-tight">
        <span className="text-mv-text-muted">monkey</span>
        <span className="text-mv-accent">vim</span>
      </div>
      <div className="flex items-center gap-1">
        <FontSizeSelector />
        <ThemeSelector />
      </div>
    </header>
  );
}
