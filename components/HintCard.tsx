"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { MarkSpec, MarkType } from "@/lib/types";

const TYPE_LABEL: Record<MarkType, { label: string; color: string }> = {
  liaison: { label: "连读", color: "#3da9ff" },
  elision: { label: "略读", color: "#ff5470" },
  weak: { label: "弱读", color: "#7a7a9a" },
  stress: { label: "重音", color: "#ffd23f" },
  sound: { label: "音变", color: "#c084fc" },
  breath: { label: "换气", color: "#94a3b8" },
  rhyme: { label: "押韵", color: "#34d399" },
};

interface Props {
  mark: MarkSpec | null;
  onClose?: () => void;
  onPlayAround?: () => void;
}

export function HintCard({ mark, onClose, onPlayAround }: Props) {
  return (
    <AnimatePresence>
      {mark && (
        <motion.div
          key={mark.id}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          className="pointer-events-auto fixed inset-x-3 bottom-28 z-30 mx-auto max-w-md rounded-2xl border border-white/10 bg-ink-900/85 p-4 shadow-glow backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: TYPE_LABEL[mark.type].color }}
              />
              <span className="text-sm font-semibold text-white">
                {TYPE_LABEL[mark.type].label}
              </span>
            </div>
            <button
              className="text-xs text-ink-300 hover:text-white"
              onClick={onClose}
            >
              关闭
            </button>
          </div>
          {mark.noteZh && (
            <p className="mt-2 text-sm leading-relaxed text-ink-100/90">{mark.noteZh}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-pill" onClick={onPlayAround}>
              播放这段
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
