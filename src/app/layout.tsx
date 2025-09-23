import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NATUREX",
  description: "원격탐사 멀티모달(위성, 드론, 사진) 자료를 활용한 산림관리 및 환경영향평가 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
