'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PromptCard, SkeletonCard } from '@/components/PromptCard';
import { CategoryTags } from '@/components/CategoryTags';
import { SearchBar } from '@/components/SearchBar';
import { PromptModal } from '@/components/PromptModal';

const PAGE_SIZE = 100;

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
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchValue, setSearchValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const initialPromptIdRef = useRef<string | null>(null);
  if (!initialPromptIdRef.current && typeof window !== 'undefined') {
    initialPromptIdRef.current = new URLSearchParams(window.location.search).get('prompt');
  }

  const fetchPrompts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('limit', PAGE_SIZE.toString());
      if (activeCategory !== '全部') params.set('category', activeCategory);
      if (searchValue) params.set('search', searchValue);

      const res = await fetch(`/api/prompts?${params.toString()}`);
      const data = await res.json();
      setPrompts(data.prompts || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE));
    } catch (err) {
      console.error('Fetch prompts error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchValue]);

  useEffect(() => {
    setPage(1);
    fetchPrompts(1);
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

  const handleSearch = () => {
    setPage(1);
    fetchPrompts(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    fetchPrompts(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '48px 0 0',
          }}>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, opacity: page <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft className="w-4 h-4" />
              上一页
            </button>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, letterSpacing: '0.04em' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || loading}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, opacity: page >= totalPages ? 0.4 : 1 }}
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
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