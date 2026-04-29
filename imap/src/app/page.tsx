'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { PromptCard, SkeletonCard } from '@/components/PromptCard';
import { CategoryTags } from '@/components/CategoryTags';
import { SearchBar } from '@/components/SearchBar';
import { PromptModal } from '@/components/PromptModal';

interface Prompt {
  id: string;
  title: string;
  description?: string | null;
  promptText: string;
  imageUrl: string;
  category: string;
  authorName: string;
  authorAvatar?: string | null;
  likeCount: number;
  viewCount: number;
  isFeatured: boolean;
  source: string;
  createdAt: string;
}

const ink = {
  initial: { opacity: 0, y: 32 },
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: 'easeOut' as const },
  }),
};

function HomeContent() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchValue, setSearchValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const initialPromptIdRef = useRef<string | null>(null);
  if (!initialPromptIdRef.current && typeof window !== 'undefined') {
    initialPromptIdRef.current = new URLSearchParams(window.location.search).get('prompt');
  }

  const fetchPrompts = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('limit', '12');
      if (activeCategory !== '全部') params.set('category', activeCategory);
      if (searchValue) params.set('search', searchValue);

      const res = await fetch(`/api/prompts?${params.toString()}`);
      const data = await res.json();
      if (reset) {
        setPrompts(data.prompts || []);
      } else {
        setPrompts((prev) => [...prev, ...(data.prompts || [])]);
      }
      setTotalPages(Math.ceil((data.total || 0) / 12));
    } catch (err) {
      console.error('Fetch prompts error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchValue]);

  useEffect(() => {
    setPage(1);
    fetchPrompts(1, true);
  }, [fetchPrompts]);

  // Open shared prompt from ?prompt= param
  useEffect(() => {
    const pid = initialPromptIdRef.current;
    if (!pid || selectedPrompt) return;
    const found = prompts.find((p) => p.id === pid);
    if (found) {
      setSelectedPrompt(found);
    } else if (!loading) {
      fetch(`/api/prompts/${pid}`)
        .then((r) => r.json())
        .then((data) => { if (data.id) setSelectedPrompt(data); })
        .catch(() => {});
    }
  }, [prompts, loading, selectedPrompt]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, page, totalPages]);

  useEffect(() => {
    if (page > 1) fetchPrompts(page);
  }, [page, fetchPrompts]);

  const handleSearch = () => {
    setPage(1);
    fetchPrompts(1, true);
  };

  const handleRandom = async () => {
    try {
      const res = await fetch('/api/prompts?random=1');
      const data = await res.json();
      if (data.prompts?.[0]) setSelectedPrompt(data.prompts[0]);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen" style={{ paddingTop: 80, paddingBottom: 120 }}>
      {/* Hero — generous whitespace, serif typography, ink-wash atmosphere */}
      <section style={{ padding: '60px 24px 0', maxWidth: 720, margin: '0 auto' }}>
        <motion.div
          custom={0}
          variants={ink}
          initial="initial"
          animate="animate"
        >
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              marginBottom: 20,
            }}
          >
            探索 AI 图像
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>提示词的无限可能</span>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 15,
              lineHeight: 1.8,
              maxWidth: 440,
              marginBottom: 48,
            }}
          >
            发现最优质的 GPT Image 2 提示词，一键复制，即刻生成令人惊叹的图像。
          </p>
        </motion.div>

        <motion.div
          custom={0.15}
          variants={ink}
          initial="initial"
          animate="animate"
          style={{ marginBottom: 40 }}
        >
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            onRandom={handleRandom}
            placeholder="搜索提示词..."
          />
        </motion.div>

        <motion.div
          custom={0.25}
          variants={ink}
          initial="initial"
          animate="animate"
        >
          <CategoryTags
            activeCategory={activeCategory}
            onSelect={(cat) => { setActiveCategory(cat); setPage(1); }}
          />
        </motion.div>
      </section>

      {/* Divider — ink brush stroke */}
      <div
        style={{
          maxWidth: 720,
          margin: '48px auto 0',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--border-hover) 20%, var(--border-hover) 80%, transparent)',
          }}
        />
      </div>

      {/* Gallery */}
      <section style={{ padding: '40px 24px 0', maxWidth: 1400, margin: '0 auto' }}>
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-tertiary)',
            letterSpacing: '0.06em',
            marginBottom: 24,
          }}
        >
          {loading && page === 1 ? '墨迹未干…' : `${prompts.length} 条`}
        </p>

        {prompts.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontSize: 18 }}>
              尚无墨迹
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 8 }}>
              成为第一个投稿者
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 32,
              alignItems: 'stretch',
            }}
          >
            {prompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                index={index % 12}
                onClick={() => setSelectedPrompt(prompt)}
              />
            ))}
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        )}
        <div ref={loadMoreRef} style={{ height: 40 }} />
      </section>

      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        onLikeChange={(id, delta) => {
          setPrompts((prev) =>
            prev.map((p) => p.id === id ? { ...p, likeCount: Math.max(0, p.likeCount + delta) } : p)
          );
          setSelectedPrompt((prev) =>
            prev && prev.id === id ? { ...prev, likeCount: Math.max(0, prev.likeCount + delta) } : prev
          );
        }}
      />
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}