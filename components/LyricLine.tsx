"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { LineSpec, MarkSpec, TokenSpec } from "@/lib/types";
import { LyricToken } from "./LyricToken";
import { AnnotationOverlay } from "./AnnotationOverlay";

interface Props {
  line: LineSpec;
  position: "prev" | "active" | "next" | "far";
  currentTime: number;
  activeTokenId: string | null;
  density: "follow" | "learn" | "breakdown";
  onTokenClick?: (token: TokenSpec, line: LineSpec) => void;
  onLineClick?: (line: LineSpec) => void;
}

const indexByMark = (marks: MarkSpec[]) => {
  const elisionByToken = new Map<string, Array<{ charStart: number; charEnd: number }>>();
  const weakSet = new Set<string>();
  const stressSet = new Set<string>();
  const soundByToken = new Map<string, string>();
  for (const m of marks) {
    if (m.type === "elision" && m.anchor.tokenId && m.anchor.charStart != null && m.anchor.charEnd != null) {
      const arr = elisionByToken.get(m.anchor.tokenId) ?? [];
      arr.push({ charStart: m.anchor.charStart, charEnd: m.anchor.charEnd });
      elisionByToken.set(m.anchor.tokenId, arr);
    }
    if (m.type === "weak" && m.anchor.tokenId) weakSet.add(m.anchor.tokenId);
    if (m.type === "stress" && m.anchor.tokenId) stressSet.add(m.anchor.tokenId);
    if (m.type === "sound" && m.anchor.tokenId) {
      soundByToken.set(m.anchor.tokenId, m.label ?? "·");
    }
  }
  return { elisionByToken, weakSet, stressSet, soundByToken };
};

export function LyricLine({
  line,
  position,
  currentTime,
  activeTokenId,
  density,
  onTokenClick,
  onLineClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const { elisionByToken, weakSet, stressSet, soundByToken } = useMemo(
    () => indexByMark(line.marks),
    [line.marks],
  );

  const visualState = position === "active" ? "active" : position;

  const variants = {
    prev: { opacity: 0.28, scale: 0.94, y: -36, filter: "blur(1px)" },
    active: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
    next: { opacity: 0.32, scale: 0.94, y: 36, filter: "blur(0.6px)" },
    far: { opacity: 0.12, scale: 0.92, y: 0, filter: "blur(2px)" },
  } as const;

  return (
    <motion.div
      layout
      data-position={visualState}
      initial={false}
      animate={variants[visualState]}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.6 }}
      className="relative w-full"
    >
      <div
        ref={containerRef}
        className={[
          "relative mx-auto inline-block px-3 py-4",
          position === "active" ? "text-3xl sm:text-4xl md:text-5xl leading-[1.5]" : "text-xl sm:text-2xl leading-[1.5]",
        ].join(" ")}
        onClick={() => onLineClick?.(line)}
      >
        <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
          {line.tokens.map((token) => {
            const isActive = activeTokenId === token.id;
            const isPast = currentTime >= token.end;
            const state: "past" | "active" | "future" = isActive
              ? "active"
              : isPast
              ? "past"
              : "future";
            const progress = isActive
              ? Math.min(
                  1,
                  Math.max(0, (currentTime - token.start) / Math.max(token.end - token.start, 0.001)),
                )
              : isPast
              ? 1
              : 0;
            return (
              <LyricToken
                key={token.id}
                ref={(el) => {
                  tokenRefs.current[token.id] = el;
                }}
                token={token}
                state={state}
                progress={progress}
                weak={weakSet.has(token.id) || token.weak}
                stress={stressSet.has(token.id) || token.stress}
                elisionRanges={elisionByToken.get(token.id)}
                soundLabel={soundByToken.get(token.id) ?? null}
                onClick={(t) => onTokenClick?.(t, line)}
                density={density}
              />
            );
          })}
        </div>
        {position === "active" && (
          <AnnotationOverlay
            line={line}
            containerRef={containerRef}
            tokenRefs={tokenRefs}
            density={density}
            activeTokenId={activeTokenId}
          />
        )}
      </div>
    </motion.div>
  );
}
