'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shuffle, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onRandom?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onRandom,
  placeholder = '搜索提示词...',
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
    if (e.key === 'Escape') {
      onChange('');
      setFocused(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <motion.div
        animate={{ boxShadow: focused
          ? '0 0 0 2px rgba(178,69,146,0.4), 0 12px 40px rgba(0,0,0,0.5), 0 0 60px rgba(178,69,146,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)'
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex items-center rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(19, 19, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: focused ? '1.5px solid rgba(178,69,146,0.6)' : '1.5px solid var(--border)',
        }}
      >
        <Search
          className="w-5 h-5 ml-5 shrink-0"
          style={{ color: focused ? '#B24592' : 'var(--text-secondary)' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-4 py-4 text-sm outline-none bg-transparent placeholder:"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'transparent',
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-2 mr-1 rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {onRandom && (
          <button
            onClick={onRandom}
            className="px-4 py-2 mr-2 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none' }}
            title="随机体验"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onSearch}
          className="px-5 py-4 font-medium text-sm transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none', borderRadius: '0 14px 14px 0', height: '100%' }}
        >
          搜索
        </button>
      </motion.div>
    </div>
  );
}
