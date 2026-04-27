'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Sparkles, Upload } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ backgroundColor: 'rgba(10, 10, 15, 0.85)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="p-2 rounded-xl group-hover:scale-105 transition-all duration-300"
            style={{ background: 'var(--accent-gradient)' }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="gradient-text">GPT Image 2</span>
            <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>Prompts</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/submit">
            <button className="btn-primary text-sm py-2 px-5">
              <Upload className="w-4 h-4" />
              提交 Prompt
            </button>
          </Link>
          {user ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-secondary text-sm py-2 px-4"
            >
              退出
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
