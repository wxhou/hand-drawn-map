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
  title: "墨辞 — GPT Image 2 提示词",
  description: "发现并学习最优质的 GPT Image 2 提示词，支持分类浏览、一键复制提示词，让 AI 图像生成变得更简单。",
  keywords: ["GPT Image 2", "AI 图像", "提示词", "Prompt", "AI Art", "墨辞"],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('imap-theme');var r=t==='system'||!t?(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'):(t==='light'?'light':'dark');document.documentElement.setAttribute('data-theme',r)}catch(e){}})()` }} />
      </head>
      <body
        className={`${geistSans.variable} ${notoSerifSC.variable} ${notoSansSC.variable} antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative' }}
      >
        {/* Ink line drawing decoration — 白描风格 */}
        <svg aria-hidden="true" className="ink-line-decor" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {/* Mountain outline — top right */}
          <path d="M600,320 C620,310 640,280 660,260 C675,245 680,250 700,230 C720,210 730,220 750,195 C770,175 780,185 800,160 C820,140 830,150 860,125 C880,110 890,120 920,95 C940,80 950,90 980,65 C1000,50 1010,60 1040,40 C1060,28 1070,35 1100,20 C1120,10 1130,18 1160,5 C1180,0 1200,5 1200,0"
            fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"
            style={{ color: 'var(--ink-wash)', opacity: 0.06 }} />
          <path d="M700,320 C715,305 730,280 750,260 C765,248 770,255 790,238 C810,220 818,228 840,210 C858,196 865,205 885,188 C905,172 912,180 935,162 C955,148 962,156 985,140 C1005,126 1012,134 1035,118"
            fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"
            style={{ color: 'var(--ink-wash)', opacity: 0.04 }} />
          {/* Distant hill — bottom left */}
          <path d="M-20,600 C0,560 30,540 60,510 C90,485 110,495 140,470 C170,448 190,458 220,435 C250,415 270,425 300,400 C330,382 345,390 370,372 C400,355 415,363 440,345 C470,330 480,338 500,320"
            fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round"
            style={{ color: 'var(--ink-wash)', opacity: 0.05 }} />
          <path d="M40,600 C60,575 90,555 120,530 C150,508 170,518 200,495 C230,475 245,485 280,462 C310,442 325,450 360,430 C390,414 400,420 430,400"
            fill="none" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round"
            style={{ color: 'var(--ink-wash)', opacity: 0.035 }} />
          {/* Cloud wisp lines */}
          <path d="M150,430 Q200,420 260,425" fill="none" stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" style={{ color: 'var(--ink-wash)', opacity: 0.03 }} />
          <path d="M750,180 Q820,170 890,175" fill="none" stroke="currentColor" strokeWidth="0.3" strokeLinecap="round" style={{ color: 'var(--ink-wash)', opacity: 0.03 }} />
          <path d="M900,90 Q950,82 1010,86" fill="none" stroke="currentColor" strokeWidth="0.25" strokeLinecap="round" style={{ color: 'var(--ink-wash)', opacity: 0.025 }} />
          {/* Small seal stamp — bottom right, just outline */}
          <g style={{ color: 'var(--accent)', opacity: 0.05, transform: 'translate(1080px, 520px) rotate(-6deg)' }}>
            <rect x="0" y="0" width="40" height="40" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <text x="20" y="28" textAnchor="middle" fontSize="18" fill="currentColor" style={{ fontWeight: 700 }}>墨</text>
          </g>
        </svg>

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
