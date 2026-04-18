"use client";

import { ThemeSelector } from "./ThemeSelector";
import { FontSizeSelector } from "./FontSizeSelector";
import { LogoIcon } from "./Logo";

export function Header() {
  return (
    <header className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6">
      <div className="flex items-center gap-2 font-mono text-lg sm:text-xl tracking-tight">
        <LogoIcon size={24} />
        <div>
          <span className="text-mv-text-muted">monkey</span>
          <span className="text-mv-accent">vim</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <FontSizeSelector />
        <ThemeSelector />
      </div>
    </header>
  );
}
