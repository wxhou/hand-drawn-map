'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Upload, Heart, User, LogOut, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/auth/ThemeProvider';

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Logo seal stamp */}
          <svg width="28" height="28" viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
            <rect x="3" y="3" width="58" height="58" rx="4" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round"/>
            <rect x="7" y="7" width="50" height="50" rx="2" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4"/>
            <text x="32" y="42" textAnchor="middle" fontSize="26" fontFamily="var(--font-serif)" fontWeight="700" fill="var(--accent)">墨</text>
          </svg>
          <span
            className="text-lg font-semibold"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              transition: 'color 0.3s var(--ease-ink)',
            }}
          >
            墨辞
          </span>
          <span
            className="text-xs"
            style={{
              color: 'var(--text-tertiary)',
              letterSpacing: '0.06em',
            }}
          >
            GPT Image 2
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => {
              const next = theme === 'system'
                ? 'light'
                : theme === 'light'
                  ? 'dark'
                  : 'system';
              setTheme(next);
            }}
            className="p-2 rounded-md transition-colors"
            style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}
            title={theme === 'system' ? '跟随系统' : theme === 'light' ? '亮色模式' : '暗色模式'}
          >
            {theme === 'light' ? <Sun className="w-3.5 h-3.5" /> : theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          </button>

          <Link href="/submit">
            <button className="btn-primary text-sm py-2 px-5">
              <Upload className="w-3.5 h-3.5" />
              投稿
            </button>
          </Link>

          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded transition-colors"
                style={{ border: '1px solid var(--border)' }}
              >
                {user.image ? (
                  <img src={user.image} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--accent-muted)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {(user.name || 'U')[0].toUpperCase()}
                  </div>
                )}
                <ChevronDown style={{ width: 12, height: 12, color: 'var(--text-tertiary)' }} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {user.name || user.email}
                    </p>
                  </div>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Heart style={{ width: 14, height: 14 }} />
                    我的收藏
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm w-full transition-colors"
                    style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                border: '1px solid var(--border)',
                borderRadius: 6,
              }}
            >
              <User style={{ width: 14, height: 14 }} />
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  );
}