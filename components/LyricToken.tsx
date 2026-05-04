"use client";

import { forwardRef } from "react";
import type { TokenSpec } from "@/lib/types";

interface Props {
  token: TokenSpec;
  state: "past" | "active" | "future";
  progress: number;
  weak?: boolean;
  stress?: boolean;
  elisionRanges?: Array<{ charStart: number; charEnd: number }>;
  soundLabel?: string | null;
  onClick?: (token: TokenSpec) => void;
  density: "follow" | "learn" | "breakdown";
}

export const LyricToken = forwardRef<HTMLSpanElement, Props>(function LyricToken(
  { token, state, progress, weak, stress, elisionRanges, soundLabel, onClick, density },
  ref,
) {
  const showElision = density !== "follow" && elisionRanges && elisionRanges.length > 0;
  const showWeak = density !== "follow" && weak;
  const showStress = stress;
  const showSound = density === "breakdown" && soundLabel;

  return (
    <span
      ref={ref}
      data-token-id={token.id}
      data-active={state === "active"}
      data-state={state}
      data-weak={showWeak ? "true" : "false"}
      data-stress={showStress ? "true" : "false"}
      className="token cursor-pointer select-none"
      style={{ ["--token-progress" as never]: progress }}
      onClick={() => onClick?.(token)}
    >
      {showSound && (
        <span
          className="absolute left-1/2 -top-4 -translate-x-1/2 text-[10px] font-mono text-accent-sound/90"
          aria-hidden
        >
          {soundLabel}
        </span>
      )}
      {showStress && state === "active" && (
        <span
          className="absolute left-1/2 -top-2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-accent-stress shadow-[0_0_10px_rgba(255,210,63,0.7)]"
          aria-hidden
        />
      )}
      <span className="relative">
        {renderTextWithElision(token.text, showElision ? elisionRanges : undefined)}
      </span>
    </span>
  );
});

function renderTextWithElision(
  text: string,
  ranges?: Array<{ charStart: number; charEnd: number }>,
) {
  if (!ranges || !ranges.length) return text;
  const sorted = [...ranges].sort((a, b) => a.charStart - b.charStart);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach((r, i) => {
    if (r.charStart > cursor) out.push(text.slice(cursor, r.charStart));
    const slice = text.slice(r.charStart, r.charEnd);
    out.push(
      <span key={`e-${i}`} className="relative inline-block opacity-60">
        {slice}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] -rotate-12 bg-accent-elision/90"
          style={{ transform: "rotate(-22deg)" }}
        />
      </span>,
    );
    cursor = r.charEnd;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
