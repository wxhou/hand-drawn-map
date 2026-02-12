import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google';
import { Agentation } from "agentation";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "手绘地图 - 把有意义的地方变成礼物",
  description: "用 AI 将任何地点转换为独特的手绘风格艺术地图，适合作为生日、纪念日、婚礼等场合的特别礼物",
  keywords: ["手绘地图", "AI地图", "礼物", "个性化", "艺术", "旅行纪念"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {process.env.NODE_ENV === "development" && <Agentation />}
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
