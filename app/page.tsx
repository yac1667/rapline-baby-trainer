"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { emptyTrack } from "@/data/sample-track";
import { useAudioEngine } from "@/lib/useAudioEngine";
import { findActiveLineIndex, findActiveTokenIndex } from "@/lib/sync";
import { LyricStage } from "@/components/LyricStage";
import { PlayerControls } from "@/components/PlayerControls";
import { HintCard } from "@/components/HintCard";
import { AudioImport } from "@/components/AudioImport";
import { MarkLegend } from "@/components/MarkLegend";
import { buildTrackFromLrc, extractM4aLyrics } from "@/lib/lrc";
import type { LineSpec, MarkSpec, TokenSpec, ViewDensity } from "@/lib/types";

export default function HomePage() {
  const audio = useAudioEngine();
  const [track, setTrack] = useState(emptyTrack);
  const [density, setDensity] = useState<ViewDensity>("learn");
  const [hintMark, setHintMark] = useState<MarkSpec | null>(null);
  const [smoothTime, setSmoothTime] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const [lyricStatus, setLyricStatus] = useState<"idle" | "embedded" | "missing">("idle");
  const autoSeekedRef = useRef(false);
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

  useEffect(() => {
    if (!hasAudio || !audio.ready || autoSeekedRef.current) return;
    autoSeekedRef.current = true;
    audio.seek(track.segmentStart);
  }, [audio, hasAudio, track.segmentStart]);

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
    async (url: string, name: string, file: File) => {
      autoSeekedRef.current = false;
      audio.setSrc(url);
      setHasAudio(true);
      setLyricStatus("missing");
      try {
        const lyrics = extractM4aLyrics(await file.arrayBuffer());
        const embeddedTrack = lyrics ? buildTrackFromLrc(lyrics, name) : null;
        if (embeddedTrack) {
          setTrack(embeddedTrack);
          setLyricStatus("embedded");
          return;
        }
      } catch {
        // Metadata parsing can fail on malformed files; show an explicit missing-lyrics state.
      }
      setTrack(emptyTrack);
    },
    [audio],
  );

  const onClearAudio = useCallback(() => {
    autoSeekedRef.current = false;
    audio.setSrc(null);
    setHasAudio(false);
    setTrack(emptyTrack);
    setLyricStatus("idle");
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
            尚未导入音频。点击右上"导入本地音频"加载已内嵌 LRC 的音频文件，页面会按 LRC 时间轴自动跟随。
          </div>
        )}
        {hasAudio && lyricStatus === "embedded" && (
          <div className="mt-1 rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-2 text-xs text-emerald-100/80">
            已读取音频内嵌 LRC，并使用其中的完整时间轴生成当前练习。
          </div>
        )}
        {hasAudio && lyricStatus === "missing" && (
          <div className="mt-1 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-2 text-xs text-amber-100/80">
            未在音频内读到可用的时间戳歌词。请先内嵌 LRC，或导入已带 LRC 的音频文件。
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
