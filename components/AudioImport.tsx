"use client";

import { useRef, useState } from "react";

interface Props {
  hasAudio: boolean;
  onPick: (url: string, name: string) => void;
  onClear: () => void;
}

export function AudioImport({ hasAudio, onPick, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          setName(file.name);
          onPick(url, file.name);
        }}
      />
      <button
        className="btn-pill"
        onClick={() => inputRef.current?.click()}
      >
        {hasAudio ? "更换音频" : "导入本地音频"}
      </button>
      {hasAudio && (
        <>
          <span className="hidden text-xs text-ink-300 sm:inline" title={name}>
            {name.length > 22 ? name.slice(0, 20) + "…" : name}
          </span>
          <button className="btn-pill" onClick={onClear}>
            清除
          </button>
        </>
      )}
    </div>
  );
}
