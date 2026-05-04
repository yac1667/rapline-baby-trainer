import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RapLine · Rap Flow Trainer",
  description:
    "可视化英文说唱跟读训练器：逐词同步、连读/略读/弱读/重音标注、慢速循环。",
};

export const viewport: Viewport = {
  themeColor: "#07070f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-dvh font-display">{children}</body>
    </html>
  );
}
