export type VimMode = "c" | "d" | "y" | "motion" | "find" | "random";

export interface Challenge {
  id: string;
  mode: VimMode;
  prompt: string;
  initialContent: string;
  cursorPos: number;
  expectedContent: string;
  expectedCursorPos: number;
  expectedCommand: string;
  alternativeCommands?: string[];
  tags: string[];
  difficulty: 1 | 2 | 3;
}

export interface ChallengeSet {
  mode: VimMode;
  label: string;
  description: string;
  key: string; // the vim key shown on the card
  challenges: Challenge[];
}

export interface CommandAttempt {
  challengeId: string;
  correct: boolean;
  timeMs: number;
  timestamp: number;
  keystrokeCount: number;
  score: number;
}

export interface SessionStats {
  mode: VimMode;
  startedAt: number;
  attempts: CommandAttempt[];
}

export interface Theme {
  name: string;
  slug: string;
  bg: string;
  accent: string;
  secondary: string;
}

export type AppView = "home" | "practice" | "summary";

export type FontSize = "small" | "medium" | "large";

// Root font-size on <html> — all rem-based sizes scale proportionally
export const fontSizeValues: Record<FontSize, string> = {
  small: "18px",
  medium: "20px",
  large: "24px",
};
