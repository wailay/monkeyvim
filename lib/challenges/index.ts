import type { Challenge, ChallengeSet, VimMode } from "../types";
import { changeSet } from "./change";
import { deleteSet } from "./delete";
import { yankSet } from "./yank";
import { motionSet } from "./motion";
import { findSet } from "./find";
import { refactorSet } from "./refactor";
import { formatSet } from "./format";
import { fixSet } from "./fix";

export const challengeSets: ChallengeSet[] = [
  changeSet,
  deleteSet,
  yankSet,
  motionSet,
  findSet,
  refactorSet,
  formatSet,
  fixSet,
];

export function getChallengeSet(mode: VimMode): ChallengeSet | null {
  if (mode === "random") return null;
  return challengeSets.find((s) => s.mode === mode) ?? null;
}

export function getChallengesForMode(mode: VimMode): Challenge[] {
  if (mode === "random") {
    return getRandomChallenges(20);
  }
  const set = getChallengeSet(mode);
  return set ? [...set.challenges] : [];
}

export function getRandomChallenges(count: number): Challenge[] {
  const all = challengeSets.flatMap((s) => s.challenges);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function shuffleChallenges(challenges: Challenge[]): Challenge[] {
  return [...challenges].sort(() => Math.random() - 0.5);
}
