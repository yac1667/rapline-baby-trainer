"use client";

import { markLegend } from "@/data/sample-track";

export function MarkLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4">
      {markLegend.map((m) => (
        <span
          key={m.type}
          className="chip"
          title={m.desc}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: m.color }}
          />
          {m.label}
        </span>
      ))}
    </div>
  );
}
