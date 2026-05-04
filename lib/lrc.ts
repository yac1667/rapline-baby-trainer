import type { LineSpec, MarkSpec, TokenSpec, TrackSpec } from "./types";

interface LrcLine {
  start: number;
  text: string;
}

const FUNCTION_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "but",
  "cause",
  "i",
  "in",
  "is",
  "me",
  "my",
  "no",
  "on",
  "or",
  "she",
  "that",
  "the",
  "to",
  "was",
  "when",
]);

function parseTime(raw: string): number {
  const [min, sec] = raw.split(":");
  return Number(min) * 60 + Number(sec);
}

function cleanWord(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9']/g, "");
}

function tokenId(lineId: string, index: number) {
  return `${lineId}-w${index + 1}`;
}

function buildTokens(lineId: string, text: string, start: number, end: number): TokenSpec[] {
  const words = text.split(/\s+/).filter(Boolean);
  const totalWeight = words.reduce((sum, word) => sum + Math.max(2, cleanWord(word).length), 0);
  let cursor = start;

  return words.map((word, index) => {
    const isLast = index === words.length - 1;
    const weight = Math.max(2, cleanWord(word).length);
    const tokenEnd = isLast ? end : cursor + ((end - start) * weight) / Math.max(totalWeight, 1);
    const token = {
      id: tokenId(lineId, index),
      text: word,
      start: cursor,
      end: tokenEnd,
      weak: FUNCTION_WORDS.has(cleanWord(word)),
      stress: !FUNCTION_WORDS.has(cleanWord(word)) && cleanWord(word).length >= 5,
    };
    cursor = tokenEnd;
    return token;
  });
}

function buildMarks(lineId: string, tokens: TokenSpec[]): MarkSpec[] {
  const marks: MarkSpec[] = [];
  tokens.forEach((token, index) => {
    const word = cleanWord(token.text);
    if (token.weak) {
      marks.push({
        id: `${lineId}-m-weak-${index}`,
        type: "weak",
        anchor: { tokenId: token.id },
        noteZh: "弱读：这个词在快语流里轻带，不要抢重拍。",
      });
    }
    if (token.stress) {
      marks.push({
        id: `${lineId}-m-stress-${index}`,
        type: "stress",
        anchor: { tokenId: token.id },
        noteZh: "重音：这里承载主要信息，跟着节拍压清楚。",
      });
    }
    if ((word.endsWith("in'") || word.endsWith("ing")) && word.length > 4) {
      marks.push({
        id: `${lineId}-m-sound-${index}`,
        type: "sound",
        anchor: { tokenId: token.id },
        label: "n",
        noteZh: "音变：快语流里词尾 -ing 常会弱化得更轻。",
      });
    }
  });

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const current = cleanWord(tokens[index].text);
    const next = cleanWord(tokens[index + 1].text);
    if (!current || !next) continue;
    if (/[aeiou]$/.test(current) || /^[aeiou]/.test(next)) {
      marks.push({
        id: `${lineId}-m-link-${index}`,
        type: "liaison",
        anchor: {
          fromTokenId: tokens[index].id,
          toTokenId: tokens[index + 1].id,
        },
        noteZh: "连读：前后两个词顺过去，中间不要断开。",
      });
    }
  }

  if (tokens.length) {
    const last = tokens[tokens.length - 1];
    marks.push({
      id: `${lineId}-m-rhyme`,
      type: "rhyme",
      anchor: { tokenId: last.id },
      noteZh: "句尾落点：收住尾音，准备接下一句。",
    });
  }

  return marks;
}

export function parseLrc(text: string): LrcLine[] {
  return text
    .split(/\r?\n/)
    .flatMap((line) => {
      const stamps = [...line.matchAll(/\[(\d{2}:\d{2}(?:\.\d{1,3})?)\]/g)];
      const lyric = line.replace(/\[[^\]]+\]/g, "").trim();
      if (!stamps.length) return [];
      return stamps.map((stamp) => ({ start: parseTime(stamp[1]), text: lyric }));
    })
    .sort((a, b) => a.start - b.start);
}

export function buildTrackFromLrc(lrcText: string, fileName: string): TrackSpec | null {
  const lrcLines = parseLrc(lrcText).filter((line) => line.text);
  if (!lrcLines.length) return null;

  const lines: LineSpec[] = lrcLines.map((entry, index) => {
    const next = lrcLines.find((candidate) => candidate.start > entry.start);
    const end = next?.start ?? entry.start + 2.2;
    const lineId = `L${index + 1}`;
    const tokens = buildTokens(lineId, entry.text, entry.start, Math.max(entry.start + 0.4, end));
    return {
      id: lineId,
      start: entry.start,
      end: Math.max(entry.start + 0.4, end),
      hintZh: "来自内嵌 LRC 时间轴；词级高亮按词长估算。",
      tokens,
      marks: buildMarks(lineId, tokens),
    };
  });

  return {
    id: "embedded-lrc",
    title: "Embedded LRC Drill",
    subtitle: `已读取 ${fileName} 内嵌 LRC · 自动跟随整首时间轴`,
    segmentStart: lines[0].start,
    segmentEnd: lines[lines.length - 1].end,
    lines,
  };
}

function atomType(view: DataView, offset: number) {
  return String.fromCharCode(
    view.getUint8(offset + 4),
    view.getUint8(offset + 5),
    view.getUint8(offset + 6),
    view.getUint8(offset + 7),
  );
}

export function extractM4aLyrics(buffer: ArrayBuffer): string | null {
  const view = new DataView(buffer);
  const decoder = new TextDecoder("utf-8");
  const lyricType = String.fromCharCode(0xa9, 0x6c, 0x79, 0x72);

  function scan(start: number, end: number): string | null {
    let offset = start;
    while (offset + 8 <= end) {
      const size = view.getUint32(offset);
      const type = atomType(view, offset);
      if (size < 8 || offset + size > end) return null;

      if (type === lyricType) {
        let child = offset + 8;
        while (child + 8 <= offset + size) {
          const childSize = view.getUint32(child);
          const childType = atomType(view, child);
          if (childSize < 8 || child + childSize > offset + size) return null;
          if (childType === "data" && childSize > 16) {
            return decoder.decode(buffer.slice(child + 16, child + childSize));
          }
          child += childSize;
        }
      }

      const childStart = type === "meta" ? offset + 12 : offset + 8;
      if (["moov", "udta", "meta", "ilst"].includes(type)) {
        const found = scan(childStart, offset + size);
        if (found) return found;
      }
      offset += size;
    }
    return null;
  }

  return scan(0, buffer.byteLength);
}
