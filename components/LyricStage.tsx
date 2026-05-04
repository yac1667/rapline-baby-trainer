"use client";

import { AnimatePresence } from "framer-motion";
import type { LineSpec, TokenSpec, ViewDensity } from "@/lib/types";
import { LyricLine } from "./LyricLine";

interface Props {
  lines: LineSpec[];
  activeLineIndex: number;
  activeTokenId: string | null;
  currentTime: number;
  density: ViewDensity;
  onTokenClick?: (token: TokenSpec, line: LineSpec) => void;
  onLineClick?: (line: LineSpec) => void;
}

export function LyricStage({
  lines,
  activeLineIndex,
  activeTokenId,
  currentTime,
  density,
  onTokenClick,
  onLineClick,
}: Props) {
  const prev = lines[activeLineIndex - 1];
  const active = lines[activeLineIndex];
  const next = lines[activeLineIndex + 1];

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-2 px-4 py-12 text-center scroll-shadow-fade">
      <div className="min-h-[3rem] w-full">
        <AnimatePresence mode="popLayout">
          {prev && (
            <LyricLine
              key={prev.id}
              line={prev}
              position="prev"
              currentTime={currentTime}
              activeTokenId={null}
              density="follow"
              onLineClick={onLineClick}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-[10rem] w-full">
        <AnimatePresence mode="popLayout">
          {active && (
            <LyricLine
              key={active.id}
              line={active}
              position="active"
              currentTime={currentTime}
              activeTokenId={activeTokenId}
              density={density}
              onTokenClick={onTokenClick}
              onLineClick={onLineClick}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="min-h-[3rem] w-full">
        <AnimatePresence mode="popLayout">
          {next && (
            <LyricLine
              key={next.id}
              line={next}
              position="next"
              currentTime={currentTime}
              activeTokenId={null}
              density="follow"
              onLineClick={onLineClick}
            />
          )}
        </AnimatePresence>
      </div>

      {active?.hintZh && (
        <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-ink-100/85 backdrop-blur">
          <span className="mr-2 text-accent-stress">●</span>
          {active.hintZh}
        </div>
      )}
    </div>
  );
}
