'use client';

import { useState } from 'react';
import { Search, Shuffle, X } from 'lucide-react';

const HOT_SEARCHES = ['头像', '海报', '漫画', '3D', 'LOGO', '信息图', '可爱', '中国风'];

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

  const handleHotSearch = (term: string) => {
    onChange(term);
    // Auto-trigger search after setting value
    setTimeout(() => onSearch(), 0);
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div
        className="relative flex items-center rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: focused ? '1px solid var(--accent-border)' : '1px solid var(--border)',
          transition: 'border-color 0.3s var(--ease-ink), box-shadow 0.3s var(--ease-ink)',
          boxShadow: focused ? '0 0 0 3px rgba(196, 69, 58, 0.06)' : 'none',
        }}
      >
        <Search
          className="w-4 h-4 ml-4 shrink-0"
          style={{ color: focused ? 'var(--accent)' : 'var(--text-tertiary)', transition: 'color 0.3s' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3.5 text-sm outline-none bg-transparent"
          style={{
            color: 'var(--text-primary)',
            backgroundColor: 'transparent',
            fontFamily: 'var(--font-sans)',
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1.5 mr-1 rounded transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {onRandom && (
          <button
            onClick={onRandom}
            className="px-3 py-1.5 mr-2 rounded text-xs font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            title="随机体验"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onSearch}
          className="px-5 py-3.5 text-sm font-medium transition-colors"
          style={{
            background: 'var(--accent)',
            color: '#f5f0eb',
            border: 'none',
            borderRadius: '0 7px 7px 0',
            height: '100%',
            letterSpacing: '0.04em',
          }}
        >
          搜索
        </button>
      </div>

      {/* Hot search tags — visible when input is empty and focused */}
      {!value && focused && (
        <div
          className="flex flex-wrap gap-2 mt-3 justify-center"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {HOT_SEARCHES.map((term) => (
            <button
              key={term}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleHotSearch(term)}
              className="px-3 py-1 rounded text-xs transition-colors cursor-pointer"
              style={{
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.02em',
              }}
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}