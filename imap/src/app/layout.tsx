import type { Metadata } from "next";
import localFont from "next/font/local";
import { Noto_Serif_SC, Noto_Sans_SC } from 'next/font/google';
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/auth/ThemeProvider";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import { AgentationWrapper } from "@/components/AgentationWrapper";

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
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('imap-theme');var r=t==='system'||!t?(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):(t==='light'?'light':'dark');document.documentElement.setAttribute('data-theme',r)}catch(e){}})()` }} />
      </head>
      <body
        className={`${geistSans.variable} ${notoSerifSC.variable} ${notoSansSC.variable} antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative' }}
      >
        {/* Ink wash background decoration */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', color: 'var(--ink-wash)' }}>
          {/* Distant mountain silhouettes — top right */}
          <svg style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '50vh', opacity: 0.03 }} viewBox="0 0 600 400" preserveAspectRatio="xMidYMin slice">
            <path d="M0,400 L80,280 L140,320 L220,200 L280,260 L350,140 L400,200 L460,100 L520,180 L600,60 L600,400Z" fill="currentColor" />
          </svg>
          {/* Rolling hills — bottom left */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '35vh', opacity: 0.025 }} viewBox="0 0 500 300" preserveAspectRatio="xMidYMax slice">
            <path d="M0,300 L0,180 C60,140 120,160 180,130 C240,100 300,120 360,90 C420,60 460,80 500,50 L500,300Z" fill="currentColor" />
          </svg>
          {/* Cinnabar seal stamp — bottom right */}
          <svg style={{ position: 'absolute', bottom: '8%', right: '6%', width: 64, height: 64, opacity: 0.06, transform: 'rotate(-12deg)' }} viewBox="0 0 64 64">
            <rect x="4" y="4" width="56" height="56" rx="4" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <text x="32" y="40" textAnchor="middle" fontSize="20" fill="var(--accent)">墨</text>
          </svg>
          {/* Ink splash — top left */}
          <svg style={{ position: 'absolute', top: '10%', left: '3%', width: 120, height: 120, opacity: 0.022 }} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="30" fill="currentColor" />
            <circle cx="40" cy="50" r="15" fill="currentColor" />
            <circle cx="80" cy="45" r="10" fill="currentColor" />
            <circle cx="55" cy="80" r="12" fill="currentColor" />
          </svg>
        </div>

        <ThemeProvider>
          <AuthProvider>
          <ErrorBoundary>
            <ToastProvider>
              <Header />
              <main className="flex-1" style={{ position: 'relative', zIndex: 1 }}>
                {children}
              </main>
              <AgentationWrapper />
            </ToastProvider>
          </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
