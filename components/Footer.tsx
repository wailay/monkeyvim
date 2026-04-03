"use client";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 py-4 px-6 mt-auto">
      {/* Shortcuts */}
      <div className="flex items-center gap-6 font-mono text-xs text-mv-text-faint">
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
      <div className="flex items-center justify-between w-full text-xs font-mono text-mv-text-faint">
        <div className="flex items-center gap-4">
          <span>contact</span>
          <span>github</span>
          <span>discord</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mv-accent">monkeyvim</span>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
