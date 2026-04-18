"use client";

import { Code, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-3 sm:gap-4 py-4 px-4 sm:px-12 lg:px-24 mt-auto">
      {/* Shortcuts — hidden on mobile since they require a physical keyboard */}
      <div className="hidden sm:flex items-center gap-6 font-mono text-xs text-mv-text-faint">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-mv-surface border border-mv-border text-mv-text-muted">
            tab
          </kbd>
          {" + "}
          <kbd className="px-1.5 py-0.5 rounded bg-mv-surface border border-mv-border text-mv-text-muted">
            enter
          </kbd>
          {" - reset"}
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-mv-surface border border-mv-border text-mv-text-muted">
            tab
          </kbd>
          {" + "}
          <kbd className="px-1.5 py-0.5 rounded bg-mv-surface border border-mv-border text-mv-text-muted">
            space
          </kbd>
          {" - skip"}
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-mv-surface border border-mv-border text-mv-text-muted">
            tab
          </kbd>
          {" + "}
          <kbd className="px-1.5 py-0.5 rounded bg-mv-surface border border-mv-border text-mv-text-muted">
            s
          </kbd>
          {" - toggle solution"}
        </span>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 w-full text-xs font-mono text-mv-text-faint">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/wailay/monkeyvim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-mv-accent transition-colors duration-150"
          >
            <Code size={12} />
            github
          </a>
          <a
            href="https://ko-fi.com/monkeyvim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-mv-accent transition-colors duration-150"
          >
            <Heart size={12} />
            support
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mv-accent">monkeyvim</span>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
