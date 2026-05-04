import type { MarkType, TrackSpec } from "@/lib/types";

export const emptyTrack: TrackSpec = {
  id: "empty-lrc-track",
  title: "RapLine · LRC Flow Trainer",
  subtitle: "导入带内嵌 LRC 的音频后自动生成逐行跟读时间轴",
  segmentStart: 0,
  segmentEnd: 0,
  lines: [],
};

export const markLegend: { type: MarkType; label: string; desc: string; color: string }[] = [
  { type: "liaison", label: "连读", desc: "两词之间蓝色弧线，顺过去不要断开", color: "#3da9ff" },
  { type: "elision", label: "略读", desc: "红色斜杠，词尾轻带或某音弱化", color: "#ff5470" },
  { type: "weak", label: "弱读", desc: "灰色小点，整词不重读", color: "#7a7a9a" },
  { type: "stress", label: "重音", desc: "黄色圆点 / 加粗，节奏落点", color: "#ffd23f" },
  { type: "sound", label: "音变", desc: "小字母提示语流中的实际听感", color: "#c084fc" },
  { type: "breath", label: "换气", desc: "竖线，意群边界 / 一口气分组", color: "#94a3b8" },
  { type: "rhyme", label: "押韵", desc: "尾部下划线，flow 落点", color: "#34d399" }
];
