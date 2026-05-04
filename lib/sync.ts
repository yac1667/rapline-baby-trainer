import type { LineSpec, TokenSpec } from "./types";

export function findActiveLineIndex(lines: LineSpec[], t: number): number {
  if (!lines.length) return -1;
  let lo = 0;
  let hi = lines.length - 1;
  if (t < lines[0].start) return -1;
  if (t >= lines[hi].end) return hi;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const line = lines[mid];
    if (t < line.start) hi = mid - 1;
    else if (t >= line.end) lo = mid + 1;
    else return mid;
  }
  return Math.max(0, hi);
}

export function findActiveTokenIndex(tokens: TokenSpec[], t: number): number {
  if (!tokens.length) return -1;
  let lo = 0;
  let hi = tokens.length - 1;
  if (t < tokens[0].start) return -1;
  if (t >= tokens[hi].end) return hi;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const tk = tokens[mid];
    if (t < tk.start) hi = mid - 1;
    else if (t >= tk.end) lo = mid + 1;
    else return mid;
  }
  return Math.max(0, hi);
}

export function tokenProgress(token: TokenSpec, t: number): number {
  if (t <= token.start) return 0;
  if (t >= token.end) return 1;
  const span = Math.max(token.end - token.start, 0.001);
  return (t - token.start) / span;
}

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
