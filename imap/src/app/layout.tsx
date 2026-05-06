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
        <div aria-hidden="true" className="ink-bg-decor" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', color: 'var(--ink-wash)' }}>
          {/* Layered mountain landscape — right side, multiple depth layers */}
          <svg style={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '70vh', opacity: 0.04 }} viewBox="0 0 800 500" preserveAspectRatio="xMidYMin slice">
            {/* Far mountains — lightest */}
            <path d="M0,500 L0,350 C30,340 50,310 80,290 C100,275 110,280 130,260 C155,235 165,245 185,220 C210,190 225,200 250,175 C270,155 285,165 310,140 C335,115 350,130 380,105 C400,88 410,95 435,78 C460,60 475,72 500,55 C520,42 535,50 560,35 C585,22 600,30 630,18 C660,8 680,15 710,5 C740,0 770,8 800,0 L800,500Z" fill="currentColor" opacity="0.3" />
            {/* Mid mountains */}
            <path d="M0,500 L0,380 C40,370 70,340 110,310 C140,288 160,295 190,270 C225,240 240,255 275,225 C300,205 315,215 345,190 C375,165 390,175 420,155 C450,138 465,148 500,125 C530,108 545,118 580,95 C610,78 625,88 660,70 C695,55 710,65 745,48 C775,35 790,42 800,30 L800,500Z" fill="currentColor" opacity="0.5" />
            {/* Near mountains — darkest */}
            <path d="M0,500 L0,410 C50,395 80,365 130,340 C165,322 185,335 220,308 C260,278 275,295 320,265 C350,245 370,258 410,232 C445,212 460,225 500,200 C535,182 555,192 595,168 C625,152 645,162 680,140 C715,122 735,132 770,112 C790,102 800,108 800,95 L800,500Z" fill="currentColor" opacity="0.8" />
            {/* Cloud wisps */}
            <ellipse cx="200" cy="280" rx="80" ry="12" fill="currentColor" opacity="0.15" />
            <ellipse cx="500" cy="180" rx="100" ry="10" fill="currentColor" opacity="0.1" />
            <ellipse cx="650" cy="100" rx="70" ry="8" fill="currentColor" opacity="0.12" />
            {/* Pine trees on near ridge */}
            <g opacity="0.6">
              <line x1="120" y1="340" x2="120" y2="310" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="120" cy="305" rx="10" ry="14" fill="currentColor" />
              <line x1="340" y1="265" x2="340" y2="230" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="340" cy="225" rx="12" ry="16" fill="currentColor" />
              <line x1="580" y1="168" x2="580" y2="135" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="580" cy="130" rx="10" ry="14" fill="currentColor" />
            </g>
          </svg>

          {/* Rolling misty hills — bottom left */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '55%', height: '40vh', opacity: 0.035 }} viewBox="0 0 600 350" preserveAspectRatio="xMidYMax slice">
            {/* Far hill */}
            <path d="M0,350 L0,200 C40,175 80,185 130,160 C180,135 210,150 260,120 C310,92 340,108 390,82 C440,60 470,72 520,50 C555,38 580,45 600,35 L600,350Z" fill="currentColor" opacity="0.3" />
            {/* Near hill */}
            <path d="M0,350 L0,240 C50,220 90,230 140,205 C190,180 220,195 280,168 C330,148 360,158 420,135 C470,118 500,128 550,105 C580,94 595,100 600,92 L600,350Z" fill="currentColor" opacity="0.6" />
            {/* Mist layers */}
            <ellipse cx="150" cy="210" rx="90" ry="8" fill="currentColor" opacity="0.2" />
            <ellipse cx="380" cy="140" rx="70" ry="6" fill="currentColor" opacity="0.15" />
            {/* Bamboo on hill */}
            <g opacity="0.5">
              <line x1="80" y1="240" x2="78" y2="160" stroke="currentColor" strokeWidth="2" />
              <path d="M78,160 Q70,155 65,148 M78,165 Q86,160 92,153 M78,172 Q68,168 62,162 M78,178 Q88,174 94,168" stroke="currentColor" strokeWidth="1" fill="none" />
              <line x1="100" y1="240" x2="98" y2="170" stroke="currentColor" strokeWidth="1.5" />
              <path d="M98,170 Q90,166 86,160 M98,175 Q106,170 112,164 M98,182 Q88,178 83,173" stroke="currentColor" strokeWidth="1" fill="none" />
            </g>
          </svg>

          {/* Cinnabar seal stamp — bottom right */}
          <svg style={{ position: 'absolute', bottom: '8%', right: '5%', width: 56, height: 56, opacity: 0.07, transform: 'rotate(-8deg)' }} viewBox="0 0 64 64">
            <rect x="4" y="4" width="56" height="56" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            <text x="32" y="42" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--accent)">墨</text>
          </svg>

          {/* Ink splash — top left */}
          <svg style={{ position: 'absolute', top: '8%', left: '4%', width: 100, height: 100, opacity: 0.03 }} viewBox="0 0 100 100">
            <ellipse cx="55" cy="50" rx="28" ry="26" fill="currentColor" />
            <ellipse cx="35" cy="42" rx="14" ry="12" fill="currentColor" />
            <ellipse cx="72" cy="40" rx="10" ry="9" fill="currentColor" />
            <ellipse cx="50" cy="72" rx="12" ry="10" fill="currentColor" />
            <ellipse cx="25" cy="65" rx="7" ry="6" fill="currentColor" />
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
