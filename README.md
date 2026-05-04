# RapLine · Rap Flow Trainer

一个面向中文母语用户的网页说唱跟读训练器。第一版只服务一个场景：把一段原本听不清、跟不上的英文说唱，拆成可视化、可重复、可跟读的训练体验。

## Stack

- Next.js 16 (App Router) + React 18 + TypeScript
- Tailwind CSS
- Framer Motion (歌词切行 / Token 高亮 / 提示卡动效)
- HTMLAudioElement + requestAnimationFrame 高频同步

## Flow Marks 标注系统

| 类型 | 视觉 | 含义 |
| --- | --- | --- |
| 连读 liaison | 蓝色 SVG 弧线 | 两词不要断开，顺过去 |
| 略读 elision | 红色斜杠覆盖在字母上 | 词尾或某音弱化 |
| 弱读 weak | 灰色小点、字号缩小 | 整词不重读 |
| 重音 stress | 黄色圆点 + 加粗 + 进度 underline | 节奏落点 |
| 音变 sound | 紫色小字母 (d/ə/y/w/n) | 实际听感提示 |
| 换气 breath | 灰白竖线 | 意群边界 / 一口气分组 |
| 押韵 rhyme | 绿色尾部下划线 | flow 落点 |

视图密度三档：

- **跟唱 (follow)**：仅当前词高亮 + 重音
- **学习 (learn)** 默认：连读 / 略读 / 弱读 / 重音
- **拆解 (breakdown)**：全部标注 + 音变小字母

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`，点击右上角 **导入本地音频** 加载你已合法获得的音频文件即可使用。

## 版权说明

仓库内的演示数据 `data/sample-track.ts` 是项目原创编写的占位练习内容，用于展示 Flow Marks 标注系统。**不要将受版权保护的歌词或音频文件提交到公开仓库。** 真实片段（例如《Baby》说唱段）请通过本地导入音频 + 自备时间轴/标注 JSON 的方式使用，或在取得授权后再发布。

## 后续路线

- 内容编辑后台：波形辅助 + 逐词打点 + 标注录入
- 拆句循环 / A-B 循环 / 录音回放
- 0.75x → 0.9x → 1x 训练台阶 + 完成反馈
- Remotion 教学短视频导出
