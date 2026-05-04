export type MarkType =
  | "liaison"
  | "elision"
  | "weak"
  | "stress"
  | "sound"
  | "breath"
  | "rhyme";

export interface SyllableSpec {
  text: string;
  start: number;
  end: number;
  stress?: boolean;
  reduced?: boolean;
}

export interface TokenSpec {
  id: string;
  text: string;
  start: number;
  end: number;
  syllables?: SyllableSpec[];
  weak?: boolean;
  stress?: boolean;
}

export interface MarkAnchor {
  tokenId?: string;
  fromTokenId?: string;
  toTokenId?: string;
  charStart?: number;
  charEnd?: number;
}

export interface MarkSpec {
  id: string;
  type: MarkType;
  anchor: MarkAnchor;
  start?: number;
  end?: number;
  label?: string;
  noteZh?: string;
}

export interface LineSpec {
  id: string;
  start: number;
  end: number;
  tokens: TokenSpec[];
  marks: MarkSpec[];
  hintZh?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
}

export interface TrackSpec {
  id: string;
  title: string;
  subtitle?: string;
  artist?: string;
  bpm?: number;
  audioSrc?: string;
  segmentStart: number;
  segmentEnd: number;
  lines: LineSpec[];
}

export type ViewDensity = "follow" | "learn" | "breakdown";
export type PlaybackRate = 0.5 | 0.75 | 0.9 | 1;
