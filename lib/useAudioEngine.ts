"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlaybackRate } from "./types";

export interface AudioEngineState {
  audioRef: React.RefObject<HTMLAudioElement>;
  playing: boolean;
  duration: number;
  currentTime: number;
  rate: PlaybackRate;
  loop: { start: number; end: number } | null;
  ready: boolean;
  setSrc: (src: string | null) => void;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  nudge: (delta: number) => void;
  setRate: (r: PlaybackRate) => void;
  setLoop: (range: { start: number; end: number } | null) => void;
}

export function useAudioEngine(): AudioEngineState {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [rate, setRateState] = useState<PlaybackRate>(0.75);
  const [loop, setLoopState] = useState<{ start: number; end: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onLoaded = () => {
      setDuration(el.duration || 0);
      setReady(true);
    };
    const onTime = () => setCurrentTime(el.currentTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !loop) return;
    let raf: number;
    const tick = () => {
      if (!el.paused && el.currentTime >= loop.end - 0.02) {
        el.currentTime = loop.start;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop]);

  const setSrc = useCallback((src: string | null) => {
    const el = audioRef.current;
    if (!el) return;
    setReady(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (!src) {
      el.removeAttribute("src");
      el.load();
      return;
    }
    el.src = src;
    el.load();
  }, []);

  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      await el.play();
    } catch {
      // Autoplay can be blocked; user gesture required
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  }, []);

  const seek = useCallback((t: number) => {
    const el = audioRef.current;
    if (!el) return;
    const target = Math.max(0, Math.min(el.duration || t, t));
    el.currentTime = target;
    setCurrentTime(target);
  }, []);

  const nudge = useCallback((delta: number) => {
    const el = audioRef.current;
    if (!el) return;
    const next = Math.max(0, (el.currentTime || 0) + delta);
    el.currentTime = next;
    setCurrentTime(next);
  }, []);

  const setRate = useCallback((r: PlaybackRate) => setRateState(r), []);
  const setLoop = useCallback((range: { start: number; end: number } | null) => setLoopState(range), []);

  return {
    audioRef,
    playing,
    duration,
    currentTime,
    rate,
    loop,
    ready,
    setSrc,
    play,
    pause,
    toggle,
    seek,
    nudge,
    setRate,
    setLoop,
  };
}
