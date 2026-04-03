"use client";

import { ThemeSelector } from "./ThemeSelector";
import { FontSizeSelector } from "./FontSizeSelector";
import { LogoIcon } from "./Logo";

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center gap-2 font-mono text-xl tracking-tight">
        <LogoIcon size={28} />
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
