"use client";

import { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate, lineNumbers } from "@codemirror/view";
import { vim, getCM, Vim } from "@replit/codemirror-vim";
import { useThemeContext } from "./ThemeProvider";
import { buildCodeMirrorTheme } from "@/lib/themes";

interface VimEditorProps {
  initialContent: string;
  cursorPos: number;
  onStateChange?: (content: string, cursorPos: number) => void;
  onSkip?: () => void;
  challengeKey: string;
}

export interface VimEditorHandle {
  focus: () => void;
}

export const VimEditor = forwardRef<VimEditorHandle, VimEditorProps>(
  function VimEditor({ initialContent, cursorPos, onStateChange, onSkip, challengeKey }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const themeCompartment = useRef(new Compartment());
    const { theme } = useThemeContext();
    const prevInsertModeRef = useRef(false);
    const prevContentRef = useRef(initialContent);
    const prevCursorRef = useRef(cursorPos);
    const [focused, setFocused] = useState(true);

    const onStateChangeRef = useRef(onStateChange);
    onStateChangeRef.current = onStateChange;
    const onSkipRef = useRef(onSkip);
    onSkipRef.current = onSkip;

    useImperativeHandle(ref, () => ({
      focus: () => {
        viewRef.current?.focus();
      },
    }));

    // Track focus via focusin/focusout on the outer container
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let timeout: ReturnType<typeof setTimeout>;

      function handleFocusIn() {
        clearTimeout(timeout);
        setFocused(true);
      }

      function handleFocusOut() {
        // Delay to allow focus to move to another element within the container (e.g. : input)
        timeout = setTimeout(() => {
          const root = containerRef.current;
          if (!root) return;
          if (!root.contains(document.activeElement)) {
            setFocused(false);
            // Actually blur the editor so it stops receiving keyboard input
            viewRef.current?.contentDOM.blur();
          }
        }, 10);
      }

      container.addEventListener("focusin", handleFocusIn);
      container.addEventListener("focusout", handleFocusOut);
      return () => {
        clearTimeout(timeout);
        container.removeEventListener("focusin", handleFocusIn);
        container.removeEventListener("focusout", handleFocusOut);
      };
    }, [challengeKey]);

    const handleUpdate = useCallback((update: ViewUpdate) => {
      const view = update.view;
      const cm = getCM(view);
      if (!cm) return;

      const vimState = cm.state.vim;
      const isInsertMode = vimState?.insertMode ?? false;
      const wasInsertMode = prevInsertModeRef.current;

      const currentContent = view.state.doc.toString();
      const currentCursor = view.state.selection.main.head;

      if (wasInsertMode && !isInsertMode) {
        onStateChangeRef.current?.(currentContent, currentCursor);
      }

      if (!isInsertMode && !wasInsertMode) {
        const contentChanged = currentContent !== prevContentRef.current;
        const cursorChanged = currentCursor !== prevCursorRef.current;

        if (contentChanged || cursorChanged) {
          requestAnimationFrame(() => {
            const latestContent = view.state.doc.toString();
            const latestCursor = view.state.selection.main.head;
            onStateChangeRef.current?.(latestContent, latestCursor);
          });
        }
      }

      prevInsertModeRef.current = isInsertMode;
      prevContentRef.current = currentContent;
      prevCursorRef.current = currentCursor;
    }, []);

    useEffect(() => {
      Vim.defineEx("quit", "q", () => {
        onSkipRef.current?.();
      });
      Vim.defineEx("write", "w", () => {});
      Vim.defineEx("wq", "wq", () => {
        onSkipRef.current?.();
      });
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;

      if (viewRef.current) {
        viewRef.current.destroy();
      }

      const cmTheme = buildCodeMirrorTheme(theme);
      themeCompartment.current = new Compartment();

      const state = EditorState.create({
        doc: initialContent,
        selection: { anchor: cursorPos },
        extensions: [
          vim({ status: true }),
          lineNumbers(),
          themeCompartment.current.of(cmTheme),
          EditorView.updateListener.of(handleUpdate),
          EditorView.lineWrapping,
          EditorView.mouseSelectionStyle.of(() => null as never),
          EditorView.domEventHandlers({
            mousedown: (e) => {
              if ((e.target as HTMLElement)?.closest?.(".cm-panels")) return false;
              // Click on editor area: just focus, don't move cursor
              viewRef.current?.focus();
              e.preventDefault();
              return true;
            },
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: containerRef.current,
      });

      viewRef.current = view;
      setFocused(true);
      prevInsertModeRef.current = false;
      prevContentRef.current = initialContent;
      prevCursorRef.current = cursorPos;

      requestAnimationFrame(() => {
        view.focus();
      });

      return () => {
        view.destroy();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challengeKey]);

    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;

      const cmTheme = buildCodeMirrorTheme(theme);
      view.dispatch({
        effects: themeCompartment.current.reconfigure(cmTheme),
      });
    }, [theme]);

    const handleOverlayClick = () => {
      viewRef.current?.focus();
    };

    return (
      <div className="relative w-full rounded-lg overflow-hidden border border-mv-border bg-mv-surface font-mono text-lg focus-within:border-mv-accent transition-colors duration-200 h-[300px]">
        <div ref={containerRef} className="h-full p-4" />
        {/* Unfocused overlay */}
        {!focused && (
          <div
            onClick={handleOverlayClick}
            className="absolute inset-0 flex items-center justify-center cursor-pointer backdrop-blur-[2px] bg-mv-bg/60 transition-opacity duration-200"
          >
            <p className="text-mv-text-muted font-mono text-sm">
              Click here or press any key to focus
            </p>
          </div>
        )}
      </div>
    );
  }
);
