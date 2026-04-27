import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Serif_SC, Noto_Sans_SC } from 'next/font/google';
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";

const notoSerifSC = Noto_Serif_SC({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
});

const notoSansSC = Noto_Sans_SC({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GPT Image 2 Prompts - 探索 AI 图像生成的无限可能",
  description: "发现并学习最优质的 GPT Image 2 提示词，支持分类浏览、一键复制提示词，让 AI 图像生成变得更简单。",
  keywords: ["GPT Image 2", "AI 图像", "提示词", "Prompt", "AI Art"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${notoSerifSC.variable} ${notoSansSC.variable} antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <SessionProvider>
          <ErrorBoundary>
            <ToastProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </ToastProvider>
          </ErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  );
}
