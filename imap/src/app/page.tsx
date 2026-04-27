'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchValue, setSearchValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  const handleRandom = () => {
    if (prompts.length === 0) return;
    const idx = Math.floor(Math.random() * prompts.length);
    setSelectedPrompt(prompts[idx]);
  };

  return (
    <div className="min-h-screen" style={{ paddingTop: 80, paddingBottom: 80 }}>
      {/* Hero */}
      <section className="text-center mb-10" style={{ padding: '0 20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(178,69,146,0.12)',
              border: '1px solid rgba(178,69,146,0.3)',
              color: '#f0a0c0',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI 图像提示词精选
          </motion.div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-noto-serif)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>探索 </span>
            <span className="gradient-text">GPT Image 2</span>
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>提示词的无限可能</span>
          </h1>

          <p className="text-base mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            发现最优质的 AI 图像生成提示词，学习 prompt engineering，一键复制，立刻生成令人惊叹的图像。
          </p>

          <div className="mb-10">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              onRandom={handleRandom}
              placeholder="搜索提示词，例如：赛博朋克、人物肖像..."
            />
          </div>

          <CategoryTags
            activeCategory={activeCategory}
            onSelect={(cat) => { setActiveCategory(cat); setPage(1); }}
          />
        </motion.div>
      </section>

      {/* Gallery */}
      <section style={{ padding: '0 24px', maxWidth: 1400, margin: '0 auto' }}>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {loading && page === 1 ? '加载中...' : `${prompts.length} 条结果`}
        </p>

        {prompts.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>还没有提示词</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>成为第一个提交的人！</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
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
        onLike={async () => {
          if (!selectedPrompt) return;
          await fetch(`/api/prompts/${selectedPrompt.id}/like`, { method: 'POST' });
          setSelectedPrompt((prev) =>
            prev ? { ...prev, likeCount: prev.likeCount + 1 } : null
          );
        }}
      />
    </div>
  );
}
