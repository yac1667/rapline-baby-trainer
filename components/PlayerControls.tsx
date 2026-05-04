"use client";

import type { PlaybackRate, ViewDensity } from "@/lib/types";

interface Props {
  playing: boolean;
  rate: PlaybackRate;
  duration: number;
  currentTime: number;
  loopActive: boolean;
  density: ViewDensity;
  hasAudio: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onBack3: () => void;
  onLoopToggle: () => void;
  onRate: (r: PlaybackRate) => void;
  onSeek: (t: number) => void;
  onDensity: (d: ViewDensity) => void;
}

const RATES: PlaybackRate[] = [0.5, 0.75, 0.9, 1];
const DENSITIES: { value: ViewDensity; label: string }[] = [
  { value: "follow", label: "跟唱" },
  { value: "learn", label: "学习" },
  { value: "breakdown", label: "拆解" },
];

function fmt(t: number) {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerControls({
  playing,
  rate,
  duration,
  currentTime,
  loopActive,
  density,
  hasAudio,
  onToggle,
  onPrev,
  onNext,
  onBack3,
  onLoopToggle,
  onRate,
  onSeek,
  onDensity,
}: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-ink-300 tabular-nums">{fmt(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.1)}
            step={0.05}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-white"
            disabled={!hasAudio}
          />
          <span className="font-mono text-xs text-ink-300 tabular-nums">{fmt(duration)}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {RATES.map((r) => (
              <button
                key={r}
                className="btn-pill"
                data-active={rate === r}
                onClick={() => onRate(r)}
              >
                {r}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-pill" onClick={onBack3} disabled={!hasAudio}>
              ⟲ 3s
            </button>
            <button className="btn-pill" onClick={onPrev} disabled={!hasAudio}>
              上一句
            </button>
            <button
              className="btn-pill !px-5 !py-2 text-base"
              data-active={playing}
              onClick={onToggle}
              disabled={!hasAudio}
            >
              {playing ? "暂停" : "播放"}
            </button>
            <button className="btn-pill" onClick={onNext} disabled={!hasAudio}>
              下一句
            </button>
            <button
              className="btn-pill"
              data-active={loopActive}
              onClick={onLoopToggle}
              disabled={!hasAudio}
            >
              单句循环
            </button>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            {DENSITIES.map((d) => (
              <button
                key={d.value}
                className="rounded-full px-3 py-1 text-xs text-ink-100/80 transition data-[active=true]:bg-white data-[active=true]:text-ink-950"
                data-active={density === d.value}
                onClick={() => onDensity(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
