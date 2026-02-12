'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-light-background/80 backdrop-blur-lg border-b border-light-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-light-primary to-light-secondary shadow-lg shadow-light-primary/25 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-light-primary to-light-secondary bg-clip-text text-transparent">
            手绘地图
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/gallery"
            className="text-light-text-secondary hover:text-light-text transition-colors duration-200"
          >
            画廊
          </Link>
          <Link
            href="/templates"
            className="text-light-text-secondary hover:text-light-text transition-colors duration-200"
          >
            模板
          </Link>
          <Link
            href="/about"
            className="text-light-text-secondary hover:text-light-text transition-colors duration-200"
          >
            关于
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
