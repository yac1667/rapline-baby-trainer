"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sampleTrack } from "@/data/sample-track";
import { useAudioEngine } from "@/lib/useAudioEngine";
import { findActiveLineIndex, findActiveTokenIndex } from "@/lib/sync";
import { LyricStage } from "@/components/LyricStage";
import { PlayerControls } from "@/components/PlayerControls";
import { HintCard } from "@/components/HintCard";
import { AudioImport } from "@/components/AudioImport";
import { MarkLegend } from "@/components/MarkLegend";
import type { LineSpec, MarkSpec, TokenSpec, ViewDensity } from "@/lib/types";

export default function HomePage() {
  const audio = useAudioEngine();
  const track = sampleTrack;
  const [density, setDensity] = useState<ViewDensity>("learn");
  const [hintMark, setHintMark] = useState<MarkSpec | null>(null);
  const [smoothTime, setSmoothTime] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const rafRef = useRef<number>();

  // High-frequency time read via rAF for smooth highlighting (timeupdate is too sparse)
  useEffect(() => {
    const tick = () => {
      const el = audio.audioRef.current;
      if (el) setSmoothTime(el.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [audio.audioRef]);

  const lines = track.lines;
  const activeLineIndex = useMemo(() => findActiveLineIndex(lines, smoothTime), [lines, smoothTime]);
  const activeLine = lines[activeLineIndex];
  const activeTokenIndex = useMemo(
    () => (activeLine ? findActiveTokenIndex(activeLine.tokens, smoothTime) : -1),
    [activeLine, smoothTime],
  );
  const activeTokenId = activeLine?.tokens[activeTokenIndex]?.id ?? null;

  const onTokenClick = useCallback(
    (token: TokenSpec, line: LineSpec) => {
      audio.seek(token.start);
      const related = line.marks.find(
        (m) =>
          m.anchor.tokenId === token.id ||
          m.anchor.fromTokenId === token.id ||
          m.anchor.toTokenId === token.id,
      );
      if (related) setHintMark(related);
    },
    [audio],
  );

  const onLineClick = useCallback(
    (line: LineSpec) => {
      audio.seek(line.start);
    },
    [audio],
  );

  const onLoopToggle = useCallback(() => {
    if (audio.loop) {
      audio.setLoop(null);
      return;
    }
    if (!activeLine) return;
    audio.setLoop({ start: activeLine.start, end: activeLine.end });
    audio.seek(activeLine.start);
    void audio.play();
  }, [audio, activeLine]);

  const onPrev = useCallback(() => {
    const idx = Math.max(0, activeLineIndex - 1);
    const line = lines[idx];
    if (line) audio.seek(line.start);
  }, [audio, activeLineIndex, lines]);

  const onNext = useCallback(() => {
    const idx = Math.min(lines.length - 1, activeLineIndex + 1);
    const line = lines[idx];
    if (line) audio.seek(line.start);
  }, [audio, activeLineIndex, lines]);

  const onPlayAround = useCallback(() => {
    if (!hintMark) return;
    const t = hintMark.start ?? activeLine?.start ?? 0;
    audio.seek(Math.max(0, t - 0.3));
    void audio.play();
  }, [audio, hintMark, activeLine]);

  const onPickAudio = useCallback(
    (url: string) => {
      audio.setSrc(url);
      setHasAudio(true);
    },
    [audio],
  );

  const onClearAudio = useCallback(() => {
    audio.setSrc(null);
    setHasAudio(false);
  }, [audio]);

  return (
    <main className="relative min-h-dvh pb-44">
      {/* Hidden audio element */}
      <audio ref={audio.audioRef} preload="auto" />

      <header className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-ink-950 font-black">
              R
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-ink-300">
                RapLine · Flow Trainer
              </div>
              <h1 className="text-lg font-semibold text-white sm:text-xl">
                {track.title}
              </h1>
              {track.subtitle && (
                <p className="text-xs text-ink-300">{track.subtitle}</p>
              )}
            </div>
          </div>
          <AudioImport hasAudio={hasAudio} onPick={onPickAudio} onClear={onClearAudio} />
        </div>

        <MarkLegend />

        {!hasAudio && (
          <div className="mt-1 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-2 text-xs text-amber-100/80">
            尚未导入音频。点击右上“导入本地音频”加载你已合法获得的音频文件，演示标注会按照内置时间轴运行。版权保护内容请勿放入公开仓库。
          </div>
        )}
      </header>

      <section className="relative">
        <div className="beat-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <LyricStage
          lines={lines}
          activeLineIndex={Math.max(0, activeLineIndex)}
          activeTokenId={activeTokenId}
          currentTime={smoothTime}
          density={density}
          onTokenClick={onTokenClick}
          onLineClick={onLineClick}
        />
      </section>

      <HintCard
        mark={hintMark}
        onClose={() => setHintMark(null)}
        onPlayAround={onPlayAround}
      />

      <PlayerControls
        playing={audio.playing}
        rate={audio.rate}
        duration={audio.duration || track.segmentEnd}
        currentTime={smoothTime}
        loopActive={!!audio.loop}
        density={density}
        hasAudio={hasAudio}
        onToggle={audio.toggle}
        onPrev={onPrev}
        onNext={onNext}
        onBack3={() => audio.nudge(-3)}
        onLoopToggle={onLoopToggle}
        onRate={audio.setRate}
        onSeek={audio.seek}
        onDensity={setDensity}
      />
    </main>
  );
}
