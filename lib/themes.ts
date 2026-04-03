import type { Theme } from "./types";
import { EditorView } from "@codemirror/view";

export const themes: Theme[] = [
  {
    name: "8008",
    slug: "8008",
    bg: "#333139",
    accent: "#f44c7f",
    secondary: "#e8caa4",
  },
  {
    name: "Dracula",
    slug: "dracula",
    bg: "#282a36",
    accent: "#bd93f9",
    secondary: "#c0c8e0",
  },
  {
    name: "Nord",
    slug: "nord",
    bg: "#2e3440",
    accent: "#88c0d0",
    secondary: "#d8dee9",
  },
  {
    name: "Monokai",
    slug: "monokai",
    bg: "#272822",
    accent: "#f92672",
    secondary: "#f8f8f2",
  },
  {
    name: "Solarized",
    slug: "solarized",
    bg: "#002b36",
    accent: "#b58900",
    secondary: "#839496",
  },
];

export const defaultTheme = themes[1];

export function getThemeBySlug(slug: string): Theme {
  return themes.find((t) => t.slug === slug) ?? defaultTheme;
}

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty("--mv-bg", theme.bg);
  root.style.setProperty("--mv-accent", theme.accent);
  root.style.setProperty("--mv-secondary", theme.secondary);
}

export function buildCodeMirrorTheme(theme: Theme) {
  return EditorView.theme(
    {
      "&": {
        backgroundColor: "transparent",
        color: theme.secondary,
        fontFamily: "var(--font-roboto-mono), monospace",
        fontSize: "1rem",
        lineHeight: "1.7",
        height: "100%",
      },
      "&.cm-editor": {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
      ".cm-scroller": {
        flex: "1",
        overflow: "auto",
      },
      ".cm-content": {
        caretColor: theme.accent,
        padding: "0",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: theme.accent,
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: theme.accent,
      },
      ".cm-fat-cursor": {
        background: `${theme.accent} !important`,
        color: `${theme.bg} !important`,
      },
      "&:not(.cm-focused) .cm-fat-cursor": {
        background: "none !important",
        outline: `1px solid ${theme.accent} !important`,
        color: "inherit !important",
      },
      ".cm-selectionBackground": {
        backgroundColor: `${theme.accent}33`,
      },
      "&.cm-focused .cm-selectionBackground": {
        backgroundColor: `${theme.accent}33`,
      },
      ".cm-activeLine": {
        backgroundColor: "transparent",
      },
      ".cm-gutters": {
        backgroundColor: "transparent",
        borderRight: "none",
        color: `${theme.secondary}40`,
        paddingRight: "8px",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "transparent",
      },
      // Vim status bar (mode indicator + command line)
      ".cm-panels-bottom": {
        borderTop: "none",
      },
      ".cm-vim-panel": {
        backgroundColor: "transparent",
        color: theme.secondary,
        fontFamily: "var(--font-roboto-mono), monospace",
        fontSize: "13px",
        padding: "6px 4px 2px",
      },
      ".cm-vim-panel input": {
        backgroundColor: "transparent",
        color: theme.accent,
        fontFamily: "var(--font-roboto-mono), monospace",
        fontSize: "13px",
        outline: "none",
        border: "none",
      },
    },
    { dark: true },
  );
}
