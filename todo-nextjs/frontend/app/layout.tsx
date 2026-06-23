import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo - Next.js",
  description: "카테캠 4기 3차 과제",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
