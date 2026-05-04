"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { LineSpec, MarkSpec } from "@/lib/types";

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

interface Props {
  line: LineSpec;
  containerRef: React.RefObject<HTMLDivElement>;
  tokenRefs: React.MutableRefObject<Record<string, HTMLSpanElement | null>>;
  density: "follow" | "learn" | "breakdown";
  activeTokenId: string | null;
}

export function AnnotationOverlay({ line, containerRef, tokenRefs, density, activeTokenId }: Props) {
  const [, setTick] = useState(0);
  const rafRef = useRef<number>();

  useLayoutEffect(() => {
    const handler = () => {
      cancelAnimationFrame(rafRef.current!);
      rafRef.current = requestAnimationFrame(() => setTick((n) => n + 1));
    };
    handler();
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [line.id, density, activeTokenId]);

  const container = containerRef.current;
  if (!container) return null;

  const containerRect = container.getBoundingClientRect();

  const rectFor = (id: string | undefined): Rect | null => {
    if (!id) return null;
    const el = tokenRefs.current[id];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      left: r.left - containerRect.left,
      right: r.right - containerRect.left,
      top: r.top - containerRect.top,
      bottom: r.bottom - containerRect.top,
      width: r.width,
      height: r.height,
    };
  };

  const visible = (m: MarkSpec) => {
    if (density === "follow") {
      return m.type === "stress";
    }
    if (density === "learn") {
      return m.type !== "rhyme" && m.type !== "sound";
    }
    return true;
  };

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {line.marks.filter(visible).map((mark) => {
        if (mark.type === "liaison") {
          const a = rectFor(mark.anchor.fromTokenId);
          const b = rectFor(mark.anchor.toTokenId);
          if (!a || !b) return null;
          if (Math.abs(a.top - b.top) > 6) return null;
          const x1 = a.right - 4;
          const x2 = b.left + 4;
          const y = Math.max(a.bottom, b.bottom) + 6;
          const cy = y + 14;
          const path = `M ${x1} ${y} C ${x1 + 8} ${cy}, ${x2 - 8} ${cy}, ${x2} ${y}`;
          const isActive = activeTokenId === mark.anchor.fromTokenId || activeTokenId === mark.anchor.toTokenId;
          return (
            <path
              key={mark.id}
              d={path}
              stroke="#3da9ff"
              strokeWidth={isActive ? 2.4 : 1.8}
              strokeLinecap="round"
              fill="none"
              opacity={isActive ? 0.95 : 0.55}
              style={{ filter: isActive ? "drop-shadow(0 0 6px rgba(61,169,255,0.7))" : undefined }}
            />
          );
        }
        if (mark.type === "rhyme") {
          const r = rectFor(mark.anchor.tokenId);
          if (!r) return null;
          return (
            <line
              key={mark.id}
              x1={r.left + 4}
              x2={r.right - 4}
              y1={r.bottom + 4}
              y2={r.bottom + 4}
              stroke="#34d399"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.7}
            />
          );
        }
        if (mark.type === "breath") {
          const r = rectFor(mark.anchor.tokenId);
          if (!r) return null;
          const x = r.right + 4;
          return (
            <line
              key={mark.id}
              x1={x}
              x2={x}
              y1={r.top + 4}
              y2={r.bottom - 4}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.7}
            />
          );
        }
        if (mark.type === "weak") {
          const r = rectFor(mark.anchor.tokenId);
          if (!r) return null;
          return (
            <circle
              key={mark.id}
              cx={(r.left + r.right) / 2}
              cy={r.top - 6}
              r={1.6}
              fill="#7a7a9a"
              opacity={0.85}
            />
          );
        }
        return null;
      })}
    </svg>
  );
}
