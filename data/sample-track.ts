import type { TrackSpec } from "@/lib/types";

// NOTE: 这是产品演示用的占位练习内容，由本项目原创编写，
// 不包含任何受版权保护的歌词或音频。用户可在页面顶部"导入音频"
// 加载本地合法素材，并通过未来的编辑器界面校准时间轴。
export const sampleTrack: TrackSpec = {
  id: "demo-flow-01",
  title: "Flow Marks Demo · Practice Line",
  subtitle: "演示标注系统：连读 · 略读 · 弱读 · 重音 · 音变 · 换气",
  artist: "RapLine Trainer",
  bpm: 128,
  segmentStart: 0,
  segmentEnd: 28,
  lines: [
    {
      id: "L1",
      start: 0.6,
      end: 4.2,
      hintZh: "前两个词连起来，第 3 个词重音落拍，最后词尾轻带不要念满。",
      tokens: [
        { id: "L1-w1", text: "step", start: 0.6, end: 0.95 },
        { id: "L1-w2", text: "up", start: 0.95, end: 1.25 },
        { id: "L1-w3", text: "to", start: 1.25, end: 1.45, weak: true },
        { id: "L1-w4", text: "the", start: 1.45, end: 1.62, weak: true },
        { id: "L1-w5", text: "mic", start: 1.62, end: 2.05, stress: true },
        { id: "L1-w6", text: "and", start: 2.05, end: 2.28, weak: true },
        { id: "L1-w7", text: "ride", start: 2.28, end: 2.7 },
        { id: "L1-w8", text: "the", start: 2.7, end: 2.88, weak: true },
        { id: "L1-w9", text: "beat", start: 2.88, end: 3.45, stress: true }
      ],
      marks: [
        { id: "L1-m1", type: "liaison", anchor: { fromTokenId: "L1-w1", toTokenId: "L1-w2" }, start: 0.85, end: 1.1, noteZh: "连读：两个词不要断开，顺过去当一拍念。" },
        { id: "L1-m2", type: "weak", anchor: { tokenId: "L1-w3" }, noteZh: "弱读：to 不要念满，靠近 schwa。" },
        { id: "L1-m3", type: "weak", anchor: { tokenId: "L1-w4" }, noteZh: "弱读：the 轻带过去。" },
        { id: "L1-m4", type: "stress", anchor: { tokenId: "L1-w5" }, noteZh: "重音：mic 压在节拍上。" },
        { id: "L1-m5", type: "elision", anchor: { tokenId: "L1-w7", charStart: 3, charEnd: 4 }, noteZh: "略读：ride 词尾 d 不完全爆破，轻带。" },
        { id: "L1-m6", type: "stress", anchor: { tokenId: "L1-w9" }, noteZh: "重音 + 句末押韵落点。" }
      ]
    },
    {
      id: "L2",
      start: 4.4,
      end: 8.4,
      hintZh: "前 3 个词压成一组连读，中间换气，最后两个词再连成一拍。",
      tokens: [
        { id: "L2-w1", text: "got", start: 4.4, end: 4.7 },
        { id: "L2-w2", text: "an", start: 4.7, end: 4.92, weak: true },
        { id: "L2-w3", text: "idea", start: 4.92, end: 5.55, stress: true },
        { id: "L2-w4", text: "in", start: 5.55, end: 5.78, weak: true },
        { id: "L2-w5", text: "my", start: 5.78, end: 6.0 },
        { id: "L2-w6", text: "head", start: 6.0, end: 6.5, stress: true },
        { id: "L2-w7", text: "running", start: 6.7, end: 7.25 },
        { id: "L2-w8", text: "out", start: 7.25, end: 7.55 },
        { id: "L2-w9", text: "of", start: 7.55, end: 7.7, weak: true },
        { id: "L2-w10", text: "thread", start: 7.7, end: 8.25, stress: true }
      ],
      marks: [
        { id: "L2-m1", type: "liaison", anchor: { fromTokenId: "L2-w1", toTokenId: "L2-w2" }, noteZh: "连读：got + an 顺成一拍。" },
        { id: "L2-m2", type: "liaison", anchor: { fromTokenId: "L2-w2", toTokenId: "L2-w3" }, noteZh: "连读：an + idea 中间出现轻 n 滑音。" },
        { id: "L2-m3", type: "sound", anchor: { tokenId: "L2-w7", charStart: 5, charEnd: 7 }, label: "n", noteZh: "音变：running 词尾 -ng 在快语流里近似轻 n。" },
        { id: "L2-m4", type: "liaison", anchor: { fromTokenId: "L2-w8", toTokenId: "L2-w9" }, noteZh: "连读：out + of 常合成 outta 感。" },
        { id: "L2-m5", type: "elision", anchor: { tokenId: "L2-w9" }, noteZh: "略读：of 的 v 在快语流里几乎不发。" },
        { id: "L2-m6", type: "breath", anchor: { tokenId: "L2-w6" }, noteZh: "换气：在 head 之后小停顿，重新进拍。" },
        { id: "L2-m7", type: "rhyme", anchor: { tokenId: "L2-w10" }, noteZh: "押韵：thread 与上一行 beat 形成 flow 落点。" }
      ]
    },
    {
      id: "L3",
      start: 8.6,
      end: 12.4,
      hintZh: "整句节奏要快，前半段轻带，后半段重音密集。",
      tokens: [
        { id: "L3-w1", text: "every", start: 8.6, end: 8.95 },
        { id: "L3-w2", text: "line", start: 8.95, end: 9.3, stress: true },
        { id: "L3-w3", text: "I", start: 9.3, end: 9.45, weak: true },
        { id: "L3-w4", text: "spit", start: 9.45, end: 9.85, stress: true },
        { id: "L3-w5", text: "is", start: 9.85, end: 10.05, weak: true },
        { id: "L3-w6", text: "a", start: 10.05, end: 10.2, weak: true },
        { id: "L3-w7", text: "step", start: 10.2, end: 10.55 },
        { id: "L3-w8", text: "ahead", start: 10.55, end: 11.15, stress: true }
      ],
      marks: [
        { id: "L3-m1", type: "elision", anchor: { tokenId: "L3-w4", charStart: 3, charEnd: 4 }, noteZh: "略读：spit 词尾 t 不完全爆破。" },
        { id: "L3-m2", type: "liaison", anchor: { fromTokenId: "L3-w5", toTokenId: "L3-w6" }, noteZh: "连读：is + a 顺成 izə 感。" },
        { id: "L3-m3", type: "liaison", anchor: { fromTokenId: "L3-w7", toTokenId: "L3-w8" }, noteZh: "连读：step + ahead 词尾 p 与下一个元音黏住。" },
        { id: "L3-m4", type: "stress", anchor: { tokenId: "L3-w8" }, noteZh: "重音：句末 ahead 落在重拍。" }
      ]
    },
    {
      id: "L4",
      start: 12.6,
      end: 16.5,
      hintZh: "末句保持气口稳定，最后的押韵不要太重，flow 收住。",
      tokens: [
        { id: "L4-w1", text: "keep", start: 12.6, end: 13.0 },
        { id: "L4-w2", text: "it", start: 13.0, end: 13.2, weak: true },
        { id: "L4-w3", text: "tight", start: 13.2, end: 13.7, stress: true },
        { id: "L4-w4", text: "and", start: 13.7, end: 13.92, weak: true },
        { id: "L4-w5", text: "let", start: 13.92, end: 14.18 },
        { id: "L4-w6", text: "the", start: 14.18, end: 14.32, weak: true },
        { id: "L4-w7", text: "rhythm", start: 14.32, end: 14.85 },
        { id: "L4-w8", text: "lead", start: 14.85, end: 15.45, stress: true }
      ],
      marks: [
        { id: "L4-m1", type: "liaison", anchor: { fromTokenId: "L4-w1", toTokenId: "L4-w2" }, noteZh: "连读：keep + it 顺成一拍。" },
        { id: "L4-m2", type: "elision", anchor: { tokenId: "L4-w3", charStart: 4, charEnd: 5 }, noteZh: "略读：tight 词尾 t 弱化。" },
        { id: "L4-m3", type: "weak", anchor: { tokenId: "L4-w6" }, noteZh: "弱读：the 轻带。" },
        { id: "L4-m4", type: "rhyme", anchor: { tokenId: "L4-w8" }, noteZh: "押韵：lead 与 ahead 收尾。" },
        { id: "L4-m5", type: "breath", anchor: { tokenId: "L4-w8" }, noteZh: "句末换气，准备下一段。" }
      ]
    }
  ]
};

export const markLegend: { type: import("@/lib/types").MarkType; label: string; desc: string; color: string }[] = [
  { type: "liaison", label: "连读", desc: "两词之间蓝色弧线，顺过去不要断开", color: "#3da9ff" },
  { type: "elision", label: "略读", desc: "红色斜杠，词尾轻带或某音弱化", color: "#ff5470" },
  { type: "weak", label: "弱读", desc: "灰色小点，整词不重读", color: "#7a7a9a" },
  { type: "stress", label: "重音", desc: "黄色圆点 / 加粗，节奏落点", color: "#ffd23f" },
  { type: "sound", label: "音变", desc: "小字母提示语流中的实际听感", color: "#c084fc" },
  { type: "breath", label: "换气", desc: "竖线，意群边界 / 一口气分组", color: "#94a3b8" },
  { type: "rhyme", label: "押韵", desc: "尾部下划线，flow 落点", color: "#34d399" }
];
